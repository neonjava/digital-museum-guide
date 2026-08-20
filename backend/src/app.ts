import express, { Application, Request, Response, NextFunction, Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { env } from './config/env';

// Import Routes
import authRoutes from './routes/authRoutes';
import museumRoutes from './routes/museumRoutes';
import sectionRoutes from './routes/sectionRoutes';
import artifactRoutes from './routes/artifactRoutes';
import qrRoutes from './routes/qrRoutes';
import mediaRoutes from './routes/mediaRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import publicRoutes from './routes/publicRoutes';

export const createApp = (): Application => {
  const app = express();

  // Helmet with relaxed cross-origin resource policy for local media streaming
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: '*', // Allow web app, Android WebView, and Netlify hosting
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Ensure uploads directory exists and serve static uploads
  if (!fs.existsSync(env.UPLOAD_DIR)) {
    fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
  }
  app.use('/uploads', express.static(env.UPLOAD_DIR));

  // Android App Links verification endpoint
  app.get('/.well-known/assetlinks.json', (_req: Request, res: Response) => {
    res.json([
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: 'com.museumguide.app',
          sha256_cert_fingerprints: [
            '14:6D:E9:7D:6D:9A:86:EC:92:43:86:14:02:18:61:A0:98:B7:6E:7E:AA:E4:13:B9:4C:90:3A:42:F2:1A:1D:64',
          ],
        },
      },
    ]);
  });

  // Rate limiter for authentication attempts
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Too many requests, please try again later.' },
  });

  // API Master Router
  const apiRouter = Router();

  // Health check endpoint
  apiRouter.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Digital Museum Guide Platform API',
      timestamp: new Date().toISOString(),
      storageProvider: env.STORAGE_PROVIDER,
    });
  });

  // Mount Feature Routes on apiRouter
  apiRouter.use('/auth', authLimiter, authRoutes);
  apiRouter.use('/museums', museumRoutes);
  apiRouter.use('/sections', sectionRoutes);
  apiRouter.use('/artifacts', artifactRoutes);
  apiRouter.use('/qr', qrRoutes);
  apiRouter.use('/media', mediaRoutes);
  apiRouter.use('/analytics', analyticsRoutes);
  apiRouter.use('/public', publicRoutes);

  // Mount API router across multiple standard prefixes for Netlify Serverless Functions & Express
  app.use('/.netlify/functions/api', apiRouter);
  app.use('/api', apiRouter);

  // 404 Route handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found',
    });
  });

  // Global Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  });

  return app;
};
