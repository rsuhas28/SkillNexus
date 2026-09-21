import {
  AcademicianProfileModel,
  OpportunityModel,
  CollaborationModel,
  ApplicationModel
} from '../models/dbAdapter.js';

// ─── Faculty Profile (Req 50) ─────────────────────────────────────────────────
export const getFacultyProfile = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const profile = await AcademicianProfileModel.findOne({ uid });
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

export const updateFacultyProfile = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const allowed = [
      'fullName', 'institution', 'department', 'designation',
      'experienceYears', 'specialization', 'publications',
      'researchInterests', 'industryExperience', 'linkedin', 'googleScholar'
    ];

    const updateData = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    await AcademicianProfileModel.updateOne({ uid }, updateData);
    const updated = await AcademicianProfileModel.findOne({ uid });

    res.json({ success: true, message: 'Faculty profile updated', data: updated });
  } catch (err) {
    next(err);
  }
};

// ─── Faculty Opportunities (Req 51-53, 56-59) ─────────────────────────────────
export const getFacultyOpportunities = async (req, res, next) => {
  try {
    const { type } = req.query;
    const facultyTypes = [
      'faculty_internship', 'industrial_training', 'fdp',
      'workshop', 'guest_lecture', 'innovation_challenge', 'live_project'
    ];

    const query = {
      type: type && facultyTypes.includes(type) ? type : { $in: facultyTypes },
      status: 'published'
    };

    const opportunities = await OpportunityModel.find(query, { sort: { createdAt: -1 } });
    res.json({ success: true, data: opportunities });
  } catch (err) {
    next(err);
  }
};

// ─── Collaborations & Live Projects (Req 54-55, 59) ───────────────────────────
export const getCollaborations = async (req, res, next) => {
  try {
    const { type, status } = req.query;
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const list = await CollaborationModel.find(query, { sort: { createdAt: -1 } });
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

export const createCollaboration = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const { type, title, description, skills, timeline, funding, deliverables } = req.body;

    if (!type || !title) {
      return res.status(400).json({ success: false, message: 'Type and title are required' });
    }

    const collaboration = await CollaborationModel.create({
      creatorUid: uid,
      type,
      title,
      description: description || '',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      timeline: timeline || '',
      funding: funding || '',
      deliverables: deliverables || '',
      status: 'open',
      partnerUid: null,
      partnerName: ''
    });

    res.status(201).json({ success: true, message: 'Collaboration initiative published', data: collaboration });
  } catch (err) {
    next(err);
  }
};

export const joinCollaboration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const collab = await CollaborationModel.findById(id);
    if (!collab) {
      return res.status(404).json({ success: false, message: 'Collaboration initiative not found' });
    }

    if (collab.creatorUid === uid) {
      return res.status(400).json({ success: false, message: 'You cannot partner on your own initiative' });
    }

    await CollaborationModel.updateOne({ _id: id }, {
      partnerUid: uid,
      partnerName: req.user.email,
      status: 'in-progress'
    });

    res.json({ success: true, message: 'Successfully joined collaboration initiative' });
  } catch (err) {
    next(err);
  }
};

export const getMyCollaborations = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const list = await CollaborationModel.find({
      $or: [{ creatorUid: uid }, { partnerUid: uid }]
    }, { sort: { createdAt: -1 } });

    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};
