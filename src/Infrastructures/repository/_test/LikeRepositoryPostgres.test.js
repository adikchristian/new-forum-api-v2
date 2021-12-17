const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTesthelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTesthelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('setCommentLikes function', () => {
    it('should set the comment\'s likes correctly', async () => {
      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId });

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread(threadId, { title: 'title' }, userId);

      const commentId = 'comment-123';
      await CommentsTableTesthelper.addComment(commentId, {}, userId, threadId);

      const idGenerator = () => '5668';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, idGenerator);

      await likeRepositoryPostgres.setLike(userId, commentId);
      const likes = await LikesTableTestHelper.findLikeById('like-5668');
      expect(likes).toHaveLength(1);
    });
    it('should delete the comment\'s likes', async () => {
      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId });

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread(threadId, { title: 'title' }, userId);

      const commentId = 'comment-123';
      await CommentsTableTesthelper.addComment(commentId, {}, userId, threadId);

      const likeId = 'like-9034';

      await LikesTableTestHelper.addLike(
        likeId,
        userId,
        commentId,
      );

      const fakeIdGenerator = () => '9034';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.setLike(userId, commentId);
      const likes = await LikesTableTestHelper.findLikeById(likeId);
      expect(likes).toEqual([]);
    });
  });
});
