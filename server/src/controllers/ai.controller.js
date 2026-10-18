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
