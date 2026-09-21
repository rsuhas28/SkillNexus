# SkillNexus — Phase 1: Authentication, Authorization & Role Management

**Bridging Skills, Academia & Industry**

## 🚀 Quick Start

```bash
# 1. Install all dependencies
npm.cmd --prefix server install
npm.cmd --prefix client install

# 2. Seed all test accounts
node server/scripts/seedAdmin.js

# 3. Start backend (port 5000)
node server/index.js

# 4. Start frontend (port 3000) — in a new terminal
npm.cmd --prefix client run dev
```

Open **http://localhost:3000**

---

## 🔑 Test Accounts

| Role         | Email                         | Password        |
|--------------|-------------------------------|-----------------|
| Admin        | admin@skillnexus.com          | Admin@1234      |
| Student      | student@skillnexus.com        | Student@1234    |
| Industry     | industry@skillnexus.com       | Industry@1234   |
| Academician  | academician@skillnexus.com    | Faculty@1234    |
| Institution  | institution@skillnexus.com    | Institute@1234  |
| Unverified   | unverified@skillnexus.com     | Unverified@1234 |

> All accounts are auto-seeded into **server/data/store.json** (local JSON store — no MongoDB needed).

---

## 🏗️ Project Structure

```
skillbridge/
├── server/
│   ├── config/db.js              # Dual-mode: MongoDB Atlas OR local JSON store
│   ├── models/
│   │   ├── schemas.js            # Mongoose schemas for all collections
│   │   └── dbAdapter.js          # Unified model API (works with both backends)
│   ├── middleware/
│   │   ├── auth.js               # authenticateUser, requireVerifiedEmail,
│   │   │                         #   requireActiveAccount, requireRole
│   │   └── errorHandler.js
│   ├── controllers/
│   │   ├── authController.js     # register, login, verifyEmail, resendVerification,
│   │   │                         #   forgotPassword, resetPassword, logout, getMe
│   │   ├── userController.js     # updateMe, getUserById
│   │   └── adminController.js    # getAllUsers, updateUserStatus, getAdminStats
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   ├── scripts/seedAdmin.js      # Seeds all 6 test accounts
│   ├── data/store.json           # Auto-created local persistent store
│   ├── .env                      # Environment config
│   └── index.js                  # Express server entry point
│
└── client/
    ├── src/
    │   ├── context/AuthContext.jsx      # Centralized auth state + actions
    │   ├── services/api.js              # Fetch-based API client
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx       # Auth + Email + Status + Role guards
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx              # Role-dynamic navigation
    │   │   ├── RoleBadge.jsx
    │   │   ├── RoleCardSelector.jsx
    │   │   └── PasswordStrengthMeter.jsx
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── VerifyEmailPage.jsx
    │   │   ├── ForgotPasswordPage.jsx
    │   │   ├── ResetPasswordPage.jsx
    │   │   ├── AccessDeniedPage.jsx
    │   │   ├── dashboards/
    │   │   │   ├── StudentDashboard.jsx
    │   │   │   ├── IndustryDashboard.jsx
    │   │   │   ├── AcademicianDashboard.jsx
    │   │   │   ├── InstitutionDashboard.jsx
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   └── AdminUsers.jsx
    │   │   └── profiles/
    │   │       ├── StudentProfile.jsx
    │   │       ├── IndustryProfile.jsx
    │   │       ├── AcademicianProfile.jsx
    │   │       └── InstitutionProfile.jsx
    │   ├── App.jsx                     # Full route tree with guards
    │   ├── main.jsx
    │   └── index.css                   # Complete design system
    └── index.html
```

---

## 🔐 Security Architecture

### Backend Middleware Chain
```
Request → authenticateUser → requireVerifiedEmail → requireActiveAccount → requireRole → Controller
```

