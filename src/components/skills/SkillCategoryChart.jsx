import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';

export default function SkillCategoryChart({ skills = [] }) {
  const categories = ['Frontend', 'Backend', 'Databases', 'Programming', 'Communication', 'Problem-solving'];

  const chartData = categories.map((cat) => {
    const catSkills = skills.filter(s => s.category === cat);
    if (catSkills.length === 0) {
      return { category: cat, current: 0, target: 4 };
    }
    const currentAvg = catSkills.reduce((acc, s) => acc + (s.currentLevel || 1), 0) / catSkills.length;
    const targetAvg = catSkills.reduce((acc, s) => acc + (s.targetLevel || 4), 0) / catSkills.length;

    return {
      category: cat,
      current: Number(currentAvg.toFixed(1)),
      target: Number(targetAvg.toFixed(1))
    };
  });

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
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.category}</div>
          <div style={{ color: 'var(--primary-400)', marginTop: 2 }}>Current Level: {data.current} / 5</div>
          <div style={{ color: 'var(--cyan-400)' }}>Target Level: {data.target} / 5</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Skill Category Radar</h3>
          <p className="card-subtitle">Current proficiency vs target goals by domain</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary-400)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary-500)' }} /> Current
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--cyan-400)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan-400)' }} /> Target
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="var(--border-subtle)" />
            <PolarAngleAxis
              dataKey="category"
              stroke="var(--text-secondary)"
              fontSize={11}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 5]}
              stroke="var(--text-dim)"
              fontSize={10}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Target"
              dataKey="target"
              stroke="var(--cyan-400)"
              fill="var(--cyan-400)"
              fillOpacity={0.15}
            />
            <Radar
              name="Current"
              dataKey="current"
              stroke="var(--primary-500)"
              fill="var(--primary-500)"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
