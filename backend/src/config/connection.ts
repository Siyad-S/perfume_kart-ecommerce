import { connect, set } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()
// connection to db
const connectToDB = async () => {
  try {
    set('strictQuery', false);
    const db = await connect( process.env.CONNECTION_URL as string);
    console.log('MongoDB connected to', db.connection.name);
  } catch (error) {
    console.error(error);
  }                                                                              
};

export default connectToDB;
