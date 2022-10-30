// Connect to DB
const { Client } = require('pg');

// change the DB_NAME string to whatever your group decides on
const DB_NAME = 'sabrina';

const DB_URL = ({
  connectionString: process.env.DATABASE_URL || `postgresql://GabrielGuild:v2_3vCSk_kHNu5za87YZvvvxW9x2bZKS@db.bit.io/GabrielGuild/${DB_NAME}?sslmode=require`,});
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined,
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