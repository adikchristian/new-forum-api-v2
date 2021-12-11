const CreatedThread = require('../CreatedThread');

describe('a CreatedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'title',
    };

    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    expect(() => new CreatedThread({ id: 123, title: 'title', owner: 'true' })).toThrowError('CREATED_THREAD.MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new CreatedThread({ id: '123', title: true, owner: 'true' })).toThrowError('CREATED_THREAD.MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new CreatedThread({ id: '123', title: 'title', owner: true })).toThrowError('CREATED_THREAD.MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create createThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'title',
      owner: 'user-123',
    };

    const createdThread = new CreatedThread(payload);

    expect(createdThread.id).toEqual(payload.id);
    expect(createdThread.title).toEqual(payload.title);
    expect(createdThread.owner).toEqual(payload.owner);
  });
});
