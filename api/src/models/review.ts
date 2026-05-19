/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - reviewId
 *         - productId
 *         - author
 *         - rating
 *         - title
 *         - body
 *         - createdAt
 *       properties:
 *         reviewId:
 *           type: integer
 *           description: The unique identifier of the review
 *         productId:
 *           type: integer
 *           description: The ID of the reviewed product
 *         author:
 *           type: string
 *           description: The review author name
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5
 *         title:
 *           type: string
 *           description: Review title
 *         body:
 *           type: string
 *           description: Review body text
 *         createdAt:
 *           type: string
 *           description: ISO date string of review creation
 *         helpful:
 *           type: integer
 *           description: Count of helpful votes
 */
export interface Review {
    reviewId: number;
    productId: number;
    author: string;
    rating: number;
    title: string;
    body: string;
    createdAt: string;
    helpful: number;
}
