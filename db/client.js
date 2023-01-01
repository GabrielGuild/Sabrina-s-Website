// Connect to DB
const { Pool, Client } = require('pg')
const connectionString = 'postgresql://GabrielGuild:v2_3vEvt_S32Kdegt4KvN89sbfGnrRfe@db.bit.io/GabrielGuild/sabrina?sslmode=require'

// async function getConnection (connectionString) {
// try{

  const pool =  new Pool({
  user: 'GabrielGuild',
    host: 'db.bit.io',
    database: 'GabrielGuild/sabrina',  
    password: 'v2_3vFTT_4vuiJ7YNeP58LnjKacCxKLY', 
    port: 5432,
    ssl: true,
  max: 20,
  idleTimeoutMillis: 300000000,
  connectionTimeoutMillis: 200000000,
})

// return client
// } catch (error) {
//   console.error(error);

//   const client  = await new Client(connectionString)
//   return client
// }

// }

// const client  =  new Client(connectionString)
// // const client = getConnection(connectionString);

module.exports = {
  query: (text, params, callback) => {
    const start = Date.now()
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res.rowCount })
      callback(err, res)
    })
  },
  getClient: (callback) => {
    pool.connect((err, client, done) => {
      const query = client.query
      // monkey patch the query method to keep track of the last query executed
      client.query = (...args) => {
        client.lastQuery = args
        return query.apply(client, args)
      }
      // set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!')
        console.error(`The last executed query on this client was: ${client.lastQuery}`)
      }, 5000)
      const release = (err) => {
        // call the actual 'done' method, returning this client to the pool
        done(err)
        // clear our timeout
        clearTimeout(timeout)
        // set the query method back to its old un-monkey-patched version
        client.query = query
      }
      callback(err, client, release)
    })
  }
}

module.exports = pool; 