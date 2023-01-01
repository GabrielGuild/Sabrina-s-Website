// This is the Web Server
const { Pool } = require('pg')
const express = require('express');
const server = express();
const apiRouter = require('./api');

// enable cross-origin resource sharing to proxy api requests
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


// connect to the server
const PORT = process.env.PORT || 4000;

// Error handler next
server.use((error, req, res, next) => {
  res.status(500);
  res.send(error);
});

// define a server handle to close open tcp connection after unit tests have run
const { createClient } = require('./db/client');

const startServer = async () => {
  try {
    // Acquire a connection from the pool
    const client = await createClient();
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

// export server and handle for routes/*.test.js
module.exports = { server, handle };