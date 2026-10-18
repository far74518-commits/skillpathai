import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { Roadmap } from '../models/Roadmap.js';
import { JobApplication } from '../models/JobApplication.js';
import { Project } from '../models/Project.js';
import { UserProject } from '../models/UserProject.js';
import { careerService } from './career.service.js';
import { roadmapService } from './roadmap.service.js';

export const dashboardService = {
  async getDashboardSummary(userId) {
    // 1. Fetch user profile
    const user = await User.findById(userId);
    const targetCareerId = user?.targetCareer || 'frontend-dev';

    // 2. Fetch skills
    const skills = await Skill.find({ userId });
    const skillsCompleted = skills.filter((s) => s.currentLevel >= s.targetLevel).length;
    const skillsInProgress = skills.length - skillsCompleted;

    // 3. Fetch active roadmap
    const roadmap = await roadmapService.getUserRoadmap(userId, targetCareerId);
    let totalTasks = 0;
    let completedTasks = 0;

    if (roadmap && roadmap.stages) {
      roadmap.stages.forEach((stage) => {
        (stage.tasks || []).forEach((t) => {
          totalTasks++;
          if (t.completed) completedTasks++;
        });
      });
    }

    const tasksRemaining = totalTasks - completedTasks;

    // 4. Calculate explainable readiness score
    const readiness = careerService.calculateReadiness(
      targetCareerId,
      skills,
      roadmap?.stages || []
    );

    // 5. Fetch job application statistics
    const jobs = await JobApplication.find({ userId });
    const jobStats = {
      total: jobs.length,
      saved: jobs.filter((j) => j.status === 'Saved').length,
      applied: jobs.filter((j) => j.status === 'Applied').length,
      interview: jobs.filter((j) => j.status === 'Interview').length,
      offer: jobs.filter((j) => j.status === 'Offer').length,
      rejected: jobs.filter((j) => j.status === 'Rejected').length,
    };

    // 6. Next recommended task
    const nextTask = roadmapService.getNextRecommendedTask(roadmap?.stages || []);

    // 7. Recommended projects
    const allProjects = await Project.find({ careerCategory: { $regex: targetCareerId.split('-')[0], $options: 'i' } }).limit(2);
    const fallbackProjects = allProjects.length > 0 ? allProjects : await Project.find().limit(2);

    // 8. Weekly activity hours (Mon to Sun)
    const weeklyHours = user?.weeklyLearningHours || 15;
    const dailyAverage = (weeklyHours / 5).toFixed(1);

    const weeklyActivity = [
      { day: 'Mon', hours: Math.min(4, Number(dailyAverage) * 1.1) },
      { day: 'Tue', hours: Math.min(4, Number(dailyAverage) * 0.9) },
      { day: 'Wed', hours: Math.min(4, Number(dailyAverage) * 1.2) },
      { day: 'Thu', hours: Math.min(4, Number(dailyAverage) * 0.8) },
      { day: 'Fri', hours: Math.min(4, Number(dailyAverage) * 1.0) },
      { day: 'Sat', hours: Math.min(5, Number(dailyAverage) * 1.3) },
      { day: 'Sun', hours: Math.min(3, Number(dailyAverage) * 0.6) },
    ];

    return {
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        targetCareer: targetCareerId,
        targetCareerTitle: readiness.targetCareerTitle,
      },
      readiness: {
        overall: readiness.overall,
        skillsScore: readiness.skillsScore,
        roadmapScore: readiness.roadmapScore,
        missingCount: readiness.missingCount,
        calculationDescription:
          'Career readiness is calculated from verified skill proficiency levels (55% weight) combined with learning roadmap milestones completed (45% weight).',
      },
      metrics: {
        totalTasks,
        completedTasks,
        tasksRemaining,
        totalSkills: skills.length,
        skillsCompleted,
        skillsInProgress,
        weeklyGoalHours: weeklyHours,
        hoursLoggedThisWeek: Math.round(weeklyHours * 0.75),
      },
      roadmapSummary: {
        title: roadmap?.title || 'Active Learning Roadmap',
        completionPercentage: roadmap?.completionPercentage || 0,
        stagesCount: roadmap?.stages?.length || 0,
      },
      nextTask,
      jobStats,
      weeklyActivity,
      recommendedProjects: fallbackProjects,
    };
  },

  async getActivityFeed(userId) {
    const jobs = await JobApplication.find({ userId }).sort({ updatedAt: -1 }).limit(3);
    const skills = await Skill.find({ userId }).sort({ updatedAt: -1 }).limit(3);

    const activities = [];

    jobs.forEach((j) => {
      activities.push({
        id: 'act_job_' + j._id,
        title: `Job Application Updated: ${j.position}`,
        detail: `${j.company} • Status: ${j.status}`,
        timestamp: j.updatedAt,
        type: 'job',
      });
    });

    skills.forEach((s) => {
      activities.push({
        id: 'act_sk_' + s._id,
        title: `Skill Progress Updated: ${s.name}`,
        detail: `Proficiency Level ${s.currentLevel} / ${s.targetLevel}`,
        timestamp: s.updatedAt,
        type: 'skill',
      });
    });

    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return activities;
  },

  async getUpcomingTasks(userId) {
    const user = await User.findById(userId);
    const targetCareerId = user?.targetCareer || 'frontend-dev';
    const roadmap = await roadmapService.getUserRoadmap(userId, targetCareerId);

    const upcoming = [];
    if (roadmap && roadmap.stages) {
      for (const stage of roadmap.stages) {
        for (const task of stage.tasks || []) {
          if (!task.completed) {
            upcoming.push({
              stageTitle: stage.title,
              taskId: task.id,
              title: task.title,
              duration: task.duration,
              skills: task.skills,
              project: task.project,
            });
            if (upcoming.length >= 5) break;
          }
        }
        if (upcoming.length >= 5) break;
      }
    }

    return upcoming;
  },
};
