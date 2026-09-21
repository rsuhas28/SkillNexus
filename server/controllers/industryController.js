import {
  IndustryProfileModel,
  OpportunityModel,
  VerificationModel,
  ApplicationModel,
  InterviewModel,
  PlacementModel,
  StudentProfileModel,
  StudentExtProfileModel,
  StudentSkillModel
} from '../models/dbAdapter.js';
import { uploadFile } from '../services/cloudinaryService.js';

// ─── Company Profile (Req 35) ─────────────────────────────────────────────────
export const getCompanyProfile = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const profile = await IndustryProfileModel.findOne({ uid });
    const verification = await VerificationModel.findOne({ uid });

    res.json({
      success: true,
      data: {
        profile,
        verificationStatus: verification?.status || 'unverified',
        verification
      }
    });
  } catch (err) {
    next(err);
  }
};

export const updateCompanyProfile = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const allowed = [
      'companyName', 'industryType', 'companySize', 'website',
      'location', 'description', 'contactPerson', 'designation',
      'contactPhone', 'linkedin', 'logoUrl'
    ];

    const updateData = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    await IndustryProfileModel.updateOne({ uid }, updateData);
    const updated = await IndustryProfileModel.findOne({ uid });

    res.json({ success: true, message: 'Company profile updated', data: updated });
  } catch (err) {
    next(err);
  }
};

// ─── Verification Workflow (Req 36) ───────────────────────────────────────────
export const submitVerification = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const { registrationInfo, contactPerson, businessEmail, website, companyName } = req.body;

    let docUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadRes = await uploadFile(file.buffer, {
          folder: `skillnexus/verifications/${uid}`
        });
        docUrls.push({
          name: file.originalname,
          url: uploadRes.secure_url || null,
          publicId: uploadRes.public_id
        });
      }
    }

    let verification = await VerificationModel.findOne({ uid });
    if (!verification) {
      verification = await VerificationModel.create({
        uid,
        companyName: companyName || req.user.email,
        registrationInfo: registrationInfo || '',
        contactPerson: contactPerson || '',
        businessEmail: businessEmail || req.user.email,
        website: website || '',
        documentsUrls: docUrls,
        status: 'pending'
      });
    } else {
      await VerificationModel.updateOne({ uid }, {
        companyName: companyName || verification.companyName,
        registrationInfo: registrationInfo || verification.registrationInfo,
        contactPerson: contactPerson || verification.contactPerson,
        businessEmail: businessEmail || verification.businessEmail,
        website: website || verification.website,
        documentsUrls: [...(verification.documentsUrls || []), ...docUrls],
        status: 'pending'
      });
      verification = await VerificationModel.findOne({ uid });
    }

    res.json({
      success: true,
      message: 'Verification request submitted for admin review',
      data: verification
    });
  } catch (err) {
    next(err);
  }
};

// ─── Opportunities CRUD (Req 37-42) ──────────────────────────────────────────
export const createOpportunity = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const {
      type, title, description, skills, location, workMode,
      eligibility, educationRequired, experienceRequired,
      salary, stipend, isFree, deadline, startDate, duration,
      openings, employmentType, extra, status
    } = req.body;

    if (!type || !title) {
      return res.status(400).json({ success: false, message: 'Type and Title are required' });
    }

    const companyProfile = await IndustryProfileModel.findOne({ uid });
    const verification = await VerificationModel.findOne({ uid, status: 'verified' });

    const opportunity = await OpportunityModel.create({
      creatorUid: uid,
      creatorRole: req.user.role,
      type,
      title,
      description: description || '',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      companyName: companyProfile?.companyName || req.user.email,
      companyWebsite: companyProfile?.website || '',
      contactEmail: req.user.email,
      isVerifiedOrg: Boolean(verification),
      location: location || '',
      workMode: workMode || 'remote',
      eligibility: eligibility || '',
      educationRequired: educationRequired || '',
      experienceRequired: experienceRequired || '',
      salary: salary || '',
      stipend: stipend || '',
      isFree: isFree !== undefined ? Boolean(isFree) : true,
      deadline: deadline ? new Date(deadline) : null,
      startDate: startDate ? new Date(startDate) : null,
      duration: duration || '',
      openings: Number(openings) || 1,
      employmentType: employmentType || 'full-time',
      extra: extra || {},
      status: status || 'published'
    });

    res.status(201).json({ success: true, message: 'Opportunity created successfully', data: opportunity });
  } catch (err) {
    next(err);
  }
};

export const getMyOpportunities = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const opportunities = await OpportunityModel.find({ creatorUid: uid }, { sort: { createdAt: -1 } });

    // Attach application counts
    const withCounts = await Promise.all(opportunities.map(async (opp) => {
      const appCount = await ApplicationModel.countDocuments({ opportunityId: opp._id });
      return { ...opp, applicationCount: appCount };
    }));

    res.json({ success: true, data: withCounts });
  } catch (err) {
    next(err);
  }
};

