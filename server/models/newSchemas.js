import mongoose from 'mongoose';

// ─── Phase 2: Student Extended Profile (Req 14) ───────────────────────────────
export const studentExtendedProfileSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true, index: true },
  // Basic
  headline: { type: String, default: '' },
  photo: { type: String, default: null }, // Cloudinary URL
  photoPublicId: { type: String, default: null },
  dateOfBirth: { type: String, default: '' },
  gender: { type: String, enum: ['male', 'female', 'non-binary', 'prefer-not-to-say', ''], default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  about: { type: String, default: '' },
  careerObjective: { type: String, default: '' },
  // Social Links
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  // Preferences
  preferredRoles: { type: [String], default: [] },
  preferredIndustries: { type: [String], default: [] },
  preferredLocations: { type: [String], default: [] },
  availability: { type: String, enum: ['immediate', '1-month', '3-months', '6-months', 'not-looking', ''], default: '' },
  // Meta
  completionPercentage: { type: Number, default: 0 },
  portfolioSlug: { type: String, default: null },
  portfolioPublic: { type: Boolean, default: false }
}, { timestamps: true });

// ─── Phase 2: Digital Portfolio (Req 15) ─────────────────────────────────────
export const portfolioSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true, index: true },
  slug: { type: String, unique: true, sparse: true, index: true },
  isPublic: { type: Boolean, default: false },
  sections: [{
    id: String,
    type: { type: String, enum: ['about', 'skills', 'education', 'projects', 'certifications', 'achievements', 'experience', 'resume', 'links'] },
    visible: { type: Boolean, default: true },
    order: Number
  }],
  customLinks: [{ label: String, url: String }]
}, { timestamps: true });

// ─── Phase 2: Student Skills (Req 16) ────────────────────────────────────────
export const studentSkillSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  skillName: { type: String, required: true },
  category: {
    type: String,
    enum: ['Programming', 'Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'Cloud', 'Cybersecurity', 'Databases', 'DevOps', 'Tools', 'Soft Skills', 'Domain Skills', 'Other'],
    default: 'Other'
  },
  proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Beginner' },
  evidence: { type: String, default: '' },
  yearsExperience: { type: Number, default: 0 },
  monthsExperience: { type: Number, default: 0 },
  source: { type: String, enum: ['self-declared', 'assessment', 'ai-extracted'], default: 'self-declared' }
}, { timestamps: true });

// ─── Phase 2: Education (Req 17) ─────────────────────────────────────────────
export const studentEducationSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  specialization: { type: String, default: '' },
  startYear: { type: String, required: true },
  endYear: { type: String, default: '' },
  isCurrent: { type: Boolean, default: false },
  cgpa: { type: String, default: '' },
  location: { type: String, default: '' },
  description: { type: String, default: '' }
}, { timestamps: true });

// ─── Phase 2: Projects (Req 18) ──────────────────────────────────────────────
export const studentProjectSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  problemSolved: { type: String, default: '' },
  technologies: { type: [String], default: [] },
  skillsUsed: { type: [String], default: [] },
  role: { type: String, default: '' },
  teamSize: { type: Number, default: 1 },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  projectUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  demoUrl: { type: String, default: '' },
  isPortfolioHighlight: { type: Boolean, default: false },
  images: [{ url: String, publicId: String }]
}, { timestamps: true });

// ─── Phase 2: Certifications (Req 19) ────────────────────────────────────────
export const studentCertificationSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  name: { type: String, required: true },
  issuingOrg: { type: String, required: true },
  issueDate: { type: String, default: '' },
  expiryDate: { type: String, default: '' },
  credentialId: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
  documentUrl: { type: String, default: null },
  documentPublicId: { type: String, default: null },
  skillsCovered: { type: [String], default: [] }
}, { timestamps: true });

// ─── Phase 2: Achievements (Req 20) ──────────────────────────────────────────
export const studentAchievementSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  title: { type: String, required: true },
  organization: { type: String, default: '' },
  date: { type: String, default: '' },
  description: { type: String, default: '' },
  category: { type: String, enum: ['Hackathon', 'Award', 'Competition', 'Scholarship', 'Publication', 'Leadership', 'Sports', 'Other'], default: 'Other' },
  documentUrl: { type: String, default: null },
  link: { type: String, default: '' }
}, { timestamps: true });

// ─── Phase 2: Documents (Req 21) ─────────────────────────────────────────────
export const studentDocumentSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['resume', 'cv', 'certificate', 'marksheet', 'project', 'other'], default: 'other' },
  fileUrl: { type: String, default: null },
  publicId: { type: String, default: null },
  mimeType: { type: String, default: '' },
  sizeBytes: { type: Number, default: 0 },
  isPrimary: { type: Boolean, default: false },
  localMode: { type: Boolean, default: false }
}, { timestamps: true });

