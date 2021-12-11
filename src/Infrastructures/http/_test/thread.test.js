const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and added thread', async () => {
      const owner = 'user-123';
      const reqPayload = {
        title: 'title',
        body: 'body',
      };

      await UsersTableTestHelper.addUser({ id: owner });

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: reqPayload,
        auth: {
          strategy: 'forumApiJwt',
          credentials: {
            id: owner,
          },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });
  describe('when GET /threads/{threadId}', () => {
    it('should response 200', async () => {
      const owner = 'user-123';
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {}, owner);
      await CommentsTableTestHelper.addComment('comment-123', {}, owner, threadId);
      await CommentsTableTestHelper.addComment('comment-097', {}, owner, threadId, true);

      const server = await createServer(container);
      const response = await await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();

      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(responseJson.data.thread.comments[0].id).toBeDefined();
      expect(responseJson.data.thread.comments[0].content).toBeDefined();
      expect(responseJson.data.thread.comments[0].username).toBeDefined();
      expect(responseJson.data.thread.comments[0].date).toBeDefined();
    });
  });
});
