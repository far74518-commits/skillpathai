import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { AIService } from '../../services/aiService';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Tag,
  ArrowRight,
  TrendingUp,
  FileCheck,
  RefreshCw,
  Zap,
  Check,
  Award
} from 'lucide-react';

export default function AIAtsReviewModal({ isOpen, onClose, cvData, targetRole, onApplySummary, onApplyBullet }) {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview | keywords | rewrite
  const [appliedSummary, setAppliedSummary] = useState(false);
  const [appliedBullets, setAppliedBullets] = useState({});

  useEffect(() => {
    if (isOpen) {
      handleRunReview();
    }
  }, [isOpen]);

  const handleRunReview = async () => {
    setLoading(true);
    setAppliedSummary(false);
    try {
      const res = await AIService.reviewATSResume(cvData, targetRole);
      setReview(res);
    } catch (err) {
      console.error('ATS review error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySummary = () => {
    if (review?.improvedSummary && onApplySummary) {
      onApplySummary(review.improvedSummary);
      setAppliedSummary(true);
    }
  };

  const handleApplyBulletItem = (idx, improvedText) => {
    if (onApplyBullet) {
      onApplyBullet(improvedText);
      setAppliedBullets(prev => ({ ...prev, [idx]: true }));
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981'; // emerald
    if (score >= 70) return '#3b82f6'; // blue
    if (score >= 55) return '#f59e0b'; // amber
    return '#ef4444'; // rose
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI ATS Resume Review & Optimizer" size="lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.1) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                ATS Compliance Analysis for {targetRole || 'Software Engineer'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Powered by {review?.source || 'Google Gemini AI'}
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={handleRunReview}
            disabled={loading}
            style={{ fontSize: '0.8rem' }}
          >
            {loading ? 'Analyzing...' : 'Re-Analyze CV'}
          </Button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
            <div
              className="animate-spin"
              style={{
                width: 42,
                height: 42,
                border: '3.5px solid rgba(99, 102, 241, 0.2)',
                borderTopColor: '#6366f1',
                borderRadius: '50%',
                margin: '0 auto 1rem'
              }}
            />
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.35rem' }}>
              Scanning CV with Google Gemini AI...
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Checking ATS parser compatibility, keyword frequency, metric density, and action verbs.
            </div>
          </div>
        ) : review ? (
          <div>
            {/* Top Score & Metrics Card */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                marginBottom: '1.25rem'
              }}
            >
              {/* ATS Compatibility Score */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: '50%',
                    border: `4px solid ${getScoreColor(review.atsScore)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    color: getScoreColor(review.atsScore),
                    boxShadow: `0 0 16px ${getScoreColor(review.atsScore)}33`
                  }}
                >
                  {review.atsScore}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    ATS Match Score
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                    {review.ratingLabel || 'Competitive'}
                  </div>
                </div>
              </div>

              {/* High-Value Keywords Found */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.15rem'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Keywords Detected
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                  {review.foundKeywords?.length || 0} Found
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {review.missingKeywords?.length || 0} critical missing
                </div>
              </div>

              {/* Action Verbs Status */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.15rem'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Impact Verbs
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
                  Active Form
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Engineering action verbs
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`tag-btn ${activeTab === 'overview' ? 'selected' : ''}`}
                style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
              >
                🔍 Overview & Critique
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('keywords')}
                className={`tag-btn ${activeTab === 'keywords' ? 'selected' : ''}`}
                style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
              >
                🏷️ Keywords & Gaps ({review.missingKeywords?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('rewrite')}
                className={`tag-btn ${activeTab === 'rewrite' ? 'selected' : ''}`}
                style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
              >
                ✨ AI Enhanced Summary & Bullets
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Strengths */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.06)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#10b981', marginBottom: '0.65rem' }}>
                    <CheckCircle2 size={17} />
                    <span>Key Strengths & ATS Highlights</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {(review.strengths || []).map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Critical Gaps */}
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.06)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.65rem' }}>
                    <AlertTriangle size={17} />
                    <span>High-Impact Recommendations for Callbacks</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {(review.criticalGaps || []).map((g, idx) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>

                {/* Action Verb Feedback */}
                {review.actionVerbFeedback && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <strong>Action Verb Guidance: </strong> {review.actionVerbFeedback}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Keywords */}
            {activeTab === 'keywords' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f43f5e', marginBottom: '0.5rem' }}>
                    ⚠️ High-Value ATS Keywords Missing for {targetRole}:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {(review.missingKeywords || []).map((kw, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'rgba(244, 63, 94, 0.1)',
                          border: '1px solid rgba(244, 63, 94, 0.3)',
                          color: '#fb7185',
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem',
                          fontWeight: 600
                        }}
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Tip: Weave these technologies and architectural keywords into your skills, project descriptions, or course highlights.
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', marginBottom: '0.5rem' }}>
                    ✅ Detected Technical Keywords in Your CV:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {(review.foundKeywords || []).map((kw, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          color: '#34d399',
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem',
                          fontWeight: 600
                        }}
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Rewrite */}
            {activeTab === 'rewrite' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* AI Enhanced Summary */}
                {review.improvedSummary && (
                  <div
                    style={{
                      background: 'rgba(99, 102, 241, 0.08)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.15rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Sparkles size={16} />
                        <span>ATS-Optimized Professional Summary</span>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={appliedSummary ? Check : ArrowRight}
                        onClick={handleApplySummary}
                        disabled={appliedSummary}
                        style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
                      >
                        {appliedSummary ? 'Applied to CV! ✓' : 'Apply to My CV'}
                      </Button>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.55, margin: 0 }}>
                      "{review.improvedSummary}"
                    </p>
                  </div>
                )}

                {/* Bullet Point Improvements */}
                {review.bulletImprovements && review.bulletImprovements.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
                      Measurable Engineering Bullet Rewrites:
                    </div>
                    {review.bulletImprovements.map((b, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.9rem 1rem',
                          marginBottom: '0.75rem'
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          <strong>Original: </strong> "{b.original}"
                        </div>
                        <div style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: 600, marginBottom: '0.35rem' }}>
                          <strong>AI Improved: </strong> "{b.improved}"
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>💡 {b.reason}</span>
                          <button
                            type="button"
                            onClick={() => handleApplyBulletItem(idx, b.improved)}
                            disabled={appliedBullets[idx]}
                            style={{
                              background: 'transparent',
                              border: '1px solid rgba(56, 189, 248, 0.4)',
                              color: '#38bdf8',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.2rem 0.5rem',
                              fontSize: '0.72rem',
                              cursor: 'pointer'
                            }}
                          >
                            {appliedBullets[idx] ? 'Copied ✓' : 'Add to Projects'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
