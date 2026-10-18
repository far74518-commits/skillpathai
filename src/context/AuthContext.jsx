import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { authApi, setToken } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Session-based authentication: requires fresh login per session before opening dashboard
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('skillpath_authenticated') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const isAuth = sessionStorage.getItem('skillpath_authenticated') === 'true';
      if (!isAuth) return null;
      return StorageService.getUser();
    } catch (e) {
      return null;
    }
  });

  const login = async (email, password, customName = '') => {
    if (!email || !password) {
      return { success: false, error: 'Please enter both email and password' };
    }

    const trimmedEmail = email.trim().toLowerCase();
    let displayName = customName ? customName.trim() : '';

    if (!displayName) {
      const emailPrefix = trimmedEmail.split('@')[0];
      displayName = emailPrefix
        .replace(/[._\-0-9]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (displayName) {
        displayName = displayName.replace(/\b\w/g, (l) => l.toUpperCase());
      } else {
        displayName = trimmedEmail.split('@')[0];
      }
    }

    try {
      // 1. Attempt backend login
      let res = null;
      try {
        res = await authApi.login({ email: trimmedEmail, password });
      } catch (loginErr) {
        // If account doesn't exist yet on backend, automatically register with this email
        try {
          res = await authApi.register({
            name: displayName,
            email: trimmedEmail,
            password,
            degree: "Bachelor's Degree",
            targetCareer: 'frontend-dev',
          });
        } catch (regErr) {
          // If password mismatch on existing account
          return { success: false, error: loginErr.message || 'Invalid email or password.' };
        }
      }

      if (res?.token) {
        setToken(res.token);
      }

      const backendUser = res?.data?.user || res?.user || {};
      const updatedUser = {
        id: backendUser._id || backendUser.id || ('usr_' + Date.now()),
        name: backendUser.name || displayName,
        email: trimmedEmail,
        headline: backendUser.headline || 'Student & Technology Explorer',
        university: backendUser.university || '',
        degree: backendUser.degree || "Bachelor's Degree",
        gradYear: backendUser.gradYear || '2027',
        avatar: backendUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=8b5cf6&color=fff&bold=true`,
        isLoggedIn: true,
        authProvider: 'email',
        isDemoUser: false,
      };

      try {
        sessionStorage.setItem('skillpath_authenticated', 'true');
      } catch (e) {}

      setUser(updatedUser);
      setIsAuthenticated(true);
      StorageService.saveUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (err) {
      // Offline fallback: log in directly with their own email
      const localUser = {
        id: 'usr_' + Date.now(),
        name: displayName,
        email: trimmedEmail,
        headline: 'Student & Technology Explorer',
        university: '',
        degree: "Bachelor's Degree",
        gradYear: '2027',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=8b5cf6&color=fff&bold=true`,
        isLoggedIn: true,
        authProvider: 'email',
        isDemoUser: false,
      };

      try {
        sessionStorage.setItem('skillpath_authenticated', 'true');
      } catch (e) {}

      setUser(localUser);
      setIsAuthenticated(true);
      StorageService.saveUser(localUser);
      return { success: true, user: localUser };
    }
  };

  const loginWithGoogle = async (customGoogleEmail = '', customName = '') => {
    const googleEmail = (customGoogleEmail && customGoogleEmail.trim().toLowerCase());
    if (!googleEmail) {
      return { success: false, error: 'Please enter a valid Gmail address.' };
    }

    const emailPrefix = googleEmail.split('@')[0];
    let displayName = (customName && customName.trim());
    if (!displayName) {
      displayName = emailPrefix
        .replace(/[._\-0-9]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (displayName) {
        displayName = displayName.replace(/\b\w/g, (l) => l.toUpperCase());
      } else {
        displayName = 'Google Student';
      }
    }

    try {
      // Call backend /api/auth/google
      const res = await authApi.google({
        email: googleEmail,
        name: displayName,
      });

      if (res?.token) {
        setToken(res.token);
      }

      const backendUser = res?.data?.user || res?.user || {};
      const googleUser = {
        id: backendUser._id || backendUser.id || ('usr_google_' + Date.now()),
        name: backendUser.name || displayName,
        email: googleEmail,
        headline: backendUser.headline || 'Student & Technology Explorer',
        university: backendUser.university || '',
        degree: backendUser.degree || 'B.S. in Computer Science',
        gradYear: backendUser.gradYear || '2027',
        avatar: backendUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4285F4&color=fff&bold=true`,
        isLoggedIn: true,
        authProvider: 'google',
        isDemoUser: false,
      };

      try {
        sessionStorage.setItem('skillpath_authenticated', 'true');
      } catch (e) {}

      setUser(googleUser);
      setIsAuthenticated(true);
      StorageService.saveUser(googleUser);
      return { success: true, user: googleUser };
    } catch (err) {
      // Offline fallback
      const fallbackUser = {
        id: 'usr_google_' + Date.now(),
        name: displayName,
        email: googleEmail,
        headline: 'Student & Technology Explorer',
        degree: 'B.S. in Computer Science',
        gradYear: '2027',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4285F4&color=fff&bold=true`,
        isLoggedIn: true,
        authProvider: 'google',
        isDemoUser: false,
      };

      try {
        sessionStorage.setItem('skillpath_authenticated', 'true');
      } catch (e) {}

      setUser(fallbackUser);
      setIsAuthenticated(true);
      StorageService.saveUser(fallbackUser);
      return { success: true, user: fallbackUser };
    }
  };

  const loginDemo = () => {
    const demoUser = {
      id: 'usr_student_demo',
      name: 'Farman Ali',
      email: 'farman.dev@example.edu',
      headline: 'Aspiring Frontend & Software Engineer',
      university: 'State University of Technology',
      degree: 'B.S. in Computer Science',
      gradYear: '2027',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isLoggedIn: true,
      isDemoUser: true,
    };

    try {
      sessionStorage.setItem('skillpath_authenticated', 'true');
    } catch (e) {}

    setUser(demoUser);
    setIsAuthenticated(true);
    StorageService.saveUser(demoUser);
    return { success: true, user: demoUser };
  };

  const signup = async ({ name, email, password, degree, university }) => {
    if (!name || !email || !password) {
      return { success: false, error: 'Please complete all required fields' };
    }
    const displayName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await authApi.register({
        name: displayName,
        email: cleanEmail,
        password,
        degree: degree || "Bachelor's Degree",
        university: university || '',
        targetCareer: 'frontend-dev',
      });

      if (res?.token) {
        setToken(res.token);
      }

      const backendUser = res?.data?.user || res?.user || {};
      const newUser = {
        id: backendUser._id || backendUser.id || ('usr_' + Date.now()),
        name: backendUser.name || displayName,
        email: cleanEmail,
        headline: 'Student & Emerging Technologist',
        university: university || '',
        degree: degree || 'Computer Science',
        gradYear: '2027',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=8b5cf6&color=fff&bold=true`,
        isLoggedIn: true,
        isDemoUser: false,
      };

      try {
        sessionStorage.setItem('skillpath_authenticated', 'true');
      } catch (e) {}

      setUser(newUser);
      setIsAuthenticated(true);
      StorageService.saveUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      const localUser = {
        id: 'usr_' + Date.now(),
        name: displayName,
        email: cleanEmail,
        headline: 'Student & Emerging Technologist',
        university: university || '',
        degree: degree || 'Computer Science',
        gradYear: '2027',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=8b5cf6&color=fff&bold=true`,
        isLoggedIn: true,
        isDemoUser: false,
      };

      try {
        sessionStorage.setItem('skillpath_authenticated', 'true');
      } catch (e) {}

      setUser(localUser);
      setIsAuthenticated(true);
      StorageService.saveUser(localUser);
      return { success: true, user: localUser };
    }
  };

  const updateUser = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    StorageService.saveUser(updated);
  };

  const logout = () => {
    try {
      authApi.logout().catch(() => {});
    } catch (e) {}

    setToken(null);
    try {
      sessionStorage.removeItem('skillpath_authenticated');
      sessionStorage.removeItem('skillpath_token');
      localStorage.removeItem('skillpath_token');
    } catch (e) {}

    setUser(null);
    setIsAuthenticated(false);
    StorageService.saveUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginWithGoogle,
        loginDemo,
        signup,
        updateUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
