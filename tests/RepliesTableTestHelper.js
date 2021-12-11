/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepillesTableTestHelper = {
  async addReply(id = 'rep-123', { content = 'content' }, owner, commentId, isDeleted = false) {
    const query = {
      text: 'INSERT INTO replies (id, content, owner, comment_id, is_deleted) VALUES($1, $2, $3, $4, $5)',
      values: [id, content, owner, commentId, isDeleted],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepillesTableTestHelper;
