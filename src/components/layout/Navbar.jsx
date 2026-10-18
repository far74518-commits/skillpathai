import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Sun, Moon, Menu, Check, LogOut, Settings, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isMobileDrawerOpen, setIsMobileDrawerOpen, addToast } = useApp();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    if (addToast) {
      addToast({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been safely signed out.',
      });
    }
    navigate('/login');
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Student');

  return (
    <header className="app-navbar-responsive">
      {/* Mobile Hamburger + Brand (Visible on mobile <= 768px) */}
      <div className="mobile-header-bar">
        <button
          className="mobile-hamburger-btn"
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Check size={16} strokeWidth={3} />
          </div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
            SkillSync
          </span>
        </div>
      </div>

      {/* Desktop Greeting (Hidden on mobile) */}
      <div className="desktop-greeting">
        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            margin: 0
          }}
        >
          {greeting}, {displayName}! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem', marginBottom: 0 }}>
          Ready to level up your skills today?
        </p>
      </div>

      {/* Right Controls */}
      <div className="navbar-stats-row" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* Chat / AI button */}
        <button
          onClick={() => navigate('/assistant')}
          className="nav-action-btn"
          title="AI Advisor Chat"
        >
          <MessageSquare size={17} />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="nav-action-btn"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* User Account Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.65rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="User Account Menu"
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {(user?.name || user?.email || 'S').charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="desktop-only-stat">
              {displayName}
            </span>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 220,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
                padding: '0.5rem',
                zIndex: 100
              }}
            >
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || displayName}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email || 'Signed in'}
                </div>
              </div>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate('/settings');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <Settings size={15} />
                <span>Account & Settings</span>
              </button>

              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--rose-400)',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginTop: '0.25rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <LogOut size={15} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Direct 1-Click Logout Button (Always visible on desktop) */}
        <button
          onClick={handleLogout}
          className="desktop-only-stat"
          style={{
            color: 'var(--rose-400)',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '0.38rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
          title="Sign Out of SkillPath AI"
        >
          <LogOut size={14} />
          <span>Log Out</span>
        </button>
      </div>
    </header>
  );
}

