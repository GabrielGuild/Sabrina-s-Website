const { createClient } = require('./client');
const models = require('./models');

module.exports = {
  createClient ,
  ...models
};

