import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { CareerService } from '../services/careerService';
import { INITIAL_ROADMAPS } from '../data/roadmaps';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Target career
  const [targetCareerId, setTargetCareerIdState] = useState(() => StorageService.getTargetCareer());

  // Skills
  const [skills, setSkills] = useState(() => StorageService.getSkills());

  // Roadmaps
  const [roadmaps, setRoadmaps] = useState(() => StorageService.getRoadmaps());

  // Jobs
  const [jobs, setJobs] = useState(() => StorageService.getJobs());

  // CV Builder Data
  const [cvData, setCvData] = useState(() => StorageService.getCV());

  // Projects
  const [projects, setProjects] = useState(() => StorageService.getProjects());

  // Settings
  const [settings, setSettings] = useState(() => StorageService.getSettings());

  // Global Quick Search Modal state (Cmd/Ctrl + K)
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Mobile navigation slide-out drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Interview Reminder',
      message: 'Upcoming interview with Stripe for Frontend Intern role next week.',
      time: '10m ago',
      type: 'interview',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Roadmap Milestone Reached',
      message: 'You completed Stage 1: Web Foundations & Core JavaScript!',
      time: '2h ago',
      type: 'milestone',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Skill Gap Recommendation',
      message: 'Upgrading TypeScript to Level 3 will boost your career readiness to 85%.',
      time: '1d ago',
      type: 'skill',
      read: true
    }
  ]);

  // Global Toast Messages
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = {
      id,
      type: toast.type || 'info', // success | error | warning | info
      title: toast.title || '',
      message: toast.message || '',
      duration: toast.duration || 4000
    };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Keyboard shortcut listener for Cmd/Ctrl+K quick search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Set target career
  const setTargetCareer = (careerId) => {
    setTargetCareerIdState(careerId);
    StorageService.saveTargetCareer(careerId);
    addToast({
      type: 'success',
      title: 'Target Career Updated',
      message: `Now tracking progress for ${CareerService.getCareerById(careerId).title}`
    });
  };

  // Skills CRUD
  const addSkill = (newSkill) => {
    const skillWithId = {
      ...newSkill,
      id: 'sk_' + Date.now(),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    const updated = [skillWithId, ...skills];
    setSkills(updated);
    StorageService.saveSkills(updated);
    addToast({
      type: 'success',
      title: 'Skill Added',
      message: `${newSkill.name} added to your tracker`
    });
  };

  const updateSkill = (id, updatedFields) => {
    const updated = skills.map(s => (s.id === id ? { ...s, ...updatedFields, lastUpdated: new Date().toISOString().split('T')[0] } : s));
    setSkills(updated);
    StorageService.saveSkills(updated);
    addToast({
      type: 'info',
      title: 'Skill Updated',
      message: 'Proficiency updated successfully'
    });
  };

  const deleteSkill = (id) => {
    const skillToDelete = skills.find(s => s.id === id);
    const updated = skills.filter(s => s.id !== id);
    setSkills(updated);
    StorageService.saveSkills(updated);
    addToast({
      type: 'warning',
      title: 'Skill Removed',
      message: `${skillToDelete?.name || 'Skill'} removed from tracker`
    });
  };

  // Roadmap actions
  const toggleTaskCompleted = (careerId, stageId, taskId) => {
    const currentRoadmap = roadmaps[careerId] || INITIAL_ROADMAPS[careerId] || roadmaps['frontend-dev'];
    if (!currentRoadmap) return;

    let wasCompleted = false;
    const updatedStages = currentRoadmap.stages.map(stage => {
      if (stage.id !== stageId) return stage;
      return {
        ...stage,
        tasks: stage.tasks.map(task => {
          if (task.id === taskId) {
            wasCompleted = !task.completed;
            return { ...task, completed: !task.completed };
          }
          return task;
        })
      };
    });

    const updatedRoadmaps = {
      ...roadmaps,
      [careerId]: {
        ...currentRoadmap,
        stages: updatedStages
      }
    };

    setRoadmaps(updatedRoadmaps);
    StorageService.saveRoadmaps(updatedRoadmaps);

    addToast({
      type: wasCompleted ? 'success' : 'info',
      title: wasCompleted ? 'Task Completed! 🚀' : 'Task Marked Incomplete',
      message: wasCompleted ? 'Great progress! Career readiness score updated.' : 'Task moved back to active list.'
    });
  };

  const addCustomTask = (careerId, stageId, taskData) => {
    const currentRoadmap = roadmaps[careerId] || INITIAL_ROADMAPS[careerId] || roadmaps['frontend-dev'];
    if (!currentRoadmap) return;

    const newTask = {
      id: 'task_' + Date.now(),
      title: taskData.title,
      description: taskData.description || 'Custom student milestone',
      skills: taskData.skills || ['Self-directed'],
      duration: taskData.duration || '6 hours',
      project: taskData.project || '',
      completed: false,
      isCustom: true
    };

    const updatedStages = currentRoadmap.stages.map(stage => {
      if (stage.id !== stageId) return stage;
      return {
        ...stage,
        tasks: [...stage.tasks, newTask]
      };
    });

    const updatedRoadmaps = {
      ...roadmaps,
      [careerId]: {
        ...currentRoadmap,
        stages: updatedStages
      }
    };

    setRoadmaps(updatedRoadmaps);
    StorageService.saveRoadmaps(updatedRoadmaps);

    addToast({
      type: 'success',
      title: 'Custom Task Added',
      message: `"${taskData.title}" added to your roadmap.`
    });
  };

  // Jobs CRUD
  const addJob = (jobData) => {
    const newJob = {
      ...jobData,
      id: 'job_' + Date.now(),
      appliedDate: jobData.appliedDate || new Date().toISOString().split('T')[0]
    };
    const updated = [newJob, ...jobs];
    setJobs(updated);
    StorageService.saveJobs(updated);
    addToast({
      type: 'success',
      title: 'Job Application Added',
      message: `${jobData.position} at ${jobData.company} logged`
    });
  };

  const updateJob = (id, updatedFields) => {
    const updated = jobs.map(j => (j.id === id ? { ...j, ...updatedFields } : j));
    setJobs(updated);
    StorageService.saveJobs(updated);
    addToast({
      type: 'info',
      title: 'Application Updated',
      message: 'Job status and notes saved'
    });
  };

  const deleteJob = (id) => {
    const toDelete = jobs.find(j => j.id === id);
    const updated = jobs.filter(j => j.id !== id);
    setJobs(updated);
    StorageService.saveJobs(updated);
    addToast({
      type: 'warning',
      title: 'Application Removed',
      message: `Application for ${toDelete?.company || 'job'} deleted`
    });
  };

  // CV actions
  const updateCVData = (newCV) => {
    setCvData(newCV);
    StorageService.saveCV(newCV);
  };

  // Projects actions
  const toggleProjectStarted = (projectId) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, started: !p.started };
      }
      return p;
    });
    setProjects(updated);
    StorageService.saveProjects(updated);
  };

  const toggleProjectCompleted = (projectId) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        const nextState = !p.completed;
        return {
          ...p,
          completed: nextState,
          started: nextState ? true : p.started
        };
      }
      return p;
    });
    setProjects(updated);
    StorageService.saveProjects(updated);
    addToast({
      type: 'success',
      title: 'Project Status Updated',
      message: 'Portfolio achievement saved!'
    });
  };

  const toggleChecklistItem = (projectId, checkId) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          checklist: p.checklist.map(item => (item.id === checkId ? { ...item, completed: !item.completed } : item))
        };
      }
      return p;
    });
    setProjects(updated);
    StorageService.saveProjects(updated);
  };

  // Settings
  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    StorageService.saveSettings(updated);
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Preferences updated successfully'
    });
  };

  // Reset all data
  const resetAllData = () => {
    StorageService.resetToFactoryDefaults();
    setTargetCareerIdState(StorageService.getTargetCareer());
    setSkills(StorageService.getSkills());
    setRoadmaps(StorageService.getRoadmaps());
    setJobs(StorageService.getJobs());
    setCvData(StorageService.getCV());
    setProjects(StorageService.getProjects());
    setSettings(StorageService.getSettings());
    addToast({
      type: 'info',
      title: 'Reset Completed',
      message: 'Workspace restored to default student demo data.'
    });
  };

  // Notifications
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Real-time computed readiness metrics
  const readiness = CareerService.calculateReadiness(targetCareerId, skills, roadmaps);

  return (
    <AppContext.Provider
      value={{
        targetCareerId,
        setTargetCareer,
        skills,
        addSkill,
        updateSkill,
        deleteSkill,
        roadmaps,
        toggleTaskCompleted,
        addCustomTask,
        jobs,
        addJob,
        updateJob,
        deleteJob,
        cvData,
        updateCVData,
        projects,
        toggleProjectStarted,
        toggleProjectCompleted,
        toggleChecklistItem,
        settings,
        updateSettings,
        resetAllData,
        readiness,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        toasts,
        addToast,
        removeToast,
        isSearchOpen,
        setIsSearchOpen,
        isMobileDrawerOpen,
        setIsMobileDrawerOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
