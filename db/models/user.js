const client = require('../client');
const bcrypt = require('bcrypt');

async function createUser({ username, password, fullname, email, isAdmin = false }) {
    try {
      const SALT_COUNT = 10;
      const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  
      const { rows: [user] } = await client.query(`
        INSERT INTO users(username, password, fullname, email, "isAdmin")
        VALUES($1, $2, $3, $4, $5, $6)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `, [username, hashedPassword, fullname, email, isAdmin]
      );
  
      delete user.password
      return user
    } catch (error) {
      throw error;
    }
  }
  module.exports = {
    // add your database adapter fns here
    createUser,
    // getUser,
    // getUserById,
    // getUserByUsername,
    // getAllUsers,
    // emailInUseCheck
  };