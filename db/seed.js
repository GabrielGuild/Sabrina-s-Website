const {
  createUser,
  } = require('./models/user');

  const client = require("./client")

  async function buildTables() {
      try{
  client.connect();

  console.log('dropping tables')
  await client.query(`
  DROP TABLE IF EXISTS users;
  `)

  console.log('building tables')
  await client.query(`
  CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  "isAdmin" BOOLEAN DEFAULT false
  );
  `)
  console.log("Finished building tables!");
} catch (error) {
  console.error("Error building tables! Buildtables");
  throw error;
  }
}

  async function createInitialData() {
  try{
      const startingUsers = [
          {username:"Gabriel", password: "Redweaver1", fullname: "Gabriel Guild", email: "gabecg@gmail.com", isAdmin: true},
          {username:"Sabrina", password: "Gruffalo0705#", fullname: "Sabrina Guild", email: "sguild20@gmail.com", isAdmin: true},
      ]
      
      const users = await Promise.all(startingUsers.map(createUser))
      console.log("USERS", users)
  } catch (error) {
      console.error("Error creating tables! create Data")
      throw error
  }
  }

  buildTables()
  .then(createInitialData)
  .catch(console.error)
  .finally(() => client.release())