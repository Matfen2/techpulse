import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ── Verify JWT token ──
export const verifyToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Accès refusé, token manquant' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Token invalide, utilisateur introuvable' });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// ── Check admin role ──
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
  next();
};