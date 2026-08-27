import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import uploadRoutes from './routes/upload.js';
import { db } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Static folder for product images
const staticUploads = path.join(__dirname, '..', '..', 'public', 'products');
app.use('/products', express.static(staticUploads));

// Health check
app.get('/api/health', (_req, res) => {
  const settings = db.getSettings();
  res.json({
    status: 'ok',
    storeName: settings.storeName,
    established: settings.established,
    address: settings.address,
    phones: settings.phone,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Shri Laxmi Sweet Mart (Mapusa, Goa - Estd. 1985)`);
  console.log(` Product Showcase REST API running at http://localhost:${PORT}`);
  console.log(` Admin Portal: admin@shrilaxmisweetmart.com (admin1985)`);
  console.log(`=======================================================`);
});
