import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getBrands,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/brands', getBrands);
router.get('/:slug', getProductBySlug);
router.post('/', verifyToken, isAdmin, createProduct);
router.put('/:id', verifyToken, isAdmin, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;