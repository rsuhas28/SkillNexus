import {
  isAIConfigured,
  extractSkillMapping,
  generateCareerGuidance,
  generateLearningRecommendations,
  getAIGuideResponse,
  explainOpportunityMatch,
  generateInterviewPrep,
  getMockInterviewQuestion,
  evaluateMockAnswer,
  generateMockInterviewFinalFeedback,
  generatePrepPlan,
  analyzeOpportunityTrust
} from '../services/aiService.js';
import {
  StudentProfileModel,
  StudentExtProfileModel,
  StudentSkillModel,
  StudentEducationModel,
  StudentProjectModel,
  OpportunityModel,
  VerificationModel,
  MockInterviewModel
} from '../models/dbAdapter.js';

// Status check
export const getAIStatus = (req, res) => {
  res.json({
    success: true,
    configured: isAIConfigured(),
    message: isAIConfigured()
      ? 'Gemini AI service active'
      : 'Gemini AI service in fallback mode (set GEMINI_API_KEY to activate)'
  });
};

// ─── Req 29: Skill Mapping ───────────────────────────────────────────────────
export const handleSkillMapping = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const { rawText, customSkills } = req.body;

    const studentSkills = await StudentSkillModel.find({ uid });
    const studentData = {
      skills: customSkills || studentSkills.map(s => s.skillName),
      resumeText: rawText || ''
    };

    const result = await extractSkillMapping(studentData);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── Req 30: Career Guidance ─────────────────────────────────────────────────
export const handleCareerGuidance = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const [profile, extProfile, skills, education, projects] = await Promise.all([
      StudentProfileModel.findOne({ uid }),
      StudentExtProfileModel.findOne({ uid }),
      StudentSkillModel.find({ uid }),
      StudentEducationModel.find({ uid }),
      StudentProjectModel.find({ uid })
    ]);

    const studentProfile = {
      degree: profile?.degree,
      department: profile?.department,
      skills: skills.map(s => ({ name: s.skillName, proficiency: s.proficiency })),
      projects: projects.map(p => ({ title: p.title, tech: p.technologies })),
      education: education.map(e => ({ degree: e.degree, inst: e.institution })),
      interests: extProfile?.preferredRoles || []
    };

    const result = await generateCareerGuidance(studentProfile);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── Req 31: Learning Recommendations ─────────────────────────────────────────
