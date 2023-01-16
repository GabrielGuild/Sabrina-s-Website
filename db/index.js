const pool = require('./client');
const models = require('./models');

module.exports = {
  pool,
  ...models
};