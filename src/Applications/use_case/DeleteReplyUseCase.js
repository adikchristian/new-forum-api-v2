class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute({
    replyId, commentId, threadId, owner,
  }) {
    const getOwnerReply = await this._replyRepository.getReplyOwner(replyId);
    if (getOwnerReply !== owner) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_THE_REPLY_OWNER');
    }
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.getOwnerByCommentId(commentId);
    await this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
