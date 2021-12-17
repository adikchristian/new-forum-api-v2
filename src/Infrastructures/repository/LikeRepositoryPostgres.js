const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async setLike(userId, commentId) {
    const selectLike = {
      text: 'SELECT id FROM likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };
    const { rows } = await this._pool.query(selectLike);

    let setLikes = {};

    if (rows.length < 1) {
      const id = `like-${this._idGenerator()}`;
      setLikes = {
        text: 'INSERT INTO likes VALUES($1, $2, $3)',
        values: [id, userId, commentId],
      };
    } else {
      const { id } = rows[0];
      setLikes = {
        text: 'DELETE FROM likes WHERE id = $1',
        values: [id],
      };
    }
    await this._pool.query(setLikes);
  }
}

module.exports = LikeRepositoryPostgres;
