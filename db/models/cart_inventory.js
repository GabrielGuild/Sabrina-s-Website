const client = require("../client")

async function getCartItemById(id) {
  try {
    const { rows: [cart_item] } = await client.query(`
      SELECT *
      FROM cart_inventory
        WHERE id = $1 AND "isPurchased"=false
    `, [id]);

    return cart_item
  } catch (error) {
    throw error
  }
}

async function addItemToCart({ userId, inventoryId, quantity, price, isPurchased=false }) {
  try {
    const { rows: [cart_item] } = await client.query(`
      INSERT INTO cart_inventory("userId", "inventoryId", quantity, price, "isPurchased")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING*
    `, [userId, inventoryId, quantity, price, isPurchased]);

    return cart_item
  } catch (error) {
    throw error
  }
}

// Will return all cart_inventory in cart
async function getCartItemsByUserId({userId}) {
  try {
    const { rows: cart } = await client.query(`
      SELECT*
      FROM cart_inventory
        WHERE "userId"=$1 AND "isPurchased"=false
    `, [userId]);

    if (cart.length) {
      return cart
    } else return false
  } catch(error) {
    throw error
  }
}

async function getDetailedUserCartByUserId({userId}) {
  try {    
    const { rows: cartItems } = await client.query(`
      SELECT inventory.id AS "inventoryId", cart_inventory.id AS "cartInventoryId",
        cart_inventory."userId", inventory.name, inventory.image, inventory.description, 
        inventory.price, inventory."isCustomizable", inventory.stock, cart_inventory.quantity 
      FROM cart_inventory
      JOIN inventory ON inventory.id = cart_inventory."inventoryId"
      WHERE cart_inventory."userId"=$1 and cart_inventory."isPurchased"=false      
    `, [userId]);

    return cartItems
  } catch (error) {
    throw error
  }
}

// The fields will be "inventoryId", quantity, price
// The id here is the cart_inventory id... i.e. one type of item in cart
async function updateCartItem({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}" =$${index + 1}`
  ).join(', ');

  if (setString.length === 0) return;

  try {
    const { rows: [updatedCartItem] } = await client.query(`
      UPDATE cart_inventory
      SET ${setString}
        WHERE id=${id} AND "isPurchased"=false
      RETURNING *;
    `, Object.values(fields));

    return updatedCartItem;

  } catch (error) {
    throw error;
  }
}

// Will remove one type of inventory from "cart" using cart_inventory ID
async function removeItemFromCart(cart_inventoryId) {
  try {
    const { rows: [deletedCartItem] } = await client.query(`
      DELETE
      FROM cart_inventory
        WHERE id=$1 AND "isPurchased"=false
      RETURNING*
    `, [cart_inventoryId]);

    return deletedCartItem
  } catch (error) {
    throw error
  }
}

async function canEditCartInventory({cartInventoryId, userId}){
  try {
    const { rows: [cartItem] } = await client.query(`
      SELECT*
      FROM cart_inventory
          WHERE id=$1
      `, [cartInventoryId])

    if (cartItem.userId === userId) { return true }

    return false

  } catch (error) {
    throw error
  }
}

async function removeAllItemsFromCart(userId) {
  try {
    const { rows: deletedCartItems } = await client.query(`
      DELETE
      FROM cart_inventory
        WHERE "userId"=$1 AND "isPurchased"=false
      RETURNING*
    `, [userId]);

    return deletedCartItems
  } catch (error) {
    throw error
  }
}

module.exports = {
  getCartItemById,
  addItemToCart,
  getCartItemsByUserId,
  getDetailedUserCartByUserId,
  updateCartItem,
  removeItemFromCart,
  canEditCartInventory,
  removeAllItemsFromCart
};