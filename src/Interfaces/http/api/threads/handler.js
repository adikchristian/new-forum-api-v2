const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(req, res) {
    const { id: owner } = req.auth.credentials;
    const threadUseCase = await this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await threadUseCase.execute(req.payload, owner);
    const response = res.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(req) {
    const { threadId } = req.params;
    const getDetailThreadUseCase = await this._container.getInstance(GetDetailThreadUseCase.name);
    const thread = await getDetailThreadUseCase.execute(threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
