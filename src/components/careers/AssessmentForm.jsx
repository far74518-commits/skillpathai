import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { Sparkles, Check, Plus, ArrowUpRight, Award, Zap } from 'lucide-react';
import { CareerService } from '../../services/careerService';

// Domain-specific skills based on degree/background field
const FIELD_SKILLS_MAP = {
  'Computer Science / Software Engineering': [
    'HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Python', 'SQL',
    'Git', 'TypeScript', 'C++', 'Java', 'Express.js', 'MongoDB'
  ],
  'Data Science & Artificial Intelligence': [
    'Python', 'SQL', 'Pandas', 'Machine Learning', 'NumPy',
    'Data Visualization', 'Git', 'Deep Learning', 'Statistics', 'R', 'Power BI'
  ],
  'UI/UX & Product Design': [
    'Figma', 'UI/UX Fundamentals', 'Wireframing', 'Prototyping',
    'User Research', 'HTML5', 'CSS3', 'Design Systems', 'Adobe XD'
  ],
  'Information Technology & Cloud / DevOps': [
    'Linux', 'Git', 'Docker', 'AWS / Cloud', 'SQL',
    'Networking', 'Python', 'Bash / Shell', 'Cybersecurity', 'Kubernetes'
  ],
  'Business Information Systems / MIS': [
    'SQL', 'Data Analytics', 'Excel / Sheets', 'Python',
    'Jira / Agile', 'Power BI / Tableau', 'System Analysis', 'Git'
  ],
  'Electrical / Computer Engineering': [
    'C++', 'Python', 'Linux', 'Git', 'Embedded Systems',
    'MATLAB', 'Digital Logic', 'SQL'
  ],
  'Self-Taught / Career Switcher': [
    'HTML5', 'CSS3', 'JavaScript', 'React', 'Python',
    'Git', 'SQL', 'Figma', 'Node.js', 'Responsive Design'
  ]
};

const DEFAULT_POPULAR_SKILLS = [
  'HTML5', 'CSS3', 'JavaScript', 'React', 'Python', 'SQL',
  'Git', 'Node.js', 'Figma', 'TypeScript', 'Linux', 'Pandas'
];

const POPULAR_INTERESTS = [
  'Frontend & Web', 'UI/UX & Design', 'Data & Analytics',
  'Backend & Cloud', 'Artificial Intelligence', 'Security & Networks',
  'Creative Coding', 'Automation & Scripting'
];

const WORK_ENVIRONMENTS = [
  'Remote Friendly', 'Hybrid', 'In-Office Collaboration',
  'Fast-Paced Startup', 'Structured Tech Enterprise'
];

