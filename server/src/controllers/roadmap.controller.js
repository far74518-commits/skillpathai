import { DataStorageService } from '../services/dataStorage.service.js';
import { roadmapService, STARTER_ROADMAPS } from '../services/roadmap.service.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllStarterRoadmaps = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Starter learning roadmaps retrieved',
    data: { roadmaps: STARTER_ROADMAPS },
  });
});

export const getMyRoadmaps = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const roadmaps = await DataStorageService.getUserRoadmaps(userId);

  // Map to an object keyed by careerType to match frontend structure
  const roadmapMap = {};
  roadmaps.forEach((r) => {
    roadmapMap[r.careerType] = r;
  });

  return res.status(200).json({
    success: true,
    message: 'User roadmaps retrieved successfully',
    data: { roadmaps: roadmapMap, list: roadmaps },
  });
});

export const getRoadmapByCareerType = asyncHandler(async (req, res) => {
  const { careerType } = req.params;
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    const starter = roadmapService.getStarterRoadmap(careerType);
    return res.status(200).json({
      success: true,
      message: 'Roadmap retrieved',
      data: { roadmap: starter },
    });
  }

  const roadmap = await DataStorageService.getUserRoadmap(userId, careerType);
  return res.status(200).json({
    success: true,
    message: 'Roadmap retrieved successfully',
    data: { roadmap },
  });
});

export const toggleTaskCompleted = asyncHandler(async (req, res) => {
  const { careerType, taskId } = req.params;
  const userId = req.user._id || req.user.id;

  const currentRoadmap = await DataStorageService.getUserRoadmap(userId, careerType);
  if (!currentRoadmap) throw ApiError.notFound('Roadmap not found.');

  let stageId = null;
  let targetCompleted = true;
  for (const st of currentRoadmap.stages) {
    const t = st.tasks.find((tk) => tk.id === taskId);
    if (t) {
      stageId = st.id;
      targetCompleted = !t.completed;
      break;
    }
  }

  const updated = await DataStorageService.updateRoadmapTask(
    userId,
    careerType,
    stageId,
    taskId,
    targetCompleted
  );

  return res.status(200).json({
    success: true,
    message: targetCompleted ? 'Milestone completed!' : 'Milestone reopened',
    data: {
      roadmap: updated,
      completionPercentage: updated?.completionPercentage || 0,
    },
  });
});

export const addCustomTask = asyncHandler(async (req, res) => {
  const { careerType } = req.params;
  const { stageId, title, description, skills, duration, project } = req.body;
  const userId = req.user._id || req.user.id;

  if (!title) {
    throw ApiError.badRequest('Task title is required');
  }

  const roadmap = await DataStorageService.getUserRoadmap(userId, careerType);
  if (!roadmap) throw ApiError.notFound('Roadmap not found');

  const newTask = {
    id: 'task_' + Date.now(),
    title,
    description: description || '',
    skills: skills || [],
    duration: duration || '1 week',
    project: project || '',
    completed: false,
    isCustom: true,
  };

  const targetStage = roadmap.stages.find((st) => st.id === stageId) || roadmap.stages[0];
  if (targetStage) {
    targetStage.tasks.push(newTask);
  }

  return res.status(201).json({
    success: true,
    message: 'Custom milestone added to roadmap',
    data: {
      roadmap,
      task: newTask,
    },
  });
});

export const createRoadmap = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { careerType, title, stages, description } = req.body;

  if (!careerType || !title) {
    throw ApiError.badRequest('careerType and title are required');
  }

  const roadmap = await DataStorageService.getUserRoadmap(userId, careerType);
  if (stages) roadmap.stages = stages;
  if (description) roadmap.description = description;

  return res.status(201).json({
    success: true,
    message: 'Roadmap created successfully',
    data: { roadmap },
  });
});

export const updateRoadmap = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const roadmap = await DataStorageService.getUserRoadmap(userId, req.params.id);

  if (!roadmap) {
    throw ApiError.notFound('Roadmap not found or unauthorized');
  }

  if (req.body.title) roadmap.title = req.body.title;
  if (req.body.description) roadmap.description = req.body.description;
  if (req.body.stages) roadmap.stages = req.body.stages;

  return res.status(200).json({
    success: true,
    message: 'Roadmap updated successfully',
    data: { roadmap },
  });
});

export const deleteRoadmap = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Roadmap reset to default',
    data: {},
  });
});
