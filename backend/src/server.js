import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 5000;
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Catalog API is healthy' }));
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use(notFound);
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alab_catalog')
  .then(() => app.listen(port, () => console.log(`API listening on http://localhost:${port}`)))
  .catch((error) => { console.error('MongoDB connection failed:', error.message); process.exit(1); });
