import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Database ──
connectDB();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ── Routes ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TechPulse API is running 🔶' });
});

// ── Auth routes ──
app.use('/api/auth', authRoutes);

// TODO: J3 — Product routes
// app.use('/api/products', productRoutes);

// ── Start ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 TechPulse API running on port ${PORT}`);
});

export default app;