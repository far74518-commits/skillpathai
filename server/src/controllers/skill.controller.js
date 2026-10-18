import { DataStorageService } from '../services/dataStorage.service.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSkills = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const skills = await DataStorageService.getSkills(userId);

  // Calculate category breakdown & stats
  const categorySummary = {};
  skills.forEach((s) => {
    categorySummary[s.category] = (categorySummary[s.category] || 0) + 1;
  });

  const completedCount = skills.filter((s) => s.currentLevel >= s.targetLevel).length;

  return res.status(200).json({
    success: true,
    message: 'Skills retrieved successfully',
    data: {
      skills,
      summary: {
        total: skills.length,
        completed: completedCount,
        inProgress: skills.length - completedCount,
        categories: categorySummary,
      },
    },
  });
});

export const getSkillById = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const skills = await DataStorageService.getSkills(userId);
  const skill = skills.find(s => s._id.toString() === req.params.id || s.id === req.params.id);

  if (!skill) throw ApiError.notFound('Skill not found or unauthorized');

  return res.status(200).json({
    success: true,
    message: 'Skill details retrieved',
    data: { skill },
  });
});

export const createSkill = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { name, category, currentLevel, targetLevel, progress, hoursSpent, notes } = req.body;

  if (!name || !name.trim()) throw ApiError.badRequest('Skill name is required');

  const existingSkills = await DataStorageService.getSkills(userId);
  const exists = existingSkills.some(s => s.name.toLowerCase() === name.trim().toLowerCase());
  if (exists) {
    throw ApiError.conflict(`You already have "${name}" in your skill tracker.`);
  }

  const skill = await DataStorageService.createSkill(userId, {
    name: name.trim(),
    category: category || 'frontend',
    currentLevel: currentLevel || 1,
    targetLevel: targetLevel || 4,
    progress: progress || 20,
    hoursSpent: hoursSpent || 0,
    notes: notes || '',
  });

  return res.status(201).json({
    success: true,
    message: 'Skill added to tracker',
    data: { skill },
  });
});

export const updateSkill = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const updated = await DataStorageService.updateSkill(userId, req.params.id, req.body);

  if (!updated) throw ApiError.notFound('Skill not found or unauthorized');

  return res.status(200).json({
    success: true,
    message: 'Skill updated successfully',
    data: { skill: updated },
  });
});

export const updateSkillProgress = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const updated = await DataStorageService.updateSkill(userId, req.params.id, req.body);

  if (!updated) throw ApiError.notFound('Skill not found or unauthorized');

  return res.status(200).json({
    success: true,
    message: 'Skill progress updated',
    data: { skill: updated },
  });
});

export const deleteSkill = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const deleted = await DataStorageService.deleteSkill(userId, req.params.id);

  if (!deleted) throw ApiError.notFound('Skill not found or unauthorized');

  return res.status(200).json({
    success: true,
    message: 'Skill removed from tracker',
    data: {},
  });
});
