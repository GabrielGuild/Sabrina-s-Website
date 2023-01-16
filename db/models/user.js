const pool = require('../client');
const bcrypt = require('bcrypt');

async function createUser({ username, password, fullname, email, isAdmin = false }) {
    try {
      const SALT_COUNT = 10;
      const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
      pool.connect(function(err, client, done) {
      const { rows: [users] } =  client.query(`
        INSERT INTO users(username, password, fullname, email, "isAdmin")
        VALUES($1, $2, $3, $4, $5)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `, [username, hashedPassword, fullname, email, isAdmin]
      );
  
      delete users.password
      done();});
      return user
    } catch (error) {
      throw error;
    }
  }

  async function getUser({ username, password }) {
    try {
      
      const user = await getUserByUsername(username);
      if (users) {
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
      pool.connect(function(err, client, done) {
        const { rows: [users] } =  client.query(`
        SELECT *
        FROM users
        WHERE id = $1
      `, [userId])
  
      delete users.password
      done();});
      return user
    } catch (error) {
      throw error
    }
  }

  async function getUserByUsername(username) {
    try {
      pool.connect(function(err, client, done) {
        const { rows: [users] } =  client.query(`
      SELECT  *
      FROM users
      WHERE username = $1
      `, [username])
      done();});
      return user
    } catch (error) {
      throw error
    }
  }

  async function getAllUsers() {
    try {
      pool.connect(function(err, client, done) {
        const { rows: [users] } =  client.query(`
        SELECT*
        FROM users;
      `);
  
      users.forEach(user => {
        delete users.password
      })
      done();});
      return users;
    } catch (error) {
      throw error;
    }
  }

  async function emailInUseCheck(emailInput) {
    try {
      let inUse = false;
      pool.connect(function(err, client, done) {
        const { rows: [users] } =  client.query(`
        SELECT email
        FROM users;
      `);
  
      rows.forEach(row => {
        if (row.email && (row.email === emailInput)) { 
          inUse = true;
        }
      })
      done();});
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