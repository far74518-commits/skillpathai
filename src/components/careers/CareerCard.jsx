import React from 'react';
import { useApp } from '../../context/AppContext';
import { Target, CheckCircle2, AlertCircle, Clock, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function CareerCard({ career, isTarget = false, onSelectTarget }) {
  const {
    id,
    title,
    category,
    tagline,
    matchScore,
    matchReasons = [],
    matchedSkills = [],
    missingSkills = [],
    difficulty,
    estimatedWeeksToReady,
    avgSalary,
    starterProjects = [],
    recommendedActions = []
  } = career;

  return (
    <div className={`career-match-card ${isTarget ? 'featured-match' : ''}`}>
      <div className="career-match-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <span className="badge badge-gray">{category}</span>
            <span className="badge badge-indigo">{difficulty}</span>
            {isTarget && <span className="badge badge-cyan">Current Target</span>}
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            {tagline}
          </p>
        </div>
        {matchScore && (
          <div className="match-percentage-badge">
            {matchScore}% Match
          </div>
        )}
      </div>

      {/* Quick Specs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          margin: '1rem 0',
          padding: '0.75rem 1rem',
          background: 'var(--bg-app)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.84rem'
        }}
      >
        <Clock size={16} color="var(--primary-400)" />
        <span style={{ color: 'var(--text-secondary)' }}>
          Estimated Duration: <strong style={{ color: '#ffffff' }}>~{estimatedWeeksToReady || 16} weeks to ready</strong>
        </span>
      </div>

      {/* Match Reasons */}
      {matchReasons.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-400)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Why This Fits Your Profile
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {matchReasons.slice(0, 2).map((reason, idx) => (
              <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <Sparkles size={14} color="var(--primary-400)" style={{ flexShrink: 0, marginTop: 3 }} />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills Gap Analysis */}
      <div className="skills-gap-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
            Skill Gap Analysis
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {missingSkills.length} missing • {matchedSkills.length} ready
          </span>
        </div>

        {missingSkills.length > 0 && (
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--rose-500)', fontWeight: 600, marginBottom: '0.25rem' }}>
              High-Priority Gaps to Learn:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {missingSkills.slice(0, 5).map((sk, idx) => (
                <span key={idx} className="badge badge-rose">
                  {sk.name || sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {matchedSkills.length > 0 && (
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--emerald-500)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Skills You Already Have:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {matchedSkills.slice(0, 5).map((sk, idx) => (
                <span key={idx} className="badge badge-emerald">
                  {sk.name || sk}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Starter Projects */}
      {starterProjects.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Recommended Starter Portfolio Project
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            🎯 {starterProjects[0].title}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Estimated time: {starterProjects[0].time} • {starterProjects[0].difficulty}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
        <Button
          variant={isTarget ? 'secondary' : 'primary'}
          onClick={() => onSelectTarget(id)}
          icon={Target}
          style={{ flex: 1 }}
        >
          {isTarget ? 'Active Target Track' : 'Select as Target Career'}
        </Button>
      </div>
    </div>
  );
}
