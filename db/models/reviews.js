/* eslint-disable no-useless-catch */
const client = require("../client")

async function createReview({
  userId, username, itemId, stars, description
}) {
  try {
    const { rows: [review] } = await client.query(`
      INSERT INTO reviews("userId", username, "itemId", stars, description)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *;
    `, [userId, username, itemId, stars, description]);

    return review
  } catch (error) {
    throw error
  }
}
async function getReviewById(Id) {
  try {
    const { rows: reviews } = await client.query(`
      SELECT *
      FROM reviews
        WHERE id = $1
    `, [Id]);

    return reviews
  } catch (error) {
    throw error
  }
}
async function getReviewsByItemId(itemId) {
  try {
    const { rows: reviews } = await client.query(`
      SELECT *
      FROM reviews
        WHERE "itemId" = $1
    `, [itemId]);

    return reviews
  } catch (error) {
    throw error
  }
}
async function getReviewsByUserId(userId) {
  try {
    const { rows: reviews } = await client.query(`
      SELECT *
      FROM reviews
        WHERE "userId" = $1 
    `, [userId]);

    return reviews
  } catch (error) {
    throw error
  }
}
async function removeReview(reviewId) {
  try {
    const { rows: [removedReview] } = await client.query(`
      UPDATE reviews
      SET "isActive" = false
        WHERE id = $1
      RETURNING*     
    `, [reviewId]);

    return removedReview;
  } catch (error) {
    throw error
  }
}
async function getStarsByItemId(itemId) {
  try {
    const { rows: reviewStars } = await client.query(`
      SELECT DISTINCT review.*, stars
      FROM reviews
        WHERE "itemId" = $1
    `, [itemId]);

    return reviewStars
  } catch (error) {
    throw error
  }
}
async function canEditReview({ userId, reviewId }) {
  try {
    const { rows: [review] } = await client.query(`
      SELECT*
      FROM reviews
        WHERE id=$1
    `, [reviewId])

    if (review.userId === userId) { return true }

    return false
  } catch (error) {
    throw error
  }
}

async function updateReview({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}" =$${index + 1}`
  ).join(', ');

  if (setString.length === 0) return;

  try {
    const { rows: [updatedReview] } = await client.query(`
      UPDATE reviews
      SET ${setString}
          WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));

    return updatedReview;
  } catch (error) {
    throw error
  }
}

async function addReviewToItem({ itemId, reviewId }) {
  try {
    const { rows: [itemReview] } = await client.query(`
      INSERT INTO item_reviews( "itemId", "reviewId")
      VALUES ($1, $2)
      RETURNING *
    `, [itemId, reviewId]);

    return itemReview
  } catch (error) {
    throw error
  }
}

module.exports = {
  createReview,
  getReviewById,
  getReviewsByItemId,
  getReviewsByUserId,
  removeReview,
  getStarsByItemId,
  canEditReview,
  updateReview,
  addReviewToItem,
};