import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

// Database connection function
export const connectToDatabase = async (): Promise<typeof mongoose> => {
  try {
    mongoose.set('strictQuery', true);
    const connection = await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Check if the connection is established
export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

// Export mongoose for use in other modules
export default mongoose; 