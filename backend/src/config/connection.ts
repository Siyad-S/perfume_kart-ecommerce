import mongoose, { connect, set } from 'mongoose';
import config from './config';

// connection to db
const connectToDB = async () => {
  try {
    set('strictQuery', false);
    // If already connected, return
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }
    const db = await connect(config.connectionUrl);
    console.log('MongoDB connected to', db.connection.name);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit process in serverless, just throw
    throw error;
  }
};

export default connectToDB;
