const { Client } = require('pg');

const DB_NAME = 'grace-dev';

const DB_URL =
 `postgres://ybehutku:xZmGQutOjhSfATX_LYAqn6bDtV5RlNjN@otto.db.elephantsql.com/ybehutku`;

let client;

// github actions client config
// if (process.env.CI) {
//   client = new Client({
//     host: 'localhost',
//     port: 5432,
//     user: 'postgres',
//     password: 'postgres',
//     database: 'postgres',
//   });
// } else {
//   // local / heroku client config
// }
client = new Client(DB_URL);

module.exports = client;
