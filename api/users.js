const express = require('express');
const usersRouter = express.Router();
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { requireLogin, requireAdmin } = require('./utils');
const {
  createUser,
  getUser,
  // getUserById,
  getReviewsByUserId,
  getUserByUsername,
  getAllUsers,
  getCartByUserId, 
  emailInUseCheck
} = require('../db');

//api calls below
usersRouter.get('/', requireAdmin, async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();

    res.send(allUsers)
  } catch (error) {
    throw error;
  }
});

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;  
  if (!username || !password) {
    res.send({
      error: 'Error',
      name: 'MissingCredentialsError',
      message: "Missing username or password."
    })
  }

  try {
    const user = await getUser({username, password});

    if (user.id) {
      const token = jwt.sign({
        id: user.id,
        username: user.username
      }, JWT_SECRET);

      res.send({ user, token, message: "you're logged in!" })
    } else if (user === 'passwordNotValid') {
      res.send({
        error: 'Error',
        name: 'PasswordNotValid',
        message: `Incorrect password for the username.`
      })
    } else if (user === 'userDoesNotExist') {
      res.send({
        error: 'Error',
        name:'UserNotFoundError',
        message: 'User not found.'
      })
    } else {
      next({
        name: 'LoginError',
        message: 'There was an error during login.'
      })
    }
  } catch ({name, message}) {
    next({name, message});
  }
});

usersRouter.post('/register', async (req, res, next) => {

  try {
    const { username, password, address, fullname, email } = req.body
    
    if (password.length < 8) {
      res.send({
        error: 'Error',
        message: 'Password Too Short!',
        name: 'Password Error'
      })
    }
    
    const _user = await getUserByUsername(username)
    if (_user) {
      res.send({
        name: 'UserExistsError',
        message: `Username ${username} is already taken.`,
        error: 'Error'
      })
    }

    const emailAlreadyInUse = await emailInUseCheck(email);
    if (emailAlreadyInUse) {
      res.send({
        name: 'EmailAlreadyUsed',
        message: `The email address ${email} has already been used by another user.`,
        error: 'Error'
      })
    } else {
      const user = await createUser({ username, password, address, fullname, email })
  
      const token = jwt.sign({
        id: user.id,
        username: user.username
      }, JWT_SECRET);
  
      res.send({
        message: "You are signed up.",
        token,
        user,
      })
    }
  } catch ({ name, message }) {
    next({ name, message })
  }
});

// get my reviews
usersRouter.get('/:userId/reviews', async (req, res, next) => {
  const { userId } = req.params;

  try {
    const userReviews = await getReviewsByUserId(userId);

    res.send(userReviews);
  } catch ({ name, message }) {
    next({ name, message })
  }
});

// get my cart
usersRouter.get('/:userId/cart', async (req, res, next) => {
  const { userId } = req.params;

  try {
    const cart = await getCartByUserId({userId});

    res.send(cart);
  } catch ({ name, message }) {
    next({ name, message })
  }
});

usersRouter.get('/me', async(req, res, next) => {
  if (req.user) {
    res.send(req.user)
  } else {
    next({
      name: 'UserFetchError', 
      message: 'There was an error fetching user data. Please try logging in.'
    })
  }
});

module.exports = usersRouter;