import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as http from 'http';
import * as https from 'https';

import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
import contactRoutes from './routes/contact.routes';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const KEEP_ALIVE_URL = process.env.KEEP_ALIVE_URL?.trim();
const KEEP_ALIVE_INTERVAL_MS = parseInt(process.env.KEEP_ALIVE_INTERVAL_MS || '240000', 10);

const getKeepAliveIntervalMs = () => {
  if (!Number.isFinite(KEEP_ALIVE_INTERVAL_MS) || KEEP_ALIVE_INTERVAL_MS < 60000) {
    return 240000;
  }

  return KEEP_ALIVE_INTERVAL_MS;
};

const pingKeepAlive = (url: string) => {
  try {
    const target = new URL(url);
    const isHttps = target.protocol === 'https:';

    if (target.protocol !== 'http:' && !isHttps) {
      console.warn(`Keep-alive URL must use http or https: ${url}`);
      return;
    }

    const transport = isHttps ? https : http;
    const port = target.port ? parseInt(target.port, 10) : isHttps ? 443 : 80;

    const request = transport.request(
      {
        method: 'GET',
        hostname: target.hostname,
        port,
        path: `${target.pathname}${target.search}`,
        timeout: 8000,
        headers: {
          'User-Agent': 'keep-alive',
        },
      },
      (response) => {
        response.resume();
      }
    );

    request.on('error', (error) => {
      console.warn(`Keep-alive ping failed: ${error.message}`);
    });

    request.on('timeout', () => {
      request.destroy(new Error('Keep-alive timeout'));
    });

    request.end();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Keep-alive URL is invalid: ${message}`);
  }
};

const startKeepAlive = () => {
  if (!KEEP_ALIVE_URL) {
    return;
  }

  const intervalMs = getKeepAliveIntervalMs();
  console.log(`Keep-alive enabled: ${KEEP_ALIVE_URL} every ${Math.round(intervalMs / 1000)}s`);

  setTimeout(() => {
    pingKeepAlive(KEEP_ALIVE_URL);
    setInterval(() => pingKeepAlive(KEEP_ALIVE_URL), intervalMs);
  }, 15000);
};

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Global error handler (must be after routes)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  startKeepAlive();
});

export default app;
