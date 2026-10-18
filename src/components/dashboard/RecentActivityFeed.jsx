import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Briefcase, FileText, CheckCircle2 } from 'lucide-react';

export default function RecentActivityFeed() {
  const { skills, jobs, cvData } = useApp();

  const activities = [
    {
      id: 'act-1',
      icon: Briefcase,
      color: 'var(--amber-500)',
      bg: 'rgba(245, 158, 11, 0.12)',
      title: 'Job application updated',
      desc: `${jobs[0]?.position || 'Frontend Engineer'} at ${jobs[0]?.company || 'Stripe'} (${jobs[0]?.status || 'Applied'})`,
      time: 'Today'
    },
    {
      id: 'act-2',
      icon: Award,
      color: 'var(--emerald-500)',
      bg: 'rgba(16, 185, 129, 0.12)',
      title: 'Skill proficiency rated',
      desc: `${skills[0]?.name || 'HTML5'} updated to Level ${skills[0]?.currentLevel || 4}`,
      time: 'Yesterday'
    },
    {
      id: 'act-3',
      icon: FileText,
      color: 'var(--primary-500)',
      bg: 'rgba(99, 102, 241, 0.12)',
      title: 'CV Profile synchronized',
      desc: `${cvData?.personalInfo?.title || 'Aspiring Software Engineer'} profile saved`,
      time: '2 days ago'
    },
    {
      id: 'act-4',
      icon: CheckCircle2,
      color: 'var(--cyan-500)',
      bg: 'rgba(6, 182, 212, 0.12)',
      title: 'Roadmap Milestone Complete',
      desc: 'Completed HTML5 Semantic Structure & Accessibility module',
      time: '3 days ago'
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Recent Activity</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 'var(--radius-md)',
                  background: act.bg,
                  color: act.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Icon size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {act.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {act.desc}
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                {act.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
