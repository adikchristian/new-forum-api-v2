class SetCommentLikesUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(userid, useCaseParam) {
    const userId = userid;
    const { threadId, commentId } = useCaseParam;

    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._likeRepository.setLike(userId, commentId);
  }
}

module.exports = SetCommentLikesUseCase;
