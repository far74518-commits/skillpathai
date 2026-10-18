import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Check, Trash2, Calendar, Award, Sparkles } from 'lucide-react';

export default function NotificationsDropdown({ isOpen, onClose }) {
  const { notifications, markNotificationRead, clearAllNotifications } = useApp();

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'interview':
        return <Calendar size={14} color="var(--amber-500)" />;
      case 'milestone':
        return <Sparkles size={14} color="var(--emerald-500)" />;
      default:
        return <Award size={14} color="var(--primary-500)" />;
    }
  };

  return (
    <div className="dropdown-menu" style={{ width: 320, padding: 0 }} onClick={(e) => e.stopPropagation()}>
      <div
        style={{
          padding: '0.85rem 1rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
          Notifications
        </span>
        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Trash2 size={12} /> Clear all
          </button>
        )}
      </div>

      <div style={{ maxHeight: 280, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No new notifications. You're all caught up!
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              style={{
                padding: '0.85rem 1rem',
                borderBottom: '1px solid var(--border-subtle)',
                background: notif.read ? 'transparent' : 'rgba(99, 102, 241, 0.06)',
                cursor: 'pointer',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start'
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--bg-surface-active)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2
                }}
              >
                {getIcon(notif.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {notif.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {notif.message}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                  {notif.time}
                </div>
              </div>
              {!notif.read && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--primary-500)',
                    flexShrink: 0,
                    marginTop: 6
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
