import { allAssessments } from '../data/questionBank.js';
import { AssessmentAttemptModel, SkillGapModel, StudentSkillModel } from '../models/dbAdapter.js';
import { calculateScore, classifyTopics, generateImprovementSuggestions } from '../services/scoringService.js';
import { analyzeSkillGap } from '../services/aiService.js';

// ─── List Available Assessments ──────────────────────────────────────────────
export const getAvailableAssessments = async (req, res, next) => {
  try {
    const list = allAssessments.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      type: a.type,
      topic: a.topic,
      timeLimit: a.timeLimit,
      totalQuestions: a.questions.length,
      passPercentage: a.passPercentage || 60
    }));

    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

// ─── Get Assessment Details ──────────────────────────────────────────────────
export const getAssessmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assessment = allAssessments.find(a => a.id === id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    res.json({
      success: true,
      data: {
        id: assessment.id,
        title: assessment.title,
        description: assessment.description,
        type: assessment.type,
        topic: assessment.topic,
        timeLimit: assessment.timeLimit,
        totalQuestions: assessment.questions.length,
        passPercentage: assessment.passPercentage || 60
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Start Assessment Attempt ────────────────────────────────────────────────
export const startAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;
    const assessment = allAssessments.find(a => a.id === id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    const startedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + assessment.timeLimit * 60 * 1000).toISOString();

    const attempt = await AssessmentAttemptModel.create({
      uid,
      assessmentId: assessment.id,
      title: assessment.title,
      type: assessment.type,
      startedAt,
      expiresAt,
      status: 'in-progress',
      answers: {},
      timeLimit: assessment.timeLimit
    });

    // Provide questions without correct answers
    const clientQuestions = assessment.questions.map(q => ({
      id: q.id,
      text: q.text,
      topic: q.topic,
      options: q.options
    }));

    res.json({
      success: true,
      data: {
        attemptId: attempt._id,
        title: assessment.title,
        type: assessment.type,
        timeLimit: assessment.timeLimit,
        expiresAt,
        questions: clientQuestions
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Submit Assessment Attempt ───────────────────────────────────────────────
export const submitAssessment = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;
    const uid = req.user.uid;

    const attempt = await AssessmentAttemptModel.findById(attemptId);
    if (!attempt || attempt.uid !== uid) {
      return res.status(404).json({ success: false, message: 'Attempt not found or unauthorized' });
    }

    if (attempt.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Assessment attempt has already been submitted' });
    }

    const assessment = allAssessments.find(a => a.id === attempt.assessmentId);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment definition not found' });
    }

    // Calculate score
    const scoreResult = calculateScore(assessment.questions, answers || {});
    const topicClassification = classifyTopics(scoreResult.topicScores);
    const suggestions = generateImprovementSuggestions(topicClassification.weak.map(w => w.topic));

    const isPassed = scoreResult.percentage >= (assessment.passPercentage || 60);

    // Update attempt
    await AssessmentAttemptModel.updateOne({ _id: attemptId }, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      answers: answers || {},
      score: scoreResult.score,
      totalQuestions: scoreResult.totalQuestions,
      percentage: scoreResult.percentage,
      passed: isPassed,
      topicScores: scoreResult.topicScores,
      classification: topicClassification,
      suggestions
    });

    // If passed, auto-record skill or update proficiency as assessment-verified
    if (isPassed) {
      const existingSkill = await StudentSkillModel.findOne({
        uid,
        skillName: { $regex: `^${assessment.topic}$`, $options: 'i' }
      });

      const proficiencyLevel = scoreResult.percentage >= 85 ? 'Expert' : scoreResult.percentage >= 70 ? 'Advanced' : 'Intermediate';

      if (existingSkill) {
        await StudentSkillModel.updateOne({ _id: existingSkill._id }, {
          proficiency: proficiencyLevel,
          source: 'assessment',
          evidence: `Passed ${assessment.title} with ${scoreResult.percentage}%`
        });
      } else {
        await StudentSkillModel.create({
          uid,
          skillName: assessment.topic,
          category: assessment.type === 'technical' ? 'Programming' : assessment.type === 'soft-skill' ? 'Soft Skills' : 'Domain Skills',
          proficiency: proficiencyLevel,
          source: 'assessment',
          evidence: `Scored ${scoreResult.percentage}% on SkillNexus Assessment`
        });
      }
    }

    res.json({
      success: true,
      message: 'Assessment submitted successfully',
      data: {
        attemptId,
        score: scoreResult.score,
        totalQuestions: scoreResult.totalQuestions,
        percentage: scoreResult.percentage,
        passed: isPassed,
        classification: topicClassification,
        topicScores: scoreResult.topicScores,
        suggestions
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get Attempt Results ─────────────────────────────────────────────────────
export const getAttemptResults = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const attempt = await AssessmentAttemptModel.findById(attemptId);
    if (!attempt || attempt.uid !== req.user.uid) {
      return res.status(404).json({ success: false, message: 'Result not found or unauthorized' });
    }

    res.json({ success: true, data: attempt });
  } catch (err) {
    next(err);
  }
};

// ─── Student Assessment History ──────────────────────────────────────────────
export const getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await AssessmentAttemptModel.find({ uid: req.user.uid }, { sort: { createdAt: -1 } });
    res.json({ success: true, data: attempts });
  } catch (err) {
    next(err);
  }
};

// ─── Skill Gap Analysis (Req 28) ─────────────────────────────────────────────
export const computeSkillGap = async (req, res, next) => {
  try {
    const { targetRole, requiredSkills } = req.body;
    const uid = req.user.uid;

    if (!targetRole) {
      return res.status(400).json({ success: false, message: 'Target role is required' });
    }

    const currentSkillsDocs = await StudentSkillModel.find({ uid });
    const currentSkills = currentSkillsDocs.map(s => s.skillName);

    // Call AI skill gap service (with fallback)
    const gapAnalysis = await analyzeSkillGap(targetRole, currentSkills, requiredSkills);

    const saved = await SkillGapModel.create({
      uid,
      targetRole,
      requiredSkills: gapAnalysis.requiredSkills || [],
      currentSkills,
      missingSkills: gapAnalysis.missingSkills || [],
      weakSkills: gapAnalysis.weakSkills || [],
      priorityRecommendations: gapAnalysis.priorityRecommendations || [],
      readinessScore: gapAnalysis.readinessScore || 50,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
};

export const getLatestSkillGap = async (req, res, next) => {
  try {
    const gaps = await SkillGapModel.find({ uid: req.user.uid }, { sort: { createdAt: -1 }, limit: 1 });
    res.json({ success: true, data: gaps[0] || null });
  } catch (err) {
    next(err);
  }
};
