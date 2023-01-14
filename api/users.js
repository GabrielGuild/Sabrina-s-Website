const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { requireAdmin } = require('./utils');
const {
  createUser,
  getUser,
  getReviewsByUserId,
  getUserByUsername,
  getAllUsers,
  emailInUseCheck,
  makeUserAdminById,
  removeUserAsAdminById,
  getDetailedUserCartByUserId
} = require('../db');

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
      const user = await createUser({ username, password, fullname, email })
  
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

usersRouter.patch('/:userId', requireAdmin, async (req, res, next) => {
  const { userId } = req.params;
  const { isAdmin } = req.body;

  if (req.user.id === userId) {
    res.send({
      error: 'Error',
      name: 'AdminConflictError',
      message: 'An admin cannot change their admin status.'
    })
  }

  try {
    let user;
    if (isAdmin) {
      user = await makeUserAdminById({id: userId});
    } else {
      user = await removeUserAsAdminById({id: userId});
    }
    
    res.send(user);
  } catch ({name, message}) {
    next({name, message})
  }
})

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

  if (req.user.id !== userId) {
    res.status(401).send({
      name: 'UnauthorizedUserError',
      message: `User ${req.user ? req.user.username : null} is not authorized to view this cart.`
    })
  }

  try {
    const cart = await getDetailedUserCartByUserId({userId});

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