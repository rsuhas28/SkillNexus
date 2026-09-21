import {
  UserModel,
  StudentProfileModel,
  StudentExtProfileModel,
  PortfolioModel,
  StudentSkillModel,
  StudentEducationModel,
  StudentProjectModel,
  StudentCertificationModel,
  StudentAchievementModel,
  StudentDocumentModel,
  AssessmentAttemptModel
} from '../models/dbAdapter.js';
import { uploadFile, deleteFile } from '../services/cloudinaryService.js';

// Helper to calculate completion percentage
const calculateCompletion = (profile, extProfile, skillsCount, eduCount, projCount, docsCount) => {
  let score = 0;
  // Basic info (20%)
  if (profile?.fullName) score += 5;
  if (profile?.institution) score += 5;
  if (profile?.department) score += 5;
  if (profile?.graduationYear) score += 5;

  // Extended Profile (30%)
  if (extProfile?.headline) score += 5;
  if (extProfile?.about) score += 5;
  if (extProfile?.phone) score += 5;
  if (extProfile?.location) score += 5;
  if (extProfile?.linkedin || extProfile?.github) score += 5;
  if (extProfile?.photo) score += 5;

  // Key Entities (50%)
  if (skillsCount > 0) score += 15;
  if (eduCount > 0) score += 15;
  if (projCount > 0) score += 10;
  if (docsCount > 0) score += 10;

  return Math.min(100, score);
};

// ─── Extended Profile (Req 14) ────────────────────────────────────────────────
export const getStudentProfile = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const user = await UserModel.findById(uid);
    const profile = await StudentProfileModel.findOne({ uid });
    let extProfile = await StudentExtProfileModel.findOne({ uid });

    if (!extProfile) {
      extProfile = await StudentExtProfileModel.create({ uid });
    }

    const [skills, education, projects, documents] = await Promise.all([
      StudentSkillModel.find({ uid }),
      StudentEducationModel.find({ uid }),
      StudentProjectModel.find({ uid }),
      StudentDocumentModel.find({ uid })
    ]);

    const completion = calculateCompletion(
      profile,
      extProfile,
      skills.length,
      education.length,
      projects.length,
      documents.length
    );

    if (extProfile.completionPercentage !== completion) {
      await StudentExtProfileModel.updateOne({ uid }, { completionPercentage: completion });
      extProfile.completionPercentage = completion;
    }

    res.json({
      success: true,
      data: {
        user: {
          uid: user?.uid || uid,
          email: user?.email,
          role: user?.role,
          emailVerified: user?.emailVerified
        },
        profile,
        extendedProfile: extProfile,
        completionPercentage: completion,
        counts: {
          skills: skills.length,
          education: education.length,
          projects: projects.length,
          documents: documents.length
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const updateStudentProfile = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const allowedFields = [
      'headline', 'dateOfBirth', 'gender', 'phone', 'location',
      'about', 'careerObjective', 'linkedin', 'github', 'portfolio',
      'preferredRoles', 'preferredIndustries', 'preferredLocations', 'availability'
    ];

    const updateData = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    let extProfile = await StudentExtProfileModel.findOne({ uid });
    if (!extProfile) {
      extProfile = await StudentExtProfileModel.create({ uid, ...updateData });
    } else {
      await StudentExtProfileModel.updateOne({ uid }, updateData);
      extProfile = await StudentExtProfileModel.findOne({ uid });
    }

    // Also update base profile fields if provided
    const baseFields = ['fullName', 'institution', 'department', 'degree', 'graduationYear', 'rollNumber'];
    const baseUpdate = {};
    for (const key of baseFields) {
      if (req.body[key] !== undefined) {
        baseUpdate[key] = req.body[key];
      }
    }
    if (Object.keys(baseUpdate).length > 0) {
      await StudentProfileModel.updateOne({ uid }, baseUpdate);
    }

    // Recalculate completion
    const [profile, skills, education, projects, documents] = await Promise.all([
      StudentProfileModel.findOne({ uid }),
      StudentSkillModel.find({ uid }),
      StudentEducationModel.find({ uid }),
      StudentProjectModel.find({ uid }),
      StudentDocumentModel.find({ uid })
    ]);

    const completion = calculateCompletion(profile, extProfile, skills.length, education.length, projects.length, documents.length);
    await StudentExtProfileModel.updateOne({ uid }, { completionPercentage: completion });
    extProfile.completionPercentage = completion;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        extendedProfile: extProfile,
        completionPercentage: completion
      }
    });
  } catch (err) {
    next(err);
  }
};

