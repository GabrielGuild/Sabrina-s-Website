// Connect to DB
const {  Pool } = require('pg')
// const connectionString = 'postgresql://GabrielGuild:v2_3y4C9_7EyVgMhcUN74Xua3s8Zv59C@db.bit.io:5432/GabrielGuild.sabrina?sslmode=require'

const pool = new Pool({
    user: 'GabrielGuild',
    host: 'db.bit.io',
    database: 'GabrielGuild/sabrina',
    password: 'v2_3y4DB_FiX2ugR6d5s5ksdADiDMExB',
    port: 5432
  });

module.exports = pool;