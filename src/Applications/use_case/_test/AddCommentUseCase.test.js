const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/TheradRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const owner = 'user-123';
    const threadId = 'thread-123';

    const useCasePayload = {
      content: 'comments',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addCommentByThreadId = jest.fn(() => Promise.resolve(expectedAddedComment));
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload, { owner, threadId });

    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockCommentRepository.addCommentByThreadId).toBeCalledWith(new AddComment(useCasePayload), owner, threadId);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
  });
});
