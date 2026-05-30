import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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
});

export default app;
