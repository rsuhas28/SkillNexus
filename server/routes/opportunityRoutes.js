import express from 'express';
import { authenticateUser, requireRole } from '../middleware/auth.js';
import {
  searchOpportunities,
  getOpportunityById,
  applyToOpportunity,
  getMyApplications,
  withdrawApplication,
  getMyInterviews,
  getMyPlacements,
  reportOpportunity
} from '../controllers/opportunityController.js';

const router = express.Router();

// Public search and view
router.get('/', searchOpportunities);
router.get('/:id', getOpportunityById);

// Student actions
const requireStudent = [authenticateUser, requireRole('student', 'admin')];

router.post('/:id/apply', requireStudent, applyToOpportunity);
router.post('/:id/report', authenticateUser, reportOpportunity);
router.get('/my/applications', requireStudent, getMyApplications);
router.patch('/applications/:id/withdraw', requireStudent, withdrawApplication);
router.get('/my/interviews', requireStudent, getMyInterviews);
router.get('/my/placements', requireStudent, getMyPlacements);

export default router;
