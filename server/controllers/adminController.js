import { UserModel } from '../models/dbAdapter.js';

/**
 * FR-13 & FR-09: Admin - Get All Users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    let query = {};

    if (role && role !== 'all') {
      query.role = role.toLowerCase();
    }
    if (status && status !== 'all') {
      query.accountStatus = status.toLowerCase();
    }

    let users = await UserModel.find(query);

    // Apply search filter if provided
    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      users = users.filter(u =>
        (u.name && u.name.toLowerCase().includes(s)) ||
        (u.email && u.email.toLowerCase().includes(s)) ||
        (u.role && u.role.toLowerCase().includes(s))
      );
    }

    // Map out safe user fields
    const safeUsers = users.map(u => ({
      _id: u._id,
      uid: u.uid,
      name: u.name,
      email: u.email,
      role: u.role,
      emailVerified: u.emailVerified,
      accountStatus: u.accountStatus || 'active',
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    }));

    return res.status(200).json({
      success: true,
      count: safeUsers.length,
      users: safeUsers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * FR-10 & FR-13: Admin - Update User Status
 */
export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'pending', 'suspended', 'blocked'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        code: 'INVALID_STATUS'
      });
    }

    // Look for user by uid or _id
    const user = await UserModel.findOne({ $or: [{ uid: id }, { _id: id }] }) || await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Guard: Prevent deactivating the primary admin account to avoid lockout
    if (user.role === 'admin' && user.email === 'admin@skillnexus.com' && status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'The primary system admin account status cannot be modified.',
        code: 'PRIMARY_ADMIN_PROTECTED'
      });
    }

    await UserModel.updateOne(
      { uid: user.uid },
      { $set: { accountStatus: status.toLowerCase() } }
    );

    const updated = await UserModel.findOne({ uid: user.uid });

    return res.status(200).json({
      success: true,
      message: `User account status successfully updated to '${status.toLowerCase()}'.`,
      user: {
        uid: updated.uid,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        accountStatus: updated.accountStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * FR-13: Admin - Platform Dashboard Statistics
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const allUsers = await UserModel.find({});

    const totalUsers = allUsers.length;
    const students = allUsers.filter(u => u.role === 'student').length;
    const industry = allUsers.filter(u => u.role === 'industry').length;
    const academicians = allUsers.filter(u => u.role === 'academician').length;
    const institutions = allUsers.filter(u => u.role === 'institution').length;
    const admins = allUsers.filter(u => u.role === 'admin').length;
    const pendingVerification = allUsers.filter(u => !u.emailVerified).length;
    const suspendedCount = allUsers.filter(u => u.accountStatus === 'suspended' || u.accountStatus === 'blocked').length;

    // Recent 5 registrations
    const recentUsers = [...allUsers]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5)
      .map(u => ({
        uid: u.uid,
        name: u.name,
        email: u.email,
        role: u.role,
        emailVerified: u.emailVerified,
        accountStatus: u.accountStatus || 'active',
        createdAt: u.createdAt
      }));

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        students,
        industry,
        academicians,
        institutions,
        admins,
        pendingVerification,
        suspendedCount,
        recentRegistrations: recentUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Req 36: Admin - Get Company Verifications
 */
export const getVerifications = async (req, res, next) => {
  try {
    const { VerificationModel } = await import('../models/dbAdapter.js');
    const { status } = req.query;
    const query = status ? { status } : {};
    const list = await VerificationModel.find(query, { sort: { createdAt: -1 } });
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

/**
 * Req 36: Admin - Review Company Verification
 */
export const reviewVerification = async (req, res, next) => {
  try {
    const { VerificationModel, IndustryProfileModel, OpportunityModel } = await import('../models/dbAdapter.js');
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const valid = ['verified', 'rejected', 'suspended', 'pending'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status' });
    }

    const verification = await VerificationModel.findById(id);
    if (!verification) {
      return res.status(404).json({ success: false, message: 'Verification record not found' });
    }

    await VerificationModel.updateOne({ _id: id }, {
      status,
      adminNotes: adminNotes || '',
      reviewedBy: req.user.email,
      reviewedAt: new Date().toISOString()
    });

    const isVerified = status === 'verified';
    // Update company opportunities
    await OpportunityModel.updateMany({ creatorUid: verification.uid }, { isVerifiedOrg: isVerified });

    res.json({ success: true, message: `Company verification status set to ${status}` });
  } catch (error) {
    next(error);
  }
};

/**
 * Req 70: Admin - Get Reported Opportunities
 */
export const getReportedOpportunities = async (req, res, next) => {
  try {
    const { OpportunityModel } = await import('../models/dbAdapter.js');
    const reported = await OpportunityModel.find({ reportCount: { $gt: 0 } }, { sort: { reportCount: -1 } });
    res.json({ success: true, data: reported });
  } catch (error) {
    next(error);
  }
};

