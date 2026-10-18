import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CareerService } from '../services/careerService';
import { AIService } from '../services/aiService';
import AssessmentForm from '../components/careers/AssessmentForm';
import CareerCard from '../components/careers/CareerCard';
import AICareerMatchingSection from '../components/jobs/AICareerMatchingSection';
import { Sparkles, Target, AlertCircle, Bot, CheckCircle2, ShieldCheck, RefreshCw, Trophy } from 'lucide-react';
import Button from '../components/common/Button';

export default function CareerAssistantPage() {
  const { targetCareerId, setTargetCareer, skills, addToast } = useApp();

  const [assessmentResults, setAssessmentResults] = useState(() => {
    return CareerService.evaluateAssessment({
      educationLevel: '',
      degreeField: '',
      existingSkills: [],
      interests: [],
      preferredWorkEnv: '',
      careerGoal: '',
      weeklyHours: 15
    });
  });

  const [aiAdvice, setAiAdvice] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live dynamic update whenever skills, degree, or stage change
  const handleFormChange = (formData) => {
    const liveResults = CareerService.evaluateAssessment(formData, skills);
    setAssessmentResults(liveResults);
  };

  const handleFormSubmit = (formData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const results = CareerService.evaluateAssessment(formData, skills);
      setAssessmentResults(results);
      setIsSubmitting(false);
      setAiAdvice(null);
      addToast({
        type: 'success',
        title: 'Career Assessment Complete',
        message: `Calculated match percentages for all 7 tech careers.`
      });
    }, 300);
  };

  const handleGenerateAiAdvice = async () => {
    setLoadingAi(true);
    const topCareer = assessmentResults[0];
    try {
      const adviceData = await AIService.generateCareerAdvice({
        targetRole: topCareer.title,
        weeklyHours: topCareer.hoursPerWeek || 15,
        missingSkills: topCareer.missingSkills
      });
      setAiAdvice(adviceData);
      addToast({
        type: 'info',
        title: 'Guidance Generated',
        message: 'Personalized study strategy ready.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'AI Service Error',
        message: 'Could not connect to external AI service.'
      });
    } finally {
      setLoadingAi(false);
    }
  };

  const topCareer = assessmentResults[0];

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Career Assistant & Skill Gap Analyzer</h1>
          <p className="page-subtitle">
            Evaluate tech roles matched against your background, uncover high-priority missing skills, and build your roadmap.
          </p>
        </div>
      </div>

      {/* TOP SECTION: Assessment Form (Left) & Top Spotlight + AI Advisor (Right) */}
      <div className="assessment-container" style={{ marginBottom: '3rem' }}>
        {/* Left Column: Form */}
        <div>
          <AssessmentForm
            onSubmit={handleFormSubmit}
            onFormChange={handleFormChange}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Right Column: Spotlight & AI Advisor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* #1 Top Match Spotlight Card */}
          {topCareer && (
            <div
              className="card"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.1))',
                border: '1.5px solid rgba(139, 92, 246, 0.4)',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Trophy size={13} /> #1 Top Recommended Match
                </span>
                <span className="match-percentage-badge">
                  {topCareer.matchScore}% Match
                </span>
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
                {topCareer.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                {topCareer.tagline}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-app)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem',
                  marginBottom: '1rem'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Career Track: </span>
                  <strong style={{ color: '#38bdf8' }}>{topCareer.category}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Study Duration: </span>
                  <strong style={{ color: '#ffffff' }}>~{topCareer.estimatedWeeksToReady || 16} weeks to ready</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Button
                  variant="primary"
                  icon={Target}
                  onClick={() => setTargetCareer(topCareer.id)}
                  style={{ flex: 1 }}
                >
                  {targetCareerId === topCareer.id ? 'Active Target Track ★' : 'Set as My Target Role'}
                </Button>
              </div>
            </div>
          )}

          {/* AI Synthesis Card */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Bot size={22} color="var(--primary-400)" />
                <div>
                  <h3 className="card-title">Deep AI Strategic Advisor</h3>
                  <p className="card-subtitle">Synthesizes actionable study pacing from your assessment</p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={loadingAi ? RefreshCw : Sparkles}
                loading={loadingAi}
                onClick={handleGenerateAiAdvice}
              >
                {aiAdvice ? 'Regenerate' : 'Get AI Strategy'}
              </Button>
            </div>

            {aiAdvice ? (
              <div style={{ background: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span className="badge badge-indigo">{aiAdvice.source}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Ready for execution</span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {aiAdvice.advice}
                </p>

                {aiAdvice.suggestedWeeklyRoutine && (
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Suggested Weekly Schedule:
                    </div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {aiAdvice.suggestedWeeklyRoutine.map((item, idx) => (
                        <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <CheckCircle2 size={14} color="var(--emerald-500)" style={{ flexShrink: 0, marginTop: 3 }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Click "Get AI Strategy" to generate tailored weekly schedules and learning priority advice for your top career match.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Full-Width 2-Column Grid of All Matching Careers */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#ffffff' }}>
              All Matching Career Tracks ({assessmentResults.length})
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 2 }}>
              Side-by-side comparison of skills gaps, salaries, and starter projects across all roles.
            </p>
          </div>

          <span className="badge badge-gray">
            Ranked by Compatibility
          </span>
        </div>

        {/* 2-Column Grid fills both the left side and right side evenly */}
        <div className="careers-two-column-grid">
          {assessmentResults.map((career) => (
            <CareerCard
              key={career.id}
              career={career}
              isTarget={targetCareerId === career.id}
              onSelectTarget={(id) => setTargetCareer(id)}
            />
          ))}
        </div>
      </div>

      {/* REAL VACANCIES SECTION: Live Database Matches & Personalized Learning Plan */}
      <div style={{ marginTop: '3.5rem' }}>
        <AICareerMatchingSection />
      </div>
    </div>
  );
}
