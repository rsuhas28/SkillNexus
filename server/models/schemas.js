import mongoose from 'mongoose';

// User Schema (PRD FR-12)
export const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['student', 'industry', 'academician', 'institution', 'admin']
  },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  verificationTokenExpires: { type: Date, default: null },
  verificationLastSent: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  accountStatus: {
    type: String,
    enum: ['active', 'pending', 'suspended', 'blocked'],
    default: 'active'
  }
}, { timestamps: true });

// Student Profile Schema
export const studentProfileSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true, index: true },
  headline: { type: String, default: 'Aspiring Professional' },
  bio: { type: String, default: '' },
  institutionName: { type: String, default: '' },
  degree: { type: String, default: '' },
  graduationYear: { type: String, default: '' },
  skills: { type: [String], default: ['JavaScript', 'React', 'Problem Solving'] },
  completionPercentage: { type: Number, default: 45 }
}, { timestamps: true });

// Industry Profile Schema
export const industryProfileSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true, index: true },
  companyName: { type: String, default: '' },
  industrySector: { type: String, default: 'Technology & Innovation' },
  companySize: { type: String, default: '50-250 Employees' },
  website: { type: String, default: '' },
  description: { type: String, default: '' },
  completionPercentage: { type: Number, default: 40 }
}, { timestamps: true });

// Academician Profile Schema
export const academicianProfileSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true, index: true },
  designation: { type: String, default: 'Assistant Professor' },
  department: { type: String, default: 'Computer Science & Engineering' },
  institutionName: { type: String, default: '' },
  researchAreas: { type: [String], default: ['Artificial Intelligence', 'Data Science'] },
  completionPercentage: { type: Number, default: 40 }
}, { timestamps: true });

// Institution Profile Schema
export const institutionProfileSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true, index: true },
  institutionName: { type: String, default: '' },
  institutionType: { type: String, default: 'University / Technical Institute' },
  campusLocation: { type: String, default: '' },
  website: { type: String, default: '' },
  completionPercentage: { type: Number, default: 50 }
}, { timestamps: true });

export const MongoUser = mongoose.models.User || mongoose.model('User', userSchema);
export const MongoStudentProfile = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema);
export const MongoIndustryProfile = mongoose.models.IndustryProfile || mongoose.model('IndustryProfile', industryProfileSchema);
export const MongoAcademicianProfile = mongoose.models.AcademicianProfile || mongoose.model('AcademicianProfile', academicianProfileSchema);
export const MongoInstitutionProfile = mongoose.models.InstitutionProfile || mongoose.model('InstitutionProfile', institutionProfileSchema);
