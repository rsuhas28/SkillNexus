import jwt from 'jsonwebtoken';
import { UserModel } from '../models/dbAdapter.js';

const JWT_SECRET = process.env.JWT_SECRET || 'skillnexus_super_secret_jwt_key_phase1_2025_secure';

/**
 * Middleware: authenticateUser
 * Authenticates requests using JWT Bearer token
 */
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
        code: 'AUTH_REQUIRED'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token. Please log in again.',
        code: 'TOKEN_INVALID'
      });
    }

    // Find the user in database
    const user = await UserModel.findOne({ uid: decoded.uid });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found.',
        code: 'USER_NOT_FOUND'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error in authenticateUser middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication verification failed.',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware: requireVerifiedEmail
 * Ensures the authenticated user's email has been verified
 */
export const requireVerifiedEmail = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
      code: 'AUTH_REQUIRED'
    });
  }

  // Admin users bypass email verification if needed, or enforce for all regular roles
  if (!req.user.emailVerified && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email before continuing.',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

/**
 * Middleware: requireActiveAccount
 * Enforces that user account status is 'active' (not suspended or blocked)
 */
export const requireActiveAccount = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
      code: 'AUTH_REQUIRED'
    });
  }

  const status = req.user.accountStatus || 'active';

  if (status === 'suspended') {
    return res.status(403).json({
      success: false,
      message: 'Your SkillNexus account has been suspended. Please contact support.',
      code: 'ACCOUNT_SUSPENDED'
    });
  }

  if (status === 'blocked') {
    return res.status(403).json({
      success: false,
      message: 'Your SkillNexus account has been blocked. Please contact support.',
      code: 'ACCOUNT_BLOCKED'
    });
  }

  next();
};

/**
 * Middleware: requireRole
 * Restricts access to specific user role(s)
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to access this page.",
        code: 'FORBIDDEN'
      });
    }

    next();
  };
};
