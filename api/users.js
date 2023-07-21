const express = require('express');
const usersRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { requireLogin, requireAdmin } = require('./utils');
const {
  createUser,
  getUser,
  getUserByUsername,
  getAllUsers,
  emailInUseCheck
} = require('../db');

// ... All your imports and setup ...

//api calls below
usersRouter.get('/', async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      error: 'MissingCredentialsError',
      message: "Missing username or password.",
    });
    return;
  }

  try {
    const user = await getUser({ username, password });

    if (user.id) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        JWT_SECRET
      );

      res.json({ user, token, message: "You're logged in!" });
    } else if (user === 'passwordNotValid') {
      res.status(401).json({
        error: 'PasswordNotValid',
        message: `Incorrect password for the username.`,
      });
    } else if (user === 'userDoesNotExist') {
      res.status(404).json({
        error: 'UserNotFoundError',
        message: 'User not found.',
      });
    } else {
      next({
        name: 'LoginError',
        message: 'There was an error during login.',
      });
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/register', async (req, res, next) => {
  try {
    const { username, password, address, fullname, email } = req.body;

    if (password.length < 8) {
      res.status(400).json({
        error: 'PasswordError',
        message: 'Password needs to be at least 8 characters',
      });
      return;
    }

    const _user = await getUserByUsername(username);
    if (_user) {
      res.status(409).json({
        name: 'UserExistsError',
        message: `Username ${username} is already taken.`,
      });
      return;
    }

    const emailAlreadyInUse = await emailInUseCheck(email);
    if (emailAlreadyInUse) {
      res.status(409).json({
        name: 'EmailAlreadyUsed',
        message: `The email address ${email} has already been used by another user.`,
      });
      return;
    }

    const user = await createUser({ username, password, address, fullname, email });

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      JWT_SECRET
    );

    res.json({
      message: "You are signed up.",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
});

usersRouter.get('/me', requireLogin, async (req, res, next) => {
  if (req.user) {
    res.json(req.user);
  } else {
    next({
      name: 'UserFetchError',
      message: 'There was an error fetching user data. Please try logging in.',
    });
  }
});

module.exports = usersRouter;
