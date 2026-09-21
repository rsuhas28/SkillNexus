import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import {
  getAIStatus,
  handleSkillMapping,
  handleCareerGuidance,
  handleLearningRecommendations,
  handleAIGuideChat,
  handleMatchExplanation,
  handleInterviewPrep,
  handleStartMockInterview,
  handleAnswerMockInterview,
  handlePrepPlan,
  handleOpportunityTrust
} from '../controllers/aiController.js';

const router = express.Router();

// Status
router.get('/status', getAIStatus);

// Phase 4
router.post('/skill-mapping', authenticateUser, handleSkillMapping);
router.post('/career-guidance', authenticateUser, handleCareerGuidance);
router.post('/learning-recommendations', authenticateUser, handleLearningRecommendations);
router.post('/guide', authenticateUser, handleAIGuideChat);
router.get('/opportunity-matches/:opportunityId', authenticateUser, handleMatchExplanation);

// Phase 9
router.post('/interview-prep', authenticateUser, handleInterviewPrep);
router.post('/mock-interview/start', authenticateUser, handleStartMockInterview);
router.post('/mock-interview/answer', authenticateUser, handleAnswerMockInterview);
router.post('/prep-plan', authenticateUser, handlePrepPlan);
router.get('/opportunities/:id/trust', authenticateUser, handleOpportunityTrust);

export default router;
