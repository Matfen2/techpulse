import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import reviewRoutes from './routes/reviews.js';
import favoriteRoutes from './routes/favorites.js';
import listingRoutes from './routes/listings.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Database (skip if running tests — tests use in-memory DB) ──
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
}

// ── Routes ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TechPulse API is running 🔶' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/admin', adminRoutes);

// ── Start (only when run directly, not imported by tests) ──
const PORT = process.env.PORT || 5000;

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFile) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export default app;