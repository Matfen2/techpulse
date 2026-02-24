import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, getFavorites);
router.post('/:productId', verifyToken, addFavorite);
router.delete('/:productId', verifyToken, removeFavorite);

export default router;