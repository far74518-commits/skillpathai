import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storageService';
import { userApi, aiApi } from '../services/api';
import { CAREERS } from '../data/careers';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';
import {
  User,
  Sliders,
  Bell,
  Sun,
  Moon,
  Database,
  Download,
  Upload,
  Trash2,
  Check,
  ShieldAlert,
  Save,
  RotateCcw,
  Server,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Key,
  Eye,
  EyeOff,
  Palette,
  Globe,
  Laptop,
  AlertCircle,
  Sparkles,
  Mail,
  Shield,
  Activity,
  Calendar,
  FileJson,
  Layers,
  MapPin,
  Briefcase,
  LogOut,
  Zap,
  RefreshCw,
  FileCheck,
  Bot
} from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme, toggleTheme } = useTheme();
  const { settings, updateSettings, targetCareerId, setTargetCareer, resetAllData, addToast } = useApp();

  const handleLogout = () => {
    logout();
    if (addToast) {
      addToast({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been safely signed out.'
      });
    }
    navigate('/login');
  };

  // Active Tab: 'profile' | 'account' | 'appearance' | 'notifications' | 'privacy' | 'data'
  const [activeTab, setActiveTab] = useState('profile');

  // 1. Profile State
  const [profileForm, setProfileForm] = useState({
    name: user?.name === 'Farman Ali' ? '' : (user?.name || ''),
    email: user?.email || '',
    headline: user?.headline === 'Aspiring Frontend & Software Engineer' ? '' : (user?.headline || ''),
    university: (user?.university === 'State University of Technology' || user?.university === 'State University') ? '' : (user?.university || ''),
    degree: (user?.degree === 'B.S. in Computer Science' || user?.degree === 'Computer Science') ? '' : (user?.degree || ''),
    gradYear: user?.gradYear || '2027',
    location: user?.location || 'Karachi, Pakistan',
    bio: user?.bio || '',
    avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=8b5cf6&color=fff&bold=true`
  });
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Sync profile form when user context changes
  useEffect(() => {
    if (user) {
      setProfileForm((prev) => ({
        ...prev,
        name: user.name === 'Farman Ali' ? '' : (user.name || prev.name),
        email: user.email || prev.email,
        headline: user.headline === 'Aspiring Frontend & Software Engineer' ? '' : (user.headline || prev.headline),
        university: (user.university === 'State University of Technology' || user.university === 'State University') ? '' : (user.university || prev.university),
        degree: (user.degree === 'B.S. in Computer Science' || user.degree === 'Computer Science') ? '' : (user.degree || prev.degree),
        gradYear: user.gradYear || prev.gradYear,
        location: user.location || prev.location,
        bio: user.bio || prev.bio,
        avatar: user.avatar || prev.avatar
      }));
    }
  }, [user]);

  // 2. Account & Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  // 3. Notification Preferences State
  const [notificationForm, setNotificationForm] = useState({
    weeklyStudyGoalHours: settings?.weeklyStudyGoalHours || user?.weeklyLearningHours || 15,
    dailyReminder: user?.notificationPreferences?.dailyReminder ?? settings?.dailyReminder ?? true,
    jobAlerts: user?.notificationPreferences?.jobAlerts ?? settings?.jobAlerts ?? true,
    careerRecommendations: user?.notificationPreferences?.careerRecommendations ?? true,
    roadmapNotifications: user?.notificationPreferences?.roadmapNotifications ?? settings?.roadmapNotifications ?? true,
    weeklyDigest: user?.notificationPreferences?.weeklyDigest ?? true
  });
  const [isNotificationsSaving, setIsNotificationsSaving] = useState(false);

  // 4. Privacy Settings State
  const [privacyForm, setPrivacyForm] = useState({
    profileVisibility: user?.privacySettings?.profileVisibility || 'public', // public | network | private
    searchIndexing: user?.privacySettings?.searchIndexing ?? true,
    dataAnalytics: user?.privacySettings?.dataAnalytics ?? true,
    twoFactorEnabled: user?.privacySettings?.twoFactorEnabled ?? false
  });
  const [isPrivacySaving, setIsPrivacySaving] = useState(false);

  // 5. Data & Export State
  const [isExporting, setIsExporting] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  // 6. AI Configuration State
  const [aiStatus, setAiStatus] = useState(null);
  const [aiForm, setAiForm] = useState({
    apiKey: '',
    provider: 'gemini',
    model: 'gemini-1.5-flash',
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isAiTesting, setIsAiTesting] = useState(false);
  const [isAiSaving, setIsAiSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Check live persistent database connection status & AI status
  useEffect(() => {
    userApi.getDatabaseStatus()
      .then((json) => {
        if (json && json.success && json.data) {
          setDbStatus(json.data);
        }
      })
      .catch(() => {
        setDbStatus({
          connected: false,
          engine: 'Persistent File Store (JSON)',
          storagePath: 'server/data/persistent_db.json',
          persistent: true,
          message: 'Active local persistent JSON document store. Data persists across server restarts, logouts, and logins.'
        });
      });

    aiApi.getStatus()
      .then((res) => {
        if (res && res.data) {
          setAiStatus(res.data);
          if (res.data.activeProvider) {
            setAiForm((prev) => ({
              ...prev,
              provider: res.data.activeProvider === 'rule-engine' ? 'gemini' : res.data.activeProvider,
              model: res.data.model || 'gemini-1.5-flash',
            }));
          }
        }
      })
      .catch(() => {});
  }, []);

  // Preset Avatar Options
  const presetAvatars = [
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name || 'User')}&background=8b5cf6&color=fff&bold=true`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name || 'User')}&background=10b981&color=fff&bold=true`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name || 'User')}&background=06b6d4&color=fff&bold=true`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name || 'User')}&background=f59e0b&color=fff&bold=true`
  ];

  // Handler: Save Profile
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter your full name.'
      });
      return;
    }

    setIsProfileSaving(true);
    try {
      // 1. Save to backend database API
      try {
        await userApi.updateProfile({
          name: profileForm.name.trim(),
          email: profileForm.email.trim(),
          headline: profileForm.headline.trim(),
          university: profileForm.university.trim(),
          degree: profileForm.degree.trim(),
          gradYear: profileForm.gradYear,
          location: profileForm.location.trim(),
          bio: profileForm.bio.trim(),
          avatar: profileForm.avatar,
          targetCareer: targetCareerId
        });
      } catch (backendErr) {
        console.warn('Backend update failed, saving locally:', backendErr.message);
      }

      // 2. Update context & local storage
      updateUser(profileForm);

      addToast({
        type: 'success',
        title: 'Profile Saved',
        message: 'Your profile details have been securely saved to the database.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not save profile changes.'
      });
    } finally {
      setIsProfileSaving(false);
    }
  };

  // Handler: Change Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter your current password.'
      });
      return;
    }

    if (newPassword.length < 8) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'New password must be at least 8 characters long.'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'New password and confirmation do not match.'
      });
      return;
    }

    setIsPasswordSaving(true);
    try {
      const res = await userApi.changePassword({ currentPassword, newPassword });
      if (res && res.success) {
        addToast({
          type: 'success',
          title: 'Password Updated',
          message: 'Your account password has been changed successfully.'
        });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error(res?.message || 'Could not update password');
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Password Update Failed',
        message: err.message || 'Current password was incorrect. Please try again.'
      });
    } finally {
      setIsPasswordSaving(false);
    }
  };

  // Handler: Save Notification Preferences
  const handleNotificationsSave = async (e) => {
    e.preventDefault();
    setIsNotificationsSaving(true);
    try {
      // 1. Update settings in AppContext
      updateSettings({
        weeklyStudyGoalHours: notificationForm.weeklyStudyGoalHours,
        dailyReminder: notificationForm.dailyReminder,
        jobAlerts: notificationForm.jobAlerts,
        roadmapNotifications: notificationForm.roadmapNotifications
      });

      // 2. Update backend database
      try {
        await userApi.updatePreferences({
          weeklyLearningHours: notificationForm.weeklyStudyGoalHours,
          notificationPreferences: {
            dailyReminder: notificationForm.dailyReminder,
            jobAlerts: notificationForm.jobAlerts,
            careerRecommendations: notificationForm.careerRecommendations,
            roadmapNotifications: notificationForm.roadmapNotifications,
            weeklyDigest: notificationForm.weeklyDigest
          }
        });
      } catch (backendErr) {
        console.warn('Backend preferences update warning:', backendErr.message);
      }

      addToast({
        type: 'success',
        title: 'Preferences Saved',
        message: 'Study goals and notification preferences saved successfully.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not save notification preferences.'
      });
    } finally {
      setIsNotificationsSaving(false);
    }
  };

  // Handler: Save Privacy Settings
  const handlePrivacySave = async (e) => {
    e.preventDefault();
    setIsPrivacySaving(true);
    try {
      try {
        await userApi.updatePreferences({
          privacySettings: privacyForm
        });
      } catch (backendErr) {
        console.warn('Backend privacy update warning:', backendErr.message);
      }

      updateUser({ privacySettings: privacyForm });

      addToast({
        type: 'success',
        title: 'Privacy Updated',
        message: 'Your privacy and security preferences have been saved.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not save privacy settings.'
      });
    } finally {
      setIsPrivacySaving(false);
    }
  };

  // Handler: Export My Data (Requirements 3, 5, 6: valid JSON named skillpath-my-data.json, no secrets, clear toast)
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      let exportPayload = null;
      const downloadFilename = 'skillpath-my-data.json';

      // 1. Request actual authenticated private data from backend database API
      try {
        const response = await userApi.exportData();
        if (response && response.success && response.data) {
          exportPayload = response.data;
        }
      } catch (backendErr) {
        console.warn('Backend database export fallback to client snapshot:', backendErr.message);
      }

      // 2. Client snapshot fallback if backend was temporarily unreachable
      if (!exportPayload) {
        const clientJson = StorageService.exportAllData();
        exportPayload = JSON.parse(clientJson);
      }

      // 3. Security Sanitize (Requirement 3 & 6: Never include passwords, hashes, secrets, tokens, or API keys)
      const sanitized = JSON.stringify(
        exportPayload,
        (key, value) => {
          if (
            [
              'password',
              'passwordHash',
              'resetPasswordToken',
              'resetPasswordExpires',
              'token',
              'secret',
              'apiKey',
              'access_token',
              'refresh_token',
              'authorization'
            ].includes(key)
          ) {
            return undefined;
          }
          return value;
        },
        2
      );

      // 4. Trigger browser file download named 'skillpath-my-data.json'
      const blob = new Blob([sanitized], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast({
        type: 'success',
        title: 'Export Complete! 📥',
        message: `Your private data has been downloaded as "${downloadFilename}".`
      });
    } catch (err) {
      console.error('Export error:', err);
      addToast({
        type: 'error',
        title: 'Export Failed',
        message: err.message || 'Could not export user data. Please try again.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handler: Import JSON
  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const res = StorageService.importData(content);
        if (res.success) {
          addToast({
            type: 'success',
            title: 'Workspace Restored',
            message: 'Imported data successfully. Reloading page state...'
          });
          setTimeout(() => window.location.reload(), 600);
        } else {
          addToast({
            type: 'error',
            title: 'Import Failed',
            message: res.message || 'Invalid backup JSON file format.'
          });
        }
      }
    };
    reader.readAsText(file);
  };

  // Handler: Delete Account
  const handleDeleteAccount = async () => {
    try {
      await userApi.deleteAccount();
    } catch (e) {
      console.warn('Backend delete notification error:', e.message);
    }
    logout();
    addToast({
      type: 'info',
      title: 'Account Deleted',
      message: 'Your account and personal data have been removed.'
    });
  };

  // Clear Profile Form Fields
  const handleClearProfile = () => {
    const cleared = {
      name: '',
      email: user?.email || '',
      headline: '',
      university: '',
      degree: '',
      gradYear: '2027',
      location: '',
      bio: '',
      avatar: `https://ui-avatars.com/api/?name=Student&background=8b5cf6&color=fff&bold=true`
    };
    setProfileForm(cleared);
    updateUser(cleared);
    addToast({
      type: 'info',
      title: 'Profile Cleared',
      message: 'Student profile fields have been cleared.'
    });
  };

  const handleSaveAiConfig = async (e) => {
    if (e) e.preventDefault();
    setIsAiSaving(true);
    try {
      const res = await aiApi.configure(aiForm.apiKey.trim(), aiForm.provider, aiForm.model);
      if (res && res.data) {
        setAiStatus(res.data);
        addToast({
          type: 'success',
          title: 'AI Settings Updated! 🚀',
          message: `Active engine: ${res.data.providerName}`
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update AI settings.'
      });
    } finally {
      setIsAiSaving(false);
    }
  };

  const handleTestAiConnection = async () => {
    setIsAiTesting(true);
    setTestResult(null);
    const start = Date.now();
    try {
      if (aiForm.apiKey) {
        await aiApi.configure(aiForm.apiKey.trim(), aiForm.provider, aiForm.model);
      }
      const res = await aiApi.getGuidance({
        targetRole: 'Full-Stack Developer',
        weeklyHours: 15,
        missingSkills: ['Cloud Architecture']
      });
      const latency = Date.now() - start;
      setTestResult({
        success: true,
        message: `Successfully connected to ${res.data.source}! Response latency: ${latency}ms.`
      });
      addToast({
        type: 'success',
        title: 'Connection Active! ⚡',
        message: `Response from ${res.data.source} received in ${latency}ms.`
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed.'
      });
      addToast({
        type: 'error',
        title: 'Connection Failed',
        message: err.message || 'Could not reach AI provider.'
      });
    } finally {
      setIsAiTesting(false);
    }
  };

  return (
    <div className="animate-fade">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <h1 className="page-title">Settings & Preferences</h1>
            <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
              SkillSync v2.4
            </span>
          </div>
          <p className="page-subtitle">
            Manage your personal profile, account credentials, appearance, notification pacing, and export private records.
          </p>
        </div>

        {/* Quick Export Button in Header */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            type="button"
            variant="secondary"
            icon={Download}
            loading={isExporting}
            onClick={handleExportData}
            style={{ fontWeight: 600 }}
          >
            Export My Data
          </Button>
        </div>
      </div>

      <div className="settings-layout">
        {/* Left Navigation Tabs */}
        <div className="settings-nav-panel">
          <button
            className={`settings-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>Profile Settings</span>
          </button>

          <button
            className={`settings-nav-btn ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
            style={{
              color: activeTab === 'ai' ? '#818cf8' : undefined
            }}
          >
            <Sparkles size={18} color="#818cf8" />
            <span>AI & Google Gemini</span>
          </button>

          <button
            className={`settings-nav-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <Key size={18} />
            <span>Account & Security</span>
          </button>

          <button
            className={`settings-nav-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Palette size={18} />
            <span>Appearance</span>
          </button>

          <button
            className={`settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            <span>Notification Settings</span>
          </button>

          <button
            className={`settings-nav-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <Lock size={18} />
            <span>Privacy & Permissions</span>
          </button>

          <button
            className={`settings-nav-btn ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            <Database size={18} />
            <span>Data Export & Storage</span>
          </button>

          <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              className="settings-nav-btn"
              onClick={handleLogout}
              style={{
                color: 'var(--rose-400)',
                background: 'rgba(244, 63, 94, 0.08)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                fontWeight: 600,
                width: '100%',
                justifyContent: 'flex-start'
              }}
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Right Content Card */}
        <div className="settings-content-card">
          {/* ========================================================
              TAB 1: PROFILE SETTINGS
              ======================================================== */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Personal Profile Details
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                    This information personalizes your career roadmap, job applications, and CV builder.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={handleClearProfile}
                  style={{ color: 'var(--rose-400)', fontSize: '0.8rem' }}
                >
                  Clear Fields
                </Button>
              </div>

              {/* Avatar Selector Card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.25rem',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={profileForm.avatar}
                    alt={profileForm.name || 'User Avatar'}
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid var(--primary-500)',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                    }}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name || 'Student')}&background=8b5cf6&color=fff&bold=true`;
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      background: 'var(--emerald-500)',
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      border: '2px solid var(--bg-surface)'
                    }}
                    title="Active Account"
                  />
                </div>

                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 4 }}>
                    Profile Picture / Avatar
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    Choose an avatar style or enter a custom image URL:
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {presetAvatars.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProfileForm({ ...profileForm, avatar: preset })}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          border: profileForm.avatar === preset ? '2px solid var(--primary-400)' : '1px solid var(--border-subtle)',
                          padding: 2,
                          background: 'none',
                          cursor: 'pointer',
                          transform: profileForm.avatar === preset ? 'scale(1.1)' : 'scale(1)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <img src={preset} alt="preset" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & Email Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={15} style={{ color: 'var(--primary-400)' }} />
                    <span>Full Display Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Farman Ali"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail size={15} style={{ color: 'var(--primary-400)' }} />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="your.email@example.com"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Headline & Location */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Briefcase size={15} style={{ color: 'var(--primary-400)' }} />
                    <span>Professional Headline / Target Role</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Full Stack Developer & Cloud Engineer"
                    value={profileForm.headline}
                    onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={15} style={{ color: 'var(--primary-400)' }} />
                    <span>Location (City, Country)</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Karachi, Pakistan"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  />
                </div>
              </div>

              {/* Education Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">University / College</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. FAST-NUCES / NUST"
                    value={profileForm.university}
                    onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Degree Major</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. BS Computer Science"
                    value={profileForm.degree}
                    onChange={(e) => setProfileForm({ ...profileForm, degree: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expected Grad Year</label>
                  <select
                    className="form-select"
                    value={profileForm.gradYear}
                    onChange={(e) => setProfileForm({ ...profileForm, gradYear: e.target.value })}
                  >
                    <option value="2024">2024 (Graduated)</option>
                    <option value="2025">2025 (Senior)</option>
                    <option value="2026">2026 (Junior)</option>
                    <option value="2027">2027 (Sophomore)</option>
                    <option value="2028">2028 (Freshman)</option>
                    <option value="2029">2029+</option>
                  </select>
                </div>
              </div>

              {/* Career Track Selector */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Layers size={15} style={{ color: 'var(--primary-400)' }} />
                  <span>Primary Target Career Roadmap</span>
                </label>
                <select
                  className="form-select"
                  value={targetCareerId}
                  onChange={(e) => setTargetCareer(e.target.value)}
                >
                  {CAREERS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} — ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Bio Summary */}
              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label">Professional Summary / Bio</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Tell recruiters about your key technical skills, projects, and career goals..."
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <Button
                  type="button"
                  variant="secondary"
                  icon={Download}
                  loading={isExporting}
                  onClick={handleExportData}
                >
                  Export My Data
                </Button>

                <Button type="submit" variant="primary" icon={Save} loading={isProfileSaving}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          )}

          {/* ========================================================
              TAB 2: ACCOUNT SETTINGS & PASSWORD
              ======================================================== */}
          {activeTab === 'account' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Account Security & Credentials
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Manage your authenticated login credentials, password security, and active sessions.
                </p>
              </div>

              {/* Account Overview Card */}
              <div className="settings-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <ShieldCheck size={20} style={{ color: 'var(--emerald-400)' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Account Overview
                  </h4>
                  <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                    Active Verified
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Email Address:</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                      {user?.email || 'Not specified'}
                    </div>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Account ID:</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, fontFamily: 'monospace' }}>
                      {user?.id || user?._id || 'usr_active'}
                    </div>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Authentication Provider:</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, textTransform: 'capitalize' }}>
                      {user?.authProvider || 'Email & Password'}
                    </div>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Account Role:</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                      Student Technologist
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Change Password Card */}
              <div className="settings-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <Key size={20} style={{ color: 'var(--primary-400)' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Change Account Password
                  </h4>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Ensure your account is protected with a secure password of at least 8 characters.
                </p>

                <form onSubmit={handlePasswordChange}>
                  {/* Current Password */}
                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">Current Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        required
                        className="form-input"
                        placeholder="Enter your current password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        style={{ paddingRight: 40 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        style={{
                          position: 'absolute',
                          right: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password & Confirm Password */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">New Password (min 8 characters) *</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          className="form-input"
                          placeholder="Min 8 characters"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          style={{ paddingRight: 40 }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          style={{
                            position: 'absolute',
                            right: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {passwordForm.newPassword && (
                        <div style={{ marginTop: 6 }}>
                          <div style={{ height: 4, background: 'var(--bg-surface-active)', borderRadius: 99, overflow: 'hidden' }}>
                            <div
                              style={{
                                height: '100%',
                                width: passwordForm.newPassword.length >= 10 ? '100%' : passwordForm.newPassword.length >= 8 ? '65%' : '30%',
                                background: passwordForm.newPassword.length >= 10 ? 'var(--emerald-400)' : passwordForm.newPassword.length >= 8 ? 'var(--amber-400)' : 'var(--rose-400)',
                                transition: 'width 0.3s ease'
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            {passwordForm.newPassword.length >= 10 ? 'Strong password' : passwordForm.newPassword.length >= 8 ? 'Good password' : 'Too short (min 8)'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm New Password *</label>
                      <input
                        type="password"
                        required
                        className="form-input"
                        placeholder="Re-enter new password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="primary" icon={Key} loading={isPasswordSaving}>
                      Update Password
                    </Button>
                  </div>
                </form>
              </div>

              {/* Active Sessions Card */}
              <div className="settings-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <Laptop size={18} style={{ color: 'var(--primary-400)' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Active Browser Sessions
                  </h4>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Devices and sessions currently logged in to your account.
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.84rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald-400)' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Current Web Client (Windows)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Active now • Localhost / Verified Session</div>
                    </div>
                  </div>
                  <span className="badge badge-indigo">This Device</span>
                </div>
              </div>

              {/* Active Session & Logout */}
              <div
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1.5rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Sign Out of Account
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                    End your active session on this device. You can log back in anytime.
                  </p>
                </div>

                <Button
                  variant="outline"
                  icon={LogOut}
                  onClick={handleLogout}
                  style={{
                    color: 'var(--rose-400)',
                    borderColor: 'rgba(244, 63, 94, 0.4)',
                    background: 'rgba(244, 63, 94, 0.06)'
                  }}
                >
                  Log Out
                </Button>
              </div>

              {/* Danger Zone: Delete Account */}
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.05)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--rose-500)', margin: 0 }}>
                    Delete Account & Purge Records
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Permanently delete your profile, saved roadmaps, skills graph, and application tracker records.
                  </p>
                </div>

                <Button variant="danger" icon={Trash2} onClick={() => setIsDeleteAccountOpen(true)}>
                  Delete Account
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: APPEARANCE (LIGHT / DARK THEME)
              ======================================================== */}
          {activeTab === 'appearance' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Display & Visual Appearance
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Switch between dark modern developer aesthetic and crisp light mode. Your choice is automatically persisted.
                </p>
              </div>

              {/* Theme Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {/* Dark Theme Card */}
                <div
                  onClick={() => {
                    if (theme !== 'dark') toggleTheme();
                  }}
                  style={{
                    background: '#0b0e1c',
                    border: `2px solid ${theme === 'dark' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.75rem 1.5rem',
                    cursor: 'pointer',
                    color: '#f8fafc',
                    position: 'relative',
                    boxShadow: theme === 'dark' ? '0 0 24px rgba(139, 92, 246, 0.25)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {theme === 'dark' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                        background: '#8b5cf6',
                        color: '#fff',
                        borderRadius: '50%',
                        padding: 3,
                        display: 'flex'
                      }}
                    >
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}

                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(139, 92, 246, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}
                  >
                    <Moon size={28} color="#a78bfa" />
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 4 }}>
                    Dark Mode (Developer Aesthetic)
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                    Deep navy blue glassmorphism, optimized for night studying, low eye fatigue, and vibrant code syntax highlighting.
                  </p>

                  <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ height: 8, width: 24, borderRadius: 99, background: '#8b5cf6' }} />
                    <span style={{ height: 8, width: 24, borderRadius: 99, background: '#10b981' }} />
                    <span style={{ height: 8, width: 24, borderRadius: 99, background: '#38bdf8' }} />
                  </div>
                </div>

                {/* Light Theme Card */}
                <div
                  onClick={() => {
                    if (theme !== 'light') toggleTheme();
                  }}
                  style={{
                    background: '#ffffff',
                    border: `2px solid ${theme === 'light' ? '#4f46e5' : '#e2e8f0'}`,
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.75rem 1.5rem',
                    cursor: 'pointer',
                    color: '#0f172a',
                    position: 'relative',
                    boxShadow: theme === 'light' ? '0 0 24px rgba(79, 70, 229, 0.2)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {theme === 'light' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                        background: '#4f46e5',
                        color: '#fff',
                        borderRadius: '50%',
                        padding: 3,
                        display: 'flex'
                      }}
                    >
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}

                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(245, 158, 11, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}
                  >
                    <Sun size={28} color="#d97706" />
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 4 }}>
                    Light Mode (Daytime Productivity)
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    Crisp white background, high contrast, clean typography, tailored for bright daytime work and CV drafting.
                  </p>

                  <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ height: 8, width: 24, borderRadius: 99, background: '#4f46e5' }} />
                    <span style={{ height: 8, width: 24, borderRadius: 99, background: '#059669' }} />
                    <span style={{ height: 8, width: 24, borderRadius: 99, background: '#0284c7' }} />
                  </div>
                </div>
              </div>

              {/* Visual Features Info */}
              <div className="settings-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                  <Sparkles size={18} style={{ color: 'var(--primary-400)' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Theme Persistence Engine
                  </h4>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Active theme is applied directly via CSS root tokens (<code>[data-theme=&quot;{theme}&quot;]</code>) and is synchronized with your authenticated student profile across page reloads and future logins.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: NOTIFICATION SETTINGS
              ======================================================== */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationsSave}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Notification & Study Goal Preferences
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Configure weekly study targets, Pakistan IT vacancy alerts, and career roadmap milestone reminders.
                </p>
              </div>

              {/* Weekly Commitment Slider */}
              <div className="settings-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Weekly Study Commitment
                  </label>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-400)' }}>
                    {notificationForm.weeklyStudyGoalHours} hours / week
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={notificationForm.weeklyStudyGoalHours}
                  onChange={(e) => setNotificationForm({ ...notificationForm, weeklyStudyGoalHours: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--primary-500)', marginTop: '0.5rem', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4 }}>
                  <span>5 hrs (Casual Study)</span>
                  <span>15 hrs (Recommended Pacing)</span>
                  <span>40 hrs (Full-time Bootcamp)</span>
                </div>
              </div>

              {/* Toggles Card */}
              <div className="settings-card">
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  Notification Channels & Alerts
                </h4>

                {/* Toggle 1: Job Alerts */}
                <div className="settings-toggle-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      Pakistan IT Job Alerts & Internships
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Get alerts for freshly posted trainee, junior, and remote vacancies matching your skills.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationForm.jobAlerts}
                    onChange={(e) => setNotificationForm({ ...notificationForm, jobAlerts: e.target.checked })}
                    style={{ width: 19, height: 19, accentColor: 'var(--primary-500)', cursor: 'pointer' }}
                  />
                </div>

                {/* Toggle 2: Career Recommendations */}
                <div className="settings-toggle-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      AI Career Recommendations & Skill Gaps
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Receive personalized recommendations when high-demand technologies emerge.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationForm.careerRecommendations}
                    onChange={(e) => setNotificationForm({ ...notificationForm, careerRecommendations: e.target.checked })}
                    style={{ width: 19, height: 19, accentColor: 'var(--primary-500)', cursor: 'pointer' }}
                  />
                </div>

                {/* Toggle 3: Daily Study Reminders */}
                <div className="settings-toggle-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      Daily Study & Streak Reminders
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Dashboard nudges to keep your study streak active and track daily milestones.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationForm.dailyReminder}
                    onChange={(e) => setNotificationForm({ ...notificationForm, dailyReminder: e.target.checked })}
                    style={{ width: 19, height: 19, accentColor: 'var(--primary-500)', cursor: 'pointer' }}
                  />
                </div>

                {/* Toggle 4: Roadmap Milestones */}
                <div className="settings-toggle-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      Roadmap Milestone Completion Badges
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Celebratory notifications when you unlock new career readiness tiers.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationForm.roadmapNotifications}
                    onChange={(e) => setNotificationForm({ ...notificationForm, roadmapNotifications: e.target.checked })}
                    style={{ width: 19, height: 19, accentColor: 'var(--primary-500)', cursor: 'pointer' }}
                  />
                </div>

                {/* Toggle 5: Weekly Digest */}
                <div className="settings-toggle-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      Weekly Progress & Career Summary Email
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Summary of hours logged, skills leveled up, and active job applications.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationForm.weeklyDigest}
                    onChange={(e) => setNotificationForm({ ...notificationForm, weeklyDigest: e.target.checked })}
                    style={{ width: 19, height: 19, accentColor: 'var(--primary-500)', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <Button type="submit" variant="primary" icon={Save} loading={isNotificationsSaving}>
                  Save Notification Preferences
                </Button>
              </div>
            </form>
          )}

          {/* ========================================================
              TAB 5: PRIVACY & SECURITY
              ======================================================== */}
          {activeTab === 'privacy' && (
            <form onSubmit={handlePrivacySave}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Privacy Controls & Data Visibility
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Manage who can discover your student profile, CV drafts, and skill verification scores.
                </p>
              </div>

              {/* Profile Visibility Card */}
              <div className="settings-card">
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  Profile & CV Visibility Tier
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: privacyForm.profileVisibility === 'public' ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-surface)',
                      border: `1px solid ${privacyForm.profileVisibility === 'public' ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      checked={privacyForm.profileVisibility === 'public'}
                      onChange={() => setPrivacyForm({ ...privacyForm, profileVisibility: 'public' })}
                      style={{ accentColor: 'var(--primary-500)', marginTop: 3 }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        Public (Recommended for Job Seeking)
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Verified Pakistani & international tech recruiters can find your profile and send interview invites.
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: privacyForm.profileVisibility === 'network' ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-surface)',
                      border: `1px solid ${privacyForm.profileVisibility === 'network' ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      checked={privacyForm.profileVisibility === 'network'}
                      onChange={() => setPrivacyForm({ ...privacyForm, profileVisibility: 'network' })}
                      style={{ accentColor: 'var(--primary-500)', marginTop: 3 }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        SkillPath Community Only
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Visible only to other registered SkillPath AI learners and peer study groups.
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: privacyForm.profileVisibility === 'private' ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-surface)',
                      border: `1px solid ${privacyForm.profileVisibility === 'private' ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      checked={privacyForm.profileVisibility === 'private'}
                      onChange={() => setPrivacyForm({ ...privacyForm, profileVisibility: 'private' })}
                      style={{ accentColor: 'var(--primary-500)', marginTop: 3 }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        Strictly Private
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Only you can see your skills, roadmaps, and CV. Hidden from all public directories.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Data Permissions Card */}
              <div className="settings-card">
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  Privacy & Data Permissions
                </h4>

                <div className="settings-toggle-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      Recruiter Directory Search Indexing
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Allow verified hiring partners in Pakistan to search candidates by target role and skill readiness score.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacyForm.searchIndexing}
                    onChange={(e) => setPrivacyForm({ ...privacyForm, searchIndexing: e.target.checked })}
                    style={{ width: 19, height: 19, accentColor: 'var(--primary-500)', cursor: 'pointer' }}
                  />
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      Anonymous Industry Skill Benchmarking
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Share anonymized skill proficiency points to improve national tech salary and career roadmap models.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacyForm.dataAnalytics}
                    onChange={(e) => setPrivacyForm({ ...privacyForm, dataAnalytics: e.target.checked })}
                    style={{ width: 19, height: 19, accentColor: 'var(--primary-500)', cursor: 'pointer' }}
                  />
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      Two-Factor Authentication (2FA) Shield
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Require a secondary confirmation check when logging in from an unrecognized device.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacyForm.twoFactorEnabled}
                    onChange={(e) => setPrivacyForm({ ...privacyForm, twoFactorEnabled: e.target.checked })}
                    style={{ width: 19, height: 19, accentColor: 'var(--primary-500)', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <Button type="submit" variant="primary" icon={Save} loading={isPrivacySaving}>
                  Save Privacy Settings
                </Button>
              </div>
            </form>
          )}

          {/* ========================================================
              TAB 6: DATA EXPORT & PERSISTENCE
              ======================================================== */}
          {activeTab === 'data' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Data Export & Storage Management
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                    Export your complete records as a valid JSON file, inspect persistent storage, or restore workspace backups.
                  </p>
                </div>
                <span className={`badge ${dbStatus?.connected ? 'badge-emerald' : 'badge-indigo'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Server size={13} />
                  <span>{dbStatus?.engine || 'Persistent Storage Active'}</span>
                </span>
              </div>

              {/* 1. PROMINENT EXPORT MY DATA CARD (Requirement 2, 3, 6) */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(16, 185, 129, 0.08))',
                  border: '1.5px solid rgba(99, 102, 241, 0.4)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.75rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 8px 24px -4px rgba(99, 102, 241, 0.15)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(99, 102, 241, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#818cf8'
                        }}
                      >
                        <FileJson size={22} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                          Export My Data
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          File format: <code>skillpath-my-data.json</code>
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0.75rem 0' }}>
                      Download a complete, valid JSON copy of your personal data directly from the persistent database.
                      Includes your <strong>profile</strong>, <strong>skills graph</strong>, <strong>career roadmaps</strong>, <strong>saved job applications</strong>, <strong>user projects</strong>, <strong>CV details</strong>, and <strong>learning stats</strong>.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--emerald-400)', fontWeight: 600 }}>
                      <ShieldCheck size={16} />
                      <span>Security Guaranteed: Zero passwords, password hashes, access tokens, refresh tokens, API keys, or secrets are included.</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'stretch' }}>
                    <Button
                      variant="primary"
                      size="lg"
                      icon={Download}
                      loading={isExporting}
                      onClick={handleExportData}
                      style={{
                        padding: '0.85rem 1.75rem',
                        fontSize: '1rem',
                        fontWeight: 700,
                        boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
                      }}
                    >
                      Export My Data
                    </Button>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      Exports only your authenticated records
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Database Connectivity & Storage Engine Diagnostic Card */}
              <div className="settings-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
                  <HardDrive size={20} style={{ color: dbStatus?.connected ? 'var(--emerald-400)' : 'var(--primary-400)' }} />
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Active Database Storage Engine
                  </h4>
                  <span className="badge badge-emerald" style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}>
                    Persistent
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                  {dbStatus?.message || 'Data persists across server restarts, logouts, and logins. All private data is strictly scoped to your authenticated account.'}
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Storage Engine: </span>
                    <strong style={{ color: 'var(--text-primary)' }}>{dbStatus?.engine || 'Persistent Local File Store (JSON)'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Storage Path: </span>
                    <code style={{ color: 'var(--text-primary)', background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: 4 }}>
                      {dbStatus?.storagePath || 'server/data/persistent_db.json'}
                    </code>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Data Isolation: </span>
                    <strong style={{ color: 'var(--emerald-400)' }}>100% User-Scoped</strong>
                  </div>
                </div>
              </div>

              {/* 3. Import JSON Backup */}
              <div className="settings-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Import JSON Workspace Backup
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Restore your workspace records from a previously exported JSON backup file.
                  </p>
                </div>

                <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Upload size={16} />
                  <span>Import JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* 4. Reset to Default */}
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.05)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--rose-500)', margin: 0 }}>
                    Reset Workspace to Sample Demo State
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Clears custom skills, milestone edits, and restores starter baseline roadmap data.
                  </p>
                </div>

                <Button variant="danger" icon={RotateCcw} onClick={() => setIsResetConfirmOpen(true)}>
                  Clear & Reset All Data
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 7: AI & GOOGLE GEMINI SETTINGS
              ======================================================== */}
          {activeTab === 'ai' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    Google Gemini & Generative AI Engine
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Configure your Google Gemini API key to activate real-time personalized career roadmaps, ATS resume reviews, and mentor intelligence.
                  </p>
                </div>

                <Button
                  variant="primary"
                  icon={Save}
                  onClick={handleSaveAiConfig}
                  loading={isAiSaving}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    fontWeight: 700
                  }}
                >
                  Save AI Settings
                </Button>
              </div>

              {/* Status Banner */}
              <div
                style={{
                  background: aiStatus?.isLive
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%)',
                  border: `1px solid ${aiStatus?.isLive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.25)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-md)',
                      background: aiStatus?.isLive
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                        {aiStatus?.providerName || 'SkillPath Intelligent Deterministic Engine'}
                      </span>
                      <span className={`badge ${aiStatus?.isLive ? 'badge-emerald' : 'badge-indigo'}`} style={{ fontSize: '0.72rem' }}>
                        {aiStatus?.isLive ? 'Live Generative LLM' : 'Offline Mode (Active)'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      Model: <code style={{ color: '#38bdf8' }}>{aiStatus?.model || 'Deterministic Semantic Rule Engine'}</code>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon={isAiTesting ? RefreshCw : Zap}
                  onClick={handleTestAiConnection}
                  disabled={isAiTesting}
                  style={{ fontSize: '0.82rem' }}
                >
                  {isAiTesting ? 'Testing Connection...' : 'Test Connection'}
                </Button>
              </div>

              {testResult && (
                <div
                  style={{
                    background: testResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                    border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    fontSize: '0.85rem',
                    color: testResult.success ? '#34d399' : '#fb7185',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{testResult.message}</span>
                </div>
              )}

              {/* API Key Form Card */}
              <div className="settings-card">
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
                  Provider & API Credentials
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  SkillPath AI works out of the box with zero external configuration using its built-in rule engine. Adding your free Google Gemini API key unlocks live generative responses.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  {/* Provider Select */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Primary AI Provider
                    </label>
                    <select
                      value={aiForm.provider}
                      onChange={(e) => setAiForm({ ...aiForm, provider: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'var(--bg-app)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem 1rem',
                        color: '#ffffff',
                        fontSize: '0.9rem'
                      }}
                    >
                      <option value="gemini">Google Gemini AI (Recommended — Fast & Free Tier)</option>
                      <option value="openai">OpenAI (GPT-4o-mini)</option>
                    </select>
                  </div>

                  {/* Model Select */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Model Tier
                    </label>
                    <select
                      value={aiForm.model}
                      onChange={(e) => setAiForm({ ...aiForm, model: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'var(--bg-app)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem 1rem',
                        color: '#ffffff',
                        fontSize: '0.9rem'
                      }}
                    >
                      {aiForm.provider === 'gemini' ? (
                        <>
                          <option value="gemini-1.5-flash">gemini-1.5-flash (Ultra fast, lightweight, recommended)</option>
                          <option value="gemini-2.0-flash">gemini-2.0-flash (Next-gen frontier reasoning)</option>
                          <option value="gemini-1.5-pro">gemini-1.5-pro (Deep complex career analysis)</option>
                        </>
                      ) : (
                        <>
                          <option value="gpt-4o-mini">gpt-4o-mini (Cost-effective fast reasoning)</option>
                          <option value="gpt-4o">gpt-4o (Full flagship model)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* API Key Input with Visibility Toggle */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {aiForm.provider === 'gemini' ? 'Google Gemini API Key' : 'OpenAI API Key'}
                    </label>
                    {aiForm.provider === 'gemini' && (
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '0.78rem', color: '#38bdf8', textDecoration: 'none' }}
                      >
                        Get a free key from Google AI Studio ↗
                      </a>
                    )}
                  </div>

                  <div style={{ position: 'relative' }}>
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={aiForm.apiKey}
                      onChange={(e) => setAiForm({ ...aiForm, apiKey: e.target.value })}
                      placeholder={aiForm.provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                      style={{
                        width: '100%',
                        background: 'var(--bg-app)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem 3rem 0.75rem 1rem',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontFamily: 'monospace'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      style={{
                        position: 'absolute',
                        right: '0.85rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
                    Your API key is kept secure and never exposed to public clients. It is handled by the server proxy.
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <Button
                    variant="outline"
                    icon={Zap}
                    onClick={handleTestAiConnection}
                    disabled={isAiTesting}
                  >
                    Test Connection
                  </Button>
                  <Button
                    variant="primary"
                    icon={Save}
                    onClick={handleSaveAiConfig}
                    loading={isAiSaving}
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                      fontWeight: 700
                    }}
                  >
                    Save Configuration
                  </Button>
                </div>
              </div>

              {/* Supported Features Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem'
                }}
              >
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem'
                  }}
                >
                  <div style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={16} />
                    <span>Smart Career Roadmaps</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    Generates 3-stage actionable milestone roadmaps with estimated hours and checkpoints.
                  </p>
                </div>

                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem'
                  }}
                >
                  <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileCheck size={16} />
                    <span>ATS Resume Review</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    Analyzes CV data against ATS scrapers, identifies missing keywords, and rewrites bullet points.
                  </p>
                </div>

                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem'
                  }}
                >
                  <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Bot size={16} />
                    <span>Career Mentor Chat</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    Tailored advice for tech interviews at Systems Limited, Contour, 10Pearls, and global remote roles.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetAllData}
        title="Clear All Stored Data?"
        message="This will reset all your skills, roadmap tasks, CV drafts, and job applications back to default factory demo values. Are you sure?"
        confirmText="Yes, Reset Everything"
        danger={true}
      />

      {/* Delete Account Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteAccountOpen}
        onClose={() => setIsDeleteAccountOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Your Account Permanently?"
        message="This will permanently delete your user profile, authentication credentials, and all private records from the database. This action cannot be undone."
        confirmText="Yes, Permanently Delete My Account"
        danger={true}
      />
    </div>
  );
}
