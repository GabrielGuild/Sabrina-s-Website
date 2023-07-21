require("dotenv").config();
const express = require('express');
const server = express();
const apiRouter = require('./api');
const pg = require('pg');

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
const client = require('./db/client');

// Connect to the server
const PORT = process.env.PORT || 4000;
let handle; // Declare the handle variable outside the callback

client.connect((err) => {
  if (err) {
    console.error('Could not connect to Postgres:', err);
    process.exit(1);
  }

  // Start the server only after successfully connecting to the database
  handle = server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}!`);
  });

  // Close the database connection gracefully when the server is closed
  process.on('SIGINT', async () => {
    console.log('Closing client');
    await client.end();
    console.log('Database connection closed');
    process.exit();
  });
});

// Error handler next
server.use((error, req, res, next) => {
  res.status(500);
  res.send(error);
});

// export server and handle for routes/*.test.js
module.exports = { server, handle };
