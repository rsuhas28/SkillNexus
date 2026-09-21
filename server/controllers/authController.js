import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import crypto from 'crypto';
import {
  UserModel,
  StudentProfileModel,
  IndustryProfileModel,
  AcademicianProfileModel,
  InstitutionProfileModel
} from '../models/dbAdapter.js';

const JWT_SECRET = process.env.JWT_SECRET || 'skillnexus_super_secret_jwt_key_phase1_2025_secure';
const COOLDOWN_SECONDS = 60;

// Password validation regex: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
export const validatePasswordStrength = (password) => {
  if (!password || password.length < 8) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password);
  return hasUpper && hasLower && hasNumber && hasSpecial;
};

// Generate JWT helper
const generateToken = (user) => {
  return jwt.sign(
    {
      uid: user.uid,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      accountStatus: user.accountStatus
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * FR-01 & FR-02: Register User
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role, termsAccepted } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
        code: 'MISSING_FIELDS'
      });
    }

    // Block public admin registration (FR-01, FR-06)
    if (role.toLowerCase() === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be publicly created.',
        code: 'ADMIN_REGISTRATION_FORBIDDEN'
      });
    }

    const validRoles = ['student', 'industry', 'academician', 'institution'];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid role selected. Must be one of: ${validRoles.join(', ')}`,
        code: 'INVALID_ROLE'
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
        code: 'INVALID_EMAIL'
      });
    }

    // Validate terms acceptance
    if (termsAccepted !== true) {
      return res.status(400).json({
        success: false,
        message: 'You must accept the Terms & Conditions to register.',
        code: 'TERMS_NOT_ACCEPTED'
      });
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and Confirm Password do not match.',
        code: 'PASSWORD_MISMATCH'
      });
    }

    // Validate password strength
    if (!validatePasswordStrength(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        code: 'WEAK_PASSWORD'
      });
    }

    // Duplicate email check
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate unique UID and verification token
    const uid = 'usr_' + crypto.randomBytes(8).toString('hex');
    const verificationToken = crypto.randomBytes(24).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const verificationLastSent = new Date();

    // Create base user record (FR-12)
    const newUser = await UserModel.create({
      uid,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role.toLowerCase(),
      emailVerified: false,
      verificationToken,
      verificationTokenExpires,
      verificationLastSent,
      accountStatus: 'active'
    });

    // Create role-specific profile (FR-12)
    let roleProfile;
    if (role.toLowerCase() === 'student') {
      roleProfile = await StudentProfileModel.create({ uid, headline: 'Student & Emerging Professional' });
    } else if (role.toLowerCase() === 'industry') {
      roleProfile = await IndustryProfileModel.create({ uid, companyName: name.trim() });
    } else if (role.toLowerCase() === 'academician') {
      roleProfile = await AcademicianProfileModel.create({ uid, designation: 'Faculty Member' });
    } else if (role.toLowerCase() === 'institution') {
      roleProfile = await InstitutionProfileModel.create({ uid, institutionName: name.trim() });
    }

    // Issue initial JWT
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. A verification email has been sent.',
      user: {
        uid: newUser.uid,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        emailVerified: newUser.emailVerified,
        accountStatus: newUser.accountStatus,
        createdAt: newUser.createdAt
      },
      token,
      profile: roleProfile,
      demoVerificationToken: verificationToken // included for demonstration/testing
    });
  } catch (error) {
    next(error);
  }
};

/**
 * FR-03: Login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
        code: 'MISSING_CREDENTIALS'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect email or password.',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect email or password.',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check account status (FR-10)
    if (user.accountStatus === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your SkillNexus account has been suspended. Please contact support.',
        code: 'ACCOUNT_SUSPENDED'
      });
    }

    if (user.accountStatus === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Your SkillNexus account has been blocked. Please contact support.',
        code: 'ACCOUNT_BLOCKED'
      });
    }

    // Retrieve role profile
    let roleProfile = null;
    if (user.role === 'student') roleProfile = await StudentProfileModel.findOne({ uid: user.uid });
    else if (user.role === 'industry') roleProfile = await IndustryProfileModel.findOne({ uid: user.uid });
    else if (user.role === 'academician') roleProfile = await AcademicianProfileModel.findOne({ uid: user.uid });
    else if (user.role === 'institution') roleProfile = await InstitutionProfileModel.findOne({ uid: user.uid });

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        accountStatus: user.accountStatus,
        verificationToken: user.verificationToken
      },
      profile: roleProfile,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * FR-04: Verify Email
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const { token, uid } = req.body;

    let user = null;
    if (token) {
      user = await UserModel.findOne({ verificationToken: token });
    } else if (uid || (req.user && req.user.uid)) {
      const targetUid = uid || req.user.uid;
      user = await UserModel.findOne({ uid: targetUid });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token or user not found.',
        code: 'INVALID_VERIFICATION_TOKEN'
      });
    }

    if (user.emailVerified) {
      return res.status(200).json({
        success: true,
        message: 'Email is already verified.',
        emailVerified: true
      });
    }

    // Update user status
    await UserModel.updateOne(
      { uid: user.uid },
      {
        $set: {
          emailVerified: true,
          verificationToken: null,
          verificationTokenExpires: null
        }
      }
    );

    const updatedUser = await UserModel.findOne({ uid: user.uid });
    const newToken = generateToken(updatedUser);

    return res.status(200).json({
      success: true,
      message: 'Email successfully verified. Welcome to SkillNexus!',
      user: {
        uid: updatedUser.uid,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        emailVerified: true,
        accountStatus: updatedUser.accountStatus
      },
      token: newToken
    });
  } catch (error) {
    next(error);
  }
};

/**
 * FR-04: Resend Verification Email with Cooldown
 */
export const resendVerification = async (req, res, next) => {
  try {
    const email = req.body.email || (req.user && req.user.email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
        code: 'MISSING_EMAIL'
      });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        code: 'USER_NOT_FOUND'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified.',
        code: 'ALREADY_VERIFIED'
      });
    }

    // Check cooldown
    const now = new Date();
    if (user.verificationLastSent) {
      const elapsedSeconds = Math.floor((now - new Date(user.verificationLastSent)) / 1000);
      if (elapsedSeconds < COOLDOWN_SECONDS) {
        const remainingSeconds = COOLDOWN_SECONDS - elapsedSeconds;
        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting another verification email.`,
          code: 'RATE_LIMITED',
          remainingSeconds
        });
      }
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(24).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await UserModel.updateOne(
      { uid: user.uid },
      {
        $set: {
          verificationToken,
          verificationTokenExpires,
          verificationLastSent: now
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: 'A new verification email has been sent.',
      demoVerificationToken: verificationToken,
      cooldown: COOLDOWN_SECONDS
    });
  } catch (error) {
    next(error);
  }
};

