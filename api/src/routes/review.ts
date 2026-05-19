/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API endpoints for managing product reviews
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Returns all reviews (optionally filtered by productId)
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *         description: Filter reviews by product ID
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */

import express from 'express';
import { Review } from '../models/review';
import { reviews as seedReviews } from '../seedData';

const router = express.Router();

let reviews: Review[] = [...seedReviews];

export const resetReviews = () => {
  reviews = [...seedReviews];
};

// Create a new review
router.post('/', (req, res) => {
  const newReview: Review = req.body;
  reviews.push(newReview);
  res.status(201).json(newReview);
});

// Get all reviews (with optional productId filter)
router.get('/', (req, res) => {
  const productId = req.query.productId;
  if (productId) {
    const filtered = reviews.filter(r => r.productId === parseInt(productId as string));
    res.json(filtered);
  } else {
    res.json(reviews);
  }
});

// Get a review by ID
router.get('/:id', (req, res) => {
  const review = reviews.find(r => r.reviewId === parseInt(req.params.id));
  if (review) {
    res.json(review);
  } else {
    res.status(404).send('Review not found');
  }
});

// Update a review by ID
router.put('/:id', (req, res) => {
  const index = reviews.findIndex(r => r.reviewId === parseInt(req.params.id));
  if (index !== -1) {
    reviews[index] = req.body;
    res.json(reviews[index]);
  } else {
    res.status(404).send('Review not found');
  }
});

// Delete a review by ID
router.delete('/:id', (req, res) => {
  const index = reviews.findIndex(r => r.reviewId === parseInt(req.params.id));
  if (index !== -1) {
    reviews.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Review not found');
  }
});

export default router;
