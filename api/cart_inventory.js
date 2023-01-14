const express = require('express');
const { 
  addItemToCart, 
  updateCartItem, 
  canEditCartInventory,
  removeItemFromCart,
  removeAllItemsFromCart,
  getDetailedUserCartByUserId
} = require('../db');
const { requireLogin } = require('./utils');

const cartInventoryRouter = express.Router();

// POST /api/cart_inventory
// Create cart_inventory, ie add item to cart
cartInventoryRouter.post('/',requireLogin, async (req, res, next) => {
  const { userId, inventoryId, quantity, price } = req.body;

  try {
    if (req.user.id === userId) {
      const cart_item = await addItemToCart({ userId, inventoryId, quantity, price });
  
      res.send(cart_item);
    } else {
      res.status(403).send({
        "error": "UnauthorizedUserError",
        "message": `User ${req.user ? req.user.username : null} is not allowed to add this item to the cart.`,
        "name": "UnauthorizedUserError"
      });
    }
  } catch ({name, message}) {
    next({name, message})
  }
});

// PATCH /api/cart_inventory/:cartInventoryId
// Update an item type in cart (TODO: probably just quantity and isPurchased???)
cartInventoryRouter.patch('/:cartInventoryId', requireLogin, async(req, res, next) => {
  const { cartInventoryId } = req.params;
  const { ...fields } = req.body;

  try {
    const canEdit = await canEditCartInventory({cartInventoryId, userId: req.user.id});
    if (canEdit) {
      const cart_item = await updateCartItem({ id: cartInventoryId, ...fields });
  
      res.send(cart_item);
    } else {
      res.status(403).send({
        "error": "UnauthorizedUserError",
        "message": `User ${req.user ? req.user.username : null} is not allowed to update this cart item.`,
        "name": "UnauthorizedUserError"
      });
    }
  } catch ({name, message}){
    next({name, message})
  }
});

// DELETE /api/cart_inventory/:cartInventoryId
// Remove an item from the cart
cartInventoryRouter.delete('/:cartInventoryId', requireLogin, async(req, res, next) => {
  const { cartInventoryId } = req.params;

  try {
    const canEdit = await canEditCartInventory({ cartInventoryId, userId: req.user.id })
    if (canEdit) {
      const removedCartItem = await removeItemFromCart(cartInventoryId);
      
      res.send(removedCartItem);
    } else {
      res.status(403).send({
        "error": "UnauthorizedUserError",
        "message": `User ${req.user ? req.user.username : null} is not allowed to remove this cart item.`,
        "name": "UnauthorizedUserError"
      });
    }
  } catch ({name, message}) {
    next({name, message})
  }
});

// GET /api/cart_inventory/user/:userId
// Get users cart by user ID
cartInventoryRouter.get('/user/:userId', requireLogin, async (req, res, next) => {
  const { userId } = req.params;

  if (req.user.id !== Number(userId)) {
    res.status(403).send({
      "name": "UnauthorizedUserError",
      "message": `User ${req.user ? req.user.username : null} is not allowed to view this cart.`
    })
  }

  try {
    const cart = await getDetailedUserCartByUserId({userId});

    res.send(cart.length? cart : {name: 'EmptyCart', message: 'The cart is empty!'})
  } catch ({name, message}) {
    next({name, message})
  }
});

// DELETE /api/cart_inventory/user/:userId
// Remove all items from a users cart
cartInventoryRouter.delete('/user/:userId', requireLogin, async(req, res, next) => {
  const { userId } = req.params;

  try {
    if (req.user.id === userId){
      const removedCartItems = await removeAllItemsFromCart(userId);

      res.send(removedCartItems);
    } else {
      res.status(403).send({
        "error": "UnauthorizedUserError",
        "message": `User ${req.user ? req.user.username : null} is not allowed to remove all items from this cart.`,
        "name": "UnauthorizedUserError"
      });
    }
  } catch (error) {
    throw error
  }
})

module.exports = cartInventoryRouter;