import request from 'supertest';
import app from '../src/app';
import Banner from '../src/models/banner.model';

describe('Banner Module Integration', () => {
    beforeEach(async () => {
        await Banner.deleteMany({});
    });

    afterAll(async () => {
        await Banner.deleteMany({});
    });

    describe('POST /banner/create', () => {
        it('should create a banner successfully', async () => {
            const bannerData = {
                banner_text: 'Test Banner',
                description: 'Test Description',
                banner_url: 'http://example.com/banner.jpg',
                home_slider: true
            };

            const res = await request(app).post('/banner/create').send(bannerData);
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.banner_text).toBe('Test Banner');
        });
    });

    describe('GET /banner/list', () => {
        beforeEach(async () => {
            await Banner.create({
                banner_text: 'Existing Banner',
                description: 'Desc',
                banner_url: 'banner.jpg',
                is_deleted: false
            });
        });

        it('should list banners', async () => {
            const res = await request(app).post('/banner/list');
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });
});
