import { Router } from 'express';
import {
  getListings,
  getMyListings,
  getListingBySlug,
  createListing,
  updateListing,
  deleteListing,
  verifyListing,
} from '../controllers/listingController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { uploadListingFiles } from '../middleware/upload.js';

const router = Router();

router.get('/', getListings);
router.get('/my', verifyToken, getMyListings);
router.get('/:slug', getListingBySlug);
router.post('/', verifyToken, uploadListingFiles, createListing);
router.put('/:id', verifyToken, uploadListingFiles, updateListing);
router.delete('/:id', verifyToken, deleteListing);
router.patch('/:id/verify', verifyToken, isAdmin, verifyListing);

export default router;