import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Database ──
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ── Routes ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TechPulse API is running 🔶' });
});

// TODO: J2 — Auth routes
// app.use('/api/auth', authRoutes);

// TODO: J3 — Product routes
// app.use('/api/products', productRoutes);

// ── Start ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 TechPulse API running on port ${PORT}`);
});

export default app;