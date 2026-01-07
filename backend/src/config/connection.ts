import { connect, set } from 'mongoose';
import config from './config';

// connection to db
const connectToDB = async () => {
  try {
    set('strictQuery', false);
    const db = await connect(config.connectionUrl);
    console.log('MongoDB connected to', db.connection.name);
  } catch (error) {
    console.error(error);
  }
};

export default connectToDB;
