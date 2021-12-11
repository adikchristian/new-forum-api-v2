const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addCommentByThreadId method', () => {
    it('should addComment and return addedComment correctly', async () => {
      const addComment = new AddComment({
        content: 'content',
      });
      const threadId = 'thread-123';
      const owner = 'user-123';
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {
        title: 'title',
        body: 'body',
      }, owner);

      const addedComment = await commentRepositoryPostgres.addCommentByThreadId(addComment, owner, threadId);
      const comment = await CommentsTableTestHelper.findCommentsById('comment-123');

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'content',
        owner,
      }));

      expect(comment).toHaveLength(1);
    });
  });

  describe('getOwnerByCommentId method', () => {
    it('should return comment owner if exist', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, {});
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {}, owner);
      await CommentsTableTestHelper.addComment(commentId, {}, owner, threadId);

      const ownerComment = await commentRepository.getOwnerByCommentId(commentId);

      await expect(commentRepository.getOwnerByCommentId(commentId)).resolves.not.toThrowError(NotFoundError);
      expect(ownerComment).toEqual(owner);
    });
    it('should return NotFoundError if commentId not exist', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepository.verifyAvailableComment('comment-123')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyAvailableComment method', () => {
    it('should return NotFoundError if commentId not exist', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepository.verifyAvailableComment('comment-123')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('deleteCommentById method', () => {
    it('should deleteCommentById from database if available', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const commentId = 'comment-123';
      const owner = 'user-123';
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {
        title: 'this title',
        body: 'this body',
      }, owner);

      await CommentsTableTestHelper.addComment(commentId, { content: 'this komen' }, owner, threadId);
      await expect(commentRepositoryPostgres.deleteCommentById(commentId)).resolves.not.toThrowError(NotFoundError);
    });
    it('should throw error when delete comment with invalid payload', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';
      await expect(commentRepositoryPostgres.deleteCommentById(commentId))
        .rejects.toThrow(NotFoundError);
    });
    it('should field is_deleted value is true after delete', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const commentId = 'comment-123';
      const owner = 'user-123';
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {
        title: 'this title',
        body: 'this body',
      }, owner);

      await CommentsTableTestHelper.addComment(commentId, { content: 'this komen' }, owner, threadId);
      await commentRepositoryPostgres.deleteCommentById(commentId);
      const comment = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comment[0].is_deleted).toStrictEqual(true);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return getCommentByThreadId ', async () => {
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const username = 'dicoding';
      const content = 'content';
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread(threadId, {}, owner);
      await CommentsTableTestHelper.addComment(commentId, {}, owner, threadId);

      const getCommentByThreadId = await commentRepository.getCommentByThreadId(threadId);
      const { date } = getCommentByThreadId[0];

      await expect(commentRepository.getCommentByThreadId(threadId))
        .resolves.not.toThrowError(InvariantError);
      expect(getCommentByThreadId).toHaveLength(1);
      expect(getCommentByThreadId[0]).toHaveProperty('username');
      expect(getCommentByThreadId[0]).toHaveProperty('id');
      expect(getCommentByThreadId[0]).toHaveProperty('date');
      expect(getCommentByThreadId[0]).toHaveProperty('content');
      expect(getCommentByThreadId[0].username).toEqual(username);
      expect(getCommentByThreadId[0].id).toEqual(commentId);
      expect(getCommentByThreadId[0].date).toEqual(date);
      expect(getCommentByThreadId[0].content).toEqual(content);
    });
  });
});
