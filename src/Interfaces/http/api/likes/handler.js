const SetcommentLikeUseCase = require('../../../../Applications/use_case/SetCommentLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(req, res) {
    const { id: user_id } = req.auth.credentials;
    const setCommentLikesUseCase = this._container.getInstance(SetcommentLikeUseCase.name);
    await setCommentLikesUseCase.execute(user_id, req.params);

    const response = res.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
