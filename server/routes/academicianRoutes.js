import express from 'express';
import { authenticateUser, requireRole } from '../middleware/auth.js';
import {
  getFacultyProfile,
  updateFacultyProfile,
  getFacultyOpportunities,
  getCollaborations,
  createCollaboration,
  joinCollaboration,
  getMyCollaborations
} from '../controllers/academicianController.js';

const router = express.Router();
const requireAcademic = [authenticateUser, requireRole('academician', 'admin')];

// Profile
router.get('/profile', requireAcademic, getFacultyProfile);
router.patch('/profile', requireAcademic, updateFacultyProfile);

// Opportunities for faculty
router.get('/opportunities', requireAcademic, getFacultyOpportunities);

// Collaborations (Academia-Industry)
router.get('/collaborations', getCollaborations);
router.post('/collaborations', authenticateUser, createCollaboration);

router.post('/collaborations/:id/join', authenticateUser, joinCollaboration);
router.get('/my/collaborations', authenticateUser, getMyCollaborations);

export default router;
