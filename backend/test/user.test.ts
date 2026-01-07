import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user.model';
import mongoose from 'mongoose';

describe('User Module Integration', () => {
    let authToken: string;
    let userId: string;

    beforeEach(async () => {
        await User.deleteMany({});

        // Register and login to get token
        const userData = {
            name: 'Test User',
            email: 'user@example.com',
            password: 'Password123!',
            phone: '1234567890'
        };
        await request(app).post('/user/register').send(userData);

        const loginRes = await request(app).post('/user/login').send({
            email: userData.email,
            password: userData.password
        });

        // Extract cookie
        const cookies = loginRes.header['set-cookie'] as unknown as string[];
        authToken = cookies.find((c: string) => c.startsWith('accessToken'))?.split(';')[0] || '';

        const user = await User.findOne({ email: userData.email });
        userId = user?._id.toString() || '';
    });

    afterAll(async () => {
        await User.deleteMany({});
    });

    describe('GET /user/me', () => {
        it('should get current user profile', async () => {
            const res = await request(app)
                .get('/user/me')
                .set('Cookie', [`${authToken}`]);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user.email).toBe('user@example.com');
        });
    });

    describe('PATCH /user/update/:id', () => {
        it('should update user profile', async () => {
            const updateData = {
                name: 'Updated Name',
                phone: '0987654321'
            };

            const res = await request(app)
                .patch(`/user/update/${userId}`)
                .set('Cookie', [`${authToken}`])
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.data.name).toBe('Updated Name');
            expect(res.body.data.phone).toBe('0987654321');
        });
    });
});
