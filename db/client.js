// Connect to DB
const { Pool, Client } = require('pg')
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



async function createClient() {
  try {
    // Acquire a connection from the pool
    const client = await pool.connect();
    client.on('notice', msg => console.warn('notice:', msg))
    setTimeout(() => {
      client.release();
    }, 20000);
    return client;
  } catch (error) {
    console.error('Error creating client: ', error);
    setTimeout(() => {
      client.release();
    }, 30000);
    throw error;
  } finally {
    // Release the connection back to the pool
    
  }
}
let client = createClient();

module.exports = client; 