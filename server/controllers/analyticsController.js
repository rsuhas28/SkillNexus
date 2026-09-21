import {
  UserModel,
  StudentProfileModel,
  StudentSkillModel,
  OpportunityModel,
  ApplicationModel,
  PlacementModel,
  AssessmentAttemptModel
} from '../models/dbAdapter.js';

// ─── Institutional Dashboard Aggregated Stats (Req 60) ────────────────────────
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      studentsCount,
      industryCount,
      facultyCount,
      opportunitiesCount,
      applicationsCount,
      placementsCount,
      assessmentsCount
    ] = await Promise.all([
      UserModel.countDocuments({ role: 'student' }),
      UserModel.countDocuments({ role: 'industry' }),
      UserModel.countDocuments({ role: 'academician' }),
      OpportunityModel.countDocuments({ status: 'published' }),
      ApplicationModel.countDocuments(),
      PlacementModel.countDocuments(),
      AssessmentAttemptModel.countDocuments({ status: 'completed' })
    ]);

    res.json({
      success: true,
      data: {
        totalStudents: studentsCount,
        totalCompanies: industryCount,
        totalFaculty: facultyCount,
        activeOpportunities: opportunitiesCount,
        totalApplications: applicationsCount,
        totalPlacements: placementsCount,
        completedAssessments: assessmentsCount,
        placementRate: studentsCount > 0 ? Math.round((placementsCount / studentsCount) * 100) : 0
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Student Skill Analytics (Req 61) ─────────────────────────────────────────
export const getSkillAnalytics = async (req, res, next) => {
  try {
    const allSkills = await StudentSkillModel.find();
    const students = await StudentProfileModel.find();

    // Skill distribution by name
    const skillCounts = {};
    const categoryCounts = {};
    const proficiencyCounts = { Beginner: 0, Intermediate: 0, Advanced: 0, Expert: 0 };

    allSkills.forEach(s => {
      const name = s.skillName;
      const cat = s.category || 'Other';
      const prof = s.proficiency || 'Beginner';

      skillCounts[name] = (skillCounts[name] || 0) + 1;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      if (proficiencyCounts[prof] !== undefined) {
        proficiencyCounts[prof]++;
      }
    });

    const topSkills = Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const categoryDistribution = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const proficiencyDistribution = Object.entries(proficiencyCounts)
      .map(([level, count]) => ({ level, count }));

    // Department breakdown
    const deptCounts = {};
    students.forEach(st => {
      const dept = st.department || 'General';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });

    const departmentDistribution = Object.entries(deptCounts)
      .map(([department, studentCount]) => ({ department, studentCount }));

    res.json({
      success: true,
      data: {
        totalSkillsRecorded: allSkills.length,
        topSkills,
        categoryDistribution,
        proficiencyDistribution,
        departmentDistribution
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Internship Analytics (Req 62) ────────────────────────────────────────────
export const getInternshipAnalytics = async (req, res, next) => {
  try {
    const opps = await OpportunityModel.find({ type: 'internship' });
    const oppIds = opps.map(o => o._id);

    const apps = await ApplicationModel.find();
    const internshipApps = apps.filter(a => oppIds.includes(a.opportunityId));

    const statusCounts = { applied: 0, shortlisted: 0, interview: 0, selected: 0, rejected: 0 };
    internshipApps.forEach(a => {
      if (statusCounts[a.status] !== undefined) {
        statusCounts[a.status]++;
      }
    });

    // Company participation
    const compCounts = {};
    opps.forEach(o => {
      const c = o.companyName || 'Other';
      compCounts[c] = (compCounts[c] || 0) + 1;
    });

    const topCompanies = Object.entries(compCounts)
      .map(([company, openings]) => ({ company, openings }))
      .sort((a, b) => b.openings - a.openings)
      .slice(0, 6);

    res.json({
      success: true,
      data: {
        totalInternshipsPosted: opps.length,
        totalApplications: internshipApps.length,
        statusFunnel: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
        topHiringCompanies: topCompanies,
        conversionRate: internshipApps.length > 0 ? Math.round((statusCounts.selected / internshipApps.length) * 100) : 0
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Placement Analytics (Req 63) ─────────────────────────────────────────────
export const getPlacementAnalytics = async (req, res, next) => {
  try {
    const placements = await PlacementModel.find();
    const studentsCount = await UserModel.countDocuments({ role: 'student' });

    const companyCounts = {};
    const roleCounts = {};

    placements.forEach(p => {
      const c = p.companyName || 'General';
      const r = p.role || 'Software Engineer';
      companyCounts[c] = (companyCounts[c] || 0) + 1;
      roleCounts[r] = (roleCounts[r] || 0) + 1;
    });

    const topRecruiters = Object.entries(companyCounts)
      .map(([company, hires]) => ({ company, hires }))
      .sort((a, b) => b.hires - a.hires)
      .slice(0, 8);

    const topRoles = Object.entries(roleCounts)
      .map(([role, count]) => ({ role, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    res.json({
      success: true,
      data: {
        totalPlacements: placements.length,
        eligibleStudents: studentsCount,
        placementRate: studentsCount > 0 ? Math.round((placements.length / studentsCount) * 100) : 0,
        topRecruiters,
        topRoles
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Industry Skill-Demand Analytics (Req 64) ─────────────────────────────────
export const getSkillDemandAnalytics = async (req, res, next) => {
  try {
    const opportunities = await OpportunityModel.find({ status: 'published' });
    const studentSkills = await StudentSkillModel.find();

    const demandMap = {};
    opportunities.forEach(opp => {
      (opp.skills || []).forEach(skill => {
        demandMap[skill] = (demandMap[skill] || 0) + 1;
      });
    });

    const supplyMap = {};
    studentSkills.forEach(s => {
      supplyMap[s.skillName] = (supplyMap[s.skillName] || 0) + 1;
    });

    const skillComparison = Object.entries(demandMap)
      .map(([skill, demand]) => ({
        skill,
        industryDemand: demand,
        studentSupply: supplyMap[skill] || 0,
        gapIndex: Math.max(0, demand - (supplyMap[skill] || 0))
      }))
      .sort((a, b) => b.industryDemand - a.industryDemand)
      .slice(0, 12);

    res.json({
      success: true,
      data: {
        totalAnalyzedOpportunities: opportunities.length,
        skillDemandVsSupply: skillComparison
      }
    });
  } catch (err) {
    next(err);
  }
};
