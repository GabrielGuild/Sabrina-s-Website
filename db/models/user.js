const bcrypt = require('bcrypt');
const { Client } = require('pg');
const client = require('../client');

async function createUser({ username, password, fullname, email, isAdmin = false }) {
  try {
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    const query = {
      text: `
        INSERT INTO users(username, password, fullname, email, "isAdmin")
        VALUES('${username}', '${hashedPassword}', '${fullname}', '${email}', ${isAdmin})
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
      `
    };

    const { rows: [user] } = await client.query(query);

    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}


async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    if (user) {
      const hashedPassword = user.password;
      const isValid = await bcrypt.compare(password, hashedPassword);
      if (isValid) {
        delete user.password;
        return user;
      } else {
        return 'passwordNotValid';
      }
    } else {
      return 'userDoesNotExist';
    }
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const query = {
      text: `
        SELECT *
        FROM users
        WHERE id = ${userId}';
      `,
      values: [userId],
    };

    const { rows: [user] } = await client.query(query);

    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const query = {
      text: `
        SELECT *
        FROM users
        WHERE username = '${username}';
      `
    };

    const { rows: [user] } = await client.query(query);

    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const query = {
      text: `
        SELECT *
        FROM users;
      `,
    };

    const { rows: users } = await client.query(query);

    users.forEach(user => {
      delete user.password;
    });

    return users;
  } catch (error) {
    throw error;
  }
}

async function emailInUseCheck(emailInput) {
  try {
    const query = {
      text: `
        SELECT email
        FROM users;
      `,
    };

    const { rows } = await client.query(query);

    let inUse = false;
    rows.forEach(row => {
      if (row.email && row.email === emailInput) {
        inUse = true;
      }
    });

    return inUse;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
  getAllUsers,
  emailInUseCheck,
};
