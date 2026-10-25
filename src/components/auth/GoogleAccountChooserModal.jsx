import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UserPlus, ArrowLeft, ArrowRight, X, Shield, Mail, Trash2 } from 'lucide-react';

const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

// List of banned auto/hardcoded demo emails that must NEVER be shown
const BANNED_AUTO_EMAILS = [
  'student@gmail.com',
  'farman.student@gmail.com',
  'student.workspace@gmail.com',
  'developer.pakistan@gmail.com',
  'student.dev@example.edu',
  'farman.dev@example.edu'
];

function getSavedRealAccounts() {
  try {
    const raw = localStorage.getItem('skillpath_google_accounts');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter out any banned or dummy auto emails
        const cleanList = parsed.filter(
          (a) => a && a.email && !BANNED_AUTO_EMAILS.includes(a.email.toLowerCase().trim())
        );
        localStorage.setItem('skillpath_google_accounts', JSON.stringify(cleanList));
        return cleanList;
      }
    }
  } catch (e) {
    console.warn('Error reading saved google accounts:', e);
  }
  return [];
}

export default function GoogleAccountChooserModal({ isOpen, onClose, onSelectAccount }) {
  const [accounts, setAccounts] = useState(getSavedRealAccounts);
  // If user has saved real accounts, show list mode; if 0 saved accounts, directly show email input mode
  const [mode, setMode] = useState(() => (getSavedRealAccounts().length > 0 ? 'list' : 'add'));
  const [customEmail, setCustomEmail] = useState('');
  const [inputError, setInputError] = useState('');
  const [signingInEmail, setSigningInEmail] = useState(null);

  // Sync real accounts when modal opens and ensure auto demo emails are purged
  useEffect(() => {
    if (isOpen) {
      const realAccounts = getSavedRealAccounts();
      setAccounts(realAccounts);
      setMode(realAccounts.length > 0 ? 'list' : 'add');
      setCustomEmail('');
      setInputError('');
      setSigningInEmail(null);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !signingInEmail) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, signingInEmail]);

  if (!isOpen) return null;

  const handleChoose = (account) => {
    if (signingInEmail) return;
    setSigningInEmail(account.email);

    // Save only real student accounts to localStorage
    try {
      if (!BANNED_AUTO_EMAILS.includes(account.email.toLowerCase().trim())) {
        const existing = accounts.filter((a) => a.email.toLowerCase() !== account.email.toLowerCase());
        const updated = [account, ...existing].slice(0, 5);
        setAccounts(updated);
        localStorage.setItem('skillpath_google_accounts', JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Error saving google account:', e);
    }

    // Realistic Google OAuth sign-in transition
    setTimeout(() => {
      onSelectAccount(account);
    }, 450);
  };

  const handleRemoveAccount = (e, emailToRemove) => {
    e.stopPropagation();
    const updated = accounts.filter((a) => a.email.toLowerCase() !== emailToRemove.toLowerCase());
    setAccounts(updated);
    try {
      localStorage.setItem('skillpath_google_accounts', JSON.stringify(updated));
    } catch (err) {
      console.warn('Error updating accounts:', err);
    }
    // If all accounts removed, switch to email input mode
    if (updated.length === 0) {
      setMode('add');
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    setInputError('');

    const trimmedEmail = customEmail.trim();
    if (!trimmedEmail) {
      setInputError('Please enter your Google / Gmail address.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setInputError('Please enter a valid email address (e.g. yourname@gmail.com).');
      return;
    }

    // Auto-derive clean display name from student's own email prefix without asking extra questions
    const emailPrefix = trimmedEmail.split('@')[0];
    const derivedName =
      emailPrefix
        .replace(/[._\-0-9]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Google Student';

    const newAccount = {
      name: derivedName,
      email: trimmedEmail,
      color: '#4285F4'
    };

    handleChoose(newAccount);
  };

  const modalNode = (
    <div className="google-auth-overlay" onClick={() => !signingInEmail && onClose()}>
      <div className="google-auth-card" onClick={(e) => e.stopPropagation()}>
        {/* Header with Google Logo & Close Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <GoogleIcon />
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Sign in with Google
            </span>
          </div>

          {!signingInEmail && (
            <button
              className="btn-icon"
              onClick={onClose}
              aria-label="Close"
              style={{ borderRadius: '50%', padding: '0.35rem', color: 'var(--text-dim)' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Google Indeterminate Progress Bar */}
        {signingInEmail && (
          <div className="google-loading-bar">
            <div className="google-loading-bar-inner"></div>
          </div>
        )}

        {mode === 'list' && accounts.length > 0 ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Choose an account
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                to continue to <strong style={{ color: 'var(--text-primary)' }}>SkillPath AI</strong>
              </p>
            </div>

            {/* List of previously logged-in REAL accounts */}
            <div className="google-accounts-list">
              {accounts.map((acc) => {
                const isSelected = signingInEmail === acc.email;
                const initial = (acc.name || acc.email || 'G').charAt(0).toUpperCase();

                return (
                  <button
                    key={acc.email}
                    type="button"
                    disabled={Boolean(signingInEmail)}
                    className={`google-account-row ${isSelected ? 'signing-in' : ''}`}
                    onClick={() => handleChoose(acc)}
                  >
                    <div
                      className="google-account-avatar"
                      style={{ background: acc.color || '#4285F4' }}
                    >
                      {initial}
                    </div>

                    <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '0.92rem',
                          color: 'var(--text-primary)',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {acc.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {acc.email}
                      </div>
                    </div>

                    {isSelected ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--primary-400)', fontWeight: 600 }}>
                          Signing in...
                        </span>
                        <div className="google-spinner" />
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span
                          role="button"
                          tabIndex={0}
                          className="google-account-remove"
                          onClick={(e) => handleRemoveAccount(e, acc.email)}
                          title="Remove account from device list"
                        >
                          <Trash2 size={14} />
                        </span>
                        <ArrowRight size={16} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Use Another Account Button */}
              <button
                type="button"
                disabled={Boolean(signingInEmail)}
                className="google-account-row google-add-account-row"
                onClick={() => setMode('add')}
              >
                <div
                  className="google-account-avatar"
                  style={{
                    background: 'var(--bg-surface-hover)',
                    border: '1px dashed var(--border-medium)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <UserPlus size={18} />
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    Use another Google account
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    Sign in with your personal or student Gmail
                  </div>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
              </button>
            </div>
          </div>
        ) : (
          /* Mode: Enter your OWN real Gmail */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {accounts.length > 0 && (
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => setMode('list')}
                  style={{ padding: '0.35rem', borderRadius: '50%' }}
                  title="Back to account list"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Sign in with Google
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Enter your Google Account email to continue to SkillPath AI
                </p>
              </div>
            </div>

            {inputError && (
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid var(--rose-500)',
                  color: 'var(--rose-500)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  marginBottom: '1rem'
                }}
              >
                {inputError}
              </div>
            )}

            <form onSubmit={handleCustomSubmit}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Email or phone *</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. yourname@gmail.com"
                    autoFocus
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                  />
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-dim)',
                    marginTop: '0.35rem',
                    display: 'block'
                  }}
                >
                  Use your personal Gmail, university G-Suite, or Google Workspace account.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                {accounts.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setMode('list')}
                  >
                    Back to Accounts
                  </button>
                )}
                <button
                  type="submit"
                  disabled={Boolean(signingInEmail)}
                  className="btn btn-primary btn-sm"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#1a73e8',
                    borderColor: '#1a73e8',
                    padding: '0.55rem 1.25rem'
                  }}
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
}
