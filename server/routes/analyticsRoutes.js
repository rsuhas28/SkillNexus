import express from 'express';
import { authenticateUser, requireRole } from '../middleware/auth.js';
import {
  getDashboardStats,
  getSkillAnalytics,
  getInternshipAnalytics,
  getPlacementAnalytics,
  getSkillDemandAnalytics
} from '../controllers/analyticsController.js';

const router = express.Router();
const requireStaff = [authenticateUser, requireRole('institution', 'admin')];

router.get('/overview', requireStaff, getDashboardStats);
router.get('/skills', requireStaff, getSkillAnalytics);
router.get('/internships', requireStaff, getInternshipAnalytics);
router.get('/placements', requireStaff, getPlacementAnalytics);
router.get('/skill-demand', requireStaff, getSkillDemandAnalytics);

export default router;
