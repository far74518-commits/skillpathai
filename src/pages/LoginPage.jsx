import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import GoogleAccountChooserModal from '../components/auth/GoogleAccountChooserModal';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to Dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address (e.g. name@gmail.com).');
      return;
    }

    if (password.length < 4) {
      setError('Password should be at least 4 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        addToast({
          type: 'success',
          title: `Welcome, ${res.user.name}!`,
          message: `Successfully logged in as ${res.user.email}.`
        });
        navigate('/dashboard', { replace: true });
      } else {
        setError(res.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountSelect = async (account) => {
    setIsLoading(true);
    try {
      const res = await loginWithGoogle(account.email, account.name);
      if (res.success) {
        addToast({
          type: 'success',
          title: `Welcome, ${res.user.name}! 🚀`,
          message: `Signed in with ${account.email} via Google.`
        });
        setIsGoogleModalOpen(false);
        navigate('/dashboard', { replace: true });
      } else {
        setError(res.error || 'Google sign-in failed.');
      }
    } catch (err) {
      setError(err.message || 'Google authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    addToast({
      type: 'info',
      title: 'Password Recovery',
      message: `Password reset simulation link sent to ${forgotEmail}`
    });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/login" className="auth-logo">
            <div className="logo-badge">SP</div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
              SkillPath <span style={{ color: 'var(--primary-400)' }}>AI</span>
            </span>
          </Link>
          <h2 className="auth-title">Student Workspace Login</h2>
          <p className="auth-subtitle">Enter your Gmail & password to access your personalized career space</p>
        </div>

        {/* Continue with Google */}
        <button
          type="button"
          className="btn-google-auth"
          onClick={() => setIsGoogleModalOpen(true)}
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        <div className="auth-divider">
          <span>or sign in with email</span>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--rose-500)', color: 'var(--rose-500)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Gmail / Email Address *</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="e.g. yourname@gmail.com"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password *</label>
              <button
                type="button"
                onClick={() => {
                  setIsForgotOpen(true);
                  setForgotSent(false);
                }}
                style={{ fontSize: '0.78rem', color: 'var(--primary-400)', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                Forgot password?
              </button>
            </div>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={ArrowRight}
            disabled={isLoading}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {isLoading ? 'Signing In...' : 'Log In & Open Dashboard'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don’t have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--primary-400)', fontWeight: 600 }}>
            Sign up free
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        title="Reset Password"
        maxWidth="440px"
      >
        {!forgotSent ? (
          <form onSubmit={handleForgotSubmit}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem', lineHeight: 1.5 }}>
              Enter your registered student email address. In demo mode, a simulated recovery link will be generated.
            </p>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="student@university.edu"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <Button variant="secondary" onClick={() => setIsForgotOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Send Reset Link
              </Button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <Sparkles size={32} color="var(--emerald-500)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Reset Link Sent!
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Demo simulation completed for <strong>{forgotEmail}</strong>. You can log in using any test password.
            </p>
            <Button variant="primary" onClick={() => setIsForgotOpen(false)}>
              Back to Login
            </Button>
          </div>
        )}
      </Modal>

      {/* Google Account Chooser Modal */}
      <GoogleAccountChooserModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleAccountSelect}
      />
    </div>
  );
}
