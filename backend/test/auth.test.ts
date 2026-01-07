import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user.model';
import mongoose from 'mongoose';

describe('Auth Module Integration', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        const count = await User.countDocuments();
        console.log('User count after delete:', count);
    });

    afterAll(async () => {
        await User.deleteMany({});
    });

    describe('POST /user/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123!',
                phone: '1234567890'
            };

            const countValues = await User.find({});
            console.log('Users in DB before request:', countValues);

            const res = await request(app).post('/user/register').send(userData);
            console.log('Auth Register Response:', res.status, JSON.stringify(res.body, null, 2));
            expect(res.status).toBe(200); // 201 for creation
            expect(res.body.success).toBe(true);

            const user = await User.findOne({ email: userData.email });
            expect(user).toBeTruthy();
            expect(user?.name).toBe(userData.name);
        });
    });

    describe('POST /user/login', () => {
        beforeEach(async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123!', // Hashed by service/controller
                phone: '1234567890'
            };
            // Use request to create user to ensure password hashing works as expected in end-to-end flow
            await request(app).post('/user/register').send(userData);
        });

        it('should login successfully with correct credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'Password123!'
            };

            const res = await request(app).post('/user/login').send(loginData);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.header['set-cookie']).toBeDefined(); // Check for cookies
        });

        it('should fail login with incorrect password', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'WrongPassword'
            };

            const res = await request(app).post('/user/login').send(loginData);
            expect(res.status).toBe(400); // Bad request or Unauthorized
        });
    });
});
