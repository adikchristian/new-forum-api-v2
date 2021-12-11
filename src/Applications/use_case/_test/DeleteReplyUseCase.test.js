const ThreadRepository = require('../../../Domains/threads/TheradRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('Delete Reply UseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const owner = 'user-123';
    const replyId = 'reply-123';
    const commentId = 'comment-123';
    const threadId = 'thread-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.getOwnerByCommentId = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.getReplyOwner = jest.fn().mockImplementation(() => Promise.resolve(owner));

    const getDeleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await getDeleteReplyUseCase.execute({
      replyId, commentId, threadId, owner,
    });
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.getOwnerByCommentId).toBeCalledWith(commentId);
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(replyId);
  });
  it('should throw error when deleting not owner reply', async () => {
    const owner = 'user-123';
    const fakeOwner = 'user-123';
    const replyId = 'reply-123';
    const commentId = 'comment-123';
    const threadId = 'thread-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.getOwnerByCommentId = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.getReplyOwner = jest.fn().mockImplementation(() => Promise.resolve(owner));

    const getDeleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await expect(getDeleteReplyUseCase.execute({
      replyId, commentId, threadId, fakeOwner,
    })).rejects.toThrowError(Error);
    await expect(mockReplyRepository.getReplyOwner).toBeCalledWith(replyId);
  });
});
