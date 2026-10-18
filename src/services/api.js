/**
 * SkillPath AI - Frontend API Service Client
 * Provides structured HTTP methods to interact with the Express REST API backend,
 * with automatic Bearer token management and fallback diagnostics.
 */

const rawBase = (import.meta.env?.VITE_API_URL || '/api').replace(/\/+$/, '');
const API_BASE = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

function getToken() {
  try {
    return (
      sessionStorage.getItem('skillpath_token') ||
      localStorage.getItem('skillpath_token') ||
      ''
    );
  } catch (e) {
    return '';
  }
}

export function setToken(token) {
  try {
    if (token) {
      sessionStorage.setItem('skillpath_token', token);
      localStorage.setItem('skillpath_token', token);
    } else {
      sessionStorage.removeItem('skillpath_token');
      localStorage.removeItem('skillpath_token');
    }
  } catch (e) {
    console.warn('Storage token write warning:', e);
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.errors = data.errors || [];
      throw error;
    }

    return data;
  } catch (error) {
    // If server is unreachable (e.g. running in frontend-only dev mode)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      error.isNetworkError = true;
      error.message = 'Backend server is offline or unreachable. Using local storage mode.';
    }
    throw error;
  }
}

// 1. Health Diagnostics
export const healthApi = {
  check: () => fetch('/health').then((r) => r.json()).catch(() => null),
};

// 2. Authentication API
export const authApi = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  google: (payload) => request('/auth/google', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me', { method: 'GET' }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (payload) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) }),
};

// 3. User Profile API
export const userApi = {
  getProfile: () => request('/user/me', { method: 'GET' }),
  updateProfile: (profile) => request('/user/me', { method: 'PUT', body: JSON.stringify(profile) }),
  updatePreferences: (prefs) => request('/user/me/preferences', { method: 'PATCH', body: JSON.stringify(prefs) }),
  changePassword: (payload) => request('/user/change-password', { method: 'POST', body: JSON.stringify(payload) }),
  exportData: () => request('/user/export', { method: 'GET' }),
  getDatabaseStatus: () => request('/user/database-status', { method: 'GET' }),
  deleteAccount: () => request('/user/me', { method: 'DELETE' }),
};

// 4. Careers API
export const careersApi = {
  getAll: () => request('/careers', { method: 'GET' }),
  getById: (id) => request(`/careers/${id}`, { method: 'GET' }),
  assess: (payload) => request('/careers/assess', { method: 'POST', body: JSON.stringify(payload) }),
  getRecommendations: () => request('/careers/recommendations', { method: 'GET' }),
};

// 5. Roadmaps API
export const roadmapsApi = {
  getAll: () => request('/roadmaps', { method: 'GET' }),
  getMy: () => request('/roadmaps/my', { method: 'GET' }),
  getByType: (careerType) => request(`/roadmaps/${careerType}`, { method: 'GET' }),
  toggleTask: (careerType, taskId) =>
    request(`/roadmaps/${careerType}/tasks/${taskId}`, { method: 'PATCH' }),
  addCustomTask: (careerType, task) =>
    request(`/roadmaps/${careerType}/tasks`, { method: 'POST', body: JSON.stringify(task) }),
};

// 6. Skills API
export const skillsApi = {
  getAll: () => request('/skills', { method: 'GET' }),
  getById: (id) => request(`/skills/${id}`, { method: 'GET' }),
  create: (skill) => request('/skills', { method: 'POST', body: JSON.stringify(skill) }),
  update: (id, skill) => request(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(skill) }),
  updateProgress: (id, progressData) =>
    request(`/skills/${id}/progress`, { method: 'PATCH', body: JSON.stringify(progressData) }),
  delete: (id) => request(`/skills/${id}`, { method: 'DELETE' }),
};

// 7. Pakistan IT Job Discovery & Application Tracker API
export const jobsApi = {
  // Discovery
  getDiscovered: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/v1/jobs${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getDiscoveredById: (id) => request(`/v1/jobs/${id}`, { method: 'GET' }),
  getFilters: () => request('/v1/jobs/filters', { method: 'GET' }),
  getCategories: () => request('/v1/jobs/categories', { method: 'GET' }),
  getLocations: () => request('/v1/jobs/locations', { method: 'GET' }),
  getCompanies: () => request('/v1/jobs/companies', { method: 'GET' }),
  getRecommendations: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/v1/jobs/recommendations${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getTrending: () => request('/v1/jobs/trending', { method: 'GET' }),
  getRecent: () => request('/v1/jobs/recent', { method: 'GET' }),
  saveDiscovered: (id) => request(`/v1/jobs/${id}/save`, { method: 'POST' }),
  getSources: () => request('/v1/jobs/sources', { method: 'GET' }),
  getSourceHealth: () => request('/v1/jobs/admin/source-health', { method: 'GET' }),
  getSyncRuns: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/v1/jobs/admin/sync-runs${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  triggerSync: (sourceId) => request('/v1/jobs/admin/sync', { method: 'POST', body: JSON.stringify(sourceId ? { sourceId } : {}) }),
  addManualJob: (jobData) => request('/v1/jobs/admin/manual', { method: 'POST', body: JSON.stringify(jobData) }),
  getAlerts: () => request('/v1/jobs/alerts', { method: 'GET' }),
  saveAlert: (alertData) => request('/v1/jobs/alerts', { method: 'POST', body: JSON.stringify(alertData) }),

  // Tracker (Applications)
  getAll: (params = {}) => {
    const qs = new URLSearchParams({ ...params, scope: 'tracker' }).toString();
    return request(`/jobs?${qs}`, { method: 'GET' });
  },
  getById: (id) => request(`/jobs/${id}`, { method: 'GET' }),
  create: (job) => request('/jobs', { method: 'POST', body: JSON.stringify(job) }),
  update: (id, job) => request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(job) }),
  updateStatus: (id, status) =>
    request(`/jobs/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id) => request(`/jobs/${id}`, { method: 'DELETE' }),
};

// 8. ATS CV Builder API
export const cvApi = {
  get: () => request('/cv', { method: 'GET' }),
  update: (cvData) => request('/cv', { method: 'PUT', body: JSON.stringify(cvData) }),
  reset: () => request('/cv', { method: 'DELETE' }),
};

// 9. Portfolio Projects API
export const projectsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/projects${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getMy: () => request('/projects/my', { method: 'GET' }),
  getById: (id) => request(`/projects/${id}`, { method: 'GET' }),
  start: (id) => request(`/projects/${id}/start`, { method: 'POST' }),
  toggleChecklist: (id, checkId) =>
    request(`/projects/${id}/checklist`, { method: 'POST', body: JSON.stringify({ checkId }) }),
  complete: (id) => request(`/projects/${id}/complete`, { method: 'POST' }),
};

// 10. Dashboard API
export const dashboardApi = {
  getSummary: () => request('/dashboard/summary', { method: 'GET' }),
  getActivity: () => request('/dashboard/activity', { method: 'GET' }),
  getUpcomingTasks: () => request('/dashboard/upcoming-tasks', { method: 'GET' }),
};

// 11. Notifications API
export const notificationsApi = {
  getAll: () => request('/notifications', { method: 'GET' }),
  markRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => request('/notifications/read-all', { method: 'PATCH' }),
  delete: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
};
