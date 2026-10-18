import { careerService } from '../services/career.service.js';
import { Assessment } from '../models/Assessment.js';
import { Skill } from '../models/Skill.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDatabaseConnected } from '../config/database.js';

export const getAllCareers = asyncHandler(async (req, res) => {
  const careers = careerService.getAllCareers();
  return res.status(200).json({
    success: true,
    message: 'Career paths retrieved successfully',
    data: { careers },
  });
});

export const getCareerById = asyncHandler(async (req, res) => {
  const career = careerService.getCareerById(req.params.id);
  return res.status(200).json({
    success: true,
    message: 'Career details retrieved',
    data: { career },
  });
});

export const assessCareers = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  let userSkills = [];

  if (isDatabaseConnected() && userId) {
    userSkills = await Skill.find({ userId });
  }

  // Calculate explainable matching scores
  const recommendations = careerService.evaluateAssessment(req.body, userSkills);

  // If user is authenticated and DB connected, persist assessment history
  if (isDatabaseConnected() && userId) {
    await Assessment.create({
      userId,
      educationLevel: req.body.educationLevel || '',
      degree: req.body.degreeField || '',
      skills: (req.body.existingSkills || []).map((s) => (typeof s === 'string' ? s : s.name)),
      interests: req.body.interests || [],
      preferredWorkEnv: req.body.preferredWorkEnv || 'Remote',
      careerGoal: req.body.careerGoal || '',
      weeklyHours: Number(req.body.weeklyHours) || 15,
      recommendedCareers: recommendations.slice(0, 5),
      skillGaps: recommendations[0]?.missingSkills || [],
    });

    // Optionally set user's top recommended career as targetCareer if not set
    const user = await User.findById(userId);
    if (user && !user.targetCareer && recommendations[0]) {
      user.targetCareer = recommendations[0].careerId;
      await user.save();
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Career assessment evaluated successfully',
    data: {
      recommendations,
      topRecommendation: recommendations[0] || null,
      assessmentNotice: 'Match scores represent structured guidance and market skill-gap analysis.',
    },
  });
});

export const getAssessmentHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;

  if (!isDatabaseConnected()) {
    return res.status(200).json({
      success: true,
      message: 'Assessment history retrieved',
      data: { assessments: [] },
    });
  }

  const assessments = await Assessment.find({ userId }).sort({ createdAt: -1 }).limit(10);
  return res.status(200).json({
    success: true,
    message: 'Assessment history retrieved successfully',
    data: { assessments },
  });
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;

  if (isDatabaseConnected()) {
    const lastAssessment = await Assessment.findOne({ userId }).sort({ createdAt: -1 });
    if (lastAssessment && lastAssessment.recommendedCareers?.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Personalized recommendations retrieved',
        data: {
          recommendations: lastAssessment.recommendedCareers,
          assessedAt: lastAssessment.createdAt,
        },
      });
    }
  }

  // Fallback to default catalogue recommendations
  const allCareers = careerService.getAllCareers().map((c) => ({
    ...c,
    careerId: c.id,
    matchScore: 85,
    matchReasons: ['Popular career path with high entry-level student demand'],
  }));

  return res.status(200).json({
    success: true,
    message: 'General recommendations retrieved',
    data: { recommendations: allCareers },
  });
});