export const handleLearningRecommendations = async (req, res, next) => {
  try {
    const { skillGaps } = req.body;
    let gaps = skillGaps;

    if (!gaps || gaps.length === 0) {
      const skills = await StudentSkillModel.find({ uid: req.user.uid });
      gaps = skills.filter(s => s.proficiency === 'Beginner').map(s => s.skillName);
      if (gaps.length === 0) {
        gaps = ['Data Structures', 'System Design', 'Cloud Computing'];
      }
    }

    const result = await generateLearningRecommendations(gaps);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── Req 32: AI Guide (Chat) ──────────────────────────────────────────────────
export const handleAIGuideChat = async (req, res, next) => {
  try {
    const { message, conversationContext } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const uid = req.user.uid;
    const [profile, skills] = await Promise.all([
      StudentProfileModel.findOne({ uid }),
      StudentSkillModel.find({ uid })
    ]);

    const context = {
      studentName: profile?.fullName || req.user.email,
      skills: skills.map(s => s.skillName),
      role: req.user.role,
      history: conversationContext || []
    };

    const result = await getAIGuideResponse(message, context);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── Req 33/34: Opportunity Match Explanations ─────────────────────────────────
export const handleMatchExplanation = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    const uid = req.user.uid;

    const [opp, skills, extProfile] = await Promise.all([
      OpportunityModel.findById(opportunityId),
      StudentSkillModel.find({ uid }),
      StudentExtProfileModel.findOne({ uid })
    ]);

    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    const studentSkills = skills.map(s => s.skillName.toLowerCase());
    const oppSkills = (opp.skillsRequired || []).map(s => s.toLowerCase());

    const matched = oppSkills.filter(s => studentSkills.includes(s));
    const missing = oppSkills.filter(s => !studentSkills.includes(s));
    const matchPercentage = oppSkills.length > 0 ? Math.round((matched.length / oppSkills.length) * 100) : 50;

    const explanation = await explainOpportunityMatch(
      { skills: skills.map(s => s.skillName), preferences: extProfile?.preferredRoles || [] },
      opp
    );

    res.json({
      success: true,
      data: {
        opportunityId,
        matchPercentage,
        matchedSkills: matched,
        missingSkills: missing,
        explanation: explanation.explanation,
        improvementTips: explanation.improvementTips
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Req 65: Interview Preparation ────────────────────────────────────────────
export const handleInterviewPrep = async (req, res, next) => {
  try {
    const { role, skills, jobDescription } = req.body;
    const uid = req.user.uid;
    const studentSkills = await StudentSkillModel.find({ uid });

    const result = await generateInterviewPrep({
      role: role || 'Software Engineer',
      skills: skills || studentSkills.map(s => s.skillName),
      jobDescription: jobDescription || ''
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── Req 66: Mock Interview ───────────────────────────────────────────────────
export const handleStartMockInterview = async (req, res, next) => {
  try {
    const { role } = req.body;
    const uid = req.user.uid;

    const firstQuestion = await getMockInterviewQuestion(role || 'Full Stack Developer', [], 0);

    const session = await MockInterviewModel.create({
      uid,
      role: role || 'Full Stack Developer',
      status: 'in-progress',
      currentQuestionIndex: 0,
      qaHistory: [
        {
          question: firstQuestion.question,
          type: firstQuestion.type,
          askedAt: new Date().toISOString()
        }
      ]
    });

    res.json({
      success: true,
      data: {
        sessionId: session._id,
        role: session.role,
        questionIndex: 0,
        question: firstQuestion.question,
        type: firstQuestion.type
      }
    });
  } catch (err) {
    next(err);
  }
};

export const handleAnswerMockInterview = async (req, res, next) => {
  try {
    const { sessionId, answer } = req.body;
    const uid = req.user.uid;

    const session = await MockInterviewModel.findById(sessionId);
    if (!session || session.uid !== uid) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    const currentIndex = session.currentQuestionIndex || 0;
    const currentQA = session.qaHistory[currentIndex];

    // Evaluate answer
    const evalResult = await evaluateMockAnswer(currentQA.question, answer, session.role);

    // Save answer and eval to history
    session.qaHistory[currentIndex].answer = answer;
    session.qaHistory[currentIndex].score = evalResult.score;
    session.qaHistory[currentIndex].feedback = evalResult.feedback;
    session.qaHistory[currentIndex].strengths = evalResult.strengths;
    session.qaHistory[currentIndex].improvements = evalResult.improvements;

    const isLast = currentIndex >= 4;
    let nextQuestionData = null;

    if (!isLast) {
      const nextIndex = currentIndex + 1;
      const nextQ = await getMockInterviewQuestion(session.role, session.qaHistory, nextIndex);
      session.qaHistory.push({
        question: nextQ.question,
        type: nextQ.type,
        askedAt: new Date().toISOString()
      });
      session.currentQuestionIndex = nextIndex;
      nextQuestionData = {
        questionIndex: nextIndex,
        question: nextQ.question,
        type: nextQ.type
      };
    } else {
      session.status = 'completed';
      const finalFeedback = await generateMockInterviewFinalFeedback(session.role, session.qaHistory);
      session.finalFeedback = finalFeedback;
    }

    await MockInterviewModel.updateOne({ _id: sessionId }, {
      qaHistory: session.qaHistory,
      currentQuestionIndex: session.currentQuestionIndex,
      status: session.status,
      finalFeedback: session.finalFeedback
    });

    res.json({
      success: true,
      data: {
        evaluation: evalResult,
        isCompleted: isLast,
        nextQuestion: nextQuestionData,
        finalFeedback: session.finalFeedback
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Req 68: Preparation Plan ─────────────────────────────────────────────────
export const handlePrepPlan = async (req, res, next) => {
  try {
    const { targetRole, skillGaps, timeline } = req.body;
    const result = await generatePrepPlan({
      targetRole: targetRole || 'Software Engineer',
      skillGaps: skillGaps || ['System Design', 'Algorithms'],
      timeline: Number(timeline) || 4
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── Req 70: Opportunity Trust Analysis ───────────────────────────────────────
export const handleOpportunityTrust = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opp = await OpportunityModel.findById(id);
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    const verification = await VerificationModel.findOne({
      targetId: opp.companyId,
      status: 'verified'
    });

    const isVerified = Boolean(verification || opp.isVerified);
    const trustAnalysis = await analyzeOpportunityTrust(opp, isVerified);

    res.json({ success: true, data: trustAnalysis });
  } catch (err) {
    next(err);
  }
};
