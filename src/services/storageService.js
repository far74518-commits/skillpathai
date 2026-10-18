import { INITIAL_SKILLS } from '../data/skills';
import { INITIAL_ROADMAPS } from '../data/roadmaps';
import { INITIAL_JOBS } from '../data/sampleJobs';
import { INITIAL_CV } from '../data/sampleCV';
import { PORTFOLIO_PROJECTS } from '../data/projects';

const STORAGE_KEYS = {
  USER: 'skillpath_user',
  TARGET_CAREER: 'skillpath_target_career',
  SKILLS: 'skillpath_skills',
  ROADMAPS: 'skillpath_roadmaps',
  JOBS: 'skillpath_jobs',
  CV: 'skillpath_cv',
  PROJECTS: 'skillpath_projects',
  SETTINGS: 'skillpath_settings',
  ASSESSMENT: 'skillpath_last_assessment'
};

const DEFAULT_USER = {
  id: 'usr_student_01',
  name: '',
  email: '',
  headline: '',
  university: '',
  degree: '',
  gradYear: '2027',
  avatar: '',
  isDemoUser: false
};

const DEFAULT_SETTINGS = {
  theme: 'dark', // 'light' | 'dark'
  weeklyStudyGoalHours: 15,
  dailyReminder: true,
  jobAlerts: true,
  roadmapNotifications: true,
  compactView: false
};

// Safe wrapper for localStorage access
function safeGet(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.warn(`Error loading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving localStorage key "${key}":`, error);
    return false;
  }
}

export const StorageService = {
  // User
  getUser() {
    return safeGet(STORAGE_KEYS.USER, null);
  },
  saveUser(user) {
    if (!user) {
      try {
        localStorage.removeItem(STORAGE_KEYS.USER);
        return true;
      } catch (e) {
        return false;
      }
    }
    return safeSet(STORAGE_KEYS.USER, user);
  },

  // Target Career
  getTargetCareer() {
    return safeGet(STORAGE_KEYS.TARGET_CAREER, 'frontend-dev');
  },
  saveTargetCareer(careerId) {
    return safeSet(STORAGE_KEYS.TARGET_CAREER, careerId);
  },

  // Skills
  getSkills() {
    return safeGet(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  },
  saveSkills(skills) {
    return safeSet(STORAGE_KEYS.SKILLS, skills);
  },

  // Roadmaps
  getRoadmaps() {
    const stored = safeGet(STORAGE_KEYS.ROADMAPS, null);
    if (!stored) return INITIAL_ROADMAPS;
    return { ...INITIAL_ROADMAPS, ...stored };
  },
  saveRoadmaps(roadmaps) {
    return safeSet(STORAGE_KEYS.ROADMAPS, roadmaps);
  },

  // Jobs
  getJobs() {
    return safeGet(STORAGE_KEYS.JOBS, INITIAL_JOBS);
  },
  saveJobs(jobs) {
    return safeSet(STORAGE_KEYS.JOBS, jobs);
  },

  // CV
  getCV() {
    return safeGet(STORAGE_KEYS.CV, INITIAL_CV);
  },
  saveCV(cv) {
    return safeSet(STORAGE_KEYS.CV, cv);
  },

  // Projects
  getProjects() {
    return safeGet(STORAGE_KEYS.PROJECTS, PORTFOLIO_PROJECTS);
  },
  saveProjects(projects) {
    return safeSet(STORAGE_KEYS.PROJECTS, projects);
  },

  // Settings
  getSettings() {
    return safeGet(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  saveSettings(settings) {
    return safeSet(STORAGE_KEYS.SETTINGS, settings);
  },

  // Assessment results
  getLastAssessment() {
    return safeGet(STORAGE_KEYS.ASSESSMENT, null);
  },
  saveLastAssessment(results) {
    return safeSet(STORAGE_KEYS.ASSESSMENT, results);
  },

  // Export full JSON backup
  exportAllData() {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: this.getUser(),
      targetCareer: this.getTargetCareer(),
      skills: this.getSkills(),
      roadmaps: this.getRoadmaps(),
      jobs: this.getJobs(),
      cv: this.getCV(),
      projects: this.getProjects(),
      settings: this.getSettings()
    };
    return JSON.stringify(backup, null, 2);
  },

  // Import JSON backup
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') throw new Error('Invalid JSON format');
      if (data.user) this.saveUser(data.user);
      if (data.targetCareer) this.saveTargetCareer(data.targetCareer);
      if (data.skills) this.saveSkills(data.skills);
      if (data.roadmaps) this.saveRoadmaps(data.roadmaps);
      if (data.jobs) this.saveJobs(data.jobs);
      if (data.cv) this.saveCV(data.cv);
      if (data.projects) this.saveProjects(data.projects);
      if (data.settings) this.saveSettings(data.settings);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Reset to initial factory defaults
  resetToFactoryDefaults() {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TARGET_CAREER);
      localStorage.removeItem(STORAGE_KEYS.SKILLS);
      localStorage.removeItem(STORAGE_KEYS.ROADMAPS);
      localStorage.removeItem(STORAGE_KEYS.JOBS);
      localStorage.removeItem(STORAGE_KEYS.CV);
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENT);
      return true;
    } catch (e) {
      console.error('Error clearing data:', e);
      return false;
    }
  }
};
