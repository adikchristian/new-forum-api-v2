class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute({ commentId, threadId, owner }) {
    await this._commentRepository.verifyAvailableComment(commentId);
    const ownerComment = await this._commentRepository.getOwnerByCommentId(commentId);
    if (ownerComment !== owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_THE_COMMENT_OWNER');
    }
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
