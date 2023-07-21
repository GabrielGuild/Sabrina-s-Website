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
    return res.status(400).json({
      error: 'Error',
      name: 'MissingCredentialsError',
      message: "Missing username or password.",
    });
  }

  try {
    const user = await getUser({ username, password });

    if (!user || !user.id) {
      return res.status(404).json({
        error: 'Error',
        name: 'UserNotFoundError',
        message: 'User not found.',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Error',
        name: 'PasswordNotValid',
        message: `Incorrect password for the username.`,
      });
    }

    const token = jwt.sign({
      id: user.id,
      username: user.username,
    }, JWT_SECRET);

    res.json({
      user: { id: user.id, username: user.username }, // Only send necessary user data
      token,
      message: "You're logged in!",
    });
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/register', async (req, res, next) => {
  try {
    const { username, password, address, fullname, email } = req.body;

    if (password.length < 8) {
      return res.status(400).json({
        error: 'PasswordError',
        message: 'Password needs to be at least 8 characters',
      });
    }

    const _user = await getUserByUsername(username);
    if (_user) {
      return res.status(409).json({
        name: 'UserExistsError',
        message: `Username ${username} is already taken.`,
      });
    }

    const emailAlreadyInUse = await emailInUseCheck(email);
    if (emailAlreadyInUse) {
      return res.status(409).json({
        name: 'EmailAlreadyUsed',
        message: `The email address ${email} has already been used by another user.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      username,
      password: hashedPassword,
      address,
      fullname,
      email,
    });

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
      user: { id: user.id, username: user.username }, // Only send necessary user data
    });
  } catch (error) {
    next(error);
  }
});

usersRouter.get('/me', requireLogin, (req, res, next) => {
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
