const { Client } = require('pg');

const DB_NAME = 'ybehutku';
const DB_USER = 'ybehutku';
const DB_PASSWORD = 'xZmGQutOjhSfATX_LYAqn6bDtV5RlNjN';
const DB_HOST = 'otto.db.elephantsql.com';
const DB_PORT = 5432;

const DB_URL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const client = new Client({
  connectionString: DB_URL,
});

module.exports = client;
