// Connect to DB

const { Pool, Client } = require('pg')
const connectionString = 'postgresql://GabrielGuild:v2_3vEvt_S32Kdegt4KvN89sbfGnrRfe@db.bit.io/GabrielGuild/sabrina?sslmode=require'

const pool = new Pool({
  user: 'GabrielGuild',
  host: 'db.bit.io',
  database: 'GabrielGuild/sabrina', 
  password: 'v2_3vEvt_S32Kdegt4KvN89sbfGnrRfe', 
  port: 5432,
  ssl:true,
})



const client = new Client({
  connectionString,
})

// console.log("pool connection equals this one right here ", pool)
// console.log("client connection equals this one right here ", client)


// change the DB_NAME string to whatever your group decides on
const DB_NAME = 'sabrina';


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
  // client = new Client(DB_URL);
}

module.exports = client;