export default function AssessmentForm({
  initialValues = {},
  onSubmit,
  onFormChange,
  isSubmitting = false
}) {
  // Empty by default (NOT pre-filled) as requested by user
  const [formData, setFormData] = useState({
    educationLevel: initialValues.educationLevel || '',
    degreeField: initialValues.degreeField || '',
    existingSkills: initialValues.existingSkills || [],
    interests: initialValues.interests || [],
    preferredWorkEnv: initialValues.preferredWorkEnv || '',
    careerGoal: initialValues.careerGoal || '',
    weeklyHours: initialValues.weeklyHours || 15
  });

  const [skillInput, setSkillInput] = useState('');
  const [customDegree, setCustomDegree] = useState('');
  const [isOtherDegree, setIsOtherDegree] = useState(false);

  // Compute available skills based on selected degreeField
  const [availableSkills, setAvailableSkills] = useState(() => {
    return DEFAULT_POPULAR_SKILLS;
  });

  // Whenever degreeField changes, update suggested skills dynamically
  useEffect(() => {
    const field = formData.degreeField;
    let suggested = FIELD_SKILLS_MAP[field] || DEFAULT_POPULAR_SKILLS;

    setAvailableSkills(prev => {
      // Ensure all currently selected skills stay visible in the list
      const combined = [...suggested];
      formData.existingSkills.forEach(s => {
        if (!combined.some(existing => existing.toLowerCase() === s.toLowerCase())) {
          combined.unshift(s);
        }
      });
      return combined;
    });
  }, [formData.degreeField]);

  // Compute live match score & top match based on current skills
  const liveResults = CareerService.evaluateAssessment(formData);
  const liveTopMatch = liveResults && liveResults.length > 0 ? liveResults[0] : null;
  const liveScore = liveTopMatch ? liveTopMatch.matchScore : 15;

  // Notify parent of real-time form state changes
  const updateFormData = (updater) => {
    setFormData(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      if (onFormChange) {
        onFormChange(updated);
      }
      return updated;
    });
  };

  const handleEducationChange = (e) => {
    updateFormData({ educationLevel: e.target.value });
  };

  const handleDegreeSelect = (e) => {
    const val = e.target.value;
    if (val === 'Other') {
      setIsOtherDegree(true);
      updateFormData({ degreeField: customDegree || 'Other' });
    } else {
      setIsOtherDegree(false);
      updateFormData({ degreeField: val });
    }
  };

  const handleCustomDegreeChange = (e) => {
    const val = e.target.value;
    setCustomDegree(val);
    updateFormData({ degreeField: val });
  };

  const toggleSkill = (skill) => {
    updateFormData(prev => {
      const exists = prev.existingSkills.some(s => s.toLowerCase() === skill.toLowerCase());
      const nextSkills = exists
        ? prev.existingSkills.filter(s => s.toLowerCase() !== skill.toLowerCase())
        : [...prev.existingSkills, skill];
      return { ...prev, existingSkills: nextSkills };
    });
  };

  const addCustomSkill = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const raw = skillInput.trim();
    if (!raw) return;

    const items = raw.split(',').map(s => s.trim()).filter(Boolean);
    if (items.length === 0) return;

    // Add to available skills list at the front
    setAvailableSkills(prev => {
      const next = [...prev];
      items.forEach(item => {
        if (!next.some(s => s.toLowerCase() === item.toLowerCase())) {
          next.unshift(item);
        }
      });
      return next;
    });

    // Auto-select the newly typed skills
    updateFormData(prev => {
      const nextSkills = [...prev.existingSkills];
      items.forEach(item => {
        if (!nextSkills.some(s => s.toLowerCase() === item.toLowerCase())) {
          nextSkills.push(item);
        }
      });
      return { ...prev, existingSkills: nextSkills };
    });

    setSkillInput('');
  };

  const toggleInterest = (interest) => {
    updateFormData(prev => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter(i => i !== interest)
          : [...prev.interests, interest]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form className="assessment-form-card" onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Student Career Assessment
          </h3>
          <span className="badge badge-indigo" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Zap size={12} /> Real-time Matching
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
          Select your stage, background, and skills. Your career compatibility percentage updates live with every selection!
        </p>
      </div>

      {/* Real-time Dynamic Score Bar */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.08))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={16} style={{ color: 'var(--primary-400)' }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Live Match Compatibility:
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: liveScore >= 70 ? 'var(--emerald-400)' : 'var(--primary-400)' }}>
              {liveScore}%
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ({formData.existingSkills.length} skills selected)
            </span>
          </div>
        </div>

        {/* Progress Fill Bar */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${liveScore}%`,
              height: '100%',
              background: liveScore >= 70
                ? 'linear-gradient(90deg, #6366f1, #10b981)'
                : 'linear-gradient(90deg, #6366f1, #38bdf8)',
              borderRadius: '999px',
              transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.45rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          <span>
            {formData.existingSkills.length === 0
              ? '⚡ Select skills below to boost your percentage'
              : `🎯 Top Match: ${liveTopMatch ? liveTopMatch.title : 'Calculating...'}`}
          </span>
          <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>Auto-updates</span>
        </div>
      </div>

      {/* 1. Education Stage (EMPTY BY DEFAULT, USER SELECTS) */}
      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label className="form-label" style={{ fontWeight: 600 }}>
          1. Current Education Stage *
        </label>
        <select
          className="form-select"
          value={formData.educationLevel}
          onChange={handleEducationChange}
          required
        >
          <option value="" disabled>-- Select Your Education Stage --</option>
          <option value="High School Senior">High School Senior</option>
          <option value="Undergraduate (1st Year / Freshman)">Undergraduate (1st Year / Freshman)</option>
          <option value="Undergraduate (2nd / 3rd Year)">Undergraduate (2nd / 3rd Year)</option>
          <option value="Undergraduate Final Year / Senior">Undergraduate Final Year / Senior</option>
          <option value="Graduate / Master's Student">Graduate / Master's Student</option>
          <option value="Career Switcher / Self-Taught Learner">Career Switcher / Self-Taught Learner</option>
        </select>
      </div>

      {/* 2. Degree or Background Field (EMPTY BY DEFAULT, USER SELECTS) */}
      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label className="form-label" style={{ fontWeight: 600 }}>
          2. Degree or Background Field *
        </label>
        <select
          className="form-select"
          value={isOtherDegree ? 'Other' : formData.degreeField}
          onChange={handleDegreeSelect}
          required
        >
          <option value="" disabled>-- Select Your Degree / Field --</option>
          <option value="Computer Science / Software Engineering">Computer Science / Software Engineering</option>
          <option value="Data Science & Artificial Intelligence">Data Science & Artificial Intelligence</option>
          <option value="Information Technology & Cloud / DevOps">Information Technology (IT) & Cloud</option>
          <option value="UI/UX & Product Design">UI/UX & Product / Graphic Design</option>
          <option value="Business Information Systems / MIS">Business Information Systems / MIS</option>
          <option value="Electrical / Computer Engineering">Electrical / Computer Engineering</option>
          <option value="Self-Taught / Career Switcher">Self-Taught / Career Switcher</option>
          <option value="Other">Other (Enter custom field)</option>
        </select>

        {isOtherDegree && (
          <input
            type="text"
            className="form-input"
            placeholder="Type your degree or background field (e.g. Mechanical, Economics, Biology)..."
            style={{ marginTop: '0.65rem' }}
            value={customDegree}
            autoFocus
            onChange={handleCustomDegreeChange}
          />
        )}
      </div>

      {/* 3. Existing Skills (DYNAMIC BASED ON DEGREE & USER SELECTION) */}
      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
          <label className="form-label" style={{ fontWeight: 600, margin: 0 }}>
            3. Skills You Already Know{' '}
            <span style={{ fontSize: '0.82rem', color: 'var(--primary-400)', fontWeight: 700 }}>
              ({formData.existingSkills.length} selected)
            </span>
          </label>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Click tags to toggle & increase match %
          </span>
        </div>

        {/* Dynamic Skills Tags List */}
        <div className="tags-selector-group">
          {availableSkills.map((sk) => {
            const isSelected = formData.existingSkills.some(s => s.toLowerCase() === sk.toLowerCase());
            return (
              <button
                type="button"
                key={sk}
                className={`tag-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleSkill(sk)}
                style={{
                  transition: 'all 0.2s ease',
                  borderWidth: isSelected ? '1.5px' : '1px'
                }}
              >
                {isSelected ? (
                  <Check size={12} style={{ display: 'inline', marginRight: 4, strokeWidth: 3 }} />
                ) : (
                  <Plus size={11} style={{ display: 'inline', marginRight: 4, opacity: 0.6 }} />
                )}
                {sk}
              </button>
            );
          })}
        </div>

        {/* Add Custom Skill Input */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Type any skill (e.g. Flutter, Vue, C#) and press Enter"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomSkill(e);
              }
            }}
          />
          <Button type="button" variant="secondary" size="sm" onClick={addCustomSkill}>
            Add Skill
          </Button>
        </div>
      </div>

      {/* 4. Interests */}
      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label className="form-label" style={{ fontWeight: 600 }}>
          4. What tech areas excite you most?{' '}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            ({formData.interests.length} selected)
          </span>
        </label>
        <div className="tags-selector-group">
          {POPULAR_INTERESTS.map((interest) => {
            const isSelected = formData.interests.includes(interest);
            return (
              <button
                type="button"
                key={interest}
                className={`tag-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleInterest(interest)}
              >
                {isSelected && <Check size={12} style={{ display: 'inline', marginRight: 4 }} />}
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Preferred Work Environment */}
      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label className="form-label" style={{ fontWeight: 600 }}>
          5. Preferred Work Environment
        </label>
        <select
          className="form-select"
          value={formData.preferredWorkEnv}
          onChange={(e) => updateFormData({ preferredWorkEnv: e.target.value })}
        >
          <option value="">-- Any / Flexible Environment --</option>
          {WORK_ENVIRONMENTS.map((env) => (
            <option key={env} value={env}>{env}</option>
          ))}
        </select>
      </div>

      {/* 6. Hours per week slider */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="form-label" style={{ fontWeight: 600 }}>
            6. Available Learning Hours / Week
          </label>
          <span style={{ fontWeight: 800, color: 'var(--primary-400)', fontSize: '1.1rem' }}>
            {formData.weeklyHours} hrs / wk
          </span>
        </div>
        <input
          type="range"
          min="5"
          max="40"
          step="5"
          value={formData.weeklyHours}
          onChange={(e) => updateFormData({ weeklyHours: Number(e.target.value) })}
          style={{ width: '100%', accentColor: 'var(--primary-500)', marginTop: '0.4rem', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
          <span>5 hrs (Casual)</span>
          <span>15 hrs (Recommended)</span>
          <span>40 hrs (Full-time Bootcamp)</span>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        icon={Sparkles}
        loading={isSubmitting}
        style={{ width: '100%' }}
      >
        Lock In & Generate Deep AI Strategy
      </Button>
    </form>
  );
}
