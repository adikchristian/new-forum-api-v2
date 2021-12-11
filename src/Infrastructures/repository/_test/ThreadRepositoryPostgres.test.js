const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist addThread correctly', async () => {
      const createThread = new CreateThread({
        title: 'title',
        body: 'body',
      });
      const fakeIdGenerator = () => '123';
      const owner = 'user-123';
      await UsersTableTestHelper.addUser({
        id: owner,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(createThread, owner);

      const threads = await ThreadTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });
    it('should return created thread correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      const createThread = new CreateThread({
        title: 'this title',
        body: 'this body',
      });

      const fakeIdGenerator = () => '123';
      const owner = 'user-123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const createdThread = await threadRepositoryPostgres.addThread(createThread, owner);

      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: 'this title',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError if thread not available', async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepository.verifyAvailableThread('thread-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if thread available', async () => {
      const threadId = 'thread-123';
      const owner = 'user-123';
      const payload = {
        id: threadId,
        title: 'coba thread',
        body: 'isi thread',
        username: 'userCoba',
      };

      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: owner, username: payload.username });
      await ThreadTableTestHelper.addThread(threadId, {
        title: payload.title,
        body: payload.body,
      }, owner);

      const thread = await threadRepository.getThreadById('thread-123');

      const { date } = thread;

      await expect(threadRepository.getThreadById('thread-123'))
        .resolves.not.toThrow(NotFoundError);
      expect(thread).toHaveProperty('id');
      expect(thread).toHaveProperty('title');
      expect(thread).toHaveProperty('body');
      expect(thread).toHaveProperty('username');
      expect(thread).toHaveProperty('date');
      expect(thread.id).toEqual(threadId);
      expect(thread.title).toEqual(payload.title);
      expect(thread.body).toEqual(payload.body);
      expect(thread.username).toEqual(payload.username);
      expect(thread.date).toEqual(date);
    });
  });
});
