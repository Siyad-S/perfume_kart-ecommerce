import request from 'supertest';
import app from '../src/app';
import Product from '../src/models/product.model';
import Brand from '../src/models/brand.model';
import Category from '../src/models/category.model';

describe('Product Module Integration Tests', () => {
    let brandId: string;
    let categoryId: string;

    beforeAll(async () => {
        // Clean up before starting
        await Product.deleteMany({});
        await Brand.deleteMany({});
        await Category.deleteMany({});

        // Create a Brand
        const brand = await Brand.create({
            name: 'Test Brand',
            description: 'Test Brand Description',
            logo_url: 'brand-logo.png',
            is_deleted: false
        });
        brandId = brand._id.toString();

        // Create a Category
        const category = await Category.create({
            name: 'Test Category',
            description: 'Test Category Description',
            image_url: 'cat-image.png',
            is_deleted: false
        });
        categoryId = category._id.toString();
    });

    afterAll(async () => {
        // Cleanup
        await Product.deleteMany({});
        await Brand.deleteMany({});
        await Category.deleteMany({});
    });

    describe('POST /product/create', () => {
        it('should create a new product with valid data', async () => {
            const newProduct = {
                name: 'Test Perfume',
                description: 'A test perfume description',
                brand_id: brandId,
                price: 99.99,
                discount_price: 79.99,
                stock_quantity: 100,
                sku: 'TEST-PERF-001',
                notes: {
                    top: ['Lemon', 'Bergamot'],
                    middle: ['Jasmine', 'Rose'],
                    base: ['Vanilla', 'Musk']
                },
                image_urls: ['http://example.com/perfume.jpg'],
                tags: ['fresh', 'summer'],
                category_id: categoryId,
                best_seller: false,
                trending: true,
                new_launch: true
            };

            const res = await request(app)
                .post('/product/create')
                .send(newProduct);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe(newProduct.name);
            expect(res.body.data.sku).toBe(newProduct.sku);
        });

        it('should fail if required fields are missing', async () => {
            const invalidProduct = {
                name: 'Incomplete Perfume'
                // Missing required fields
            };

            const res = await request(app)
                .post('/product/create')
                .send(invalidProduct);

            expect(res.status).toBe(400); // Validation error
        });
    });

    describe('POST /product/list', () => {
        it('should list products', async () => {
            const res = await request(app)
                .post('/product/list')
                .send({});

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        it('should filter products by search term', async () => {
            const res = await request(app)
                .post('/product/list')
                .send({ search: 'Test Perfume' });

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
            expect(res.body.data[0].name).toContain('Test Perfume');
        });
    });
});