### Frontend Route Guards (`ProtectedRoute.jsx`)
1. **AuthGuard** — Not authenticated → `/login`
2. **AccountStatusGuard** — Suspended/Blocked → Friendly notice screen
3. **EmailVerificationGuard** — Not verified → `/verify-email`
4. **RoleGuard** — Wrong role → `/access-denied`

---

## 🌐 API Reference

### Auth (public)
| Method | Endpoint                      | Description              |
|--------|-------------------------------|--------------------------|
| POST   | /api/auth/register            | Register (roles: student, industry, academician, institution) |
| POST   | /api/auth/login               | Login & get JWT          |
| POST   | /api/auth/verify-email        | Verify email with token  |
| POST   | /api/auth/resend-verification | Resend (60s cooldown)    |
| POST   | /api/auth/forgot-password     | Request reset link (safe)|
| POST   | /api/auth/reset-password      | Reset with token         |
| POST   | /api/auth/logout              | Logout                   |
| GET    | /api/auth/me                  | Get own profile (JWT)    |

### Users (authenticated)
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | /api/users/me     | Get own user + profile   |
| PATCH  | /api/users/me     | Update own profile       |
| GET    | /api/users/:id    | Get user by ID           |

### Admin (admin role only)
| Method | Endpoint                       | Description              |
|--------|--------------------------------|--------------------------|
| GET    | /api/admin/users               | List all users           |
| PATCH  | /api/admin/users/:id/status    | Update account status    |
| GET    | /api/admin/stats               | Platform statistics      |

---

## 🗄️ Connecting MongoDB Atlas (Optional)

Edit `server/.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/skillnexus
```

The system automatically detects the URI and switches from local JSON store to MongoDB Atlas. Re-run `node server/scripts/seedAdmin.js` after connecting.

---

## 📋 Phase 1 Acceptance Checklist

### Registration & Roles
- ✅ Student / Industry / Academician / Institution can register
- ✅ Admin cannot be publicly registered (ADMIN_REGISTRATION_FORBIDDEN)
- ✅ Duplicate email rejected
- ✅ Password strength: 8+ chars, uppercase, lowercase, number, special char
- ✅ Terms & Conditions enforced

### Email Verification  
- ✅ Verification token generated on register
- ✅ Resend with 60-second cooldown
- ✅ Unverified users blocked from protected pages

### Login & Sessions
- ✅ Valid credentials + JWT issued
- ✅ Suspended/Blocked accounts blocked at login
- ✅ Role detected → correct dashboard route

### Password Recovery
- ✅ Forgot password → safe generic response (no email enumeration)
- ✅ Reset token valid for 1 hour
- ✅ New password must pass strength requirements

### Authorization & Guards
- ✅ Student blocked from /industry, /academician, /institution, /admin
- ✅ Admin blocked from /student, /industry, /academician, /institution dashboards
- ✅ Backend middleware enforces role server-side (not just frontend)
- ✅ Suspended users see friendly error screen
- ✅ Expired/missing tokens return 401

### Admin Dashboard
- ✅ Platform stats (total users, by role, pending verification)
- ✅ Recent registrations table
- ✅ User Management: search, filter by role/status
- ✅ Activate / Suspend / Block any non-admin user
- ✅ Primary admin account protected from status changes

### Responsive Layout
- ✅ Desktop — sidebar + full layout
- ✅ Tablet/Mobile — sidebar collapses to top bar

---

## 🔮 Future Phase Compatibility

The Phase 1 architecture is designed to support all future SkillNexus phases without any auth rebuilds:

| Phase | Feature |
|-------|---------|
| 2     | Student Profile & Digital Portfolio |
| 3     | Skill Assessment |
| 4     | AI Skill Extraction |
| 5     | Skill Gap Analysis |
| 6     | Learning Recommendations |
| 7     | Internship & Job Matching |
| 8     | Academia–Industry Collaboration |
| 9     | Institution Analytics |
| 10    | Admin Management & Verification |

Add new routes under `/api/students/*`, `/api/industry/*`, etc. using the existing middleware stack.
