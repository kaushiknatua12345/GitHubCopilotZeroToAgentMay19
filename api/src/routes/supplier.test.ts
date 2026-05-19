import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import supplierRouter, { resetSuppliers } from './supplier';
import { suppliers as seedSuppliers } from '../seedData';

let app: express.Express;

describe('Supplier API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/suppliers', supplierRouter);
        resetSuppliers();
    });

    it('should create a new supplier', async () => {
        const newSupplier = {
            supplierId: 10,
            name: "MeowTech Labs",
            description: "Cutting-edge feline wellness technology",
            contactPerson: "Cleo Purrkins",
            email: "cleo@meowtech.com",
            phone: "555-0201"
        };
        const response = await request(app).post('/suppliers').send(newSupplier);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newSupplier);
    });

    it('should get all suppliers', async () => {
        const response = await request(app).get('/suppliers');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedSuppliers.length);
        response.body.forEach((supplier: Record<string, unknown>, index: number) => {
            expect(supplier).toMatchObject(seedSuppliers[index]);
        });
    });

    it('should get a supplier by ID', async () => {
        const response = await request(app).get('/suppliers/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedSuppliers[0]);
    });

    it('should update a supplier by ID', async () => {
        const updatedSupplier = {
            ...seedSuppliers[0],
            name: 'PurrTech Innovations v2'
        };
        const response = await request(app).put('/suppliers/1').send(updatedSupplier);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedSupplier);
    });

    it('should delete a supplier by ID', async () => {
        const response = await request(app).delete('/suppliers/1');
        expect(response.status).toBe(204);

        const getResponse = await request(app).get('/suppliers/1');
        expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existing supplier (GET)', async () => {
        const response = await request(app).get('/suppliers/999');
        expect(response.status).toBe(404);
    });

    it('should return 404 for non-existing supplier (PUT)', async () => {
        const response = await request(app).put('/suppliers/999').send({ name: 'Ghost Supplier' });
        expect(response.status).toBe(404);
    });

    it('should return 404 for non-existing supplier (DELETE)', async () => {
        const response = await request(app).delete('/suppliers/999');
        expect(response.status).toBe(404);
    });

    it('should handle malformed ID gracefully', async () => {
        const response = await request(app).get('/suppliers/abc');
        expect(response.status).toBe(404);
    });

    it('should persist a created supplier in subsequent GET', async () => {
        const newSupplier = {
            supplierId: 11,
            name: "TailWag Tech",
            description: "Cross-species smart device manufacturer",
            contactPerson: "Rex Barker",
            email: "rex@tailwag.com",
            phone: "555-0301"
        };
        await request(app).post('/suppliers').send(newSupplier);

        const response = await request(app).get('/suppliers/11');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(newSupplier);
    });
});
