import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { AIService } from '../../services/aiService';
import {
  Sparkles,
  Layers,
  Clock,
  CheckCircle2,
  BookOpen,
  Calendar,
  Award,
  Zap,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function AIRoadmapGeneratorModal({
  isOpen,
  onClose,
  initialTargetRole = 'Full-Stack Developer',
  initialSkills = ['JavaScript', 'HTML', 'CSS'],
  onAdoptRoadmap,
}) {
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [experienceLevel, setExperienceLevel] = useState('Undergraduate Student');
  const [weeklyHours, setWeeklyHours] = useState(15);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(initialSkills);
  const [focusInput, setFocusInput] = useState('');
  const [focusAreas, setFocusAreas] = useState(['Modern Frameworks', 'Cloud Deployment', 'REST APIs']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleAddFocus = (e) => {
    e.preventDefault();
    if (focusInput.trim() && !focusAreas.includes(focusInput.trim())) {
      setFocusAreas([...focusAreas, focusInput.trim()]);
      setFocusInput('');
    }
  };

  const handleRemoveFocus = (area) => {
    setFocusAreas(focusAreas.filter((a) => a !== area));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await AIService.generateCustomRoadmap({
        targetRole,
        experienceLevel,
        weeklyHours,
        currentSkills: skills,
        focusAreas,
      });
      setGeneratedRoadmap(result);
    } catch (err) {
      console.error('Roadmap generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdopt = () => {
    if (generatedRoadmap && onAdoptRoadmap) {
      onAdoptRoadmap(generatedRoadmap);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Smart Career Roadmap Generator" size="lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(56, 189, 248, 0.1) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
              Custom Curriculum Architect
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Synthesize a tailored 3-stage milestone path with hours, skills, and checkpoints powered by Google Gemini AI.
            </div>
          </div>
        </div>

        {!generatedRoadmap ? (
          /* Form Controls */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Target Career / Niche */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Target Tech Role or Specialty
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full-Stack AI Engineer, Cloud DevOps Specialist, Golang Backend Developer..."
                style={{
                  width: '100%',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  color: '#ffffff',
                  fontSize: '0.92rem'
                }}
              />
            </div>

            {/* Experience Level & Hours Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Current Stage
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    color: '#ffffff',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="Undergraduate Student">Undergraduate University Student</option>
                  <option value="Fresh Graduate (0-1 yr)">Fresh Graduate (0-1 yr)</option>
                  <option value="Career Switcher">Career Switcher</option>
                  <option value="Junior Engineer (1-2 yrs)">Junior Engineer (1-2 yrs)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Weekly Commitment: <strong style={{ color: '#38bdf8' }}>{weeklyHours} hrs/week</strong>
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#8b5cf6', marginTop: '0.65rem' }}
                />
              </div>
            </div>

            {/* Current Skills Chips */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Your Existing Skills (to avoid redundant learning)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Type a skill and press Enter..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                  style={{
                    flex: 1,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.55rem 0.85rem',
                    color: '#ffffff',
                    fontSize: '0.85rem'
                  }}
                />
                <Button variant="secondary" size="sm" onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {skills.map((s, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#a5b4fc',
                      fontSize: '0.78rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s)}
                      style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer', padding: 0 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Desired Focus Areas */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Key Focus & Innovation Priorities
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={focusInput}
                  onChange={(e) => setFocusInput(e.target.value)}
                  placeholder="e.g. Next.js, Docker, Microservices..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFocus(e)}
                  style={{
                    flex: 1,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.55rem 0.85rem',
                    color: '#ffffff',
                    fontSize: '0.85rem'
                  }}
                />
                <Button variant="secondary" size="sm" onClick={handleAddFocus}>
                  Add
                </Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {focusAreas.map((f, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#7dd3fc',
                      fontSize: '0.78rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {f}
                    <button
                      type="button"
                      onClick={() => handleRemoveFocus(f)}
                      style={{ background: 'none', border: 'none', color: '#7dd3fc', cursor: 'pointer', padding: 0 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Generate Trigger */}
            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={Sparkles}
                onClick={handleGenerate}
                disabled={isGenerating || !targetRole.trim()}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.45)'
                }}
              >
                {isGenerating ? 'Synthesizing with Gemini AI...' : 'Generate Roadmap with AI'}
              </Button>
            </div>
          </div>
        ) : (
          /* Roadmap Preview & Adoption */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  {generatedRoadmap.roadmapTitle || `${targetRole} Roadmap`}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                  {generatedRoadmap.summary} • Est. {generatedRoadmap.totalEstimatedWeeks || 12} Weeks ({weeklyHours} hrs/wk)
                </p>
              </div>
              <span className="badge badge-indigo" style={{ fontSize: '0.78rem' }}>
                {generatedRoadmap.source}
              </span>
            </div>

            {/* Stages Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '380px', overflowY: 'auto', paddingRight: '0.35rem' }}>
              {(generatedRoadmap.stages || []).map((stage, sIdx) => (
                <div
                  key={sIdx}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Layers size={16} />
                      <span>{stage.title}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.05)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                      {stage.duration}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {(stage.milestones || []).map((m, mIdx) => (
                      <div
                        key={mIdx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#ffffff' }}>
                            {m.title}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={12} /> {m.estimatedHours} hrs
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                          {m.description}
                        </p>
                        {m.skills && m.skills.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.2rem' }}>
                            {m.skills.map((sk, kIdx) => (
                              <span
                                key={kIdx}
                                style={{
                                  fontSize: '0.7rem',
                                  background: 'rgba(139, 92, 246, 0.12)',
                                  color: '#c4b5fd',
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: 'var(--radius-sm)'
                                }}
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <Button variant="outline" size="sm" onClick={() => setGeneratedRoadmap(null)}>
                ← Adjust Parameters
              </Button>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  icon={CheckCircle2}
                  onClick={handleAdopt}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  Adopt & Set as Active Roadmap
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
