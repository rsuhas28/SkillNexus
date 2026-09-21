import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { AIGuideDrawer } from './components/AIGuideDrawer.jsx';

// Public Pages (Phase 1)
import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { VerifyEmailPage } from './pages/VerifyEmailPage.jsx';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.jsx';
import { ResetPasswordPage } from './pages/ResetPasswordPage.jsx';
import { AccessDeniedPage } from './pages/AccessDeniedPage.jsx';

// Dashboards
import { StudentDashboard } from './pages/dashboards/StudentDashboard.jsx';
import { IndustryDashboard } from './pages/dashboards/IndustryDashboard.jsx';
import { AcademicianDashboard } from './pages/dashboards/AcademicianDashboard.jsx';
import { InstitutionDashboard } from './pages/dashboards/InstitutionDashboard.jsx';
import { AdminDashboard } from './pages/dashboards/AdminDashboard.jsx';
import { AdminUsers } from './pages/dashboards/AdminUsers.jsx';

// Profiles
import { StudentProfile } from './pages/profiles/StudentProfile.jsx';
import { IndustryProfile } from './pages/profiles/IndustryProfile.jsx';
import { AcademicianProfile } from './pages/profiles/AcademicianProfile.jsx';
import { InstitutionProfile } from './pages/profiles/InstitutionProfile.jsx';

// Phase 2: Student Foundation
import { SkillsPage } from './pages/student/SkillsPage.jsx';
import { PortfolioPage } from './pages/student/PortfolioPage.jsx';
import { PublicPortfolioPage } from './pages/student/PublicPortfolioPage.jsx';
import { ProjectsAndCertsPage } from './pages/student/ProjectsAndCertsPage.jsx';

// Phase 3: Assessments & Skill Gap
import { AssessmentsPage } from './pages/student/AssessmentsPage.jsx';
import { TakeAssessmentPage } from './pages/student/TakeAssessmentPage.jsx';
import { AssessmentResultsPage } from './pages/student/AssessmentResultsPage.jsx';
import { SkillGapPage } from './pages/student/SkillGapPage.jsx';

// Phase 4 & 9: AI Prep & Interview
import { AIPrepPage } from './pages/student/AIPrepPage.jsx';

// Phase 5 & 6: Opportunities & Recruitment
import { OpportunitiesDiscoveryPage } from './pages/opportunities/OpportunitiesDiscoveryPage.jsx';
import { OpportunityDetailPage } from './pages/opportunities/OpportunityDetailPage.jsx';
import { StudentApplicationsPage } from './pages/student/StudentApplicationsPage.jsx';
import { IndustryOpportunitiesPage } from './pages/industry/IndustryOpportunitiesPage.jsx';
import { CandidatePipelinePage } from './pages/industry/CandidatePipelinePage.jsx';
import { CompanyVerificationPage } from './pages/industry/CompanyVerificationPage.jsx';

// Phase 7: Academician Opportunities & Collaborations
import { FacultyOpportunitiesPage } from './pages/academician/FacultyOpportunitiesPage.jsx';
import { CollaborationsPage } from './pages/academician/CollaborationsPage.jsx';

// Phase 8: Institution Analytics
import { InstitutionAnalyticsPage } from './pages/institution/InstitutionAnalyticsPage.jsx';

// Phase 10: Admin Verifications & Moderation
import { AdminVerificationsPage } from './pages/admin/AdminVerificationsPage.jsx';
import { AdminModerationPage } from './pages/admin/AdminModerationPage.jsx';

// Layout that wraps authenticated pages with Sidebar
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        {children}
      </main>
      <AIGuideDrawer />
    </div>
  );
};

// Redirect logged-in users away from auth pages
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading, user, getDashboardRouteForRole } = useAuth();
  if (loading) return null;
  if (isAuthenticated && user) {
    return <Navigate to={getDashboardRouteForRole(user.role)} replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-viewport">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />

          {/* Public Portfolio (Req 15) */}
          <Route path="/portfolio/:slug" element={<PublicPortfolioPage />} />

          {/* Public Opportunity Search & Detail (Req 43) */}
          <Route path="/opportunities" element={<OpportunitiesDiscoveryPage />} />
          <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />

          {/* --- Student Routes (Phases 2-6, 9) --- */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AuthenticatedLayout><StudentDashboard /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AuthenticatedLayout><StudentProfile /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/portfolio" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AuthenticatedLayout><PortfolioPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/skills" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AuthenticatedLayout><SkillsPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/projects-certs" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AuthenticatedLayout><ProjectsAndCertsPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/assessments" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AuthenticatedLayout><AssessmentsPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/assessments/take/:id" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AuthenticatedLayout><TakeAssessmentPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/assessments/results/:attemptId" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AuthenticatedLayout><AssessmentResultsPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/skill-gap" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AuthenticatedLayout><SkillGapPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/ai-prep" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AuthenticatedLayout><AIPrepPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/applications" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AuthenticatedLayout><StudentApplicationsPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* --- Industry Routes (Phases 5-6) --- */}
          <Route path="/industry/dashboard" element={
            <ProtectedRoute allowedRoles={['industry']}>
              <AuthenticatedLayout><IndustryDashboard /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/industry/profile" element={
            <ProtectedRoute allowedRoles={['industry']}>
              <AuthenticatedLayout><IndustryProfile /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/industry/opportunities" element={
            <ProtectedRoute allowedRoles={['industry']}>
              <AuthenticatedLayout><IndustryOpportunitiesPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/industry/opportunities/:opportunityId/applications" element={
            <ProtectedRoute allowedRoles={['industry', 'admin']}>
              <AuthenticatedLayout><CandidatePipelinePage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/industry/verification" element={
            <ProtectedRoute allowedRoles={['industry']}>
              <AuthenticatedLayout><CompanyVerificationPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* --- Academician Routes (Phase 7) --- */}
          <Route path="/academician/dashboard" element={
            <ProtectedRoute allowedRoles={['academician']}>
              <AuthenticatedLayout><AcademicianDashboard /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/academician/profile" element={
            <ProtectedRoute allowedRoles={['academician']}>
              <AuthenticatedLayout><AcademicianProfile /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/academician/opportunities" element={
            <ProtectedRoute allowedRoles={['academician']}>
              <AuthenticatedLayout><FacultyOpportunitiesPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/academician/collaborations" element={
            <ProtectedRoute allowedRoles={['academician', 'industry', 'institution', 'admin']}>
              <AuthenticatedLayout><CollaborationsPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* --- Institution Routes (Phase 8) --- */}
          <Route path="/institution/dashboard" element={
            <ProtectedRoute allowedRoles={['institution']}>
              <AuthenticatedLayout><InstitutionDashboard /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/institution/profile" element={
            <ProtectedRoute allowedRoles={['institution']}>
              <AuthenticatedLayout><InstitutionProfile /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/institution/analytics" element={
            <ProtectedRoute allowedRoles={['institution', 'admin']}>
              <AuthenticatedLayout><InstitutionAnalyticsPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* --- Admin Routes (Phase 10) --- */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AuthenticatedLayout><AdminDashboard /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AuthenticatedLayout><AdminUsers /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/verifications" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AuthenticatedLayout><AdminVerificationsPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/moderation" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AuthenticatedLayout><AdminModerationPage /></AuthenticatedLayout>
            </ProtectedRoute>
          } />

          {/* --- Catch-All: Redirect to Landing --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
