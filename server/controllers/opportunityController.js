import {
  OpportunityModel,
  ApplicationModel,
  InterviewModel,
  PlacementModel,
  StudentDocumentModel,
  StudentProfileModel,
  PortfolioModel
} from '../models/dbAdapter.js';

// ─── Search / Discover Opportunities (Req 43) ────────────────────────────────
export const searchOpportunities = async (req, res, next) => {
  try {
    const {
      keyword,
      type,
      workMode,
      location,
      verifiedOnly,
      page = 1,
      limit = 20
    } = req.query;

    const query = { status: 'published' };

    if (type) {
      query.type = type;
    }

    if (workMode) {
      query.workMode = workMode;
    }

    if (verifiedOnly === 'true') {
      query.isVerifiedOrg = true;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    let allItems = await OpportunityModel.find(query, { sort: { createdAt: -1 } });

    // Filter by keyword across title, description, companyName, skills
    if (keyword && keyword.trim()) {
      const kw = keyword.toLowerCase().trim();
      allItems = allItems.filter(item => {
        const titleMatch = (item.title || '').toLowerCase().includes(kw);
        const compMatch = (item.companyName || '').toLowerCase().includes(kw);
        const descMatch = (item.description || '').toLowerCase().includes(kw);
        const skillMatch = (item.skills || []).some(s => s.toLowerCase().includes(kw));
        return titleMatch || compMatch || descMatch || skillMatch;
      });
    }

    const total = allItems.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = allItems.slice(startIndex, startIndex + Number(limit));

    res.json({
      success: true,
      data: {
        opportunities: paginated,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get Single Opportunity Details ──────────────────────────────────────────
export const getOpportunityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opp = await OpportunityModel.findById(id);
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    // Check if user has already applied
    let hasApplied = false;
    let applicationData = null;

    if (req.user) {
      const existing = await ApplicationModel.findOne({
        studentUid: req.user.uid,
        opportunityId: id
      });
      if (existing) {
        hasApplied = true;
        applicationData = existing;
      }
    }

    res.json({
      success: true,
      data: {
        opportunity: opp,
        hasApplied,
        application: applicationData
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Apply to Opportunity (Req 44) ───────────────────────────────────────────
export const applyToOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { coverLetter, resumeUrl, portfolioUrl, answers } = req.body;
    const studentUid = req.user.uid;

    const opp = await OpportunityModel.findById(id);
    if (!opp || opp.status !== 'published') {
      return res.status(404).json({ success: false, message: 'Opportunity not open for applications' });
    }

    // Check deadline
    if (opp.deadline && new Date(opp.deadline) < new Date()) {
      return res.status(400).json({ success: false, message: 'Application deadline has passed' });
    }

    // Duplicate check
    const existing = await ApplicationModel.findOne({ studentUid, opportunityId: id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied to this opportunity' });
    }

    // Default primary resume and portfolio if not provided
    let finalResumeUrl = resumeUrl;
    if (!finalResumeUrl) {
      const primaryDoc = await StudentDocumentModel.findOne({ uid: studentUid, isPrimary: true });
      finalResumeUrl = primaryDoc?.fileUrl || null;
    }

    let finalPortfolioUrl = portfolioUrl;
    if (!finalPortfolioUrl) {
      const userPortfolio = await PortfolioModel.findOne({ uid: studentUid, isPublic: true });
      if (userPortfolio) {
        finalPortfolioUrl = `/portfolio/${userPortfolio.slug}`;
      }
    }

    const application = await ApplicationModel.create({
      studentUid,
      opportunityId: id,
      creatorUid: opp.creatorUid,
      coverLetter: coverLetter || '',
      resumeUrl: finalResumeUrl,
      portfolioUrl: finalPortfolioUrl || '',
      answers: answers || [],
      status: 'applied',
      statusHistory: [
        {
          status: 'applied',
          changedAt: new Date().toISOString(),
          note: 'Application submitted by candidate'
        }
      ]
    });

    // Increment application count
    await OpportunityModel.updateOne({ _id: id }, { $inc: { applicationCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (err) {
    next(err);
  }
};

// ─── Student Applications Tracking (Req 45) ──────────────────────────────────
export const getMyApplications = async (req, res, next) => {
  try {
    const studentUid = req.user.uid;
    const applications = await ApplicationModel.find({ studentUid }, { sort: { createdAt: -1 } });

    // Populate opportunity and interview details
    const populated = await Promise.all(applications.map(async (app) => {
      const opp = await OpportunityModel.findById(app.opportunityId);
      const interviews = await InterviewModel.find({ applicationId: app._id });
      const placement = await PlacementModel.findOne({ applicationId: app._id });

      return {
        ...app,
        opportunity: opp || { title: 'Opportunity (Archived)', companyName: 'N/A', type: 'job' },
        interviews,
        placement
      };
    }));

    res.json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// ─── Withdraw Application (Req 45) ───────────────────────────────────────────
export const withdrawApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentUid = req.user.uid;

    const app = await ApplicationModel.findById(id);
    if (!app || app.studentUid !== studentUid) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized' });
    }

    if (['selected', 'rejected'].includes(app.status)) {
      return res.status(400).json({ success: false, message: 'Cannot withdraw an application that has concluded' });
    }

    const history = app.statusHistory || [];
    history.push({
      status: 'withdrawn',
      changedAt: new Date().toISOString(),
      note: 'Withdrawn by student'
    });

    await ApplicationModel.updateOne({ _id: id }, {
      status: 'withdrawn',
      statusHistory: history
    });

    res.json({ success: true, message: 'Application withdrawn successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── Student Interviews (Req 48) ──────────────────────────────────────────────
export const getMyInterviews = async (req, res, next) => {
  try {
    const studentUid = req.user.uid;
    const interviews = await InterviewModel.find({ studentUid }, { sort: { scheduledAt: 1 } });

    const populated = await Promise.all(interviews.map(async (inv) => {
      const app = await ApplicationModel.findById(inv.applicationId);
      const opp = app ? await OpportunityModel.findById(app.opportunityId) : null;
      return {
        ...inv,
        opportunity: opp
      };
    }));

    res.json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// ─── Student Placements / Offers (Req 49) ─────────────────────────────────────
export const getMyPlacements = async (req, res, next) => {
  try {
    const studentUid = req.user.uid;
    const placements = await PlacementModel.find({ studentUid }, { sort: { selectionDate: -1 } });
    res.json({ success: true, data: placements });
  } catch (err) {
    next(err);
  }
};

// ─── Report Opportunity (Req 70) ─────────────────────────────────────────────
export const reportOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, details } = req.body;

    const opp = await OpportunityModel.findById(id);
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    await OpportunityModel.updateOne({ _id: id }, { $inc: { reportCount: 1 } });

    res.json({
      success: true,
      message: 'Report submitted. Our safety team will review this opportunity.'
    });
  } catch (err) {
    next(err);
  }
};
