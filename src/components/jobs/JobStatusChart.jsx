import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function JobStatusChart({ jobs = [] }) {
  const statusColors = {
    Saved: '#64748b',
    Applied: '#0284c7',
    Interview: '#d97706',
    Offer: '#16a34a',
    Rejected: '#dc2626'
  };

  const counts = {
    Saved: 0,
    Applied: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0
  };

  jobs.forEach((j) => {
    if (counts[j.status] !== undefined) {
      counts[j.status]++;
    }
  });

  const chartData = Object.keys(counts)
    .filter((k) => counts[k] > 0)
    .map((k) => ({
      name: k,
      value: counts[k],
      color: statusColors[k]
    }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            padding: '0.5rem 0.8rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.82rem'
          }}
        >
          <span style={{ fontWeight: 700, color: data.color }}>{data.name}: </span>
          <span style={{ color: 'var(--text-primary)' }}>{data.value} applications</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">Pipeline Funnel</h3>
          <p className="card-subtitle">Active distribution of your applications</p>
        </div>
      </div>

      <div style={{ width: '100%', height: 180 }}>
        {chartData.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No applications tracked yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        {chartData.map((d) => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
            <span style={{ color: 'var(--text-secondary)' }}>{d.name} ({d.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
