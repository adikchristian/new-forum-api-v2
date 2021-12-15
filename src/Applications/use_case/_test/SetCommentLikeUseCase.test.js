const SetCommentLikesUseCase = require('../SetCommentLikeUseCase');
const ThreadRepository = require('../../../Domains/threads/TheradRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('set comment\'s likes use case', () => {
  it('should orchestrating the set comment\'s likes action correctl', async () => {
    const userId = 'user-123';
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockLikeRepository.setLike = jest.fn().mockImplementation(() => Promise.resolve());

    const setCommentLikesUseCase = new SetCommentLikesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await expect(setCommentLikesUseCase.execute(userId, useCaseParam)).resolves.not.toThrowError();
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCaseParam.commentId);
    expect(mockLikeRepository.setLike).toBeCalledWith(userId, useCaseParam.commentId);
  });
});
