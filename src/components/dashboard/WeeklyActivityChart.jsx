import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';

export default function WeeklyActivityChart() {
  const { settings } = useApp();
  const goalHours = settings?.weeklyStudyGoalHours || 15;

  const activityData = [
    { day: 'Mon', hours: 2.5, completedTasks: 1 },
    { day: 'Tue', hours: 3.0, completedTasks: 2 },
    { day: 'Wed', hours: 1.5, completedTasks: 0 },
    { day: 'Thu', hours: 4.0, completedTasks: 2 },
    { day: 'Fri', hours: 2.0, completedTasks: 1 },
    { day: 'Sat', hours: 3.5, completedTasks: 2 },
    { day: 'Sun', hours: 1.0, completedTasks: 0 }
  ];

  const totalHours = activityData.reduce((acc, curr) => acc + curr.hours, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            padding: '0.6rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.82rem'
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.day}</div>
          <div style={{ color: 'var(--primary-400)', marginTop: 2 }}>{data.hours} study hours</div>
          <div style={{ color: 'var(--text-muted)' }}>{data.completedTasks} tasks finished</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Weekly Learning Activity</h3>
          <p className="card-subtitle">
            {totalHours} of {goalHours} hrs studied this week ({Math.round((totalHours / goalHours) * 100)}% of goal)
          </p>
        </div>
        <span className="badge badge-indigo">Goal: {goalHours}h/wk</span>
      </div>

      <div style={{ width: '100%', height: 220, marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
              stroke="var(--text-dim)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'var(--border-subtle)' }}
            />
            <YAxis
              stroke="var(--text-dim)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              unit="h"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-surface-hover)' }} />
            <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
              {activityData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.hours >= 3.0 ? 'var(--primary-500)' : 'var(--cyan-500)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
