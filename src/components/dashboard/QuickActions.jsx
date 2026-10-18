import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Award, FileText, Star, Map } from 'lucide-react';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: 'AI Assessment', icon: Sparkles, color: 'var(--primary-400)', path: '/assistant' },
    { label: 'Check Roadmap', icon: Map, color: 'var(--cyan-400)', path: '/roadmap' },
    { label: 'Track Skills', icon: Award, color: 'var(--emerald-400)', path: '/skills' },
    { label: 'Edit CV', icon: FileText, color: 'var(--violet-500)', path: '/cv-builder' },
    { label: 'Projects', icon: Star, color: 'var(--amber-400)', path: '/projects' }
  ];

  return (
    <div className="card">
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <h3 className="card-title">Quick Actions</h3>
      </div>
      <div className="quick-actions-grid">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.path}
              className="quick-action-btn"
              onClick={() => navigate(act.path)}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--bg-surface-active)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: act.color
                }}
              >
                <Icon size={18} />
              </div>
              <span>{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
