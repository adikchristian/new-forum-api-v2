/* eslint-disable camelcase */
const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'johndoe',
      date: '2021-08-08T07:59:18.982Z',
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      is_deleted: 'true',
    };
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should print **komentar telah dihapus** iDeleted is true', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      content: 'ini dihapus',
      is_deleted: true,
    };
    const detailComment = new DetailComment(payload);

    expect(detailComment.content).toEqual('**komentar telah dihapus**');
  });
  it('should print payload content if iDeleted is false', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      content: 'ini komen',
      is_deleted: false,
    };
    const detailComment = new DetailComment(payload);

    expect(detailComment.content).toEqual(payload.content);
  });

  it('should create detailComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      is_deleted: false,
    };

    const {
      id, username, date, content, is_deleted = false,
    } = new DetailComment(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
    expect(is_deleted).toEqual(payload.is_deleted);
  });
});
