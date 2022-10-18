const express = require('express');
const apiRouter = express.Router();
const jwt = require('jsonwebtoken');
const { getUserById } = require('../db')

apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { JWT_SECRET } = process.env;
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${prefix}`
    });
  }
});


apiRouter.get('/health', (req, res, next) => {
  res.send({
    healthy: true,
  });
});

// ROUTER: /api/users
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

// 404 not found 
apiRouter.use('*', async (req, res) => {
  res.status(404)
  res.send({
    message: "page not found"
  })
});

module.exports = apiRouter;