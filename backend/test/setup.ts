import mongoose from 'mongoose';

beforeAll(async () => {
    // Use a local test database
    const testUrl = process.env.TEST_DB_URL || 'mongodb://localhost:27017/perfume_ecommerce_test';

    try {
        await mongoose.connect(testUrl);
        console.log('Connected to test database');
    } catch (err) {
        console.error('Failed to connect to test database', err);
        process.exit(1);
    }
});

afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
        // Clean up database after tests
        await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
});
