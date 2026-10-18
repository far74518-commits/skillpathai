import crypto from 'crypto';
import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { Roadmap } from '../models/Roadmap.js';
import { CV } from '../models/CV.js';
import { ApiError } from '../utils/ApiError.js';
import { emailService } from './email.service.js';
import { roadmapService } from './roadmap.service.js';

export const authService = {
  async register({ name, email, password, degree, university, targetCareer }) {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      throw ApiError.conflict('An account with this email address already exists.');
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password, // Will be hashed by UserSchema pre-save hook
      degree: degree || '',
      university: university || '',
      targetCareer: targetCareer || 'frontend-dev',
    });

    // Seed default starter skills for the new user
    await this.seedDefaultSkillsForUser(newUser._id);

    // Seed starter roadmap
    await roadmapService.getUserRoadmap(newUser._id, newUser.targetCareer);

    // Initialize blank CV
    await CV.create({
      userId: newUser._id,
      personalInfo: {
        fullName: newUser.name,
        email: newUser.email,
        title: 'Aspiring Software Engineer',
      },
    });

    // Send optional welcome email
    emailService.sendWelcomeEmail(newUser.email, newUser.name);

    return newUser;
  },

  async login(email, password) {
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    return user;
  },

  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User profile not found.');
    }
    return user;
  },

  async forgotPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Security best practice: Do not reveal whether user exists to prevent user enumeration
    if (!user) {
      return { success: true, message: 'If an account matches that email, a password reset link has been dispatched.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    await emailService.sendPasswordResetEmail(user.email, resetToken, user.name);

    return { success: true, message: 'If an account matches that email, a password reset link has been dispatched.' };
  },

  async resetPassword(resetToken, newPassword) {
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw ApiError.badRequest('Password reset token is invalid or has expired.');
    }

    user.passwordHash = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return user;
  },

  async seedDefaultSkillsForUser(userId) {
    const defaultSkills = [
      { name: 'JavaScript', category: 'programming', currentLevel: 3, targetLevel: 5, progress: 60, hoursSpent: 45 },
      { name: 'React', category: 'frontend', currentLevel: 3, targetLevel: 4, progress: 75, hoursSpent: 60 },
      { name: 'HTML & Modern CSS', category: 'frontend', currentLevel: 4, targetLevel: 5, progress: 85, hoursSpent: 50 },
      { name: 'Git & GitHub', category: 'tools', currentLevel: 3, targetLevel: 4, progress: 65, hoursSpent: 30 },
      { name: 'Node.js & Express', category: 'backend', currentLevel: 2, targetLevel: 4, progress: 40, hoursSpent: 25 },
      { name: 'TypeScript', category: 'programming', currentLevel: 2, targetLevel: 4, progress: 35, hoursSpent: 20 },
      { name: 'SQL & Relational DBs', category: 'databases', currentLevel: 2, targetLevel: 4, progress: 45, hoursSpent: 25 },
    ];

    const records = defaultSkills.map((s) => ({ ...s, userId }));
    try {
      await Skill.insertMany(records);
    } catch (e) {
      // Ignore duplicates
    }
  },
};
