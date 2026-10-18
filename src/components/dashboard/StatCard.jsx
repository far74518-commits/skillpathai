import React from 'react';

export default function StatCard({ label, value, trend, icon: Icon, color = 'var(--primary-500)', bg = 'rgba(99, 102, 241, 0.12)' }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {trend && <span className="stat-trend">{trend}</span>}
      </div>
      <div className="stat-icon-box" style={{ background: bg, color }}>
        <Icon size={24} />
      </div>
    </div>
  );
}
