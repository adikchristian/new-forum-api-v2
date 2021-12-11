const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteRplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ReplyCommentsHandler {
  constructor(container) {
    this._container = container;
    this.postReplyCommentHandler = this.postReplyCommentHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyCommentHandler(req, res) {
    const { id: owner } = req.auth.credentials;
    const { threadId, commentId } = req.params;
    const addReplyUseCase = await this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(req.payload, { owner, commentId, threadId });

    const response = res.response({
      status: 'success',
      data: {
        addedReply,
      },
    });

    response.code(201);
    return response;
  }

  async deleteReplyHandler(req) {
    const { id: owner } = req.auth.credentials;
    const { replyId, commentId, threadId } = req.params;
    const deleteReplyUseCase = await this._container.getInstance(DeleteRplyUseCase.name);
    await deleteReplyUseCase.execute({
      replyId, commentId, threadId, owner,
    });
    return {
      status: 'success',
    };
  }
}

module.exports = ReplyCommentsHandler;
