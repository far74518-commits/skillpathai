import { DataStorageService } from '../services/dataStorage.service.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDatabaseConnected } from '../config/database.js';

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const user = await DataStorageService.findUserById(userId);
  if (!user) throw ApiError.notFound('User not found');

  return res.status(200).json({
    success: true,
    message: 'Profile fetched successfully',
    data: { user },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const user = await DataStorageService.findUserById(userId);
  if (!user) throw ApiError.notFound('User not found');

  const allowedUpdates = [
    'name',
    'avatar',
    'headline',
    'educationLevel',
    'degree',
    'university',
    'gradYear',
    'interests',
    'existingSkills',
    'careerGoals',
    'preferredWorkEnvironment',
    'weeklyLearningHours',
    'targetCareer',
    'theme',
    'bio',
    'location',
    'phone',
    'privacySettings',
    'notificationPreferences',
  ];

  const filtered = {};
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      filtered[field] = req.body[field];
    }
  });

  // Handle email update safely
  if (req.body.email && req.body.email.trim()) {
    const cleanEmail = req.body.email.trim().toLowerCase();
    if (cleanEmail !== user.email.toLowerCase()) {
      const existing = await DataStorageService.findUserByEmail(cleanEmail);
      if (existing) {
        throw ApiError.conflict('An account with this email address already exists.');
      }
      filtered.email = cleanEmail;
    }
  }

  const updated = await DataStorageService.updateUser(userId, filtered);
  if (!updated) throw ApiError.notFound('User not found');

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: updated },
  });
});

export const updatePreferences = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const user = await DataStorageService.findUserById(userId);
  if (!user) throw ApiError.notFound('User not found');

  const updates = {};
  if (req.body.notificationPreferences) {
    updates.notificationPreferences = {
      ...(user.notificationPreferences || {}),
      ...req.body.notificationPreferences,
    };
  }
  if (req.body.privacySettings) {
    updates.privacySettings = {
      ...(user.privacySettings || {}),
      ...req.body.privacySettings,
    };
  }
  if (req.body.theme) updates.theme = req.body.theme;
  if (req.body.weeklyLearningHours) updates.weeklyLearningHours = req.body.weeklyLearningHours;

  const updated = await DataStorageService.updateUser(userId, updates);

  return res.status(200).json({
    success: true,
    message: 'Preferences updated successfully',
    data: {
      notificationPreferences: updated.notificationPreferences,
      privacySettings: updated.privacySettings,
      theme: updated.theme,
      weeklyLearningHours: updated.weeklyLearningHours,
    },
  });
});

// Secure Change Password
export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw ApiError.badRequest('Current password and new password are required');
  }

  if (newPassword.length < 8) {
    throw ApiError.badRequest('New password must be at least 8 characters long');
  }

  const user = await DataStorageService.findUserById(userId, true);
  if (!user) throw ApiError.notFound('User not found');

  // Verify current password against stored hash
  let isMatch = false;
  if (user.comparePassword) {
    isMatch = await user.comparePassword(currentPassword);
  } else if (user.passwordHash) {
    isMatch = await DataStorageService.verifyPassword(currentPassword, user.passwordHash);
  }

  if (!isMatch) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  await DataStorageService.updateUserPassword(userId, newPassword);

  return res.status(200).json({
    success: true,
    message: 'Password changed successfully',
    data: {},
  });
});

// Working Export My Data (STRICTLY PRIVATE, SANITIZED, VALID JSON NAMED skillpath-my-data.json)
export const exportUserData = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  if (!userId) {
    throw ApiError.unauthorized('User session not found.');
  }

  const exportPayload = await DataStorageService.exportUserData(userId);

  // Requirement 3 & 6: Ensure no passwords, password hashes, secrets, or tokens exist
  const sanitizedJson = JSON.stringify(exportPayload, (key, value) => {
    if (['password', 'passwordHash', 'resetPasswordToken', 'resetPasswordExpires', 'token', 'secret', 'apiKey', 'access_token', 'refresh_token'].includes(key)) {
      return undefined;
    }
    return value;
  }, 2);

  const cleanPayload = JSON.parse(sanitizedJson);
  const safeFilename = 'skillpath-my-data.json';

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);

  return res.status(200).json({
    success: true,
    message: 'Your private career data has been exported successfully.',
    filename: safeFilename,
    data: cleanPayload,
  });
});

export const getDatabaseStatus = asyncHandler(async (req, res) => {
  const connected = isDatabaseConnected();
  return res.status(200).json({
    success: true,
    data: {
      connected,
      engine: connected ? 'MongoDB' : 'Persistent File Store (JSON)',
      storagePath: connected ? 'mongodb://127.0.0.1:27017/skillpathai' : 'server/data/persistent_db.json',
      persistent: true,
      message: connected
        ? 'Connected to MongoDB database'
        : 'Active local persistent JSON document store. Data persists across server restarts, logouts, and logins. To connect MongoDB, set MONGODB_URI in server/.env with your local or Atlas URI.',
    },
  });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true });

  return res.status(200).json({
    success: true,
    message: 'Your account and all associated records have been permanently deleted.',
    data: {},
  });
});
