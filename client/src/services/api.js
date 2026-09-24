import { DEMO_OPPORTUNITIES, DEMO_STUDENT_DATA, DEMO_ACCOUNTS } from './demoStore.js';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getDemoFallback(endpoint, options) {
  const method = (options.method || 'GET').toUpperCase();
  const token = localStorage.getItem('skillnexus_token') || '';
  const savedDemo = localStorage.getItem('skillnexus_demo_user');
  let currentDemo = null;
  if (savedDemo) {
    try { currentDemo = JSON.parse(savedDemo); } catch (e) {}
  }

  // 1. Auth & Users
  if (endpoint.startsWith('/users/me')) {
    if (currentDemo) return { success: true, user: currentDemo.user, profile: currentDemo.profile };
    return { success: true, user: DEMO_ACCOUNTS['student@skillnexus.com'].user, profile: DEMO_ACCOUNTS['student@skillnexus.com'].profile };
  }
  if (endpoint.startsWith('/auth/login')) {
    let body = {};
    try { body = JSON.parse(options.body || '{}'); } catch (e) {}
    const email = (body.email || '').toLowerCase().trim();
    if (DEMO_ACCOUNTS[email]) {
      const match = DEMO_ACCOUNTS[email];
      return { success: true, token: `demo_token_${match.user.role}`, user: match.user, profile: match.profile };
    }
  }

  // 2. Student Profile & Data
  if (endpoint.startsWith('/students/profile')) {
    return { success: true, data: currentDemo?.profile || DEMO_ACCOUNTS['student@skillnexus.com'].profile };
  }
  if (endpoint.startsWith('/students/portfolio')) {
    return { success: true, data: { slug: 'alex-rivera', isPublic: true, sections: [] } };
  }
  if (endpoint.startsWith('/students/skills')) {
    return { success: true, data: DEMO_STUDENT_DATA.skills };
  }
  if (endpoint.startsWith('/students/education')) {
    return { success: true, data: DEMO_STUDENT_DATA.education };
  }
  if (endpoint.startsWith('/students/projects')) {
    return { success: true, data: DEMO_STUDENT_DATA.projects };
  }
  if (endpoint.startsWith('/students/certifications')) {
    return { success: true, data: DEMO_STUDENT_DATA.certifications };
  }
  if (endpoint.startsWith('/students/achievements')) {
    return { success: true, data: DEMO_STUDENT_DATA.achievements };
  }
  if (endpoint.startsWith('/students/documents')) {
    return { success: true, data: [] };
  }

  // 3. Opportunities
  if (endpoint.startsWith('/opportunities/my/applications')) {
    return { success: true, data: DEMO_STUDENT_DATA.applications };
  }
  if (endpoint.startsWith('/opportunities/my/interviews')) {
    return { success: true, data: DEMO_STUDENT_DATA.interviews };
  }
  if (endpoint.startsWith('/opportunities/my/placements')) {
    return { success: true, data: DEMO_STUDENT_DATA.placements };
  }
  if (endpoint.startsWith('/opportunities/')) {
    const parts = endpoint.split('/');
    const oppId = parts[2];
    const found = DEMO_OPPORTUNITIES.find(o => o._id === oppId);
    return { success: true, data: found || DEMO_OPPORTUNITIES[0] };
  }
  if (endpoint.startsWith('/opportunities')) {
    return { success: true, data: DEMO_OPPORTUNITIES, total: DEMO_OPPORTUNITIES.length };
  }

  // 4. Industry
  if (endpoint.startsWith('/industry/opportunities')) {
    return { success: true, data: DEMO_OPPORTUNITIES.slice(0, 3) };
  }
  if (endpoint.startsWith('/industry/profile')) {
    return { success: true, data: DEMO_ACCOUNTS['industry@skillnexus.com'].profile };
  }

  // 5. Academician & Collaborations
  if (endpoint.startsWith('/academicians/collaborations')) {
    return { success: true, data: DEMO_STUDENT_DATA.collaborations };
  }
  if (endpoint.startsWith('/academicians/profile')) {
    return { success: true, data: DEMO_ACCOUNTS['academician@skillnexus.com'].profile };
  }

  // 6. Analytics
  if (endpoint.startsWith('/analytics/overview')) {
    return { success: true, data: DEMO_STUDENT_DATA.analytics.overview };
  }
  if (endpoint.startsWith('/analytics/skills')) {
    return { success: true, data: DEMO_STUDENT_DATA.analytics.skills };
  }
  if (endpoint.startsWith('/analytics/placements')) {
    return { success: true, data: DEMO_STUDENT_DATA.analytics.placements };
  }
  if (endpoint.startsWith('/analytics/skill-demand')) {
    return { success: true, data: DEMO_STUDENT_DATA.analytics.demand };
  }

  // Default fallback for any mutation or query in demo mode
  if (method === 'POST' || method === 'PATCH' || method === 'DELETE') {
    return { success: true, message: 'Saved successfully (Demo mode)' };
  }
  return { success: true, data: [] };
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('skillnexus_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    if (!response.ok) {
      // If 404 or backend unavailable on static host like Netlify, gracefully provide demo fallback
      if (response.status === 404 || response.status >= 500) {
        return getDemoFallback(endpoint, options);
      }
      const data = await response.json().catch(() => ({}));
      const error = new Error(data.message || 'Unable to connect to SkillNexus. Please try again.');
      error.status = response.status;
      error.code = data.code;
      error.data = data;
      throw error;
    }

    const data = await response.json().catch(() => ({
      success: false,
      message: 'Unexpected server response format.'
    }));

    return data;
  } catch (err) {
    // If fetch failed or network error (e.g. Netlify static hosting without backend proxy)
    if (err.name === 'TypeError' || err.message?.includes('fetch') || err.code === 'NETWORK_ERROR') {
      return getDemoFallback(endpoint, options);
    }
    throw err;
  }
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  verifyEmail: (payload) => request('/auth/verify-email', { method: 'POST', body: JSON.stringify(payload) }),
  resendVerification: (payload) => request('/auth/resend-verification', { method: 'POST', body: JSON.stringify(payload) }),
  forgotPassword: (payload) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload) }),
  resetPassword: (payload) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  firebaseAuth: (payload) => request('/auth/firebase', { method: 'POST', body: JSON.stringify(payload) }),

  // User
  getMe: () => request('/users/me'),
  updateMe: (payload) => request('/users/me', { method: 'PATCH', body: JSON.stringify(payload) }),
  getUserById: (id) => request(`/users/${id}`),

  // Phase 2: Student
  getStudentProfile: () => request('/students/profile'),
  updateStudentProfile: (payload) => request('/students/profile', { method: 'PATCH', body: JSON.stringify(payload) }),
  getPortfolio: () => request('/students/portfolio'),
  updatePortfolio: (payload) => request('/students/portfolio', { method: 'PATCH', body: JSON.stringify(payload) }),
  getPublicPortfolio: (slug) => request(`/students/portfolio/public/${slug}`),
  getSkills: () => request('/students/skills'),
  addSkill: (payload) => request('/students/skills', { method: 'POST', body: JSON.stringify(payload) }),
  updateSkill: (id, payload) => request(`/students/skills/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteSkill: (id) => request(`/students/skills/${id}`, { method: 'DELETE' }),
  getEducation: () => request('/students/education'),
  addEducation: (payload) => request('/students/education', { method: 'POST', body: JSON.stringify(payload) }),
  updateEducation: (id, payload) => request(`/students/education/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteEducation: (id) => request(`/students/education/${id}`, { method: 'DELETE' }),
  getProjects: () => request('/students/projects'),
  addProject: (payload) => request('/students/projects', { method: 'POST', body: JSON.stringify(payload) }),
  updateProject: (id, payload) => request(`/students/projects/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteProject: (id) => request(`/students/projects/${id}`, { method: 'DELETE' }),
  getCertifications: () => request('/students/certifications'),
  addCertification: (payload) => request('/students/certifications', { method: 'POST', body: JSON.stringify(payload) }),
  deleteCertification: (id) => request(`/students/certifications/${id}`, { method: 'DELETE' }),
  getAchievements: () => request('/students/achievements'),
  addAchievement: (payload) => request('/students/achievements', { method: 'POST', body: JSON.stringify(payload) }),
  deleteAchievement: (id) => request(`/students/achievements/${id}`, { method: 'DELETE' }),
  getDocuments: () => request('/students/documents'),
  setPrimaryDocument: (id) => request(`/students/documents/${id}/primary`, { method: 'PATCH' }),
  deleteDocument: (id) => request(`/students/documents/${id}`, { method: 'DELETE' }),
  getUnifiedSkillProfile: () => request('/students/skill-profile'),

  // Phase 3: Assessments
  getAssessments: () => request('/assessments'),
  getAssessmentById: (id) => request(`/assessments/${id}`),
  startAssessment: (id) => request(`/assessments/${id}/start`, { method: 'POST' }),
  submitAssessment: (attemptId, payload) => request(`/assessments/attempts/${attemptId}/submit`, { method: 'POST', body: JSON.stringify(payload) }),
  getAttemptResults: (attemptId) => request(`/assessments/attempts/${attemptId}`),
  getMyAttempts: () => request('/assessments/my/attempts'),
  computeSkillGap: (payload) => request('/assessments/skill-gap', { method: 'POST', body: JSON.stringify(payload) }),
  getLatestSkillGap: () => request('/assessments/skill-gap/latest'),

  // Phase 4 & 9: AI
  getAIStatus: () => request('/ai/status'),
  getSkillMapping: (payload) => request('/ai/skill-mapping', { method: 'POST', body: JSON.stringify(payload) }),
  getCareerGuidance: (payload) => request('/ai/career-guidance', { method: 'POST', body: JSON.stringify(payload) }),
  getLearningRecommendations: (payload) => request('/ai/learning-recommendations', { method: 'POST', body: JSON.stringify(payload) }),
  sendAIGuideMessage: (payload) => request('/ai/guide', { method: 'POST', body: JSON.stringify(payload) }),
  getOpportunityMatchExplanation: (oppId) => request(`/ai/opportunity-matches/${oppId}`),
  getInterviewPrep: (payload) => request('/ai/interview-prep', { method: 'POST', body: JSON.stringify(payload) }),
  startMockInterview: (payload) => request('/ai/mock-interview/start', { method: 'POST', body: JSON.stringify(payload) }),
  answerMockInterview: (payload) => request('/ai/mock-interview/answer', { method: 'POST', body: JSON.stringify(payload) }),
  getPrepPlan: (payload) => request('/ai/prep-plan', { method: 'POST', body: JSON.stringify(payload) }),
  getOpportunityTrust: (id) => request(`/ai/opportunities/${id}/trust`),

  // Phase 5: Industry
  getCompanyProfile: () => request('/industry/profile'),
  updateCompanyProfile: (payload) => request('/industry/profile', { method: 'PATCH', body: JSON.stringify(payload) }),
  submitVerification: (payload) => request('/industry/verification', { method: 'POST', body: JSON.stringify(payload) }),
  createOpportunity: (payload) => request('/industry/opportunities', { method: 'POST', body: JSON.stringify(payload) }),
  getMyOpportunities: () => request('/industry/opportunities'),
  updateOpportunity: (id, payload) => request(`/industry/opportunities/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteOpportunity: (id) => request(`/industry/opportunities/${id}`, { method: 'DELETE' }),
  getOpportunityApplications: (oppId) => request(`/industry/opportunities/${oppId}/applications`),
  updateApplicationStatus: (appId, payload) => request(`/industry/applications/${appId}/status`, { method: 'PATCH', body: JSON.stringify(payload) }),
  scheduleInterview: (appId, payload) => request(`/industry/applications/${appId}/schedule-interview`, { method: 'POST', body: JSON.stringify(payload) }),

  // Phase 6: Opportunities & Student Applications
  searchOpportunities: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/opportunities?${q}`);
  },
  getOpportunityById: (id) => request(`/opportunities/${id}`),
  applyToOpportunity: (id, payload) => request(`/opportunities/${id}/apply`, { method: 'POST', body: JSON.stringify(payload) }),
  reportOpportunity: (id, payload) => request(`/opportunities/${id}/report`, { method: 'POST', body: JSON.stringify(payload) }),
  getMyApplications: () => request('/opportunities/my/applications'),
  withdrawApplication: (id) => request(`/opportunities/applications/${id}/withdraw`, { method: 'PATCH' }),
  getMyInterviews: () => request('/opportunities/my/interviews'),
  getMyPlacements: () => request('/opportunities/my/placements'),

  // Phase 7: Academician & Collaborations
  getFacultyProfile: () => request('/academicians/profile'),
  updateFacultyProfile: (payload) => request('/academicians/profile', { method: 'PATCH', body: JSON.stringify(payload) }),
  getFacultyOpportunities: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/academicians/opportunities?${q}`);
  },
  getCollaborations: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/academicians/collaborations?${q}`);
  },
  createCollaboration: (payload) => request('/academicians/collaborations', { method: 'POST', body: JSON.stringify(payload) }),
  joinCollaboration: (id) => request(`/academicians/collaborations/${id}/join`, { method: 'POST' }),
  getMyCollaborations: () => request('/academicians/my/collaborations'),

  // Phase 8: Institutional Analytics
  getAnalyticsOverview: () => request('/analytics/overview'),
  getSkillAnalytics: () => request('/analytics/skills'),
  getInternshipAnalytics: () => request('/analytics/internships'),
  getPlacementAnalytics: () => request('/analytics/placements'),
  getSkillDemandAnalytics: () => request('/analytics/skill-demand'),

  // Admin
  getAdminUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/users?${query}`);
  },
  updateUserStatus: (id, status) => request(`/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  getAdminStats: () => request('/admin/stats'),
  getAdminVerifications: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/verifications?${q}`);
  },
  reviewVerification: (id, payload) => request(`/admin/verifications/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  getReportedOpportunities: () => request('/admin/reported-opportunities')
};

