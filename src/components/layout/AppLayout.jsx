import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import Toast from '../common/Toast';
import QuickSearchModal from '../common/QuickSearchModal';

export default function AppLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <main className="page-container">
          <Outlet />
        </main>
        <MobileNav />
      </div>
      <Toast />
      <QuickSearchModal />
    </div>
  );
}