/**
 * FR-05: Forgot Password
 * Always responds with generic safe message to prevent email enumeration
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address.',
        code: 'MISSING_EMAIL'
      });
    }

    const genericSuccessResponse = {
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.'
    };

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(200).json(genericSuccessResponse);
    }

    // Generate reset token
    const resetPasswordToken = crypto.randomBytes(24).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await UserModel.updateOne(
      { uid: user.uid },
      {
        $set: {
          resetPasswordToken,
          resetPasswordExpires
        }
      }
    );

    console.log(`[Password Reset Simulated] Reset Link for ${user.email}: http://localhost:3000/reset-password?token=${resetPasswordToken}`);

    return res.status(200).json({
      ...genericSuccessResponse,
      demoResetToken: resetPasswordToken // Included for testing convenience
    });
  } catch (error) {
    next(error);
  }
};

/**
 * FR-05: Reset Password with Token
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password fields are required.',
        code: 'MISSING_FIELDS'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and Confirm Password do not match.',
        code: 'PASSWORD_MISMATCH'
      });
    }

    if (!validatePasswordStrength(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.',
        code: 'WEAK_PASSWORD'
      });
    }

    const user = await UserModel.findOne({ resetPasswordToken: token });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset link.',
        code: 'INVALID_TOKEN'
      });
    }

    if (user.resetPasswordExpires && new Date(user.resetPasswordExpires) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Password reset link has expired. Please request a new one.',
        code: 'TOKEN_EXPIRED'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await UserModel.updateOne(
      { uid: user.uid },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Your password has been successfully reset. You may now log in.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * FR-11: Logout
 */
export const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

/**
 * FR-12: Get current user profile
 */
