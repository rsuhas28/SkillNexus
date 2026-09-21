import express from 'express';
import {
  getAllUsers,
  updateUserStatus,
  getAdminStats,
  getVerifications,
  reviewVerification,
  getReportedOpportunities
} from '../controllers/adminController.js';
import {
  authenticateUser,
  requireActiveAccount,
  requireRole
} from '../middleware/auth.js';

const router = express.Router();

// Admin protection: must be authenticated, active, and have 'admin' role
router.use(authenticateUser, requireActiveAccount, requireRole('admin'));

router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/stats', getAdminStats);

// Verifications (Req 36)
router.get('/verifications', getVerifications);
router.patch('/verifications/:id', reviewVerification);

// Moderation (Req 70)
router.get('/reported-opportunities', getReportedOpportunities);

export default router;

