import express from 'express';
import { authenticateUser, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getCompanyProfile,
  updateCompanyProfile,
  submitVerification,
  createOpportunity,
  getMyOpportunities,
  updateOpportunity,
  deleteOpportunity,
  getOpportunityApplications,
  updateApplicationStatus,
  scheduleInterview
} from '../controllers/industryController.js';

const router = express.Router();
const requireIndustry = [authenticateUser, requireRole('industry', 'admin')];

// Profile
router.get('/profile', requireIndustry, getCompanyProfile);
router.patch('/profile', requireIndustry, updateCompanyProfile);

// Verification (Req 36)
router.post('/verification', requireIndustry, upload.array('documents', 5), submitVerification);

// Opportunities CRUD (Req 37-42)
router.get('/opportunities', requireIndustry, getMyOpportunities);
router.post('/opportunities', requireIndustry, createOpportunity);
router.patch('/opportunities/:id', requireIndustry, updateOpportunity);
router.delete('/opportunities/:id', requireIndustry, deleteOpportunity);

// Recruiter Candidate Management (Req 46-48)
router.get('/opportunities/:opportunityId/applications', requireIndustry, getOpportunityApplications);
router.patch('/applications/:applicationId/status', requireIndustry, updateApplicationStatus);
router.post('/applications/:applicationId/schedule-interview', requireIndustry, scheduleInterview);

export default router;
