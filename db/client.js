const { Client } = require('pg');

const DB_NAME = 'ybehutku';
const DB_USER = 'ybehutku';
const DB_PASSWORD = 'xZmGQutOjhSfATX_LYAqn6bDtV5RlNjN';
const DB_HOST = 'otto.db.elephantsql.com';
const DB_PORT = 5432;

const DB_URL = `postgres://ybehutku:xZmGQutOjhSfATX_LYAqn6bDtV5RlNjN@otto.db.elephantsql.com/ybehutku`;

const client = new Client({
  connectionString: DB_URL,
});

module.exports = client;
