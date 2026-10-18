import { Project } from '../models/Project.js';
import { UserProject } from '../models/UserProject.js';
import { DataStorageService } from '../services/dataStorage.service.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDatabaseConnected } from '../config/database.js';

export const getProjects = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { category, difficulty } = req.query;

  const query = {};
  if (category && category !== 'All') query.careerCategory = category;
  if (difficulty && difficulty !== 'All') query.difficulty = difficulty;

  let projects = [];
  if (isDatabaseConnected()) {
    projects = await Project.find(query);
  }

  // Attach user's progress
  let userProjects = [];
  if (userId) {
    userProjects = await DataStorageService.getUserProjects(userId);
  }

  const userProgressMap = {};
  userProjects.forEach((up) => {
    userProgressMap[up.projectSlug] = up;
  });

  const merged = projects.map((p) => {
    const obj = p.toObject ? p.toObject() : p;
    const up = userProgressMap[p.slug] || userProgressMap[p._id?.toString()];
    return {
      ...obj,
      id: p.slug,
      started: up ? up.started : false,
      completed: up ? up.completed : false,
      checklist: (p.checklist || []).map((item) => {
        const found = up?.checklist?.find((c) => c.id === item.id);
        return {
          id: item.id,
          text: item.text,
          completed: found ? found.completed : false,
        };
      }),
    };
  });

  return res.status(200).json({
    success: true,
    message: 'Projects catalogue retrieved',
    data: { projects: merged },
  });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id || req.user?.id;

  let project = null;
  if (isDatabaseConnected()) {
    project = (await Project.findOne({ slug: id })) || (await Project.findById(id).catch(() => null));
  }

  if (!project) {
    // Basic fallback project object
    project = {
      slug: id,
      title: 'Full-Stack Portfolio Project',
      description: 'Hands-on project experience with real modern engineering standards.',
      checklist: [
        { id: 'c1', text: 'Set up repository and folder structure' },
        { id: 'c2', text: 'Implement key core components and business logic' },
        { id: 'c3', text: 'Deploy to live cloud hosting' }
      ]
    };
  }

  let userProgress = null;
  if (userId) {
    const ups = await DataStorageService.getUserProjects(userId);
    userProgress = ups.find((up) => up.projectSlug === (project.slug || id));
  }

  const pObj = project.toObject ? project.toObject() : project;
  const result = {
    ...pObj,
    id: project.slug || id,
    started: userProgress ? userProgress.started : false,
    completed: userProgress ? userProgress.completed : false,
    checklist: (project.checklist || []).map((item) => {
      const found = userProgress?.checklist?.find((c) => c.id === item.id);
      return {
        id: item.id,
        text: item.text,
        completed: found ? found.completed : false,
      };
    }),
  };

  return res.status(200).json({
    success: true,
    message: 'Project details retrieved',
    data: { project: result },
  });
});

export const startProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id || req.user.id;

  const existing = await DataStorageService.getUserProjects(userId);
  const up = existing.find((p) => p.projectSlug === id);
  const nextStarted = up ? !up.started : true;

  const updated = await DataStorageService.updateUserProject(userId, id, {
    started: nextStarted,
    completed: nextStarted ? (up?.completed || false) : false,
  });

  return res.status(200).json({
    success: true,
    message: nextStarted ? 'Project marked as started' : 'Project status reset',
    data: { userProject: updated },
  });
});

export const toggleChecklistItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { checkId } = req.body;
  const userId = req.user._id || req.user.id;

  const existing = await DataStorageService.getUserProjects(userId);
  const up = existing.find((p) => p.projectSlug === id);
  const checklist = up?.checklist || [];

  const foundItem = checklist.find((c) => c.id === checkId);
  if (foundItem) {
    foundItem.completed = !foundItem.completed;
  } else {
    checklist.push({ id: checkId, completed: true });
  }

  const updated = await DataStorageService.updateUserProject(userId, id, {
    checklist,
    started: true,
  });

  return res.status(200).json({
    success: true,
    message: 'Checklist milestone updated',
    data: { userProject: updated },
  });
});

export const completeProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id || req.user.id;

  const existing = await DataStorageService.getUserProjects(userId);
  const up = existing.find((p) => p.projectSlug === id);
  const nextCompleted = up ? !up.completed : true;

  const updated = await DataStorageService.updateUserProject(userId, id, {
    completed: nextCompleted,
    started: true,
  });

  return res.status(200).json({
    success: true,
    message: nextCompleted ? 'Project completed! Portfolio badge updated.' : 'Project marked as in-progress',
    data: { userProject: updated },
  });
});

export const getMyProjects = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const userProjects = await DataStorageService.getUserProjects(userId);

  return res.status(200).json({
    success: true,
    message: 'Active student portfolio projects',
    data: { userProjects },
  });
});
