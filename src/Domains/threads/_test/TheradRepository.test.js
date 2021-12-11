const ThreadRepository = require('../TheradRepository');

describe('ThreadRepository interface', () => {
  it('should throe error when invoke abstract behaiour', async () => {
    const threadRepository = new ThreadRepository();

    await expect(threadRepository.addThread({}, '')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.verifyAvailableThread('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.getThreadById('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.getCommentByThreadId('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
