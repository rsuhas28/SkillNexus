import express from 'express';
import { updateMe, getUserById } from '../controllers/userController.js';
import { getMe } from '../controllers/authController.js';
import { updateUserStatus } from '../controllers/adminController.js';
import {
  authenticateUser,
  requireVerifiedEmail,
  requireActiveAccount,
  requireRole
} from '../middleware/auth.js';

const router = express.Router();

// Middleware chain for users
router.use(authenticateUser);

// GET /api/users/me
router.get('/me', getMe);

// PATCH /api/users/me
router.patch('/me', requireVerifiedEmail, requireActiveAccount, updateMe);

// GET /api/users/:id
router.get('/:id', requireVerifiedEmail, requireActiveAccount, getUserById);

// PATCH /api/users/:id/status (PRD Section 22 requires PATCH /api/users/:id/status - only admin can modify status)
router.patch('/:id/status', requireRole('admin'), updateUserStatus);

export default router;
