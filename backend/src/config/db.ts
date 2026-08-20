import mongoose from 'mongoose';
import { env } from './env';

let memoryServerInstance: any = null;

export const connectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    let uri = env.MONGODB_URI;

    if (!uri) {
      console.log('ℹ️ No MONGODB_URI found in environment. Initializing local embedded MongoDB...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create();
      uri = memoryServerInstance.getUri();
      console.log(`✅ Embedded MongoDB initialized at ${uri}`);
    }

    await mongoose.connect(uri);
    console.log(`🚀 MongoDB Connected successfully: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export const getMemoryServerInstance = () => memoryServerInstance;
