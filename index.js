// This is the Web Server
const { Pool} = require('pg')
require("dotenv").config();
const express = require('express');
const server = express();
const apiRouter = require('./api');

// enable cross-origin resource sharing to proxy api requests
// from localhost:3000 to localhost:4000 in local dev env
const cors = require('cors');
server.use(cors());

// create logs for everything
const morgan = require('morgan');
server.use(morgan('dev'));

// handle application/json requests
server.use(express.urlencoded({extended: false}));
server.use(express.json());

// here's our static files
const path = require('path');
server.use(express.static(path.join(__dirname, 'build')));


// here's our API
server.use('/api', apiRouter);

// by default serve up the react app if we don't recognize the route
server.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// bring in the DB connection
const connectionString = 'postgresql://GabrielGuild:v2_3vEvt_S32Kdegt4KvN89sbfGnrRfe@db.bit.io/GabrielGuild/sabrina?sslmode=require'
const pool = new Pool({
  user: 'GabrielGuild',
    host: 'db.bit.io',
    database: 'GabrielGuild/sabrina',  
    password: 'v2_3vFTT_4vuiJ7YNeP58LnjKacCxKLY', 
    port: 5432,
    ssl: true,
  max: 20,
  keepAlives: true,
  keepAliveIntervalMillis: 30000,
})

// connect to the server
const PORT = process.env.PORT || 4000;

// Error handler next
server.use((error, req, res, next) => {
  res.status(500);
  res.send(error);
});





// define a server handle to close open tcp connection after unit tests have run
const startServer = async () => {

  try {
    // Acquire a connection from the pool
    const client = await pool.connect();
    client.on('notice', msg => console.warn('notice:', msg))
    console.log('Database is open for business!');
    client.release();
  } catch (error) {
    console.error('Database is closed for repairs!\n', error);
  } finally {
    // Release the connection back to the pool
    
  }
}

const handle = server.listen(PORT, startServer);

// // export server and handle for routes/*.test.js
module.exports = { server, handle };