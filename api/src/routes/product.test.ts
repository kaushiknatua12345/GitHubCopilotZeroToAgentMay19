import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import productRouter, { resetProducts } from './product';
import { products as seedProducts } from '../seedData';

let app: express.Express;

describe('Product API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/products', productRouter);
        resetProducts();
    });

    it('should create a new product', async () => {
        const newProduct = {
            productId: 100,
            supplierId: 1,
            name: "LaserChase Turbo",
            description: "AI-powered laser toy that adapts to your cat's reflexes",
            price: 59.99,
            sku: "CAT-LASER-001",
            unit: "piece",
            imgName: "laser-chase.png"
        };
        const response = await request(app).post('/products').send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newProduct);
    });

    it('should get all products', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedProducts.length);
        response.body.forEach((product: Record<string, unknown>, index: number) => {
            expect(product).toMatchObject(seedProducts[index]);
        });
    });

    it('should get a product by ID', async () => {
        const response = await request(app).get('/products/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedProducts[0]);
    });

    it('should update a product by ID', async () => {
        const updatedProduct = {
            ...seedProducts[0],
            name: 'SmartFeeder Pro'
        };
        const response = await request(app).put('/products/1').send(updatedProduct);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedProduct);
    });

    it('should delete a product by ID', async () => {
        const response = await request(app).delete('/products/1');
        expect(response.status).toBe(204);

        const getResponse = await request(app).get('/products/1');
        expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existing product (GET)', async () => {
        const response = await request(app).get('/products/999');
        expect(response.status).toBe(404);
    });

    it('should return 404 for non-existing product (PUT)', async () => {
        const response = await request(app).put('/products/999').send({ name: 'Ghost Product' });
        expect(response.status).toBe(404);
    });

    it('should return 404 for non-existing product (DELETE)', async () => {
        const response = await request(app).delete('/products/999');
        expect(response.status).toBe(404);
    });

    it('should handle malformed ID gracefully', async () => {
        const response = await request(app).get('/products/abc');
        expect(response.status).toBe(404);
    });

    it('should persist a created product in subsequent GET', async () => {
        const newProduct = {
            productId: 101,
            supplierId: 2,
            name: "WhiskerWand",
            description: "Interactive feather wand with motion sensing",
            price: 34.99,
            sku: "CAT-WAND-001",
            unit: "piece",
            imgName: "whisker-wand.png"
        };
        await request(app).post('/products').send(newProduct);

        const response = await request(app).get('/products/101');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(newProduct);
    });
});
