import { isMongoConnected, getStore, saveStore } from '../config/db.js';
import {
  MongoUser,
  MongoStudentProfile,
  MongoIndustryProfile,
  MongoAcademicianProfile,
  MongoInstitutionProfile
} from './schemas.js';
import {
  MongoStudentExtProfile,
  MongoPortfolio,
  MongoStudentSkill,
  MongoStudentEducation,
  MongoStudentProject,
  MongoStudentCertification,
  MongoStudentAchievement,
  MongoStudentDocument,
  MongoAssessmentDef,
  MongoAssessmentAttempt,
  MongoSkillGap,
  MongoOpportunity,
  MongoVerification,
  MongoApplication,
  MongoInterview,
  MongoPlacement,
  MongoCollaboration,
  MongoMockInterview
} from './newSchemas.js';

// ─── Generic JSON Store Model Factory ────────────────────────────────────────
function createJsonModel(collectionKey) {
  return {
    find: async (query = {}, opts = {}) => {
      const store = getStore();
      let items = (store[collectionKey] || []).filter(item => matchQuery(item, query));
      if (opts.sort) {
        const [field, dir] = Object.entries(opts.sort)[0];
        items = items.sort((a, b) => {
          if (dir === -1 || dir === 'desc') return new Date(b[field] || 0) - new Date(a[field] || 0);
          return new Date(a[field] || 0) - new Date(b[field] || 0);
        });
      }
      if (opts.skip) items = items.slice(opts.skip);
      if (opts.limit) items = items.slice(0, opts.limit);
      return items;
    },
    findOne: async (query = {}) => {
      const store = getStore();
      const items = store[collectionKey] || [];
      const found = items.find(item => matchQuery(item, query));
      return found ? { ...found } : null;
    },
    findById: async (id) => {
      const store = getStore();
      const items = store[collectionKey] || [];
      const found = items.find(item => item._id === id || item.uid === id || item.id === id);
      return found ? { ...found } : null;
    },
    create: async (doc) => {
      const store = getStore();
      if (!store[collectionKey]) store[collectionKey] = [];
      const newDoc = {
        _id: 'id_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
        ...doc,
        createdAt: doc.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      store[collectionKey].push(newDoc);
      saveStore(store);
      return { ...newDoc };
    },
    updateOne: async (query, update) => {
      const store = getStore();
      const items = store[collectionKey] || [];
      const index = items.findIndex(item => matchQuery(item, query));
      if (index === -1) return { matchedCount: 0, modifiedCount: 0 };
      const setFields = update.$set ? update.$set : update;
      items[index] = { ...items[index], ...setFields, updatedAt: new Date().toISOString() };
      saveStore(store);
      return { matchedCount: 1, modifiedCount: 1 };
    },
    findByIdAndUpdate: async (id, update, options = {}) => {
      const store = getStore();
      const items = store[collectionKey] || [];
      const index = items.findIndex(item => item._id === id || item.uid === id || item.id === id);
      if (index === -1) return options.upsert ? await createJsonModel(collectionKey).create({ _id: id, ...update.$set }) : null;
      const setFields = update.$set ? update.$set : update;
      items[index] = { ...items[index], ...setFields, updatedAt: new Date().toISOString() };
      saveStore(store);
      return { ...items[index] };
    },
    deleteOne: async (query) => {
      const store = getStore();
      const items = store[collectionKey] || [];
      const index = items.findIndex(item => matchQuery(item, query));
      if (index === -1) return { deletedCount: 0 };
      items.splice(index, 1);
      saveStore(store);
      return { deletedCount: 1 };
    },
    deleteMany: async (query) => {
      const store = getStore();
      const items = store[collectionKey] || [];
      const before = items.length;
      store[collectionKey] = items.filter(item => !matchQuery(item, query));
      saveStore(store);
      return { deletedCount: before - store[collectionKey].length };
    },
    countDocuments: async (query = {}) => {
      const store = getStore();
      const items = store[collectionKey] || [];
      return items.filter(item => matchQuery(item, query)).length;
    },
    aggregate: async (pipeline) => {
      // Basic aggregation: group + count for analytics fallback
      const store = getStore();
      const items = store[collectionKey] || [];
      // Simple fallback — return all items for JS-side aggregation
      return items;
    }
  };
}

function matchQuery(item, query) {
  for (const [key, value] of Object.entries(query)) {
    if (key === '$or') {
      if (!value.some(subQ => matchQuery(item, subQ))) return false;
      continue;
    }
    if (key === '$and') {
      if (!value.every(subQ => matchQuery(item, subQ))) return false;
      continue;
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (value.$ne !== undefined && item[key] === value.$ne) return false;
      if (value.$in !== undefined && !value.$in.includes(item[key])) return false;
      if (value.$nin !== undefined && value.$nin.includes(item[key])) return false;
      if (value.$regex !== undefined) {
        const regex = typeof value.$regex === 'string' ? new RegExp(value.$regex, value.$options || 'i') : value.$regex;
        if (!regex.test(item[key] || '')) return false;
      }
      if (value.$gte !== undefined && !(item[key] >= value.$gte)) return false;
      if (value.$lte !== undefined && !(item[key] <= value.$lte)) return false;
    } else {
      if (item[key] !== value) return false;
    }
  }
  return true;
}

// ─── Model Adapter Factory ────────────────────────────────────────────────────
function makeAdapter(mongoModel, collectionKey) {
  const jsonModel = createJsonModel(collectionKey);
  return {
    find: (...a) => isMongoConnected ? mongoModel.find(...a) : jsonModel.find(...a),
    findOne: (...a) => isMongoConnected ? mongoModel.findOne(...a) : jsonModel.findOne(...a),
    findById: (...a) => isMongoConnected ? mongoModel.findById(...a) : jsonModel.findById(...a),
    create: (...a) => isMongoConnected ? mongoModel.create(...a) : jsonModel.create(...a),
    updateOne: (...a) => isMongoConnected ? mongoModel.updateOne(...a) : jsonModel.updateOne(...a),
    findByIdAndUpdate: (...a) => isMongoConnected ? mongoModel.findByIdAndUpdate(...a) : jsonModel.findByIdAndUpdate(...a),
    deleteOne: (...a) => isMongoConnected ? mongoModel.deleteOne(...a) : jsonModel.deleteOne(...a),
    deleteMany: (...a) => isMongoConnected ? mongoModel.deleteMany(...a) : jsonModel.deleteMany(...a),
    countDocuments: (...a) => isMongoConnected ? mongoModel.countDocuments(...a) : jsonModel.countDocuments(...a),
    aggregate: (...a) => isMongoConnected ? mongoModel.aggregate(...a) : jsonModel.aggregate(...a)
  };
}

// ─── Phase 1 Models (Preserved) ──────────────────────────────────────────────
export const UserModel = makeAdapter(MongoUser, 'users');
export const StudentProfileModel = makeAdapter(MongoStudentProfile, 'student_profiles');
export const IndustryProfileModel = makeAdapter(MongoIndustryProfile, 'industry_profiles');
export const AcademicianProfileModel = makeAdapter(MongoAcademicianProfile, 'academician_profiles');
export const InstitutionProfileModel = makeAdapter(MongoInstitutionProfile, 'institution_profiles');

// ─── Phase 2 Models ───────────────────────────────────────────────────────────
export const StudentExtProfileModel = makeAdapter(MongoStudentExtProfile, 'student_ext_profiles');
export const PortfolioModel = makeAdapter(MongoPortfolio, 'portfolios');
export const StudentSkillModel = makeAdapter(MongoStudentSkill, 'student_skills');
export const StudentEducationModel = makeAdapter(MongoStudentEducation, 'student_education');
export const StudentProjectModel = makeAdapter(MongoStudentProject, 'student_projects');
export const StudentCertificationModel = makeAdapter(MongoStudentCertification, 'student_certifications');
export const StudentAchievementModel = makeAdapter(MongoStudentAchievement, 'student_achievements');
export const StudentDocumentModel = makeAdapter(MongoStudentDocument, 'student_documents');

// ─── Phase 3 Models ───────────────────────────────────────────────────────────
export const AssessmentDefModel = makeAdapter(MongoAssessmentDef, 'assessment_definitions');
export const AssessmentAttemptModel = makeAdapter(MongoAssessmentAttempt, 'assessment_attempts');
export const SkillGapModel = makeAdapter(MongoSkillGap, 'skill_gaps');

// ─── Phase 5-6 Models ────────────────────────────────────────────────────────
export const OpportunityModel = makeAdapter(MongoOpportunity, 'opportunities');
export const VerificationModel = makeAdapter(MongoVerification, 'verifications');
export const ApplicationModel = makeAdapter(MongoApplication, 'applications');
export const InterviewModel = makeAdapter(MongoInterview, 'interviews');
export const PlacementModel = makeAdapter(MongoPlacement, 'placements');

// ─── Phase 7 Models ───────────────────────────────────────────────────────────
export const CollaborationModel = makeAdapter(MongoCollaboration, 'collaborations');

// ─── Phase 9 Models ───────────────────────────────────────────────────────────
export const MockInterviewModel = makeAdapter(MongoMockInterview, 'mock_interviews');
