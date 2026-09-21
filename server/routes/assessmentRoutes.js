import express from 'express';
import { authenticateUser, requireRole } from '../middleware/auth.js';
import {
  getAvailableAssessments,
  getAssessmentById,
  startAssessment,
  submitAssessment,
  getAttemptResults,
  getMyAttempts,
  computeSkillGap,
  getLatestSkillGap
} from '../controllers/assessmentController.js';

const router = express.Router();
const requireStudent = [authenticateUser, requireRole('student', 'admin')];

// Available assessments
router.get('/', authenticateUser, getAvailableAssessments);
router.get('/:id', authenticateUser, getAssessmentById);

// Attempt lifecycle
router.post('/:id/start', requireStudent, startAssessment);
router.post('/attempts/:attemptId/submit', requireStudent, submitAssessment);
router.get('/attempts/:attemptId', requireStudent, getAttemptResults);
router.get('/my/attempts', requireStudent, getMyAttempts);

// Skill Gap
router.post('/skill-gap', requireStudent, computeSkillGap);
router.get('/skill-gap/latest', requireStudent, getLatestSkillGap);

export default router;
