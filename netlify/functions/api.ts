import serverless from 'serverless-http';
import { createApp } from '../../backend/src/app';
import { connectDB } from '../../backend/src/config/db';

const app = createApp();
let isDbConnected = false;

const serverlessHandler = serverless(app);

export const handler = async (event: any, context: any) => {
  // Prevent Lambda from waiting for MongoDB event loop to close
  context.callbackWaitsForEmptyEventLoop = false;

  if (!isDbConnected) {
    try {
      await connectDB();
      isDbConnected = true;
    } catch (err) {
      console.error('MongoDB connection error in Netlify Serverless Function:', err);
    }
  }

  return serverlessHandler(event, context);
};
