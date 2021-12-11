const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.addReplyByCommentId({}, '')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.getReplyByThreadId('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.getReplyOwner('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.deleteReplyById('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