export const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const uid = req.user.uid;
    const uploadResult = await uploadFile(req.file.buffer, {
      folder: `skillnexus/students/${uid}/photo`,
      resource_type: 'image'
    });

    const photoUrl = uploadResult.secure_url || '/placeholder-avatar.png';
    await StudentExtProfileModel.updateOne({ uid }, {
      photo: photoUrl,
      photoPublicId: uploadResult.public_id
    });

    res.json({
      success: true,
      message: uploadResult._warning ? 'Photo uploaded in local preview mode' : 'Photo uploaded successfully',
      data: {
        photoUrl,
        publicId: uploadResult.public_id,
        warning: uploadResult._warning
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Digital Portfolio (Req 15) ───────────────────────────────────────────────
export const getPortfolio = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    let portfolio = await PortfolioModel.findOne({ uid });

    if (!portfolio) {
      const defaultSections = [
        { id: 'about', type: 'about', visible: true, order: 1 },
        { id: 'skills', type: 'skills', visible: true, order: 2 },
        { id: 'projects', type: 'projects', visible: true, order: 3 },
        { id: 'education', type: 'education', visible: true, order: 4 },
        { id: 'certifications', type: 'certifications', visible: true, order: 5 },
        { id: 'achievements', type: 'achievements', visible: true, order: 6 },
        { id: 'resume', type: 'resume', visible: true, order: 7 }
      ];
      portfolio = await PortfolioModel.create({
        uid,
        slug: 'portfolio-' + uid.slice(0, 8),
        isPublic: false,
        sections: defaultSections,
        customLinks: []
      });
    }

    res.json({ success: true, data: portfolio });
  } catch (err) {
    next(err);
  }
};

export const updatePortfolio = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const { slug, isPublic, sections, customLinks } = req.body;
    const updateData = {};

    if (slug !== undefined) {
      // Check slug uniqueness
      const existing = await PortfolioModel.findOne({ slug });
      if (existing && existing.uid !== uid) {
        return res.status(400).json({ success: false, message: 'Portfolio slug is already taken' });
      }
      updateData.slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    }
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (sections !== undefined) updateData.sections = sections;
    if (customLinks !== undefined) updateData.customLinks = customLinks;

    await PortfolioModel.updateOne({ uid }, updateData);
    const updated = await PortfolioModel.findOne({ uid });

    res.json({ success: true, message: 'Portfolio settings updated', data: updated });
  } catch (err) {
    next(err);
  }
};

