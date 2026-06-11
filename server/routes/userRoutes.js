import express from 'express';
import { getAllUsers, getUser, putUser, deleteUser, postUsers } from '../controller/UserController.js';
import { authenticateToken, requireRole } from '../middleWare/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, requireRole('admin'), getAllUsers);
router.post('/', authenticateToken, requireRole('admin'), postUsers);
router.get('/:id', authenticateToken, getUser);
router.put('/:id', authenticateToken, putUser);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteUser);

export default router;
