import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { Museum } from './models/Museum';
import { seedDatabase } from './scripts/seed';

const startServer = async () => {
  try {
    // 1. Connect to Database (Atlas or embedded fallback)
    await connectDB();

    // 2. Auto-seed if database is completely empty
    const museumCount = await Museum.countDocuments();
    if (museumCount === 0) {
      console.log('🌱 Database is empty. Running initial museum exhibit seeder...');
      await seedDatabase();
    }

    // 3. Initialize App
    const app = createApp();

    // 4. Start listening
    const server = app.listen(env.PORT, () => {
      console.log(`================================================`);
      console.log(`🏛️  Digital Museum Guide API Server Running`);
      console.log(`📡  Port: ${env.PORT}`);
      console.log(`🌍  Environment: ${env.NODE_ENV}`);
      console.log(`🔗  Client URL: ${env.CLIENT_URL}`);
      console.log(`🗄️  Storage Provider: ${env.STORAGE_PROVIDER}`);
      console.log(`================================================`);
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, closing server...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();
