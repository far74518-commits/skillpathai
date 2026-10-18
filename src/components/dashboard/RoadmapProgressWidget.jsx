import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CareerService } from '../../services/careerService';
import { Map, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import Button from '../common/Button';

export default function RoadmapProgressWidget() {
  const { targetCareerId, roadmaps, toggleTaskCompleted } = useApp();
  const career = CareerService.getCareerById(targetCareerId);
  const roadmap = roadmaps[targetCareerId] || roadmaps['frontend-dev'];

  if (!roadmap || !roadmap.stages) return null;

  // Find next incomplete task
  let nextTask = null;
  let nextTaskStageId = null;
  let totalTasks = 0;
  let completedTasks = 0;

  roadmap.stages.forEach(stage => {
    (stage.tasks || []).forEach(task => {
      totalTasks++;
      if (task.completed) {
        completedTasks++;
      } else if (!nextTask) {
        nextTask = task;
        nextTaskStageId = stage.id;
      }
    });
  });

  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Map size={18} color="var(--primary-500)" />
            Current Roadmap: {career?.title}
          </h3>
          <p className="card-subtitle">
            {completedTasks} of {totalTasks} milestones achieved ({percentage}%)
          </p>
        </div>
        <Link to="/roadmap">
          <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
            Full Roadmap
          </Button>
        </Link>
      </div>

      {/* Progress Bar */}
      <div style={{ height: 8, background: 'var(--bg-surface-active)', borderRadius: 99, overflow: 'hidden', margin: '0.75rem 0 1.25rem' }}>
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, var(--primary-500), var(--cyan-500))',
            borderRadius: 99,
            transition: 'width 0.4s ease'
          }}
        />
      </div>

      {/* Next Up Task */}
      {nextTask ? (
        <div
          style={{
            background: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem'
          }}
        >
          <button
            onClick={() => toggleTaskCompleted(targetCareerId, nextTaskStageId, nextTask.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              marginTop: 2
            }}
            title="Mark completed"
          >
            <Circle size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-400)', textTransform: 'uppercase' }}>
              Next Recommended Milestone
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: 2 }}>
              {nextTask.title}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {nextTask.description}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem', flexWrap: 'wrap' }}>
              <span className="badge badge-gray">{nextTask.duration}</span>
              {(nextTask.skills || []).slice(0, 2).map((sk, i) => (
                <span key={i} className="badge badge-indigo">{sk}</span>
              ))}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleTaskCompleted(targetCareerId, nextTaskStageId, nextTask.id)}
          >
            Done
          </Button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--emerald-500)', fontWeight: 600 }}>
          <CheckCircle2 size={24} style={{ display: 'inline-block', marginBottom: 4 }} />
          <div>All roadmap milestones completed! Fantastic work!</div>
        </div>
      )}
    </div>
  );
}