export const getPublicPortfolio = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let portfolio = await PortfolioModel.findOne({ slug, isPublic: true });
    if (!portfolio) {
      // Also try by user id
      portfolio = await PortfolioModel.findOne({ uid: slug, isPublic: true });
    }

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Public portfolio not found or private' });
    }

    const uid = portfolio.uid;
    const [profile, extProfile, skills, education, projects, certs, achievements] = await Promise.all([
      StudentProfileModel.findOne({ uid }),
      StudentExtProfileModel.findOne({ uid }),
      StudentSkillModel.find({ uid }),
      StudentEducationModel.find({ uid }),
      StudentProjectModel.find({ uid }),
      StudentCertificationModel.find({ uid }),
      StudentAchievementModel.find({ uid })
    ]);

    res.json({
      success: true,
      data: {
        portfolio,
        profile: {
          fullName: profile?.fullName,
          institution: profile?.institution,
          department: profile?.department,
          degree: profile?.degree,
          graduationYear: profile?.graduationYear,
          headline: extProfile?.headline,
          photo: extProfile?.photo,
          location: extProfile?.location,
          about: extProfile?.about,
          linkedin: extProfile?.linkedin,
          github: extProfile?.github,
          portfolio: extProfile?.portfolio
        },
        skills,
        education,
        projects,
        certifications: certs,
        achievements
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Skills (Req 16) ──────────────────────────────────────────────────────────
export const getSkills = async (req, res, next) => {
  try {
    const skills = await StudentSkillModel.find({ uid: req.user.uid });
    res.json({ success: true, data: skills });
  } catch (err) {
    next(err);
  }
};

export const addSkill = async (req, res, next) => {
  try {
    const { skillName, category, proficiency, evidence, yearsExperience, monthsExperience, source } = req.body;
    if (!skillName) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    const existing = await StudentSkillModel.findOne({
      uid: req.user.uid,
      skillName: { $regex: `^${skillName.trim()}$`, $options: 'i' }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Skill already exists in your profile' });
    }

    const newSkill = await StudentSkillModel.create({
      uid: req.user.uid,
      skillName: skillName.trim(),
      category: category || 'Other',
      proficiency: proficiency || 'Beginner',
      evidence: evidence || '',
      yearsExperience: Number(yearsExperience) || 0,
      monthsExperience: Number(monthsExperience) || 0,
      source: source || 'self-declared'
    });

    res.status(201).json({ success: true, message: 'Skill added successfully', data: newSkill });
  } catch (err) {
    next(err);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { skillName, category, proficiency, evidence, yearsExperience, monthsExperience } = req.body;

    const skill = await StudentSkillModel.findById(id);
    if (!skill || skill.uid !== req.user.uid) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    const updateData = {};
    if (skillName) updateData.skillName = skillName.trim();
    if (category) updateData.category = category;
    if (proficiency) updateData.proficiency = proficiency;
    if (evidence !== undefined) updateData.evidence = evidence;
    if (yearsExperience !== undefined) updateData.yearsExperience = Number(yearsExperience);
    if (monthsExperience !== undefined) updateData.monthsExperience = Number(monthsExperience);

    await StudentSkillModel.updateOne({ _id: id }, updateData);
    const updated = await StudentSkillModel.findById(id);

    res.json({ success: true, message: 'Skill updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await StudentSkillModel.findById(id);
    if (!skill || skill.uid !== req.user.uid) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    await StudentSkillModel.deleteOne({ _id: id });
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── Education (Req 17) ───────────────────────────────────────────────────────
export const getEducation = async (req, res, next) => {
  try {
    const education = await StudentEducationModel.find({ uid: req.user.uid });
    res.json({ success: true, data: education });
  } catch (err) {
    next(err);
  }
};

export const addEducation = async (req, res, next) => {
  try {
    const { institution, degree, specialization, startYear, endYear, isCurrent, cgpa, location, description } = req.body;
    if (!institution || !degree || !startYear) {
      return res.status(400).json({ success: false, message: 'Institution, degree, and start year are required' });
    }

    const record = await StudentEducationModel.create({
      uid: req.user.uid,
      institution,
      degree,
      specialization: specialization || '',
      startYear,
      endYear: isCurrent ? 'Present' : (endYear || ''),
      isCurrent: Boolean(isCurrent),
      cgpa: cgpa || '',
      location: location || '',
      description: description || ''
    });

    res.status(201).json({ success: true, message: 'Education added successfully', data: record });
  } catch (err) {
    next(err);
  }
};

export const updateEducation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await StudentEducationModel.findById(id);
    if (!record || record.uid !== req.user.uid) {
      return res.status(404).json({ success: false, message: 'Education record not found' });
    }

    await StudentEducationModel.updateOne({ _id: id }, req.body);
    const updated = await StudentEducationModel.findById(id);
    res.json({ success: true, message: 'Education updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteEducation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await StudentEducationModel.findById(id);
    if (!record || record.uid !== req.user.uid) {
      return res.status(404).json({ success: false, message: 'Education record not found' });
    }
    await StudentEducationModel.deleteOne({ _id: id });
    res.json({ success: true, message: 'Education deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── Projects (Req 18) ────────────────────────────────────────────────────────
export const getProjects = async (req, res, next) => {
  try {
    const projects = await StudentProjectModel.find({ uid: req.user.uid });
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
};

export const addProject = async (req, res, next) => {
  try {
    const {
      title, description, problemSolved, technologies, skillsUsed,
      role, teamSize, startDate, endDate, projectUrl, githubUrl, demoUrl, isPortfolioHighlight
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Project title is required' });
    }

    const project = await StudentProjectModel.create({
      uid: req.user.uid,
      title,
      description: description || '',
      problemSolved: problemSolved || '',
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map(s => s.trim()) : []),
      skillsUsed: Array.isArray(skillsUsed) ? skillsUsed : (skillsUsed ? skillsUsed.split(',').map(s => s.trim()) : []),
      role: role || '',
      teamSize: Number(teamSize) || 1,
      startDate: startDate || '',
      endDate: endDate || '',
      projectUrl: projectUrl || '',
      githubUrl: githubUrl || '',
      demoUrl: demoUrl || '',
      isPortfolioHighlight: Boolean(isPortfolioHighlight),
      images: []
    });

    res.status(201).json({ success: true, message: 'Project added successfully', data: project });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await StudentProjectModel.findById(id);
    if (!project || project.uid !== req.user.uid) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const data = { ...req.body };
    if (typeof data.technologies === 'string') {
      data.technologies = data.technologies.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (typeof data.skillsUsed === 'string') {
      data.skillsUsed = data.skillsUsed.split(',').map(s => s.trim()).filter(Boolean);
    }

    await StudentProjectModel.updateOne({ _id: id }, data);
    const updated = await StudentProjectModel.findById(id);
    res.json({ success: true, message: 'Project updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await StudentProjectModel.findById(id);
    if (!project || project.uid !== req.user.uid) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    await StudentProjectModel.deleteOne({ _id: id });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── Certifications (Req 19) ──────────────────────────────────────────────────
export const getCertifications = async (req, res, next) => {
  try {
    const certs = await StudentCertificationModel.find({ uid: req.user.uid });
    res.json({ success: true, data: certs });
  } catch (err) {
    next(err);
  }
};

export const addCertification = async (req, res, next) => {
  try {
    const { name, issuingOrg, issueDate, expiryDate, credentialId, credentialUrl, skillsCovered } = req.body;
    if (!name || !issuingOrg) {
      return res.status(400).json({ success: false, message: 'Certification name and issuing organization are required' });
    }

    let documentUrl = null;
    let documentPublicId = null;

    if (req.file) {
      const uploadRes = await uploadFile(req.file.buffer, {
        folder: `skillnexus/students/${req.user.uid}/certs`
      });
      documentUrl = uploadRes.secure_url;
      documentPublicId = uploadRes.public_id;
    }

    const cert = await StudentCertificationModel.create({
      uid: req.user.uid,
      name,
      issuingOrg,
      issueDate: issueDate || '',
      expiryDate: expiryDate || '',
      credentialId: credentialId || '',
      credentialUrl: credentialUrl || '',
      documentUrl,
      documentPublicId,
      skillsCovered: Array.isArray(skillsCovered) ? skillsCovered : (skillsCovered ? skillsCovered.split(',').map(s => s.trim()) : [])
    });

    res.status(201).json({ success: true, message: 'Certification added successfully', data: cert });
  } catch (err) {
    next(err);
  }
};

export const updateCertification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cert = await StudentCertificationModel.findById(id);
    if (!cert || cert.uid !== req.user.uid) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }

    const data = { ...req.body };
    if (typeof data.skillsCovered === 'string') {
      data.skillsCovered = data.skillsCovered.split(',').map(s => s.trim()).filter(Boolean);
    }

    if (req.file) {
      const uploadRes = await uploadFile(req.file.buffer, {
        folder: `skillnexus/students/${req.user.uid}/certs`
      });
      data.documentUrl = uploadRes.secure_url;
      data.documentPublicId = uploadRes.public_id;
    }

    await StudentCertificationModel.updateOne({ _id: id }, data);
    const updated = await StudentCertificationModel.findById(id);
    res.json({ success: true, message: 'Certification updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteCertification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cert = await StudentCertificationModel.findById(id);
    if (!cert || cert.uid !== req.user.uid) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }
    if (cert.documentPublicId) {
      await deleteFile(cert.documentPublicId);
    }
    await StudentCertificationModel.deleteOne({ _id: id });
    res.json({ success: true, message: 'Certification deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── Achievements (Req 20) ────────────────────────────────────────────────────
export const getAchievements = async (req, res, next) => {
  try {
    const achievements = await StudentAchievementModel.find({ uid: req.user.uid });
    res.json({ success: true, data: achievements });
  } catch (err) {
    next(err);
  }
};

export const addAchievement = async (req, res, next) => {
  try {
    const { title, organization, date, description, category, link } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Achievement title is required' });
    }

    const achievement = await StudentAchievementModel.create({
      uid: req.user.uid,
      title,
      organization: organization || '',
      date: date || '',
      description: description || '',
      category: category || 'Other',
      link: link || ''
    });

    res.status(201).json({ success: true, message: 'Achievement added successfully', data: achievement });
  } catch (err) {
    next(err);
  }
};

export const updateAchievement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const achievement = await StudentAchievementModel.findById(id);
    if (!achievement || achievement.uid !== req.user.uid) {
      return res.status(404).json({ success: false, message: 'Achievement not found' });
    }
    await StudentAchievementModel.updateOne({ _id: id }, req.body);
    const updated = await StudentAchievementModel.findById(id);
    res.json({ success: true, message: 'Achievement updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteAchievement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const achievement = await StudentAchievementModel.findById(id);
    if (!achievement || achievement.uid !== req.user.uid) {
      return res.status(404).json({ success: false, message: 'Achievement not found' });
    }
    await StudentAchievementModel.deleteOne({ _id: id });
    res.json({ success: true, message: 'Achievement deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── Documents / Resume (Req 21) ──────────────────────────────────────────────
export const getDocuments = async (req, res, next) => {
  try {
    const documents = await StudentDocumentModel.find({ uid: req.user.uid });
    res.json({ success: true, data: documents });
  } catch (err) {
    next(err);
  }
};

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const uid = req.user.uid;
    const { name, type, isPrimary } = req.body;

    const uploadRes = await uploadFile(req.file.buffer, {
      folder: `skillnexus/students/${uid}/docs`,
      resource_type: 'raw',
      original_filename: req.file.originalname
    });

    const isPrimaryBool = isPrimary === 'true' || isPrimary === true;
    if (isPrimaryBool) {
      // Unset existing primary documents for this user
      await StudentDocumentModel.updateMany({ uid, type: type || 'resume' }, { isPrimary: false });
    }

    const doc = await StudentDocumentModel.create({
      uid,
      name: name || req.file.originalname,
      type: type || 'resume',
      fileUrl: uploadRes.secure_url || null,
      publicId: uploadRes.public_id,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      isPrimary: isPrimaryBool,
      localMode: Boolean(uploadRes._localMode)
    });

    res.status(201).json({
      success: true,
      message: uploadRes._warning ? 'Document recorded in local preview mode' : 'Document uploaded successfully',
      data: doc,
      warning: uploadRes._warning
    });
  } catch (err) {
    next(err);
  }
};

export const setPrimaryDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await StudentDocumentModel.findById(id);
    if (!doc || doc.uid !== req.user.uid) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Reset others of same type
    const allSameType = await StudentDocumentModel.find({ uid: req.user.uid, type: doc.type });
    for (const item of allSameType) {
      await StudentDocumentModel.updateOne({ _id: item._id }, { isPrimary: item._id === id });
    }

    res.json({ success: true, message: 'Primary document set successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await StudentDocumentModel.findById(id);
    if (!doc || doc.uid !== req.user.uid) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (doc.publicId) {
      await deleteFile(doc.publicId);
    }
    await StudentDocumentModel.deleteOne({ _id: id });
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── Unified Skill Profile (Req 27) ───────────────────────────────────────────
export const getUnifiedSkillProfile = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const [profile, extProfile, skills, education, projects, certs, attempts] = await Promise.all([
      StudentProfileModel.findOne({ uid }),
      StudentExtProfileModel.findOne({ uid }),
      StudentSkillModel.find({ uid }),
      StudentEducationModel.find({ uid }),
      StudentProjectModel.find({ uid }),
      StudentCertificationModel.find({ uid }),
      AssessmentAttemptModel.find({ uid, status: 'completed' })
    ]);

    // Group skills by category
    const categorized = {};
    skills.forEach(skill => {
      const cat = skill.category || 'Other';
      if (!categorized[cat]) categorized[cat] = [];
      categorized[cat].push(skill);
    });

    // Extract assessment-verified skills
    const assessedSkills = [];
    attempts.forEach(att => {
      if (att.topicScores) {
        Object.entries(att.topicScores).forEach(([topic, score]) => {
          assessedSkills.push({
            topic,
            score: score.percentage,
            assessmentType: att.type,
            level: score.percentage >= 80 ? 'Advanced' : score.percentage >= 60 ? 'Intermediate' : 'Beginner',
            date: att.completedAt
          });
        });
      }
    });

    res.json({
      success: true,
      data: {
        summary: {
          fullName: profile?.fullName,
          department: profile?.department,
          institution: profile?.institution,
          headline: extProfile?.headline,
          totalSkills: skills.length,
          totalAssessments: attempts.length,
          totalProjects: projects.length,
          totalCertifications: certs.length
        },
        skills,
        categorizedSkills: categorized,
        assessedSkills,
        recentAssessments: attempts.slice(-5),
        projects,
        certifications: certs,
        education
      }
    });
  } catch (err) {
    next(err);
  }
};
