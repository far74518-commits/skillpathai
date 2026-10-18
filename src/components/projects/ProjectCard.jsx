import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Code2, CheckCircle2, Play, Check } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function ProjectCard({ project }) {
  const { toggleProjectStarted, toggleProjectCompleted, toggleChecklistItem } = useApp();

  const {
    id,
    title,
    careerTrack,
    difficulty,
    estimatedHours,
    skills = [],
    description,
    features = [],
    checklist = [],
    started,
    completed
  } = project;

  const completedChecks = checklist.filter(c => c.completed).length;
  const progressPct = checklist.length > 0 ? Math.round((completedChecks / checklist.length) * 100) : (completed ? 100 : 0);

  return (
    <div className={`project-card ${completed ? 'card-completed' : ''}`}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className="badge badge-indigo">{careerTrack}</span>
            <span className={`badge ${difficulty === 'Beginner' ? 'badge-emerald' : difficulty === 'Intermediate' ? 'badge-amber' : 'badge-rose'}`}>
              {difficulty}
            </span>
          </div>
          {completed && (
            <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={12} /> Completed
            </span>
          )}
        </div>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
          {title}
        </h3>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
          {description}
        </p>

        {/* Skills Chips */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {skills.map((sk, idx) => (
            <span key={idx} className="badge badge-gray">
              {sk}
            </span>
          ))}
        </div>

        {/* Checklist box */}
        {checklist.length > 0 && (
          <div className="project-checklist-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>Project Checklist</span>
              <span>{completedChecks} / {checklist.length} ({progressPct}%)</span>
            </div>

            <div style={{ height: 5, background: 'var(--bg-surface-active)', borderRadius: 99, overflow: 'hidden', marginBottom: '0.65rem' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  background: 'var(--emerald-500)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="project-check-item"
                  onClick={() => toggleChecklistItem(id, item.id)}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 3,
                      border: `1.5px solid ${item.completed ? 'var(--emerald-500)' : 'var(--border-medium)'}`,
                      background: item.completed ? 'var(--emerald-500)' : 'transparent',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {item.completed && <Check size={11} />}
                  </div>
                  <span style={{ textDecoration: item.completed ? 'line-through' : 'none', opacity: item.completed ? 0.7 : 1 }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Clock size={14} />
          <span>{estimatedHours}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {!completed ? (
            <Button
              size="sm"
              variant={started ? 'outline' : 'secondary'}
              icon={Play}
              onClick={() => toggleProjectStarted(id)}
            >
              {started ? 'In Progress' : 'Start Project'}
            </Button>
          ) : null}

          <Button
            size="sm"
            variant={completed ? 'secondary' : 'primary'}
            icon={CheckCircle2}
            onClick={() => toggleProjectCompleted(id)}
          >
            {completed ? 'Reopen' : 'Mark Completed'}
          </Button>
        </div>
      </div>
    </div>
  );
}
