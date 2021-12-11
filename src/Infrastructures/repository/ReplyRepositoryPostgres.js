const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DetailsReply = require('../../Domains/replies/entities/DetailsReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReplyByCommentId(addReply, owner, commentId) {
    const id = `reply-${this._idGenerator()}`;
    const { content } = addReply;

    const query = {
      text: 'INSERT INTO replies (id, content, owner, comment_id) VALUES ($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, owner, commentId],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async getReplyByThreadId(commentId) {
    const query = {
      text: `SELECT replies.*, users.username as username FROM replies
      INNER JOIN users ON replies.owner = users.id 
      INNER JOIN comments ON comments.id = replies.comment_id 
      INNER JOIN threads ON threads.id = comments.thread_id
      WHERE comments.thread_id = $1
      ORDER BY replies.date`,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((payload) => new DetailsReply({
      ...payload,
      date: new Date(payload.date).toISOString(),
    }));
  }

  async getReplyOwner(id) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }

    return result.rows[0].owner;
  }

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
