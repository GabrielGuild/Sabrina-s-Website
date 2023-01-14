const express = require('express');
const inventoryRouter = express.Router();
const { requireAdmin } = require('./utils');

const {
  createInventory,
  getInventory,
  getInventoryForAdmin,
  getInventoryById,
  deactivateInventory,
  updateInventory,
  getReviewsByItemId,
} = require('../db')

inventoryRouter.get('/', async (req, res, next) => {  
  try {
    const getAllInventory = await getInventory();

    res.send(getAllInventory);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

inventoryRouter.get('/admin', async (req, res, next) => {
  try {
    const getAllInventory = await getInventoryForAdmin();

    res.send(getAllInventory);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

inventoryRouter.get('/:inventoryId', async (req, res, next) => {
  const { inventoryId } = req.params;

  try {
    const item = await getInventoryById(inventoryId);

    res.send(item);
  } catch ({ name, message }) {
    next({ name, message })
  }
});

inventoryRouter.get('/:inventoryId/reviews', async (req, res, next) => {
  const { inventoryId } = req.params;
  try {
    const reviews = await getReviewsByItemId(inventoryId);

    res.send(reviews);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

inventoryRouter.get('/:inventoryId', async(req, res, next) =>{
  try {
    const { inventoryId } = req.params;
    const item = await getInventoryById(inventoryId);

    res.send(item);
  } catch({name, message}){
    next({name, message})
  }
})

inventoryRouter.post('/', requireAdmin, async (req, res, next) => {
  const { name, image, description, price, purchasedCount, stock, isActive, isCustomizable } = req.body;
  const inventoryObj = { name, image, description, price, purchasedCount, stock, isActive, isCustomizable };

  try {
    const newInventory = await createInventory(inventoryObj);

    res.send(newInventory);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

inventoryRouter.patch('/:inventoryId', requireAdmin, async (req, res, next) => {
  const { inventoryId } = req.params;
  const { ...fields } = req.body;

  try {
    const updatedInventoryItem = await updateInventory({ inventoryId, ...fields });

    res.send(updatedInventoryItem);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

inventoryRouter.delete('/:inventoryId', requireAdmin, async (req, res, next) => {
  const { inventoryId } = req.params;

  try {
    const deactivatedItem = await deactivateInventory({ inventoryId });

    res.send(deactivatedItem);
  } catch ({ name, message }) {
    next({ name, message });
  }
});



module.exports = inventoryRouter;