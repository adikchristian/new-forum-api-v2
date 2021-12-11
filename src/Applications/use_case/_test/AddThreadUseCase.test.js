const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const ThreadRepository = require('../../../Domains/threads/TheradRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const owner = 'user-123';
    const useCasePayload = {
      title: 'this title',
      body: 'this body',
    };

    const expectedCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(expectedCreatedThread));

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const createdThread = await getThreadUseCase.execute(useCasePayload, owner);

    expect(createdThread).toStrictEqual(expectedCreatedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new CreateThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }), owner);
  });
});
