import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { isDatabaseConnected } from '../config/database.js';
import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { Roadmap } from '../models/Roadmap.js';
import { JobApplication } from '../models/JobApplication.js';
import { CV } from '../models/CV.js';
import { UserProject } from '../models/UserProject.js';
import { Project } from '../models/Project.js';
import { Assessment } from '../models/Assessment.js';
import { STARTER_ROADMAPS } from './roadmap.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'persistent_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory document store structure with atomic file synchronization
class PersistentStore {
  constructor() {
    this.data = {
      users: [],
      skills: [],
      roadmaps: [],
      jobApplications: [],
      cvs: [],
      userProjects: [],
      assessments: [],
      meta: {
        created: new Date().toISOString(),
        version: '1.0'
      }
    };
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        if (raw && raw.trim()) {
          const parsed = JSON.parse(raw);
          this.data = {
            users: Array.isArray(parsed.users) ? parsed.users : [],
            skills: Array.isArray(parsed.skills) ? parsed.skills : [],
            roadmaps: Array.isArray(parsed.roadmaps) ? parsed.roadmaps : [],
            jobApplications: Array.isArray(parsed.jobApplications) ? parsed.jobApplications : [],
            cvs: Array.isArray(parsed.cvs) ? parsed.cvs : [],
            userProjects: Array.isArray(parsed.userProjects) ? parsed.userProjects : [],
            assessments: Array.isArray(parsed.assessments) ? parsed.assessments : [],
            meta: parsed.meta || { version: '1.0', updated: new Date().toISOString() }
          };
          return;
        }
      }
      this.saveToDisk();
    } catch (err) {
      console.warn('[PersistentStore] Error loading from disk, initializing fresh store:', err.message);
      this.saveToDisk();
    }
  }

  saveToDisk() {
    try {
      this.data.meta.updated = new Date().toISOString();
      const content = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(DB_FILE, content, 'utf8');
      return true;
    } catch (err) {
      try {
        const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
        const content = JSON.stringify(this.data, null, 2);
        fs.writeFileSync(tmpFile, content, 'utf8');
        fs.copyFileSync(tmpFile, DB_FILE);
        try { fs.unlinkSync(tmpFile); } catch (e) {}
        return true;
      } catch (innerErr) {
        console.error('[PersistentStore] Save error:', innerErr.message);
        return false;
      }
    }
  }

  // --- Users ---
  async findUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    if (isDatabaseConnected()) {
      return await User.findOne({ email: cleanEmail }).select('+passwordHash');
    }
    return this.data.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  }

  async findUserById(id, includePassword = false) {
    if (!id) return null;
    const strId = id.toString();
    if (isDatabaseConnected()) {
      return includePassword
        ? await User.findById(id).select('+passwordHash')
        : await User.findById(id).select('-passwordHash');
    }
    const found = this.data.users.find(u => u._id.toString() === strId || u.id === strId);
    if (!found) return null;
    if (includePassword) {
      return { ...found };
    }
    const copy = { ...found };
    delete copy.passwordHash;
    return copy;
  }

  async createUser({ name, email, password, degree = '', university = '', targetCareer = 'frontend-dev', role = 'user' }) {
    const cleanEmail = email.toLowerCase().trim();
    const assignedRole = role === 'admin' || cleanEmail === 'admin@skillpath.ai' ? 'admin' : 'user';
    if (isDatabaseConnected()) {
      const newUser = await User.create({
        name: name.trim(),
        email: cleanEmail,
        passwordHash: password,
        degree,
        university,
        targetCareer,
        role: assignedRole,
      });
      return newUser;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const id = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

    const newUser = {
      _id: id,
      id: id,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: assignedRole,
      degree: degree || '',
      university: university || '',
      targetCareer: targetCareer || 'frontend-dev',
      headline: '',
      educationLevel: "Bachelor's Degree",
      gradYear: '2027',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b5cf6&color=fff&bold=true`,
      interests: [],
      existingSkills: [],
      weeklyLearningHours: 15,
      theme: 'dark',
      notificationPreferences: {
        emailJobAlerts: true,
        roadmapReminders: true,
        interviewReminders: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.users.push(newUser);

    // Initialize default starter skills for this user
    const defaultSkills = [
      { name: 'HTML5 & Modern CSS', category: 'frontend', currentLevel: 3, targetLevel: 4, progress: 60, hoursSpent: 20 },
      { name: 'JavaScript (ES6+)', category: 'programming', currentLevel: 2, targetLevel: 4, progress: 45, hoursSpent: 35 },
      { name: 'React.js', category: 'frontend', currentLevel: 1, targetLevel: 4, progress: 20, hoursSpent: 12 },
      { name: 'Git & Version Control', category: 'tools', currentLevel: 2, targetLevel: 3, progress: 50, hoursSpent: 15 }
    ];

    defaultSkills.forEach(s => {
      this.data.skills.push({
        _id: 'skl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        userId: id,
        ...s,
        notes: 'Initial starter baseline',
        lastUpdated: new Date().toISOString()
      });
    });

    // Initialize blank CV
    this.data.cvs.push({
      _id: 'cv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: id,
      personalInfo: {
        fullName: name.trim(),
        email: cleanEmail,
        phone: '',
        location: '',
        title: 'Aspiring Software Engineer',
        summary: ''
      },
      education: [],
      experience: [],
      projects: [],
      skills: { technical: [], frameworks: [], tools: [], soft: [] },
      certifications: [],
      selectedTemplate: 'modern',
      updatedAt: new Date().toISOString()
    });

    // Initialize starter roadmap
    const starterRoadmap = STARTER_ROADMAPS[targetCareer] || STARTER_ROADMAPS['frontend-dev'];
    if (starterRoadmap) {
      this.data.roadmaps.push({
        _id: 'rdm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        userId: id,
        careerType: targetCareer,
        title: starterRoadmap.title,
        description: starterRoadmap.description,
        stages: JSON.parse(JSON.stringify(starterRoadmap.stages)),
        completionPercentage: 0,
        updatedAt: new Date().toISOString()
      });
    }

    this.saveToDisk();

    const result = { ...newUser };
    delete result.passwordHash;
    return result;
  }

  async verifyPassword(plainPassword, passwordHash) {
    if (!plainPassword || !passwordHash) return false;
    return await bcrypt.compare(plainPassword, passwordHash);
  }

  async updateUserPassword(userId, newPassword) {
    const strId = userId.toString();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    if (isDatabaseConnected()) {
      const user = await User.findById(userId);
      if (!user) return false;
      user.passwordHash = passwordHash;
      await user.save();
      return true;
    }

    const idx = this.data.users.findIndex(u => u._id.toString() === strId || u.id === strId);
    if (idx === -1) return false;

    this.data.users[idx].passwordHash = passwordHash;
    this.data.users[idx].updatedAt = new Date().toISOString();
    this.saveToDisk();
    return true;
  }

  async updateUser(userId, updates = {}) {
    const strId = userId.toString();
    if (isDatabaseConnected()) {
      return await User.findByIdAndUpdate(userId, updates, { new: true }).select('-passwordHash');
    }

    const idx = this.data.users.findIndex(u => u._id.toString() === strId || u.id === strId);
    if (idx === -1) return null;

    const safeUpdates = { ...updates };
    delete safeUpdates.passwordHash;
    delete safeUpdates._id;
    delete safeUpdates.id;

    this.data.users[idx] = {
      ...this.data.users[idx],
      ...safeUpdates,
      updatedAt: new Date().toISOString()
    };

    this.saveToDisk();
    const copy = { ...this.data.users[idx] };
    delete copy.passwordHash;
    return copy;
  }

  // --- Skills ---
  async getSkills(userId) {
    const strId = userId.toString();
    if (isDatabaseConnected()) {
      return await Skill.find({ userId }).sort({ currentLevel: -1, name: 1 });
    }
    return this.data.skills.filter(s => s.userId.toString() === strId);
  }

  async createSkill(userId, skillData) {
    const strId = userId.toString();
    if (isDatabaseConnected()) {
      return await Skill.create({ userId, ...skillData });
    }

    const newSkill = {
      _id: 'skl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: strId,
      name: skillData.name.trim(),
      category: skillData.category || 'frontend',
      currentLevel: Number(skillData.currentLevel) || 1,
      targetLevel: Number(skillData.targetLevel) || 4,
      progress: Number(skillData.progress) || 20,
      hoursSpent: Number(skillData.hoursSpent) || 0,
      notes: skillData.notes || '',
      lastUpdated: new Date().toISOString()
    };

    this.data.skills.push(newSkill);
    this.saveToDisk();
    return newSkill;
  }

  async updateSkill(userId, skillId, skillData) {
    const strUserId = userId.toString();
    const strSkillId = skillId.toString();

    if (isDatabaseConnected()) {
      return await Skill.findOneAndUpdate({ _id: skillId, userId }, skillData, { new: true });
    }

    const idx = this.data.skills.findIndex(s => s.userId.toString() === strUserId && s._id.toString() === strSkillId);
    if (idx === -1) return null;

    this.data.skills[idx] = {
      ...this.data.skills[idx],
      ...skillData,
      lastUpdated: new Date().toISOString()
    };

    this.saveToDisk();
    return this.data.skills[idx];
  }

  async deleteSkill(userId, skillId) {
    const strUserId = userId.toString();
    const strSkillId = skillId.toString();

    if (isDatabaseConnected()) {
      return await Skill.findOneAndDelete({ _id: skillId, userId });
    }

    const before = this.data.skills.length;
    this.data.skills = this.data.skills.filter(s => !(s.userId.toString() === strUserId && s._id.toString() === strSkillId));
    this.saveToDisk();
    return this.data.skills.length < before;
  }

  // --- Roadmaps ---
  async getUserRoadmaps(userId) {
    const strId = userId.toString();
    if (isDatabaseConnected()) {
      return await Roadmap.find({ userId });
    }
    return this.data.roadmaps.filter(r => r.userId.toString() === strId);
  }

  async getUserRoadmap(userId, careerType) {
    const strId = userId.toString();
    if (isDatabaseConnected()) {
      let r = await Roadmap.findOne({ userId, careerType });
      if (!r) {
        const starter = STARTER_ROADMAPS[careerType] || STARTER_ROADMAPS['frontend-dev'];
        r = await Roadmap.create({
          userId,
          careerType,
          title: starter.title,
          description: starter.description,
          stages: starter.stages
        });
      }
      return r;
    }

    let existing = this.data.roadmaps.find(r => r.userId.toString() === strId && r.careerType === careerType);
    if (!existing) {
      const starter = STARTER_ROADMAPS[careerType] || STARTER_ROADMAPS['frontend-dev'];
      existing = {
        _id: 'rdm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        userId: strId,
        careerType,
        title: starter.title,
        description: starter.description,
        stages: JSON.parse(JSON.stringify(starter.stages)),
        completionPercentage: 0,
        updatedAt: new Date().toISOString()
      };
      this.data.roadmaps.push(existing);
      this.saveToDisk();
    }
    return existing;
  }

  async updateRoadmapTask(userId, careerType, stageId, taskId, completed) {
    const strId = userId.toString();
    if (isDatabaseConnected()) {
      const roadmap = await Roadmap.findOne({ userId, careerType });
      if (!roadmap) return null;

      roadmap.stages.forEach(st => {
        if (st.id === stageId) {
          st.tasks.forEach(t => {
            if (t.id === taskId) {
              t.completed = completed;
            }
          });
        }
      });
      await roadmap.save();
      return roadmap;
    }

    const roadmap = await this.getUserRoadmap(userId, careerType);
    if (!roadmap) return null;

    let totalTasks = 0;
    let completedCount = 0;

    roadmap.stages.forEach(st => {
      if (st.id === stageId) {
        st.tasks.forEach(t => {
          if (t.id === taskId) {
            t.completed = completed;
          }
        });
      }
      st.tasks.forEach(t => {
        totalTasks++;
        if (t.completed) completedCount++;
      });
    });

    roadmap.completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
    roadmap.updatedAt = new Date().toISOString();

    this.saveToDisk();
    return roadmap;
  }

  // --- Job Applications ---
  async getJobApplications(userId, filters = {}) {
    const strId = userId.toString();
    if (isDatabaseConnected()) {
      const query = { userId };
      if (filters.status && filters.status !== 'All') query.status = filters.status;
      return await JobApplication.find(query).sort({ appliedDate: -1 });
    }

    let list = this.data.jobApplications.filter(j => j.userId.toString() === strId);
    if (filters.status && filters.status !== 'All') {
      list = list.filter(j => j.status === filters.status);
    }
    return list;
  }

  async createJobApplication(userId, jobData) {
    const strId = userId.toString();
    if (isDatabaseConnected()) {
      return await JobApplication.create({ userId, ...jobData });
    }

    const newApp = {
      _id: 'job_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: strId,
      company: jobData.company,
      position: jobData.position,
      location: jobData.location || 'Remote',
      type: jobData.type || 'Full-time',
      salary: jobData.salary || '',
      jobUrl: jobData.jobUrl || '',
      status: jobData.status || 'Saved',
      appliedDate: jobData.appliedDate || new Date().toISOString(),
      notes: jobData.notes || '',
      createdAt: new Date().toISOString()
    };

    this.data.jobApplications.push(newApp);
    this.saveToDisk();
    return newApp;
  }

  async updateJobApplication(userId, applicationId, updates) {
    const strUserId = userId.toString();
    const strAppId = applicationId.toString();

    if (isDatabaseConnected()) {
      return await JobApplication.findOneAndUpdate({ _id: applicationId, userId }, updates, { new: true });
    }

    const idx = this.data.jobApplications.findIndex(j => j.userId.toString() === strUserId && j._id.toString() === strAppId);
    if (idx === -1) return null;

    this.data.jobApplications[idx] = {
      ...this.data.jobApplications[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveToDisk();
    return this.data.jobApplications[idx];
  }

  async deleteJobApplication(userId, applicationId) {
    const strUserId = userId.toString();
    const strAppId = applicationId.toString();

    if (isDatabaseConnected()) {
      return await JobApplication.findOneAndDelete({ _id: applicationId, userId });
    }

    const before = this.data.jobApplications.length;
    this.data.jobApplications = this.data.jobApplications.filter(j => !(j.userId.toString() === strUserId && j._id.toString() === strAppId));
    this.saveToDisk();
    return this.data.jobApplications.length < before;
  }

  // --- CV Details ---
  async getCV(userId) {
    const strId = userId.toString();
    if (isDatabaseConnected()) {
      return await CV.findOne({ userId });
    }
    return this.data.cvs.find(c => c.userId.toString() === strId) || null;
  }

  async saveCV(userId, cvPayload) {
    const strId = userId.toString();
    if (isDatabaseConnected()) {
      let cv = await CV.findOne({ userId });
      if (!cv) {
        cv = await CV.create({ userId, ...cvPayload });
      } else {
        Object.assign(cv, cvPayload);
        await cv.save();
      }
      return cv;
    }

    const idx = this.data.cvs.findIndex(c => c.userId.toString() === strId);
    if (idx === -1) {
      const newCv = {
        _id: 'cv_' + Date.now(),
        userId: strId,
        ...cvPayload,
        updatedAt: new Date().toISOString()
      };
      this.data.cvs.push(newCv);
      this.saveToDisk();
      return newCv;
    }

    this.data.cvs[idx] = {
      ...this.data.cvs[idx],
      ...cvPayload,
      updatedAt: new Date().toISOString()
    };
    this.saveToDisk();
    return this.data.cvs[idx];
  }

  // --- User Projects ---
  async getUserProjects(userId) {
    const strId = userId.toString();
    if (isDatabaseConnected()) {
      return await UserProject.find({ userId });
    }
    return this.data.userProjects.filter(p => p.userId.toString() === strId);
  }

  async updateUserProject(userId, projectSlug, updates) {
    const strId = userId.toString();
    if (isDatabaseConnected()) {
      return await UserProject.findOneAndUpdate(
        { userId, projectSlug },
        { $set: updates },
        { new: true, upsert: true }
      );
    }

    const idx = this.data.userProjects.findIndex(p => p.userId.toString() === strId && p.projectSlug === projectSlug);
    if (idx === -1) {
      const newProj = {
        _id: 'upr_' + Date.now(),
        userId: strId,
        projectSlug,
        started: updates.started ?? false,
        completed: updates.completed ?? false,
        checklist: updates.checklist || [],
        repoUrl: updates.repoUrl || '',
        liveDemoUrl: updates.liveDemoUrl || '',
        updatedAt: new Date().toISOString()
      };
      this.data.userProjects.push(newProj);
      this.saveToDisk();
      return newProj;
    }

    this.data.userProjects[idx] = {
      ...this.data.userProjects[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveToDisk();
    return this.data.userProjects[idx];
  }

  // --- Complete Private Data Export (STRICTLY SANITIZED - NO PASSWORDS/TOKENS) ---
  async exportUserData(userId) {
    const strId = userId.toString();

    let userObj = null;
    let skillsList = [];
    let roadmapsList = [];
    let jobsList = [];
    let cvObj = null;
    let projectsList = [];
    let assessmentsList = [];

    if (isDatabaseConnected()) {
      const [u, sks, rdms, jbs, cvData, projs, asms] = await Promise.all([
        User.findById(userId).select('-passwordHash -resetPasswordToken -resetPasswordExpires'),
        Skill.find({ userId }),
        Roadmap.find({ userId }),
        JobApplication.find({ userId }),
        CV.findOne({ userId }),
        UserProject.find({ userId }),
        Assessment.find({ userId })
      ]);
      userObj = u ? (u.toObject ? u.toObject() : u) : null;
      skillsList = sks || [];
      roadmapsList = rdms || [];
      jobsList = jbs || [];
      cvObj = cvData ? (cvData.toObject ? cvData.toObject() : cvData) : null;
      projectsList = projs || [];
      assessmentsList = asms || [];
    } else {
      const rawUser = this.data.users.find(u => u._id.toString() === strId || u.id === strId);
      userObj = rawUser ? { ...rawUser } : null;
      skillsList = this.data.skills.filter(s => s.userId.toString() === strId);
      roadmapsList = this.data.roadmaps.filter(r => r.userId.toString() === strId);
      jobsList = this.data.jobApplications.filter(j => j.userId.toString() === strId);
      cvObj = this.data.cvs.find(c => c.userId.toString() === strId) || null;
      projectsList = this.data.userProjects.filter(p => p.userId.toString() === strId);
      assessmentsList = this.data.assessments.filter(a => a.userId && a.userId.toString() === strId);
    }

    // STRICT SANITIZATION: Eliminate any sensitive fields
    if (userObj) {
      delete userObj.passwordHash;
      delete userObj.password;
      delete userObj.resetPasswordToken;
      delete userObj.resetPasswordExpires;
      delete userObj.token;
      delete userObj.__v;
    }

    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      exportEngine: isDatabaseConnected() ? 'MongoDB' : 'PersistentFileStore',
      user: userObj,
      skills: skillsList,
      roadmaps: roadmapsList,
      savedJobs: jobsList,
      cv: cvObj,
      projects: projectsList,
      assessments: assessmentsList,
      summary: {
        totalSkills: skillsList.length,
        totalRoadmaps: roadmapsList.length,
        totalApplications: jobsList.length,
        hasCV: Boolean(cvObj),
        totalUserProjects: projectsList.length
      }
    };
  }
}

export const DataStorageService = new PersistentStore();
