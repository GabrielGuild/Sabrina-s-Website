const {
    createUser,
  } = require('./models/user');
  
  const { createClient } = require('./client');


  async function buildTables() {
    let client;

    try {
      // Acquire a connection from the pool
       client = await createClient();
  
      console.log('dropping tables');
      await client.query(`
        DROP TABLE IF EXISTS users;
      `);
  
      console.log('building tables');
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          fullname VARCHAR(255),
          email VARCHAR(255) UNIQUE NOT NULL,
          "isAdmin" BOOLEAN DEFAULT false
        );
      `);
      console.log('Finished building tables!');
  
      // Release the connection back to the pool
      client.release();
    } catch (error) {
      console.error('Error building tables! Buildtables');
      throw error;
    }finally{
    }
  }

    async function createInitialData() {
        let client
    try{
         client = await createClient();

        const startingUsers = [
            {username:"Gabriel", password: "Redweaver1", fullname: "Gabriel Guild", email: "gabecg@gmail.com", isAdmin: true},
            {username:"Sabrina", password: "Gruffalo0705#", fullname: "Sabrina Guild", email: "sguild20@gmail.com", isAdmin: true},
        ]
        
        const users = await Promise.all(startingUsers.map(createUser))
        console.log("USERS", users)
        client.release();
    } catch (error) {
        console.error("Error creating tables! create Data")
        throw error
    }finally{
    }
    }

    buildTables()
    .then(createInitialData)
    .catch(console.error)
    