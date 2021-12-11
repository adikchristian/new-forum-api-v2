const AddedReply = require('../AddedReply');

describe('a AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'this content',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    expect(() => new AddedReply({ id: 123, content: 'this content', owner: 'true' })).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedReply({ id: '123', content: true, owner: 'true' })).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedReply({ id: '123', content: 'this content', owner: true })).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply object correctly', () => {
    const payload = {
      id: 'thread-123',
      content: 'ini_content',
      owner: 'user-123',
    };

    const addedReply = new AddedReply(payload);

    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
