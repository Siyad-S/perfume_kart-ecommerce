import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user.model';
import Product from '../src/models/product.model';
import { Order } from '../src/models/order.model';
import Brand from '../src/models/brand.model';
import Category from '../src/models/category.model';
import mongoose from 'mongoose';

describe('Order Module Integration', () => {
    let authToken: string;
    let userId: string;
    let productId: string;

    beforeAll(async () => {
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Brand.deleteMany({});
        await Category.deleteMany({});

        // 1. Setup User
        const userData = {
            name: 'Test Buyer',
            email: 'buyer@example.com',
            password: 'Password123!'
        };
        await request(app).post('/user/register').send(userData);
        const loginRes = await request(app).post('/user/login').send({
            email: userData.email,
            password: userData.password
        });
        const cookies = loginRes.header['set-cookie'] as unknown as string[];
        authToken = cookies.find((c: string) => c.startsWith('accessToken'))?.split(';')[0] || '';
        const user = await User.findOne({ email: userData.email });
        userId = user!._id!.toString();

        // 2. Setup Brand & Category
        const brand = await Brand.create({ name: 'Brand', logo_url: 'logo.png' });
        const category = await Category.create({ name: 'Category', image_url: 'cat.png' });

        // 3. Setup Product
        const product = await Product.create({
            name: 'Order Product',
            description: 'Desc',
            brand_id: brand._id,
            category_id: category._id,
            price: 100,
            discount_price: 80,
            stock_quantity: 50,
            sku: 'ORD-001',
            image_urls: ['img.png'],
            tags: ['tag'],
            notes: { top: [], middle: [], base: [] }
        });
        productId = product._id.toString();
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Brand.deleteMany({});
        await Category.deleteMany({});
    });

    describe('POST /order/create', () => {
        it('should create an order successfully', async () => {
            const orderData = {
                products: [{ product_id: productId, quantity: 1, unit_price: 80 }],
                shipping_address: {
                    fullName: 'Test Buyer',
                    street: '123 Test St',
                    city: 'Test City',
                    state: 'Test State',
                    country: 'Test Country',
                    postal_code: '12345',
                    phone: '1234567890'
                },
                payment_method: 'cod',
                total_amount: 80
            };

            const res = await request(app)
                .post('/order/create')
                .set('Cookie', [`${authToken}`])
                .send(orderData);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });
    });

    describe('GET /order/list', () => {
        it('should list user orders', async () => {
            const res = await request(app)
                .post('/order/list')
                .set('Cookie', [`${authToken}`]);

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });
});
