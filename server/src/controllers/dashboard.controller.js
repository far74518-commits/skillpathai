import { dashboardService } from '../services/dashboard.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDatabaseConnected } from '../config/database.js';

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;

  if (!isDatabaseConnected()) {
    // Return structured default demo data if offline
    return res.status(200).json({
      success: true,
      message: 'Dashboard summary retrieved (demo fallback)',
      data: {
        user: { name: req.user.name, email: req.user.email, targetCareer: 'frontend-dev', targetCareerTitle: 'Frontend Developer' },
        readiness: { overall: 65, skillsScore: 60, roadmapScore: 70, missingCount: 3 },
        metrics: { totalTasks: 9, completedTasks: 2, tasksRemaining: 7, totalSkills: 7, skillsCompleted: 2, skillsInProgress: 5, weeklyGoalHours: 15, hoursLoggedThisWeek: 11 },
        roadmapSummary: { title: 'Frontend Developer Learning Roadmap', completionPercentage: 22, stagesCount: 3 },
        nextTask: { title: 'Modern JavaScript (ES6+), Async/Await & Event Loop', duration: '2 weeks' },
        jobStats: { total: 4, saved: 1, applied: 1, interview: 1, offer: 1, rejected: 0 },
        weeklyActivity: [
          { day: 'Mon', hours: 2.5 },
          { day: 'Tue', hours: 3.0 },
          { day: 'Wed', hours: 1.5 },
          { day: 'Thu', hours: 2.0 },
          { day: 'Fri', hours: 3.5 },
          { day: 'Sat', hours: 4.0 },
          { day: 'Sun', hours: 1.0 },
        ],
        recommendedProjects: [],
      },
    });
  }

  const summary = await dashboardService.getDashboardSummary(userId);
  return res.status(200).json({
    success: true,
    message: 'Dashboard statistics calculated successfully',
    data: summary,
  });
});

export const getDashboardActivity = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;

  if (!isDatabaseConnected()) {
    return res.status(200).json({
      success: true,
      message: 'Activity feed retrieved',
      data: { activities: [] },
    });
  }

  const activities = await dashboardService.getActivityFeed(userId);
  return res.status(200).json({
    success: true,
    message: 'Recent activity feed retrieved',
    data: { activities },
  });
});

export const getUpcomingTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;

  if (!isDatabaseConnected()) {
    return res.status(200).json({
      success: true,
      message: 'Upcoming tasks retrieved',
      data: { tasks: [] },
    });
  }

  const tasks = await dashboardService.getUpcomingTasks(userId);
  return res.status(200).json({
    success: true,
    message: 'Upcoming tasks retrieved',
    data: { tasks },
  });
});
