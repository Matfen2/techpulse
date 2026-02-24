import { Router } from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,
} from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/user/me', verifyToken, getMyReviews);
router.get('/:productId', getProductReviews);
router.post('/:productId', verifyToken, createReview);
router.put('/:id', verifyToken, updateReview);
router.delete('/:id', verifyToken, deleteReview);

export default router;