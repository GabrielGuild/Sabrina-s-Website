const client = require('../client');
const bcrypt = require('bcrypt');

async function createUser({ username, password, fullname, email, isAdmin = false }) {
    try {
      const SALT_COUNT = 10;
      const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  
      const { rows: [user] } = await client.query(`
        INSERT INTO users(username, password, fullname, email, "isAdmin")
        VALUES($1, $2, $3, $4, $5)
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

  async function getUser({ username, password }) {
    try {
      const user = await getUserByUsername(username);
      if (user) {
        const hashedPassword = user.password;
        const isValid = await bcrypt.compare(password, hashedPassword)
        if (isValid) {
          delete user.password
          return user
        } else {
          return 'passwordNotValid'
        }
      } else {
        return 'userDoesNotExist'
      }
    } catch (error) {
      throw error
    }
  }

  async function getUserById(userId) {
    try {
      const { rows: [user] } = await client.query(`
        SELECT *
        FROM users
        WHERE id = $1
      `, [userId])
  
      delete user.password
  
      return user
    } catch (error) {
      throw error
    }
  }

  async function getUserByUsername(username) {
    try {
      const { rows: [user] } = await client.query(`
      SELECT  *
      FROM users
      WHERE username = $1
      `, [username])
      return user
    } catch (error) {
      throw error
    }
  }

  async function getAllUsers() {
    try {
      const { rows: users } = await client.query(`
        SELECT*
        FROM users;
      `);
  
      users.forEach(user => {
        delete user.password
      })
  
      return users;
    } catch (error) {
      throw error;
    }
  }

  async function emailInUseCheck(emailInput) {
    try {
      let inUse = false;
      const { rows } = await client.query(`
        SELECT email
        FROM users;
      `);
  
      rows.forEach(row => {
        if (row.email && (row.email === emailInput)) { 
          inUse = true;
        }
      })
  
      return inUse
    } catch (error) {
      throw error
    }
  }

  module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
    getAllUsers,
    emailInUseCheck
  };