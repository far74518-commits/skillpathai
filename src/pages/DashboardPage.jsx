import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { CareerService } from '../services/careerService';
import StatCard from '../components/dashboard/StatCard';
import WeeklyActivityChart from '../components/dashboard/WeeklyActivityChart';
import RoadmapProgressWidget from '../components/dashboard/RoadmapProgressWidget';
import RecentActivityFeed from '../components/dashboard/RecentActivityFeed';
import QuickActions from '../components/dashboard/QuickActions';
import ProjectCard from '../components/projects/ProjectCard';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Target,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock
} from 'lucide-react';
import Button from '../components/common/Button';

export default function DashboardPage() {
  const { user } = useAuth();
  const { targetCareerId, skills, jobs, readiness, projects } = useApp();

  const career = CareerService.getCareerById(targetCareerId);

  // Count skills completed (level >= targetLevel) vs remaining
  const skillsCompleted = skills.filter(s => (s.currentLevel || 1) >= (s.targetLevel || 4)).length;
  const skillsRemaining = skills.length - skillsCompleted;

  // Projects count
  const completedProjects = projects.filter(p => p.completed).length;

  // Recommended project for target career
  const featuredProject = projects.find(p => !p.completed) || projects[0];

  return (
    <div className="animate-fade">
      {/* Welcome Banner */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Welcome back, {user?.name?.split(' ')[0] || user?.name || 'Student'}! 👋
          </h1>
          <p className="page-subtitle">
            Targeting <strong>{career?.title || 'Software Engineering'}</strong> • Tracking readiness, skills, and portfolio milestones.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/assistant">
            <Button variant="outline" size="sm" icon={Sparkles}>
              Re-run Assessment
            </Button>
          </Link>
          <Link to="/cv-builder">
            <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
              View My CV
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Stat Cards Row */}
      <div className="dashboard-grid-stats">
        <StatCard
          label="Career Readiness"
          value={`${readiness.overall}%`}
          trend="+12% this month"
          icon={Target}
          color="var(--primary-500)"
          bg="rgba(99, 102, 241, 0.12)"
        />
        <StatCard
          label="Mastered Skills"
          value={skillsCompleted}
          trend={`${skillsRemaining} skills in progress`}
          icon={CheckCircle2}
          color="var(--emerald-500)"
          bg="rgba(16, 185, 129, 0.12)"
        />
        <StatCard
          label="Skill Gaps to Close"
          value={readiness.missingCount || 4}
          trend="Required for target role"
          icon={AlertTriangle}
          color="var(--amber-500)"
          bg="rgba(245, 158, 11, 0.12)"
        />
        <StatCard
          label="Portfolio Projects"
          value={projects.length}
          trend={`${completedProjects} completed • Build your proof`}
          icon={Code2}
          color="var(--cyan-500)"
          bg="rgba(6, 182, 212, 0.12)"
        />
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="dashboard-main-columns">
        {/* Left Column (Primary charts and milestones) */}
        <div className="dashboard-column">
          {/* Career Readiness Hero Card */}
          <div className="readiness-hero-card">
            <div className="readiness-score-display">
              {readiness.overall}%
            </div>
            <div className="readiness-details">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-indigo">Career Benchmark</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target: {career?.title}</span>
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {readiness.overall >= 75
                  ? 'High Interview Readiness!'
                  : 'Consistent Progress — Keep Closing Skill Gaps'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
                Your portfolio, skills matrix, and completed roadmap tasks position you well for junior positions and summer engineering internships.
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Skills Match: <strong style={{ color: 'var(--text-primary)' }}>{readiness.skillsScore}%</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Roadmap Progress: <strong style={{ color: 'var(--text-primary)' }}>{readiness.roadmapScore}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap Widget */}
          <RoadmapProgressWidget />

          {/* Weekly Activity Chart */}
          <WeeklyActivityChart />

          {/* Featured Portfolio Project Card */}
          {featuredProject && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Recommended Capstone Project</h3>
                  <p className="card-subtitle">Boost your readiness score by finishing this project checklist</p>
                </div>
                <Link to="/projects">
                  <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                    All Projects
                  </Button>
                </Link>
              </div>
              <ProjectCard project={featuredProject} />
            </div>
          )}
        </div>

        {/* Right Column (Quick actions, recent activity, upcoming tasks) */}
        <div className="dashboard-column">
          <QuickActions />

          {/* Upcoming Deadlines Widget */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Calendar size={18} color="var(--primary-400)" />
                Upcoming Deadlines
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ background: 'var(--bg-app)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-amber">Interview</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>In 3 days</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                  Stripe Technical Discussion
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Review React performance & array parsing algorithms
                </div>
              </div>

              <div style={{ background: 'var(--bg-app)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-indigo">Roadmap Milestone</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>This Sunday</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                  Complete Custom React Hooks Module
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Target: 4 hours study remaining
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <RecentActivityFeed />
        </div>
      </div>
    </div>
  );
}
