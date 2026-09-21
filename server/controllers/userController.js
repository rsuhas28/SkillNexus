import {
  UserModel,
  StudentProfileModel,
  IndustryProfileModel,
  AcademicianProfileModel,
  InstitutionProfileModel
} from '../models/dbAdapter.js';

export const updateMe = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, profileData } = req.body;

    if (name && name.trim()) {
      await UserModel.updateOne({ uid: user.uid }, { $set: { name: name.trim() } });
    }

    let updatedProfile = null;
    if (profileData) {
      if (user.role === 'student') {
        await StudentProfileModel.updateOne({ uid: user.uid }, { $set: profileData });
        updatedProfile = await StudentProfileModel.findOne({ uid: user.uid });
      } else if (user.role === 'industry') {
        await IndustryProfileModel.updateOne({ uid: user.uid }, { $set: profileData });
        updatedProfile = await IndustryProfileModel.findOne({ uid: user.uid });
      } else if (user.role === 'academician') {
        await AcademicianProfileModel.updateOne({ uid: user.uid }, { $set: profileData });
        updatedProfile = await AcademicianProfileModel.findOne({ uid: user.uid });
      } else if (user.role === 'institution') {
        await InstitutionProfileModel.updateOne({ uid: user.uid }, { $set: profileData });
        updatedProfile = await InstitutionProfileModel.findOne({ uid: user.uid });
      }
    }

    const updatedUser = await UserModel.findOne({ uid: user.uid });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        uid: updatedUser.uid,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        emailVerified: updatedUser.emailVerified,
        accountStatus: updatedUser.accountStatus
      },
      profile: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requester = req.user;

    // A user can view their own profile, or an admin can view any user
    if (requester.role !== 'admin' && requester.uid !== id && requester._id !== id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to access this user.",
        code: 'FORBIDDEN'
      });
    }

    const user = await UserModel.findOne({ $or: [{ uid: id }, { _id: id }] }) || await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        code: 'USER_NOT_FOUND'
      });
    }

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
        createdAt: user.createdAt
      },
      profile
    });
  } catch (error) {
    next(error);
  }
};
