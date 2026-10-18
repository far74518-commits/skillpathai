import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CareerAssistantPage from './pages/CareerAssistantPage';
import RoadmapPage from './pages/RoadmapPage';
import SkillsPage from './pages/SkillsPage';
import CVBuilderPage from './pages/CVBuilderPage';
import JobTrackerPage from './pages/JobTrackerPage';
import ProjectsPage from './pages/ProjectsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Global styles
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';

function RootRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <Routes>
              {/* Root route: Login first if unauthenticated, else dashboard */}
              <Route path="/" element={<RootRoute />} />
              <Route path="/welcome" element={<LandingPage />} />

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Student Workspace (Dashboard App Shell) */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/assistant" element={<CareerAssistantPage />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/cv-builder" element={<CVBuilderPage />} />
                <Route path="/jobs" element={<JobTrackerPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Fallback 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
