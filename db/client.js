// Connect to DB
const {  Pool } = require('pg')
 const connectionString = 'postgres://ybehutku:xZmGQutOjhSfATX_LYAqn6bDtV5RlNjN@otto.db.elephantsql.com/ybehutku'

const pool = new Pool({
  connectionString: connectionString,
  });

module.exports = pool;
