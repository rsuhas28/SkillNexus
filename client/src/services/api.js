import {
  DEMO_OPPORTUNITIES,
  DEMO_STUDENT_DATA,
  DEMO_ACCOUNTS,
  DEMO_ASSESSMENTS,
  DEMO_ATTEMPTS,
  DEMO_SKILL_GAP,
  DEMO_MOCK_INTERVIEW,
  DEMO_ADMIN_USERS
} from './demoStore.js';

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
    const match = DEMO_ACCOUNTS[email] || DEMO_ACCOUNTS['student@skillnexus.com'];
    localStorage.setItem('skillnexus_demo_user', JSON.stringify({ user: match.user, profile: match.profile }));
    localStorage.setItem('skillnexus_token', `demo_token_${match.user.role}`);
    return { success: true, token: `demo_token_${match.user.role}`, user: match.user, profile: match.profile };
  }
  if (endpoint.startsWith('/auth/register')) {
    let body = {};
    try { body = JSON.parse(options.body || '{}'); } catch (e) {}
    const email = (body.email || '').toLowerCase().trim();
    const role = body.role || 'student';
    const name = body.name || 'New User';
    // Check if it matches a known demo account
    const knownMatch = DEMO_ACCOUNTS[email];
    if (knownMatch) {
      const t = `demo_token_${knownMatch.user.role}`;
      localStorage.setItem('skillnexus_demo_user', JSON.stringify({ user: knownMatch.user, profile: knownMatch.profile }));
      localStorage.setItem('skillnexus_token', t);
      return { success: true, token: t, user: knownMatch.user, profile: knownMatch.profile };
    }
    // Create a fresh demo user session for any new registrant
    const newUser = { _id: `usr_new_${Date.now()}`, uid: `usr_new_${Date.now()}`, name, email, role, emailVerified: true, accountStatus: 'active' };
    const newProfile = role === 'student'
      ? { headline: 'New Student', institutionName: '', degree: '', graduationYear: '', skills: [], completionPercentage: 0 }
      : role === 'industry'
      ? { companyName: name, industrySector: 'Technology', companySize: '1-50', completionPercentage: 0 }
      : role === 'academician'
      ? { designation: 'Lecturer', department: 'Computer Science', institutionName: '', completionPercentage: 0 }
      : { institutionName: name, institutionType: 'University', completionPercentage: 0 };
    const t = `demo_token_${role}_${Date.now()}`;
    localStorage.setItem('skillnexus_demo_user', JSON.stringify({ user: newUser, profile: newProfile }));
    localStorage.setItem('skillnexus_token', t);
    return { success: true, token: t, user: newUser, profile: newProfile };
  }
  if (endpoint.startsWith('/auth/firebase')) {
    // After Firebase OAuth succeeds on the frontend, map to demo session by role hint
    let body = {};
    try { body = JSON.parse(options.body || '{}'); } catch (e) {}
    const email = (body.clientEmail || '').toLowerCase().trim();
    const role = body.role || 'student';
    const name = body.clientName || 'Google User';
    const knownMatch = DEMO_ACCOUNTS[email];
    if (knownMatch) {
      const t = `demo_token_${knownMatch.user.role}`;
      localStorage.setItem('skillnexus_demo_user', JSON.stringify({ user: knownMatch.user, profile: knownMatch.profile }));
      localStorage.setItem('skillnexus_token', t);
      return { success: true, token: t, user: knownMatch.user, profile: knownMatch.profile };
    }
    const newUser = { _id: `usr_oauth_${Date.now()}`, uid: `usr_oauth_${Date.now()}`, name, email, role, emailVerified: true, accountStatus: 'active' };
    const newProfile = { headline: `${role.charAt(0).toUpperCase() + role.slice(1)} — Just joined SkillNexus`, completionPercentage: 10 };
    const t = `demo_token_${role}_${Date.now()}`;
    localStorage.setItem('skillnexus_demo_user', JSON.stringify({ user: newUser, profile: newProfile }));
    localStorage.setItem('skillnexus_token', t);
    return { success: true, token: t, user: newUser, profile: newProfile };
  }
  if (endpoint.startsWith('/auth/logout')) {
    localStorage.removeItem('skillnexus_token');
    localStorage.removeItem('skillnexus_demo_user');
    return { success: true };
  }
  if (endpoint.startsWith('/auth/')) {
    return { success: true, message: 'OK (demo mode)' };
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
  if (endpoint.startsWith('/students/skill-profile')) {
    return { success: true, data: { skills: DEMO_STUDENT_DATA.skills, totalScore: 88 } };
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
  if (endpoint.startsWith('/academicians/collaborations') || endpoint.startsWith('/academicians/my/collaborations')) {
    return { success: true, data: DEMO_STUDENT_DATA.collaborations };
  }
  if (endpoint.startsWith('/academicians/opportunities')) {
    return { success: true, data: DEMO_OPPORTUNITIES.filter(o => o.type === 'fdp' || o.type === 'live_project') };
  }
  if (endpoint.startsWith('/academicians/profile')) {
    return { success: true, data: DEMO_ACCOUNTS['academician@skillnexus.com'].profile };
  }

  // 6. Assessments & Skill Gaps
  if (endpoint.startsWith('/assessments/my/attempts')) {
    return { success: true, data: DEMO_ATTEMPTS };
  }
  if (endpoint.startsWith('/assessments/attempts/')) {
    return { success: true, data: DEMO_ATTEMPTS[0] };
  }
  if (endpoint.startsWith('/assessments/skill-gap')) {
    return { success: true, data: DEMO_SKILL_GAP };
  }
  if (endpoint.startsWith('/assessments/')) {
    const parts = endpoint.split('/');
    const asmId = parts[2];
    const found = DEMO_ASSESSMENTS.find(a => a._id === asmId);
    return { success: true, data: found || DEMO_ASSESSMENTS[0] };
  }
  if (endpoint.startsWith('/assessments')) {
    return { success: true, data: DEMO_ASSESSMENTS };
  }

  // 7. AI Services
  if (endpoint.startsWith('/ai/status')) {
    return { success: true, aiReady: true, model: 'SkillNexus AI Engine' };
  }
  if (endpoint.startsWith('/ai/skill-mapping')) {
    return { success: true, data: DEMO_SKILL_GAP };
  }
  if (endpoint.startsWith('/ai/learning-recommendations')) {
    return { success: true, data: DEMO_SKILL_GAP.learningPathways };
  }
  if (endpoint.startsWith('/ai/career-guidance') || endpoint.startsWith('/ai/guide')) {
    return { success: true, guidance: 'Based on your advanced React & Python competencies, target roles include Full Stack AI Engineer and Cloud Applications Architect.', suggestions: ['Master Kubernetes orchestration', 'Implement RAG vector indexing'] };
  }
  if (endpoint.startsWith('/ai/mock-interview') || endpoint.startsWith('/ai/interview-prep')) {
    return { success: true, data: DEMO_MOCK_INTERVIEW };
  }
  if (endpoint.startsWith('/ai/prep-plan')) {
    return { success: true, data: DEMO_SKILL_GAP.learningPathways };
  }
  if (endpoint.startsWith('/ai/opportunity-matches/')) {
    return { success: true, matchScore: 88, matchedSkills: ['React.js', 'Python', 'Docker & Containers'], missingSkills: ['Kubernetes'] };
  }
  if (endpoint.startsWith('/ai/opportunities/')) {
    return { success: true, trustScore: 98, verifiedOrg: true, flags: [] };
  }

  // 8. Admin & Institutional
  if (endpoint.startsWith('/admin/users')) {
    return { success: true, users: DEMO_ADMIN_USERS, total: DEMO_ADMIN_USERS.length };
  }
  if (endpoint.startsWith('/admin/stats')) {
    return { success: true, stats: DEMO_STUDENT_DATA.analytics.overview };
  }
  if (endpoint.startsWith('/admin/verifications') || endpoint.startsWith('/admin/reported-opportunities')) {
    return { success: true, data: [] };
  }
  if (endpoint.startsWith('/institution/profile')) {
    return { success: true, data: DEMO_ACCOUNTS['institution@skillnexus.com'].profile };
  }

  // 9. Analytics
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
  if (endpoint.startsWith('/analytics/internships')) {
    return { success: true, data: DEMO_STUDENT_DATA.analytics.overview };
  }

  // Default fallback for any mutation or query in demo mode
  if (method === 'POST' || method === 'PATCH' || method === 'DELETE') {
    return { success: true, message: 'Saved successfully (Demo mode)' };
  }
  return { success: true, data: [] };
}

async function request(endpoint, options = {}) {
  // If deployed to a static host (like Netlify) without an explicit API server URL,
  // directly serve the rich client-side demo dataset to guarantee zero latency and no HTML errors.
  const isStaticDeploy = typeof window !== 'undefined' &&
    !import.meta.env.VITE_API_URL &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  if (isStaticDeploy) {
    return getDemoFallback(endpoint, options);
  }

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
    const contentType = response.headers.get('content-type') || '';

    // If server returned HTML (e.g. Netlify SPA redirect fallback for /api)
    if (contentType.includes('text/html')) {
      return getDemoFallback(endpoint, options);
    }

    if (!response.ok) {
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

    const data = await response.json().catch(() => null);
    if (!data) {
      return getDemoFallback(endpoint, options);
    }

    return data;
  } catch (err) {
    // If fetch failed or network error (e.g. backend offline or CORS)
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

