import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Layers,
  Activity,
  Clock,
  Columns3,
  Star,
  GitFork,
  Bot,
  FileText,
  Briefcase,
  Menu,
  Check,
  Edit3,
  LogOut,
  X,
  Settings
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { readiness, isMobileDrawerOpen, setIsMobileDrawerOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = () => {
    // Auto-close drawer on mobile when clicking a link
    if (isMobileDrawerOpen) {
      setIsMobileDrawerOpen(false);
    }
  };

  const mainMenuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/roadmap', label: 'Generate Roadmap', icon: Layers },
    { to: '/dashboard', label: 'Progress', icon: Activity, hasDot: true, dotColor: '#f59e0b' },
    { to: '/assistant', label: 'Insights', icon: Clock },
    { to: '/assistant', label: 'Compare Careers', icon: Columns3 },
    { to: '/projects', label: 'Projects', icon: Star }
  ];

  const toolsItems = [
    { to: '/skills', label: 'Skill Graph', icon: GitFork },
    { to: '/assistant', label: 'AI Advisor', icon: Bot, hasDot: true, dotColor: '#10b981' },
    { to: '/cv-builder', label: 'CV Builder', icon: FileText },
    { to: '/jobs', label: 'Jobs & Applications', icon: Briefcase },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileDrawerOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}

      <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''} ${isMobileDrawerOpen ? 'mobile-drawer-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header" style={{ padding: '1.25rem 1.25rem 1rem' }}>
          <Link to="/dashboard" className="sidebar-logo" style={{ textDecoration: 'none' }} onClick={handleLinkClick}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                flexShrink: 0
              }}
            >
              <Check size={20} strokeWidth={3} />
            </div>

            {(!collapsed || isMobileDrawerOpen) && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  SkillSync
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#8b5cf6', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>
                  AI CAREER OS
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse toggle */}
          <button
            className="sidebar-collapse-btn desktop-only-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem',
              color: 'var(--text-muted)'
            }}
          >
            <Menu size={16} />
          </button>

          {/* Mobile Close Button */}
          <button
            className="mobile-drawer-close-btn"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-label="Close mobile menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav" style={{ padding: '0.75rem' }}>
          {mainMenuItems.map((item, idx) => {
            const Icon = item.icon;
            const isRoadmapActive = item.label === 'Generate Roadmap' && location.pathname.includes('/roadmap');
            return (
              <NavLink
                key={idx}
                to={item.to}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `sidebar-link ${isRoadmapActive ? 'active' : isActive && item.label !== 'Generate Roadmap' ? 'active' : ''}`
                }
                title={collapsed && !isMobileDrawerOpen ? item.label : undefined}
              >
                <Icon size={18} />
                {(!collapsed || isMobileDrawerOpen) && <span style={{ flex: 1 }}>{item.label}</span>}
                {(!collapsed || isMobileDrawerOpen) && item.hasDot && (
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: item.dotColor || '#f59e0b',
                      boxShadow: `0 0 8px ${item.dotColor || '#f59e0b'}`
                    }}
                  />
                )}
              </NavLink>
            );
          })}

          {/* Tools Divider */}
          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0.75rem 0.5rem' }} />

          {toolsItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.to}
                onClick={handleLinkClick}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                title={collapsed && !isMobileDrawerOpen ? item.label : undefined}
              >
                <Icon size={18} />
                {(!collapsed || isMobileDrawerOpen) && <span style={{ flex: 1 }}>{item.label}</span>}
                {(!collapsed || isMobileDrawerOpen) && item.hasDot && (
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: item.dotColor || '#10b981',
                      boxShadow: `0 0 8px ${item.dotColor || '#10b981'}`
                    }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile & XP Card */}
        {(!collapsed || isMobileDrawerOpen) && (
          <div style={{ padding: '1rem 0.85rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(15, 18, 36, 0.4)' }}>
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-muted)' }}>Career Readiness</span>
                <span style={{ color: '#8b5cf6', fontWeight: 700 }}>{readiness.overall || 65}%</span>
              </div>
              <div style={{ height: 5, background: 'var(--bg-surface-active)', borderRadius: 99, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${readiness.overall || 65}%`,
                    background: 'linear-gradient(90deg, #8b5cf6, #6366f1)',
                    borderRadius: 99
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
              onClick={() => {
                navigate('/settings');
                handleLinkClick();
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#10b981',
                  color: '#ffffff',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}
              >
                {(user?.name || user?.email || 'S').charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || user?.email || 'Student'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email || user?.headline || 'Tech Student'}
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                  navigate('/login');
                  handleLinkClick();
                }}
                style={{
                  color: 'var(--rose-400)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4
                }}
                title="Log Out / Switch Account"
              >
                <LogOut size={15} />
              </button>
            </div>

            {/* Prominent Log Out Button */}
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
                handleLinkClick();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.65rem',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: 'var(--rose-400)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* Collapsed Sidebar Logout Button */}
        {collapsed && !isMobileDrawerOpen && (
          <div style={{ padding: '0.85rem 0', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: 'var(--rose-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
              title="Log Out"
            >
              <LogOut size={17} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
