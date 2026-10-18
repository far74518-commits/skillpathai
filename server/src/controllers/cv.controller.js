import { DataStorageService } from '../services/dataStorage.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCV = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  let cv = await DataStorageService.getCV(userId);

  if (!cv) {
    // Initialize default profile template for student
    cv = await DataStorageService.saveCV(userId, {
      personalInfo: {
        fullName: req.user.name || '',
        email: req.user.email || '',
        phone: '',
        location: '',
        title: 'Aspiring Software Engineer',
        summary: '',
      },
      education: [],
      experience: [],
      projects: [],
      skills: { technical: [], frameworks: [], tools: [], soft: [] },
      certifications: [],
      selectedTemplate: 'modern',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'CV profile retrieved successfully',
    data: { cv },
  });
});

export const updateCV = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const sections = ['personalInfo', 'education', 'experience', 'projects', 'skills', 'certifications', 'selectedTemplate'];
  const payload = {};
  sections.forEach((sec) => {
    if (req.body[sec] !== undefined) {
      payload[sec] = req.body[sec];
    }
  });

  const cv = await DataStorageService.saveCV(userId, payload);

  return res.status(200).json({
    success: true,
    message: 'CV profile saved successfully',
    data: { cv },
  });
});

export const resetCV = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  await DataStorageService.saveCV(userId, {
    personalInfo: { fullName: req.user.name || '', email: req.user.email || '' },
    education: [],
    experience: [],
    projects: [],
    skills: { technical: [], frameworks: [], tools: [], soft: [] },
    certifications: [],
    selectedTemplate: 'modern',
  });

  return res.status(200).json({
    success: true,
    message: 'CV reset to blank template',
    data: {},
  });
});
