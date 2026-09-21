import express from 'express';
import { authenticateUser, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getStudentProfile,
  updateStudentProfile,
  uploadPhoto,
  getPortfolio,
  updatePortfolio,
  getPublicPortfolio,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
  getAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
  getDocuments,
  uploadDocument,
  setPrimaryDocument,
  deleteDocument,
  getUnifiedSkillProfile
} from '../controllers/studentController.js';

const router = express.Router();

// Public portfolio route
router.get('/portfolio/public/:slug', getPublicPortfolio);

// All other routes require student or admin role
const requireStudent = [authenticateUser, requireRole('student', 'admin')];

// Profile
router.get('/profile', requireStudent, getStudentProfile);
router.patch('/profile', requireStudent, updateStudentProfile);
router.post('/photo', requireStudent, upload.single('photo'), uploadPhoto);

// Portfolio
router.get('/portfolio', requireStudent, getPortfolio);
router.patch('/portfolio', requireStudent, updatePortfolio);

// Skills
router.get('/skills', requireStudent, getSkills);
router.post('/skills', requireStudent, addSkill);
router.patch('/skills/:id', requireStudent, updateSkill);
router.delete('/skills/:id', requireStudent, deleteSkill);

// Education
router.get('/education', requireStudent, getEducation);
router.post('/education', requireStudent, addEducation);
router.patch('/education/:id', requireStudent, updateEducation);
router.delete('/education/:id', requireStudent, deleteEducation);

// Projects
router.get('/projects', requireStudent, getProjects);
router.post('/projects', requireStudent, addProject);
router.patch('/projects/:id', requireStudent, updateProject);
router.delete('/projects/:id', requireStudent, deleteProject);

// Certifications
router.get('/certifications', requireStudent, getCertifications);
router.post('/certifications', requireStudent, upload.single('document'), addCertification);
router.patch('/certifications/:id', requireStudent, upload.single('document'), updateCertification);
router.delete('/certifications/:id', requireStudent, deleteCertification);

// Achievements
router.get('/achievements', requireStudent, getAchievements);
router.post('/achievements', requireStudent, addAchievement);
router.patch('/achievements/:id', requireStudent, updateAchievement);
router.delete('/achievements/:id', requireStudent, deleteAchievement);

// Documents
router.get('/documents', requireStudent, getDocuments);
router.post('/documents', requireStudent, upload.single('file'), uploadDocument);
router.patch('/documents/:id/primary', requireStudent, setPrimaryDocument);
router.delete('/documents/:id', requireStudent, deleteDocument);

// Unified Skill Profile (Req 27)
router.get('/skill-profile', requireStudent, getUnifiedSkillProfile);

export default router;
