// Connect to DB
const { Client, Pool } = require('pg')
const connectionString = 'postgresql://GabrielGuild:v2_3y3GS_MQZHjrS5euNWvm97Qy8YQ48@db.bit.io:5432/GabrielGuild.sabrina?sslmode=require'

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
// } v2_3y3Hw_y8hYnHQkTKUmQxx82wmSVGz
client = new Client(connectionString);

module.exports = client;