import React from 'react';
import { Check, Clock, Code2, Sparkles } from 'lucide-react';

export default function TaskItem({ task, onToggle }) {
  const { id, title, description, skills = [], duration, project, completed, isCustom } = task;

  return (
    <div className={`task-item ${completed ? 'completed' : ''}`}>
      <button
        className={`task-checkbox-btn ${completed ? 'checked' : ''}`}
        onClick={onToggle}
        aria-label={completed ? 'Mark incomplete' : 'Mark completed'}
      >
        {completed && <Check size={14} />}
      </button>

      <div className="task-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="task-title-text">{title}</span>
          {isCustom && <span className="badge badge-cyan">Personal Task</span>}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
          {description}
        </p>

        {project && (
          <div
            style={{
              marginTop: '0.5rem',
              fontSize: '0.82rem',
              color: 'var(--primary-400)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Code2 size={13} />
            <span>Checkpoint: {project}</span>
          </div>
        )}

        <div className="task-meta-chips" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
          <span className="badge badge-gray" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={11} />
            {duration}
          </span>
          <span
            className="badge badge-emerald"
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.35)'
            }}
          >
            🎯 {task.targetMastery || 85}% Seekhna Chahiye
          </span>
          {skills.map((sk, idx) => (
            <span key={idx} className="badge badge-indigo">
              {sk}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
