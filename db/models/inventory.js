/* eslint-disable no-useless-catch */
const client = require("../client")

async function createInventory({
  name,
  image,
  description,
  price,
  purchasedCount,
  stock,
  isActive = true,
  isCustomizable
}) {
  try {
    const { rows: [inventory] } = await client.query(`
      INSERT INTO inventory( name, image, description, price, "purchasedCount", stock, "isActive", "isCustomizable") 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)  
      RETURNING *;
    `, [name, image, description, price, purchasedCount, stock, isActive, isCustomizable]);

    return inventory;
  } catch (error) {
    throw error;
  }
}

async function getInventory() {
  try {
    const { rows: inventory } = await client.query(`
      SELECT *
      FROM inventory
      WHERE "isActive" = true
    `)

    const inventoryWithStarsAttached = attachStarsToItems(inventory);

    return inventoryWithStarsAttached
  } catch (error) {
    throw error;
  }
}

async function attachStarsToItems(items) {
  const itemsToReturn = [...items];
  const includedItemIds = items.map((_, index) => `$${index + 1}`).join(', ');
  const itemIds = items.map(item => item.id);
  if (!itemIds?.length) return;

  try {
    const { rows: ratings } = await client.query(`
      SELECT inventory.id AS "itemId", stars
      FROM inventory
      JOIN reviews ON reviews."itemId" = inventory.id
      WHERE reviews."itemId" IN (${includedItemIds});
    `, itemIds)

    for (const item of itemsToReturn) {
      const starsToAdd = ratings.filter(rating => rating.itemId === item.id);
      starsToAdd.forEach(rating => delete rating.itemId)
      item.ratings = starsToAdd;
    }

    return itemsToReturn;
  } catch (error) {
    throw error
  }
}

async function getInventoryForAdmin() {
  try {
    const { rows: inventory } = await client.query(`
      SELECT *
      FROM inventory
    `);

    const inventoryWithStarsAttached = attachStarsToItems(inventory);

    return inventoryWithStarsAttached
  } catch (error) {
    throw error
  }
}

async function getInventoryById(id) {
  try {
    const { rows: [inventory] } = await client.query(`
      SELECT*
      FROM inventory WHERE id=$1
    `, [id]);

    if (!inventory) { return null }

    const item = await attachStarsToItems([inventory]);

    return item[0];
  } catch (error) {
    throw error;
  }
}

async function getInventoryByName(name) {
  try {
    const { rows: [inventory] } = await client.query(`
      SELECT*
      FROM inventory WHERE name=$1
    ` [name]);

    if (!inventory) { return null }

    return inventory;

  } catch (error) {
    throw error;
  }
}

async function subtractItemQuantityFromStock(items) {
  try {
    items.forEach(async (item) => {
      const inventory = await getInventoryById(item.inventoryId);
      const stock = inventory.stock - item.quantity;

      await updateInventory({
        inventoryId: inventory.id,
        stock
      });
    });

    return
  } catch (error) {
    throw error
  }
}


async function addToInventoryPurchasedCount(items) {
  try {
    items.forEach(async (item) => {
      const inventory = await getInventoryById(item.inventoryId);
      const purchasedCount = inventory.purchasedCount + item.quantity;
      
      await updateInventory({
        inventoryId: inventory.id,
        purchasedCount
      })
    })

    return
  } catch (error) {
    throw error
  }
}

async function updateInventory({ inventoryId, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}" =$${index + 1}`
  ).join(', ');

  if (setString.length === 0) return;

  try {
    const { rows: [updatedInventory] } = await client.query(`
      UPDATE inventory
      SET ${setString}
        WHERE id=${inventoryId}
      RETURNING *;
    `, Object.values(fields));

    return updatedInventory;

  } catch (error) {
    throw error;
  }
}

async function deactivateInventory({ inventoryId }) {
  try {
    const { rows: [deactivatedInventory] } = await client.query(`
      UPDATE inventory
      SET "isActive"=false
        WHERE id=$1
      RETURNING*;
    `, [inventoryId]);

    return deactivatedInventory;

  } catch (error) {
    throw error
  }
}

module.exports = {
  createInventory,
  getInventory,
  getInventoryForAdmin,
  getInventoryById,
  getInventoryByName,
  subtractItemQuantityFromStock,
  updateInventory,
  deactivateInventory,
  addToInventoryPurchasedCount
}