import { aiService } from '../services/ai.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCareerGuidance = asyncHandler(async (req, res) => {
  const profile = {
    ...req.body,
    userId: req.user?._id || req.user?.id,
  };

  const guidance = await aiService.generateCareerGuidance(profile);

  return res.status(200).json({
    success: true,
    message: 'AI career guidance generated successfully',
    data: guidance,
  });
});

export const generateSmartRoadmap = asyncHandler(async (req, res) => {
  const params = {
    ...req.body,
    userId: req.user?._id || req.user?.id,
  };

  const roadmap = await aiService.generateSmartRoadmap(params);

  return res.status(200).json({
    success: true,
    message: 'AI smart roadmap generated successfully',
    data: roadmap,
  });
});

export const reviewATSResume = asyncHandler(async (req, res) => {
  const { cvData, targetRole } = req.body;

  const review = await aiService.reviewATSResume({
    cvData: cvData || {},
    targetRole: targetRole || req.user?.targetCareer || 'Software Engineer',
  });

  return res.status(200).json({
    success: true,
    message: 'ATS resume review generated successfully',
    data: review,
  });
});

export const askCareerAssistant = asyncHandler(async (req, res) => {
  const { question, context, targetCareer } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Question is required for career assistant',
    });
  }

  const response = await aiService.askCareerAssistant({
    question,
    context: context || {},
    targetCareer: targetCareer || req.user?.targetCareer || 'Software Engineer',
  });

  return res.status(200).json({
    success: true,
    message: 'AI assistant response generated successfully',
    data: response,
  });
});

export const getAIStatus = asyncHandler(async (req, res) => {
  const status = aiService.getProviderStatus();
  return res.status(200).json({
    success: true,
    data: status,
  });
});

export const configureAI = asyncHandler(async (req, res) => {
  const { apiKey, provider, model } = req.body;

  const status = aiService.setRuntimeKey({
    apiKey,
    provider: provider || 'gemini',
    model,
  });

  return res.status(200).json({
    success: true,
    message: 'AI service configuration updated in runtime memory',
    data: status,
  });
});
