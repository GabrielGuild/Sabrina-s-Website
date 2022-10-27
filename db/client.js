// Connect to DB
const { Client } = require('pg');

// change the DB_NAME string to whatever your group decides on
const DB_NAME = 'sabrina';

const DB_URL =process.env.DATABASE_URL || `https://sabrinaguild.herokuapp.com/${DB_Name}`;
  // process.env.DATABASE_URL || `postgres://localhost:5432/${DB_NAME}`;

let client;

console.log( "is the url correct",process.env.DATABASE_URL || `postgres://localhost:5432/${DB_NAME}`)
// github actions client config
if (process.env.CI) {
  client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  });
} else {
  // local / heroku client config
  client = new Client(DB_URL);
}

module.exports = client;