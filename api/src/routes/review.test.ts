import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import reviewRoutes, { resetReviews } from './review';

const app = express();
app.use(express.json());
app.use('/api/reviews', reviewRoutes);

beforeEach(() => {
  resetReviews();
});

describe('Review Routes', () => {
  it('should return all reviews', async () => {
    const res = await request(app).get('/api/reviews');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should filter reviews by productId', async () => {
    const res = await request(app).get('/api/reviews?productId=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((review: { productId: number }) => {
      expect(review.productId).toBe(1);
    });
  });

  it('should return a review by ID', async () => {
    const res = await request(app).get('/api/reviews/1');
    expect(res.status).toBe(200);
    expect(res.body.reviewId).toBe(1);
  });

  it('should return 404 for non-existent review', async () => {
    const res = await request(app).get('/api/reviews/999');
    expect(res.status).toBe(404);
  });

  it('should create a new review', async () => {
    const newReview = {
      reviewId: 100,
      productId: 2,
      author: 'TestUser',
      rating: 5,
      title: 'Great product',
      body: 'Absolutely love it!',
      createdAt: new Date().toISOString(),
      helpful: 0,
    };
    const res = await request(app).post('/api/reviews').send(newReview);
    expect(res.status).toBe(201);
    expect(res.body.reviewId).toBe(100);
  });

  it('should update a review', async () => {
    const updated = {
      reviewId: 1,
      productId: 1,
      author: 'Updated Author',
      rating: 3,
      title: 'Updated title',
      body: 'Updated body',
      createdAt: '2025-11-15T10:30:00Z',
      helpful: 20,
    };
    const res = await request(app).put('/api/reviews/1').send(updated);
    expect(res.status).toBe(200);
    expect(res.body.author).toBe('Updated Author');
  });

  it('should delete a review', async () => {
    const res = await request(app).delete('/api/reviews/1');
    expect(res.status).toBe(204);

    const check = await request(app).get('/api/reviews/1');
    expect(check.status).toBe(404);
  });

  it('should return 404 when deleting non-existent review', async () => {
    const res = await request(app).delete('/api/reviews/999');
    expect(res.status).toBe(404);
  });
});
