import request from 'supertest';
import app from '../src/app';
import Brand from '../src/models/brand.model';

describe('Brand Module Integration', () => {
    beforeEach(async () => {
        await Brand.deleteMany({});
    });

    afterAll(async () => {
        await Brand.deleteMany({});
    });

    describe('POST /brand/create', () => {
        it('should create a brand successfully', async () => {
            const brandData = {
                name: 'Chanel',
                description: 'Luxury brand',
                logo_url: 'http://example.com/logo.png', // Changed from logo to logo_url to match model
                origin: 'France'
            };

            const res = await request(app).post('/brand/create').send(brandData);
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe('Chanel');
        });

        it('should fail validation if required fields are missing', async () => {
            const res = await request(app).post('/brand/create').send({
                description: 'No name brand'
            });
            expect(res.status).toBe(400); // Validation error
        });
    });

    describe('GET /brand/list', () => {
        beforeEach(async () => {
            await Brand.create({
                name: 'Dior',
                logo_url: 'dior.png',
                is_deleted: false
            });
        });

        it('should list brands', async () => {
            const res = await request(app).post('/brand/list');
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });
});
