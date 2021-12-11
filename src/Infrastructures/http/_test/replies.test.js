const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const ReplyRepositoryPostgres = require('../../repository/ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('Replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 when thread or comment exist', async () => {
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const payload = {
        content: 'reply',
      };

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {}, owner);
      await CommentsTableTestHelper.addComment(commentId, {}, owner, threadId);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload,
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
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200', async () => {
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      const payload = {
        content: 'ini sebuah balasan',
      };

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {}, owner);
      await CommentsTableTestHelper.addComment(commentId, {}, owner, threadId);
      await RepliesTableTestHelper.addReply(replyId, payload, owner, commentId);

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        auth: {
          strategy: 'forumApiJwt',
          credentials: {
            id: owner,
          },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