export const updateOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const opp = await OpportunityModel.findById(id);
    if (!opp || (opp.creatorUid !== uid && req.user.role !== 'admin')) {
      return res.status(404).json({ success: false, message: 'Opportunity not found or unauthorized' });
    }

    const data = { ...req.body };
    if (typeof data.skills === 'string') {
      data.skills = data.skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    await OpportunityModel.updateOne({ _id: id }, data);
    const updated = await OpportunityModel.findById(id);

    res.json({ success: true, message: 'Opportunity updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const opp = await OpportunityModel.findById(id);
    if (!opp || (opp.creatorUid !== uid && req.user.role !== 'admin')) {
      return res.status(404).json({ success: false, message: 'Opportunity not found or unauthorized' });
    }

    await OpportunityModel.deleteOne({ _id: id });
    res.json({ success: true, message: 'Opportunity deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── Recruiter Dashboard & Candidate Management (Req 46, 47, 48, 49) ───────────
export const getOpportunityApplications = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    const uid = req.user.uid;

    const opp = await OpportunityModel.findById(opportunityId);
    if (!opp || (opp.creatorUid !== uid && req.user.role !== 'admin')) {
      return res.status(404).json({ success: false, message: 'Opportunity not found or unauthorized' });
    }

    const applications = await ApplicationModel.find({ opportunityId }, { sort: { createdAt: -1 } });

    // Populate candidate details
    const populated = await Promise.all(applications.map(async (app) => {
      const studentProfile = await StudentProfileModel.findOne({ uid: app.studentUid });
      const studentExt = await StudentExtProfileModel.findOne({ uid: app.studentUid });
      const skills = await StudentSkillModel.find({ uid: app.studentUid });

      return {
        ...app,
        candidate: {
          fullName: studentProfile?.fullName,
          institution: studentProfile?.institution,
          department: studentProfile?.department,
          graduationYear: studentProfile?.graduationYear,
          headline: studentExt?.headline,
          photo: studentExt?.photo,
          skills: skills.map(s => s.skillName)
        }
      };
    }));

    res.json({ success: true, data: { opportunity: opp, applications: populated } });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status, note } = req.body;
    const uid = req.user.uid;

    const allowedStatuses = ['applied', 'under-review', 'shortlisted', 'interview', 'selected', 'rejected', 'withdrawn'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const app = await ApplicationModel.findById(applicationId);
    if (!app || (app.creatorUid !== uid && req.user.role !== 'admin')) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized' });
    }

    const history = app.statusHistory || [];
    history.push({
      status,
      changedAt: new Date().toISOString(),
      note: note || `Status updated to ${status}`
    });

    await ApplicationModel.updateOne({ _id: applicationId }, {
      status,
      statusHistory: history,
      recruiterNotes: note || app.recruiterNotes
    });

    // If status is selected, auto-create a placement record (Req 49)
    if (status === 'selected') {
      const opp = await OpportunityModel.findById(app.opportunityId);
      const existingPlacement = await PlacementModel.findOne({ studentUid: app.studentUid, applicationId });
      if (!existingPlacement) {
        await PlacementModel.create({
          studentUid: app.studentUid,
          applicationId,
          opportunityId: app.opportunityId,
          companyName: opp?.companyName || 'SkillNexus Partner',
          role: opp?.title || 'Selected Role',
          selectionDate: new Date().toISOString(),
          status: 'selected',
          packageOffered: opp?.salary || opp?.stipend || 'Competitive'
        });
      }
    }

    res.json({ success: true, message: `Application status updated to ${status}` });
  } catch (err) {
    next(err);
  }
};

export const scheduleInterview = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { stage, scheduledAt, durationMinutes, mode, meetingLink, interviewer, notes } = req.body;
    const uid = req.user.uid;

    const app = await ApplicationModel.findById(applicationId);
    if (!app || (app.creatorUid !== uid && req.user.role !== 'admin')) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized' });
    }

    const interview = await InterviewModel.create({
      applicationId,
      studentUid: app.studentUid,
      creatorUid: uid,
      stage: stage || 'Technical Round 1',
      scheduledAt: new Date(scheduledAt),
      durationMinutes: Number(durationMinutes) || 45,
      mode: mode || 'video',
      meetingLink: meetingLink || '',
      interviewer: interviewer || '',
      notes: notes || '',
      result: 'pending'
    });

    // Advance status to 'interview'
    await ApplicationModel.updateOne({ _id: applicationId }, { status: 'interview' });

    res.status(201).json({ success: true, message: 'Interview scheduled successfully', data: interview });
  } catch (err) {
    next(err);
  }
};
