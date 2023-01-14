const express = require('express');
const reviewsRouter = express.Router();
const { requireLogin, requireAdmin } = require('./utils');

const {
  createReview,
  getReviewsByItemId,
  removeReview,
  canEditReview,
  updateReview,
} = require('../db')

reviewsRouter.get('/item/:itemId', async (req, res, next) => {
  const { itemId } = req.params;

  try {
    const reviews = await getReviewsByItemId(itemId);

    res.send(reviews);
  } catch ({ name, message }) {
    next({ name, message })
  }
})

//post review
reviewsRouter.post('/', requireLogin, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const username = req.user.username
    const { itemId, stars, description } = req.body;

    const userReview = await createReview({ userId, username, itemId, stars, description });

    res.send(userReview);
  } catch ({ name, message }) {
    next({ name, message })
  }
})

//Patch my Review 
reviewsRouter.patch('/:reviewId', requireLogin, async (req, res, next) => {
  const { reviewId } = req.params;
  const { ...fields } = req.body;

  try {
    const userId = req.user.id;
    const canEdit = await canEditReview({ userId, reviewId });

    if (canEdit) {
      const updatedReview = await updateReview({ id: reviewId, ...fields });

      res.send(updatedReview);
    } else {
      res.status(403).send({
        "error": "UnauthorizedUserError",
        "message": `User ${req.user ? req.user.username : null} is not allowed to update this review `,
        "name": "UnauthorizedUserError"
      });
    }

  } catch ({ name, message }) {
    next({ name, message });
  }
})

// delete review 
reviewsRouter.delete('/:reviewId', requireLogin, async (req, res, next) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  try {
    const canEdit = await canEditReview({ userId, reviewId })
    if (canEdit) {
      const deletedReview = await removeReview(reviewId);

      res.send(deletedReview);
    } else {
      res.status(403).send({
        "error": "UnauthorizedUserError",
        "message": `User ${req.user ? req.user.username : null} is not allowed to remove this review `,
        "name": "UnauthorizedUserError"
      });
    }

  } catch ({ name, message }) {
    next({ name, message });
  }
})

reviewsRouter.delete('/:reviewId/admin', requireAdmin, async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    const deletedReview = await removeReview(reviewId);

    res.send(deletedReview);
  } catch ({ name, message }) {
    next({ name, message });
  }
})

module.exports = reviewsRouter;