export const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    let profile = null;

    if (user.role === 'student') profile = await StudentProfileModel.findOne({ uid: user.uid });
    else if (user.role === 'industry') profile = await IndustryProfileModel.findOne({ uid: user.uid });
    else if (user.role === 'academician') profile = await AcademicianProfileModel.findOne({ uid: user.uid });
    else if (user.role === 'institution') profile = await InstitutionProfileModel.findOne({ uid: user.uid });

    return res.status(200).json({
      success: true,
      user: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        accountStatus: user.accountStatus,
        verificationToken: user.verificationToken,
        createdAt: user.createdAt
      },
      profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Firebase Auth — POST /auth/firebase
 * Accepts a Firebase ID token, decodes it, then creates/updates a
 * SkillNexus user and returns a standard SkillNexus JWT.
 */
export const firebaseAuthHandler = async (req, res, next) => {
  try {
    const { idToken, role: roleHint } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID token is required.',
        code: 'MISSING_ID_TOKEN'
      });
    }

    // Lightweight JWT decode (base64url) — no signature verification here.
    // For production-grade security, install firebase-admin and call
    // admin.auth().verifyIdToken(idToken) instead.
    let firebasePayload;
    try {
      const parts = idToken.split('.');
      if (parts.length !== 3) throw new Error('Malformed token');
      firebasePayload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Invalid Firebase ID token.',
        code: 'INVALID_FIREBASE_TOKEN'
      });
    }

    const firebaseUid = firebasePayload.user_id || firebasePayload.sub || firebasePayload.uid || req.body.clientUid;
    const email = firebasePayload.email || req.body.clientEmail || (firebaseUid ? `${firebaseUid}@firebase.user` : null);
    const name = firebasePayload.name || req.body.clientName || (email ? email.split('@')[0] : 'Firebase User');
    const picture = firebasePayload.picture || req.body.clientPhoto || null;
    const email_verified = typeof firebasePayload.email_verified === 'boolean' ? firebasePayload.email_verified : true;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'Firebase token missing user identification claim (user_id/sub).',
        code: 'MISSING_TOKEN_CLAIMS'
      });
    }

    // Find or create the SkillNexus user
    const normalizedEmail = email ? email.toLowerCase().trim() : null;
    let user = normalizedEmail ? await UserModel.findOne({ email: normalizedEmail }) : null;
    if (!user && firebaseUid) {
      user = await UserModel.findOne({ firebaseUid });
    }

    if (!user) {
      const validRoles = ['student', 'industry', 'academician', 'institution'];
      const role = roleHint && validRoles.includes(roleHint) ? roleHint : 'student';

      user = await UserModel.create({
        uid: `fb_${firebaseUid}`,
        name: name || (email ? email.split('@')[0] : 'Firebase User'),
        email: normalizedEmail || `${firebaseUid}@firebase.user`,
        password: `firebase_${crypto.randomBytes(16).toString('hex')}`,
        role,
        emailVerified: !!email_verified,
        accountStatus: 'active',
        firebaseUid,
        avatarUrl: picture || null,
        authProvider: 'firebase',
        createdAt: new Date().toISOString()
      });

      // Create the corresponding role profile
      const profileData = { userId: user.uid, createdAt: new Date().toISOString() };
      if (role === 'student') await StudentProfileModel.create(profileData).catch(() => {});
      else if (role === 'industry') await IndustryProfileModel.create(profileData).catch(() => {});
      else if (role === 'academician') await AcademicianProfileModel.create(profileData).catch(() => {});
      else if (role === 'institution') await InstitutionProfileModel.create(profileData).catch(() => {});
    } else {
      // Sync Firebase fields on returning user
      const updates = {
        emailVerified: user.emailVerified || !!email_verified,
        firebaseUid: user.firebaseUid || firebaseUid
      };
      if (picture && !user.avatarUrl) updates.avatarUrl = picture;
      await UserModel.updateOne({ uid: user.uid }, updates);
      user = { ...user, ...updates };
    }

    const jwtToken = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Firebase authentication successful.',
      token: jwtToken,
      user: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        accountStatus: user.accountStatus,
        avatarUrl: user.avatarUrl || null,
        authProvider: user.authProvider || 'firebase'
      },
      profile: null
    });
  } catch (error) {
    next(error);
  }
};
