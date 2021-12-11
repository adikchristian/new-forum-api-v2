const AddReply = require('../AddReply');

describe('', () => {
  it('should throw error when payload is not contain needed property', () => {
    const payload = {
      title: 'anc',
    };
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 123,
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddReply object correctly', () => {
    const payload = {
      content: 'add reply',
    };

    const { content } = new AddReply(payload);
    expect(content).toEqual(payload.content);
  });
});
