class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const comments = await this._commentRepository.getCommentByThreadId(threadId);
    const replies = await this._replyRepository.getReplyByThreadId(threadId);
    const listreply = await Promise.all(replies.map(async (reply) => ({
      ...reply,
    })));
    const listComment = await Promise.all(comments.map(async (comment) => ({
      ...comment,
      replies: listreply,
    })));

    const thread = await this._threadRepository.getThreadById(threadId);
    return {
      ...thread,
      comments: listComment,
    };
  }
}

module.exports = GetDetailThreadUseCase;
