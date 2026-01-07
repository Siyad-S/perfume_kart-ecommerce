import request from 'supertest';
import app from '../src/app';
import Category from '../src/models/category.model';

describe('Category Module Integration', () => {
    beforeEach(async () => {
        await Category.deleteMany({});
    });

    afterAll(async () => {
        await Category.deleteMany({});
    });

    describe('POST /category/create', () => {
        it('should create a category successfully', async () => {
            const categoryData = {
                name: 'Men Perfume',
                description: 'Perfumes for men',
                image_url: 'http://example.com/men.jpg'
            };

            const res = await request(app).post('/category/create').send(categoryData);
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe('Men Perfume');
        });
    });

    describe('GET /category/list', () => {
        beforeEach(async () => {
            await Category.create({
                name: 'Women Perfume',
                image_url: 'women.jpg',
                is_deleted: false
            });
        });

        it('should list categories', async () => {
            const res = await request(app).post('/category/list');
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });
});
