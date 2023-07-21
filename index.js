require('dotenv').config();
const express = require('express');
const server = express();
const apiRouter = require('./api');
const { client } = require('./db');

const PORT = process.env.PORT || 4000;

// enable cross-origin resource sharing to proxy API requests
// from localhost:3000 to localhost:4000 in local dev env
const cors = require('cors');
server.use(cors());

// create logs for everything
const morgan = require('morgan');
server.use(morgan('dev'));

// handle application/json requests
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

// serve static files
const path = require('path');
server.use(express.static(path.join(__dirname, 'build')));

// use the API router
server.use('/api', apiRouter);

// default route to serve the React app
server.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// start the server
async function startServer() {
  try {
    await client.connect();
    console.log('Database is open for business!');
    const handle = server.listen(PORT, () => {
      console.log(`Server is running on ${PORT}!`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Closing database connection...');
      await client.end();
      console.log('Database connection closed.');
      console.log('Shutting down server...');
      handle.close(() => {
        console.log('Server has been shut down.');
        process.exit();
      });
    });
  } catch (error) {
    console.error('Database connection failed!\n', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Error handler
server.use((error, req, res, next) => {
  res.status(500);
  res.send(error);
});

// export server and handle for routes/*.test.js
module.exports = { server }
