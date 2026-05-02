const pool = require('../db/pool');
const bcrypt = require('bcrypt');

const create = async (username, password) => {
  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(`
    INSERT INTO users (username, password_hash)
    VALUES ($1,$2)
    RETURNING user_id, username;
  `, [username, hash]);

  return result.rows[0];
};

const findByUsername = async (username) => {
  const result = await pool.query(`
    SELECT * FROM users WHERE username = $1;
  `, [username]);

  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query(
    `SELECT user_id, username FROM users WHERE user_id = $1`,
    [id]
  );
  return result.rows[0];
};

const updatePassword = async (userId, password) => {
  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(`
    UPDATE users
    SET password_hash = $1
    WHERE user_id = $2
    RETURNING user_id, username;
  `, [hash, userId]);

  return result.rows[0];
};

const remove = async (userId) => {
  const result = await pool.query(`
    DELETE FROM users
    WHERE user_id = $1
    RETURNING user_id, username;
  `, [userId]);

  return result.rows[0];
};

module.exports = {
  create,
  findByUsername,
  findById,
  updatePassword,
  remove
};