// ─── Phase 3: Assessment Definitions (Req 22-24) ─────────────────────────────
export const assessmentDefinitionSchema = new mongoose.Schema({
  type: { type: String, enum: ['technical', 'soft-skill', 'aptitude'], required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  timeLimit: { type: Number, default: 30 }, // minutes
  maxAttempts: { type: Number, default: 3 },
  questions: [{
    id: String,
    text: String,
    section: String,
    topic: String,
    type: { type: String, enum: ['mcq', 'multi-select', 'true-false'], default: 'mcq' },
    options: [{ id: String, text: String }],
    correctAnswer: mongoose.Schema.Types.Mixed, // String for mcq, Array for multi-select
    difficulty: String,
    explanation: String
  }]
}, { timestamps: true });

// ─── Phase 3: Assessment Attempts (Req 22-26) ────────────────────────────────
export const assessmentAttemptSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  assessmentId: { type: String, required: true },
  assessmentType: { type: String, enum: ['technical', 'soft-skill', 'aptitude'] },
  topic: String,
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  timeLimit: Number,
  answers: { type: Map, of: mongoose.Schema.Types.Mixed }, // questionId -> answer
  submitted: { type: Boolean, default: false },
  results: {
    totalQuestions: Number,
    attempted: Number,
    correct: Number,
    incorrect: Number,
    skipped: Number,
    score: Number,
    percentage: Number,
    timeTaken: Number, // seconds
    topicScores: { type: Map, of: mongoose.Schema.Types.Mixed },
    sectionScores: { type: Map, of: mongoose.Schema.Types.Mixed },
    topicClassification: {
      strong: [mongoose.Schema.Types.Mixed],
      moderate: [mongoose.Schema.Types.Mixed],
      weak: [mongoose.Schema.Types.Mixed]
    }
  }
}, { timestamps: true });

// ─── Phase 3: Skill Gap (Req 28) ─────────────────────────────────────────────
export const skillGapSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  targetRole: { type: String, required: true },
  gaps: [{
    skill: String,
    currentLevel: String,
    requiredLevel: String,
    gap: String,
    priority: { type: String, enum: ['High', 'Medium', 'Low'] },
    action: String
  }],
  overallReadiness: { type: Number, default: 0 }, // percentage
  lastAnalyzed: { type: Date, default: Date.now }
}, { timestamps: true });

// ─── Phase 5: Opportunities (Req 35-42, 50-59) ───────────────────────────────
export const opportunitySchema = new mongoose.Schema({
  creatorUid: { type: String, required: true, index: true },
  creatorRole: { type: String, enum: ['industry', 'academician', 'institution', 'admin'] },
  type: {
    type: String,
    required: true,
    enum: ['job', 'internship', 'apprenticeship', 'project', 'training', 'mentorship', 'faculty_internship', 'industrial_training', 'fdp', 'workshop', 'guest_lecture', 'innovation_challenge', 'live_project'],
    index: true
  },
  status: { type: String, enum: ['draft', 'published', 'closed', 'archived'], default: 'draft', index: true },
  // Core
  title: { type: String, required: true },
  description: { type: String, default: '' },
  skills: { type: [String], default: [], index: true },
  // Company/Org
  companyName: { type: String, default: '' },
  companyWebsite: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  isVerifiedOrg: { type: Boolean, default: false },
  // Location & Mode
  location: { type: String, default: '' },
  workMode: { type: String, enum: ['remote', 'on-site', 'hybrid', ''], default: '' },
  // Eligibility
  eligibility: { type: String, default: '' },
  educationRequired: { type: String, default: '' },
  experienceRequired: { type: String, default: '' },
  // Compensation
  salary: { type: String, default: '' },
  stipend: { type: String, default: '' },
  isFree: { type: Boolean, default: true },
  // Time
  deadline: { type: Date, default: null },
  startDate: { type: Date, default: null },
  duration: { type: String, default: '' },
  openings: { type: Number, default: 1 },
  // Employment
  employmentType: { type: String, enum: ['full-time', 'part-time', 'contract', 'freelance', ''], default: '' },
  // Extra for specific types
  extra: { type: mongoose.Schema.Types.Mixed, default: {} }, // mentorProfile, FDP schedule, etc.
  // Aggregates
  applicationCount: { type: Number, default: 0 },
  reportCount: { type: Number, default: 0 }
}, { timestamps: true });

opportunitySchema.index({ title: 'text', description: 'text', skills: 'text', companyName: 'text' });

// ─── Phase 5: Company Verification (Req 36) ───────────────────────────────────
export const verificationSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true, index: true },
  companyName: String,
  status: { type: String, enum: ['pending', 'verified', 'rejected', 'suspended'], default: 'pending', index: true },
  documentsUrls: [{ name: String, url: String, publicId: String }],
  registrationInfo: String,
  contactPerson: String,
  businessEmail: String,
  website: String,
  adminNotes: String,
  reviewedBy: String,
  reviewedAt: Date
}, { timestamps: true });

