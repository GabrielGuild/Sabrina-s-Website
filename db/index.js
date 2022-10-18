const client = require('./client');
const models = require('./models');

module.exports = {
  client,
  ...models
  //...require('./client'), // adds key/values from users.js
  //...require('./inventory'), // adds key/values from users.js

};

