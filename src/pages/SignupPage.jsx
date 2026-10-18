import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, Building2, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';
import GoogleAccountChooserModal from '../components/auth/GoogleAccountChooserModal';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: 'State University of Technology',
    degree: 'B.S. in Computer Science',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const { signup, loginDemo, loginWithGoogle } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signup(formData);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Account Created!',
          message: `Welcome to SkillPath AI, ${formData.name}!`
        });
        navigate('/dashboard');
      } else {
        setError(res.error || 'Failed to create account.');
      }
    } catch (err) {
      setError(err?.message || 'Failed to create account.');
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
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err?.message || 'Google sign in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = () => {
    loginDemo();
    addToast({
      type: 'info',
      title: 'Demo Session Active',
      message: 'Logged in with pre-loaded student portfolio data.'
    });
    navigate('/dashboard');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="logo-badge">SP</div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
              SkillPath <span style={{ color: 'var(--primary-400)' }}>AI</span>
            </span>
          </Link>
          <h2 className="auth-title">Create student profile</h2>
          <p className="auth-subtitle">Join thousands of students building their career readiness</p>
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
          <span>or register with email</span>
        </div>

        {/* Demo Fast Track */}
        <div className="auth-demo-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-400)', marginBottom: '0.35rem' }}>
            <Sparkles size={16} /> Instant Student Demo Mode
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
            Want to test drive without typing? Launch with preloaded student sample data.
          </p>
          <Button variant="primary" size="sm" onClick={handleDemoAccess} style={{ width: '100%' }}>
            Launch Demo Workspace
          </Button>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--rose-500)', color: 'var(--rose-500)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div className="input-with-icon">
              <User size={16} className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">University / College Email *</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="student@university.edu"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Institution</label>
              <div className="input-with-icon">
                <Building2 size={16} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="University"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Degree Major</label>
              <div className="input-with-icon">
                <GraduationCap size={16} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Major"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min 6 chars"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Repeat"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Button type="submit" variant="secondary" size="lg" disabled={isLoading} style={{ width: '100%', marginTop: '0.75rem' }}>
            {isLoading ? 'Creating Profile...' : 'Create Custom Profile'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-400)', fontWeight: 600 }}>
            Log in
          </Link>
        </div>
      </div>

      {/* Google Account Chooser Modal */}
      <GoogleAccountChooserModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleAccountSelect}
      />
    </div>
  );
}
