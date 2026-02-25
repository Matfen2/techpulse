import { Router } from 'express';
import { getStats, getUsers, deleteUserAdmin, getAllListingsAdmin } from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = Router();

router.use(verifyToken, isAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUserAdmin);
router.get('/listings', getAllListingsAdmin);

export default router;