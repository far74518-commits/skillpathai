import { Notification } from '../models/Notification.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDatabaseConnected } from '../config/database.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;

  if (!isDatabaseConnected()) {
    return res.status(200).json({
      success: true,
      message: 'Notifications retrieved (local mode)',
      data: { notifications: [] },
    });
  }

  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);

  // If user has no notifications, create starter welcome notifications
  if (notifications.length === 0) {
    const welcomeNotes = [
      {
        userId,
        title: 'Welcome to SkillPath AI! 🚀',
        message: 'Your intelligent career workspace is initialized. Set your target career in Career Assistant.',
        type: 'system',
        read: false,
      },
      {
        userId,
        title: 'Interview Milestone Tracked',
        message: 'Your job tracking workspace is ready to monitor application stages and interviews.',
        type: 'interview',
        read: false,
      },
    ];
    const created = await Notification.insertMany(welcomeNotes);
    return res.status(200).json({
      success: true,
      message: 'Notifications retrieved',
      data: { notifications: created },
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Notifications retrieved successfully',
    data: { notifications },
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const notif = await Notification.findOne({ _id: req.params.id, userId });

  if (!notif) throw ApiError.notFound('Notification not found');

  notif.read = true;
  await notif.save();

  return res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: { notification: notif },
  });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  await Notification.updateMany({ userId, read: false }, { read: true });

  return res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
    data: {},
  });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const deleted = await Notification.findOneAndDelete({ _id: req.params.id, userId });

  if (!deleted) throw ApiError.notFound('Notification not found');

  return res.status(200).json({
    success: true,
    message: 'Notification deleted',
    data: {},
  });
});