// ─── Phase 6: Applications (Req 44-47) ───────────────────────────────────────
export const applicationSchema = new mongoose.Schema({
  studentUid: { type: String, required: true, index: true },
  opportunityId: { type: String, required: true, index: true },
  creatorUid: { type: String, required: true }, // industry user who created opportunity
  // Application content
  coverLetter: { type: String, default: '' },
  resumeUrl: { type: String, default: null },
  portfolioUrl: { type: String, default: '' },
  answers: [{ question: String, answer: String }],
  // Status pipeline
  status: {
    type: String,
    enum: ['applied', 'under-review', 'shortlisted', 'interview', 'selected', 'rejected', 'withdrawn'],
    default: 'applied',
    index: true
  },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    note: String
  }],
  recruiterNotes: { type: String, default: '' }
}, { timestamps: true });

// ─── Phase 6: Interviews (Req 48) ────────────────────────────────────────────
export const interviewSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, index: true },
  studentUid: { type: String, required: true },
  creatorUid: { type: String, required: true },
  stage: { type: String, default: 'Round 1' },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, default: 60 },
  mode: { type: String, enum: ['video', 'phone', 'in-person', 'technical'], default: 'video' },
  meetingLink: { type: String, default: '' },
  interviewer: { type: String, default: '' },
  notes: { type: String, default: '' },
  result: { type: String, enum: ['pending', 'passed', 'failed', 'no-show'], default: 'pending' }
}, { timestamps: true });

// ─── Phase 6: Placements (Req 49) ────────────────────────────────────────────
export const placementSchema = new mongoose.Schema({
  studentUid: { type: String, required: true, unique: true, index: true },
  applicationId: { type: String, required: true },
  opportunityId: { type: String, required: true },
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  selectionDate: { type: Date, default: Date.now },
  joiningDate: { type: Date, default: null },
  status: { type: String, enum: ['selected', 'joined', 'declined', 'deferred'], default: 'selected' },
  packageOffered: { type: String, default: '' }
}, { timestamps: true });

// ─── Phase 7: Collaborations (Req 54-55) ─────────────────────────────────────
export const collaborationSchema = new mongoose.Schema({
  creatorUid: { type: String, required: true, index: true },
  type: { type: String, enum: ['consultancy', 'research', 'live_project'], required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  skills: { type: [String], default: [] },
  timeline: { type: String, default: '' },
  status: { type: String, enum: ['open', 'in-progress', 'completed', 'closed'], default: 'open' },
  partnerUid: { type: String, default: null }, // industry or faculty partner
  partnerName: { type: String, default: '' },
  funding: { type: String, default: '' },
  deliverables: { type: String, default: '' },
  outcome: { type: String, default: '' }
}, { timestamps: true });

// ─── Phase 9: Mock Interview Sessions (Req 66) ───────────────────────────────
export const mockInterviewSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  targetRole: { type: String, required: true },
  interviewType: { type: String, enum: ['technical', 'behavioral', 'mixed'], default: 'mixed' },
  qaHistory: [{
    question: String,
    type: String,
    answer: String,
    evaluation: mongoose.Schema.Types.Mixed
  }],
  finalFeedback: { type: mongoose.Schema.Types.Mixed, default: null },
  completed: { type: Boolean, default: false },
  voiceEnabled: { type: Boolean, default: false }
}, { timestamps: true });

// ─── Mongoose Model Exports ───────────────────────────────────────────────────
const getModel = (name, schema) => mongoose.models[name] || mongoose.model(name, schema);

export const MongoStudentExtProfile = getModel('StudentExtProfile', studentExtendedProfileSchema);
export const MongoPortfolio = getModel('Portfolio', portfolioSchema);
export const MongoStudentSkill = getModel('StudentSkill', studentSkillSchema);
export const MongoStudentEducation = getModel('StudentEducation', studentEducationSchema);
export const MongoStudentProject = getModel('StudentProject', studentProjectSchema);
export const MongoStudentCertification = getModel('StudentCertification', studentCertificationSchema);
export const MongoStudentAchievement = getModel('StudentAchievement', studentAchievementSchema);
export const MongoStudentDocument = getModel('StudentDocument', studentDocumentSchema);
export const MongoAssessmentDef = getModel('AssessmentDefinition', assessmentDefinitionSchema);
export const MongoAssessmentAttempt = getModel('AssessmentAttempt', assessmentAttemptSchema);
export const MongoSkillGap = getModel('SkillGap', skillGapSchema);
export const MongoOpportunity = getModel('Opportunity', opportunitySchema);
export const MongoVerification = getModel('Verification', verificationSchema);
export const MongoApplication = getModel('Application', applicationSchema);
export const MongoInterview = getModel('Interview', interviewSchema);
export const MongoPlacement = getModel('Placement', placementSchema);
export const MongoCollaboration = getModel('Collaboration', collaborationSchema);
export const MongoMockInterview = getModel('MockInterview', mockInterviewSchema);
