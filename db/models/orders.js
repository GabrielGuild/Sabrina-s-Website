/* eslint-disable no-useless-catch */
const client = require("../client");
const { getCartItemsByUserId } = require("./cart_inventory");
const { subtractItemQuantityFromStock, addToInventoryPurchasedCount } = require("./inventory");
const { getAllUsers } = require("./user");

// This will return all orders submitted by any user (for admin)
// Returns order, plus user object, plus array of item objects
async function getAllOrders(){
  try {
    const { rows: orders } = await client.query(`
      SELECT orders.*
      FROM orders
    `);

    const ordersWithUsers = await attachUsersToOrders(orders);
    
    ordersWithUsers.forEach(order => delete order.userId)

    const ordersWithUsersAndItems = await attachCartItemsToOrders(ordersWithUsers);

    return ordersWithUsersAndItems
  } catch (error) {
    throw error
  }
}

// Attaches relevant user object to orders passed in
async function attachUsersToOrders(orders){
  const ordersToReturn = [...orders];
  try {
    const allUsers = await getAllUsers();
    
    ordersToReturn.forEach(order => {
      const userToAdd = allUsers.filter(user => user.id === order.userId);
      order.user = userToAdd[0];
    })

    return ordersToReturn
  } catch (error) {
    throw error
  }
}

// When user submits order
async function createNewOrder({userId, price, orderDate}){
  try {
    const itemsInCart = await getCartItemsByUserId({userId})

    if (itemsInCart) {
      await subtractItemQuantityFromStock(itemsInCart);

      await addToInventoryPurchasedCount(itemsInCart);

      const { rows: [order] } = await client.query(`
        INSERT INTO orders("userId", price, "orderDate")
        VALUES($1, $2, $3)
        RETURNING*
      `, [userId, price, orderDate]);

      await addCartToOrder({orderId: order.id, userId});
  
      const orderWithCartItemsAttached = await attachCartItemsToOrders([order]);
  
      return orderWithCartItemsAttached[0]
    } else {
      return false
    }
  } catch (error) {
    throw error
  }
}

// Sets isPurchased to true on items in user's cart, adds the order ID
async function addCartToOrder({orderId, userId}){
  try {
    const { rows: cartItemsToOrder } = await client.query(`
        UPDATE cart_inventory
        SET "orderId"=$1, "isPurchased"=true
          WHERE "userId"=$2 AND "isPurchased"=false
        RETURNING*
      `, [orderId, userId]);
  
      return cartItemsToOrder;
  } catch (error) {
    throw error
  }
}

// Returns the array of orders with array of relevant item objects attached
async function attachCartItemsToOrders(orders) {
  const ordersToReturn = [...orders];
  const includedOrderIds = orders.map((_, index) => `$${index + 1}`).join(', ');
  const orderIds = orders.map(order => order.id);
  if (!orderIds?.length) return;
  
  try {
    const { rows: cartItems } = await client.query(`
      SELECT cart_inventory.id AS "cartInventoryId", inventory.id AS "inventoryId",
        inventory.name, inventory.image, inventory.description, cart_inventory.quantity, 
        cart_inventory.price, cart_inventory."orderId"
      FROM inventory
      JOIN cart_inventory ON cart_inventory."inventoryId" = inventory.id
      WHERE cart_inventory."orderId" IN (${includedOrderIds});
    `, orderIds);

    for (const order of ordersToReturn) {
      const itemsToAdd = cartItems.filter(item => item.orderId === order.id);
      itemsToAdd.forEach(item => delete item.orderId)
      order.items = itemsToAdd;
    }

    return ordersToReturn;
  } catch (error) {
    throw error
  }
}

async function getOrderHistoryByUserId(userId) {
  try {
    const { rows: orders } = await client.query(`
      SELECT * 
      FROM orders
      WHERE "userId"=$1;
    `, [userId]);
    
    const ordersWithItemsAttached = await attachCartItemsToOrders(orders);

    return ordersWithItemsAttached;
  } catch (error) {
    throw error
  }
}

// Updates order information-- NOT cart_inventory items
// Can be used to 'delete' order by setting inactivated to true
async function updateSubmittedOrder({ orderId, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}" =$${index + 1}`
  ).join(', ');

  if (setString.length === 0) return;

  try {
    const { rows: [updatedOrder] } = await client.query(`
      UPDATE orders
      SET ${setString}
        WHERE id=${orderId}
      RETURNING *;
    `, Object.values(fields));

    return updatedOrder;

  } catch (error) {
    throw error;
  }
}

async function updateSingleItemInSubmittedOrder({ orderId, cart_inventoryId, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}" =$${index + 1}`
  ).join(', ');

  if (setString.length === 0) return;

  try {
    const { rows: [updatedItemInOrder] } = await client.query(`
      UPDATE cart_inventory
      SET ${setString}
        WHERE id=${cart_inventoryId} AND "isPurchased"=true AND "orderId"=${orderId}
      RETURNING *;
    `, Object.values(fields));

    return updatedItemInOrder;

  } catch (error) {
    throw error;
  }
}

async function removeSingleItemFromSubmittedOrder({cart_inventoryId, orderId}) {
  try {
    const { rows: [deletedItemFromOrder] } = await client.query(`
      DELETE
      FROM cart_inventory
        WHERE id=$1 AND "isPurchased"=true AND "orderId"=$2
      RETURNING*
    `, [cart_inventoryId, orderId]);

    return deletedItemFromOrder
  } catch (error) {
    throw error
  }
}

module.exports = {
  getAllOrders,
  createNewOrder,
  addCartToOrder,
  attachCartItemsToOrders,
  getOrderHistoryByUserId,
  updateSubmittedOrder,
  updateSingleItemInSubmittedOrder,
  removeSingleItemFromSubmittedOrder
}