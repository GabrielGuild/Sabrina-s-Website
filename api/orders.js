const express = require('express');
const { createNewOrder, getOrderHistoryByUserId, getAllOrders } = require('../db/models/orders');
const { requireLogin, requireAdmin } = require('./utils');
const ordersRouter = express.Router();

// Get all orders (FOR ADMIN ONLY)
// GET /api/orders
ordersRouter.get('/', requireAdmin, async (req, res, next) => {
  try {
    const orders = await getAllOrders();

    res.send(orders);
  } catch ({name, message}){
    next({name, message})
  }
})

// Create/Submit new order
// POST /api/orders
ordersRouter.post('/', async (req, res, next) => {
  const {userId, price, orderDate} = req.body;

  try {
    const newOrder = await createNewOrder({userId, price, orderDate});

    res.send(newOrder);
  } catch ({name, message}) {
    next({name, message})
  }
});

// Get users order history
// GET /api/orders/user/:userId
ordersRouter.get('/user/:userId', async (req, res, next) => {
  const { userId } = req.params; 

  try {
    const orders = await getOrderHistoryByUserId(userId);

    res.send( orders ? orders : { name: 'NoOrdersToDisplay', message: 'No order history to display.' })
  } catch ({name, message}) {
    next({name, message})
  }
});

module.exports = ordersRouter;