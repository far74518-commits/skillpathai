import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary-400)',
          marginBottom: '1.5rem'
        }}
      >
        <Compass size={40} />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: 440, fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '2rem' }}>
        The learning pathway or career page you are looking for doesn’t exist or may have been relocated.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/dashboard">
          <Button variant="primary" icon={Home}>
            Go to Student Dashboard
          </Button>
        </Link>
        <Link to="/">
          <Button variant="secondary" icon={ArrowLeft}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
