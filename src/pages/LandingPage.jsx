import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CAREERS } from '../data/careers';
import { FAQS, TESTIMONIALS } from '../data/faqs';
import {
  Compass,
  Sparkles,
  Map,
  Award,
  FileText,
  Layers,
  Code2,
  ArrowRight,
  Sun,
  Moon,
  ChevronDown,
  CheckCircle2,
  Target,
  ShieldCheck,
  Zap,
  TrendingUp,
  Users
} from 'lucide-react';
import Button from '../components/common/Button';

export default function LandingPage() {
  const { loginDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const handleDemoAccess = () => {
    loginDemo();
    navigate('/dashboard');
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI Career Guidance',
      desc: 'Smart assessment algorithm evaluating your degree, existing skills, and work style to identify high-growth tech matches and skill gaps.'
    },
    {
      icon: Map,
      title: 'Personalized Learning Roadmaps',
      desc: 'Step-by-step milestone roadmaps from foundations to production-ready frameworks, with full progress saving and personal task additions.'
    },
    {
      icon: Award,
      title: 'Skills Matrix & Gap Radar',
      desc: 'Visual proficiency tracking across frontend, backend, databases, and problem solving with comparative gap analysis.'
    },
    {
      icon: FileText,
      title: 'ATS-Optimized CV Builder',
      desc: 'Live two-way CV editor with Modern Tech and Clean Executive templates, instant LocalStorage saving, and print-ready A4 PDF export.'
    },
    {
      icon: Layers,
      title: 'Dynamic Degree Roadmaps',
      desc: 'Role-based curriculum roadmaps mapped to BSCS, BSSE, BSDS, BSIT, and Cyber Security with skill gap tracking.'
    },
    {
      icon: Code2,
      title: 'Curated Portfolio Projects',
      desc: 'Real-world project blueprints with step-by-step interactive checklists and clear learning outcomes to impress hiring teams.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Assess & Discover',
      desc: 'Answer 6 quick questions about your studies, existing tech skills, and interests to generate matching career paths and gap reports.'
    },
    {
      number: '02',
      title: 'Follow the Roadmap',
      desc: 'Tackle beginner, intermediate, and advanced curriculum milestones with verified project checkpoints and trackable progress.'
    },
    {
      number: '03',
      title: 'Build Projects & CV',
      desc: 'Complete portfolio-grade applications and format your achievements using our live ATS-ready CV builder templates.'
    },
    {
      number: '04',
      title: 'Track & Land Jobs',
      desc: 'Log your applications, manage recruiter callbacks and interview stages, and track your overall career readiness score.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {/* Landing Topbar */}
      <header className="landing-navbar">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div className="logo-badge">SP</div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            SkillPath <span style={{ color: 'var(--primary-400)' }}>AI</span>
          </span>
        </Link>

        <nav className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#how-it-works" className="landing-nav-link">How It Works</a>
          <a href="#careers" className="landing-nav-link">Popular Careers</a>
          <a href="#testimonials" className="landing-nav-link">Reviews</a>
          <a href="#faq" className="landing-nav-link">FAQ</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            className="nav-icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link to="/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>

          <Button variant="primary" size="sm" onClick={handleDemoAccess}>
            Demo Dashboard
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-glow-bg" />
        <div className="hero-content">
          <div className="hero-pill-badge">
            <Sparkles size={14} color="var(--primary-400)" />
            <span>Intelligent Career Planning Platform for Students</span>
          </div>

          <h1 className="hero-title">
            Build Your Future, <br />
            <span className="gradient-text">One Skill at a Time.</span>
          </h1>

          <p className="hero-description">
            SkillPath AI empowers university students and career switchers to identify high-growth tech roles,
            close critical skill gaps, conquer step-by-step roadmaps, build professional ATS CVs, and track job offers.
          </p>

          <div className="hero-cta-group">
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleDemoAccess}
            >
              Get Started Free
            </Button>
            <a href="#careers">
              <Button variant="secondary" size="lg" icon={Compass}>
                Explore Careers
              </Button>
            </a>
          </div>

          {/* Interactive Preview Mockup */}
          <div className="hero-preview-container">
            <div className="hero-preview-mockup">
              <div className="mockup-header-bar">
                <div className="mockup-dot red" />
                <div className="mockup-dot yellow" />
                <div className="mockup-dot green" />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                  app.skillpath.ai/dashboard
                </span>
              </div>

              <div className="mockup-body" style={{ textAlign: 'left' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CAREER READINESS</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-400)', marginTop: 2 }}>78%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--emerald-500)' }}>Top 15% in cohort</div>
                  </div>
                  <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TARGET ROLE</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>Frontend Developer</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--cyan-400)' }}>Stage 2 of 3 Active</div>
                  </div>
                  <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACTIVE APPLICATIONS</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--amber-500)', marginTop: 2 }}>6 Jobs</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>1 Interview • 1 Offer</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle2 size={18} color="var(--emerald-500)" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Next Milestone: React Hooks & State Management Architecture</span>
                  </div>
                  <Button size="sm" variant="primary" onClick={handleDemoAccess}>
                    Launch Live Workspace
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-section container">
        <div className="section-header-center">
          <div className="section-badge">All-In-One Toolkit</div>
          <h2 className="section-title">Designed for Serious Student Success</h2>
          <p className="section-desc">
            No more disconnected spreadsheets, tutorial hell, or generic advice. SkillPath AI coordinates every phase of your journey.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="feature-card">
                <div className="feature-icon-wrapper">
                  <Icon size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {feat.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="landing-section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-header-center">
            <div className="section-badge">Proven Methodology</div>
            <h2 className="section-title">How SkillPath AI Works</h2>
            <p className="section-desc">
              From day one of your degree to your signed offer letter, follow a structured four-stage system.
            </p>
          </div>

          <div className="how-it-works-grid">
            {steps.map((st, idx) => (
              <div key={idx} className="step-card">
                <div className="step-number">{st.number}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {st.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Careers Section */}
      <section id="careers" className="landing-section container">
        <div className="section-header-center">
          <div className="section-badge">Career Tracks</div>
          <h2 className="section-title">High-Demand Modern Tech Careers</h2>
          <p className="section-desc">
            Curated curriculums with realistic industry learning benchmarks and required skill profiles.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.75rem' }}>
          {CAREERS.slice(0, 6).map((career) => (
            <div key={career.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-indigo">{career.category}</span>
                  <span className="badge badge-emerald">{career.demand}</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {career.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.5rem 0 1rem', lineHeight: 1.5 }}>
                  {career.tagline}
                </p>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  <strong>Duration: </strong>~{career.estimatedWeeksToReady || 16} weeks to ready
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {career.requiredSkills.slice(0, 4).map((sk, idx) => (
                    <span key={idx} className="badge badge-gray">{sk.name}</span>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                icon={ArrowRight}
                iconPosition="right"
                onClick={handleDemoAccess}
              >
                View Learning Roadmap
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="landing-section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-header-center">
            <div className="section-badge">Student Feedback</div>
            <h2 className="section-title">Loved by Students Everywhere</h2>
            <p className="section-desc">
              (Demo content illustrating student outcomes and career shifts)
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.75rem' }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {t.role} • {t.school}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="landing-section container">
        <div className="section-header-center">
          <div className="section-badge">Got Questions?</div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-desc">Everything you need to know about SkillPath AI and local persistence.</p>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0
                    }}
                  />
                </button>
                {isOpen && <div className="faq-answer">{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="logo-badge">SP</div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  SkillPath <span style={{ color: 'var(--primary-400)' }}>AI</span>
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                The intelligent student career planning engine. Bridging academic studies with real industry readiness.
              </p>
            </div>

            <div>
              <div className="footer-col-title">Navigation</div>
              <div className="footer-links">
                <Link to="/dashboard" className="footer-link">Student Dashboard</Link>
                <Link to="/assistant" className="footer-link">AI Career Guidance</Link>
                <Link to="/roadmap" className="footer-link">Learning Roadmaps</Link>
                <Link to="/skills" className="footer-link">Skills Tracker</Link>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Productivity</div>
              <div className="footer-links">
                <Link to="/cv-builder" className="footer-link">ATS CV Builder</Link>
                <Link to="/projects" className="footer-link">Portfolio Projects</Link>
                <Link to="/settings" className="footer-link">Settings & Backups</Link>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Platform</div>
              <div className="footer-links">
                <Link to="/login" className="footer-link">Demo Login</Link>
                <Link to="/signup" className="footer-link">Student Registration</Link>
                <a href="#faq" className="footer-link">FAQ & Help</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div>© {new Date().getFullYear()} SkillPath AI. Client-side state persisted in LocalStorage.</div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <span>Privacy First</span>
              <span>No Secret Keys Exposed</span>
              <span>Open for Students</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
