const {
    //client,
    // declare your model imports here
    createUser,
    createInventory,
    createReview,
    createNewOrder,
    addItemToCart,
    //createReviews
    // for example, User
  } = require('./');
  
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
        CREATE TABLE inventory(
          id SERIAL PRIMARY KEY,
          name VARCHAR(255),
          image VARCHAR(255),
          description TEXT NOT NULL,
          price INTEGER,
          "purchasedCount" INTEGER,
          stock INTEGER,
          "isCustomizable" BOOLEAN DEFAULT true,
          "isActive" BOOLEAN DEFAULT true
        );
        CREATE TABLE reviews(
          id SERIAL PRIMARY KEY,
          "userId" INTEGER REFERENCES users(id),
          username VARCHAR(255) REFERENCES users(username),
          "itemId" INTEGER REFERENCES inventory(id),
          stars INTEGER,
          "isActive" BOOLEAN DEFAULT true,
          description TEXT NOT NULL
        );
        CREATE TABLE orders(
          id SERIAL PRIMARY KEY,
          "orderDate" TIMESTAMPTZ DEFAULT NOW(),
          "userId" INTEGER REFERENCES users(id),
          price INTEGER,
          inactivated BOOLEAN DEFAULT false
        );
        CREATE TABLE cart_inventory(
          id SERIAL PRIMARY KEY, 
          "userId" INTEGER REFERENCES users(id),
          "inventoryId" INTEGER NOT NULL REFERENCES inventory(id),
          quantity INTEGER,
          price INTEGER NOT NULL,
          "isPurchased" BOOLEAN DEFAULT false,
          "orderId" INTEGER REFERENCES orders(id) DEFAULT null
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
        { username: "Sabrina", password: "Gruffalo0705", fullname: "Sabrina Guild", email: "sguild20@gmail.com" },
        { username: "Gabriel", password: "Redweaver#24", fullname: "Gabriel Guild", email: "gabecg@gmail.com", isAdmin: true },
      ]
      const users = await Promise.all(usersToCreate.map(createUser))
      console.log("USERS", users)
      console.log("Finish creating users...")
  
      console.log("Starting to create inventory...")
    //   const inventoryToCreate = [
    //     {
    //       name: "workshop or office desk",
    //       image: "./images/table-1.png",
    //       price: "150",
    //       description: "beetle kill wood and epoxy hand crafted to specifications sure to stand the test of time ",
    //       purchasedCount: "0",
    //       stock: "10",
    //       isActive: "true",
    //       isCustomizable: "false"
    //     },
  
    //     {
    //       name: "exquisite cutting board made from pine and maple",
    //       image: "./images/cutting-board-2.png",
    //       price: "65",
    //       description: "hard wood cutting board perfect for durablity when cutting meats and vegies with custom laser engraving for custom messages ",
    //       purchasedCount: "0",
    //       stock: "10",
    //       isActive: "true",
    //       isCustomizable: "true"
    //     },
  
    //     {
    //       name: "exquisite cutting board with epoxy",
    //       image: "./images/cutting-board-7.png",
    //       price: "65",
    //       description: "hard wood cutting board perfect for durablity when cutting meats and vegies with custom laser engraving for custom messages ",
    //       purchasedCount: "0",
    //       stock: "10",
    //       isActive: "true",
    //       isCustomizable: "false"
    //     },
  
    //     {
    //       name: "Mini bar",
    //       image: "./images/mini-bar.png",
    //       price: "65",
    //       description: "mini bar made out of beetle kill wood",
    //       purchasedCount: "0",
    //       stock: "5",
    //       isActive: "true",
    //       isCustomizable: "false"
    //     },
    //   ]
    //   const inventory = await Promise.all(inventoryToCreate.map(createInventory))
    //   console.log(inventory)
    //   console.log("Finish creating inventory...")
  
    //   console.log("Starting to create reviews...")
    //   const reviewsToCreate = [
    //     { userId: 1, username: 'albert', itemId: 1, stars: 5, description: "This is quite possiably the best work desk thats ever existed in the history of man" },
    //     { userId: 2, username: 'sandra', itemId: 1, stars: 4, description: "This work desk is so good i can't physically leave it four stars for being waaaaay too good" },
    //     { userId: 3, username: 'glamgal', itemId: 2, stars: 4, description: "I will uses this when I cook! also this thing is so sturdy i could rely on it to fight off the law " },
    //     { userId: 4, username: 'marcus', itemId: 2, stars: 3, description: "Could use some more wood-work." },
    //   ]
    //   const reviews = await Promise.all(reviewsToCreate.map(createReview))
    //   console.log(reviews)
    //   console.log("Finish creating reviews...")
      
    //   console.log('Building carts...');
    //   const cartItems = [
    //     { userId: 1, inventoryId: 1, quantity: 2, price: 5000 },
    //     { userId: 1, inventoryId: 2, quantity: 5, price: 10 },
    //     { userId: 2, inventoryId: 1, quantity: 2, price: 5000 },
    //     { userId: 2, inventoryId: 2, quantity: 5, price: 10}
    //   ]
    //   const inventoryInCarts = await Promise.all(cartItems.map(addItemToCart));
    //   console.log('Inventory in carts:', inventoryInCarts);
    //   console.log('Finished building cart...')
  
    //   console.log('Building order...');
    //   const order = await createNewOrder({userId: 1, price: 50000})
    //   console.log('ORDER:', order)
      console.log('Finished building order.')
  
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
  
