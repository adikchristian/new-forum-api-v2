const CreateThread = require('../CreateThread');

describe('a CreateThread entities', () => {
  it('should throw error when payload is not contain needed property', () => {
    const payload = {
      title: 'title',
    };

    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 123,
      body: 'ini body',
    };

    expect(() => new CreateThread(payload)).toThrowError('REATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create thread object correctly', () => {
    const payload = {
      title: 'title-123',
      body: 'ini body',
    };

    const { title, body } = new CreateThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
