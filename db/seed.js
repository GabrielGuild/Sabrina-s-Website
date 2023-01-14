const {
  createUser,
  createInventory,
  createReview,
  createNewOrder,
  addItemToCart,
} = require('./');

const { Client } = require('pg');
const client = require("./client")

async function buildTables() {
  try {
    client.connect();
    console.log("Dropping All Tables...")
    // drop tables in correct order
    await client.query(`
      DROP TABLE IF EXISTS item_reviews;
      DROP TABLE IF EXISTS cart_inventory;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS carts;
      DROP TABLE IF EXISTS inventory;
      DROP TABLE IF EXISTS users;
    `)

    // build tables in correct order
    console.log('hello again')
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
    console.error("Error building tables!");
    throw error;
  }
}
async function createInitialData() {
  console.log("Starting to create users...")
  try {
    const usersToCreate = [
           {username:"Gabriel", password: "Redweaver1", fullname: "Gabriel Guild", email: "gabecg@gmail.com", isAdmin: true},
           {username:"Sabrina", password: "Gruffalo0705#", fullname: "Sabrina Guild", email: "sguild20@gmail.com", isAdmin: true},
    ]
    const users = await Promise.all(usersToCreate.map(createUser))
    console.log("USERS", users)
    console.log("Finish creating users...")

    console.log("Finished creating tables!")

  } catch (error) {
    console.error("Error creating tables!")
    throw error
  }
}
  

buildTables()
  .then(createInitialData)
  .catch(console.error)
  .finally(() => client.end());
