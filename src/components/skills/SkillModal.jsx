import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { SKILL_CATEGORIES, PROFICIENCY_LEVELS } from '../../data/skills';

export default function SkillModal({ isOpen, onClose, onSave, initialSkill = null }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [currentLevel, setCurrentLevel] = useState(3);
  const [targetLevel, setTargetLevel] = useState(4);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialSkill) {
        setName(initialSkill.name || '');
        setCategory(initialSkill.category || 'Frontend');
        setCurrentLevel(initialSkill.currentLevel || 3);
        setTargetLevel(initialSkill.targetLevel || 4);
        setNotes(initialSkill.notes || '');
      } else {
        setName('');
        setCategory('Frontend');
        setCurrentLevel(3);
        setTargetLevel(4);
        setNotes('');
      }
      setError('');
    }
  }, [initialSkill, isOpen]);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a skill name');
      return;
    }

    onSave({
      ...(initialSkill ? { id: initialSkill.id } : {}),
      name: name.trim(),
      category,
      currentLevel: Number(currentLevel),
      targetLevel: Number(targetLevel),
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialSkill ? 'Edit Skill Proficiency' : 'Add New Tracked Skill'}
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              borderRadius: 'var(--radius-md)',
              color: '#fda4af',
              fontSize: '0.84rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Skill Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Next.js, Docker, PostgreSQL, GraphQL"
            required
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {SKILL_CATEGORIES.filter(c => c !== 'All').map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Current Level (1-5)</label>
            <select
              className="form-select"
              value={currentLevel}
              onChange={(e) => setCurrentLevel(Number(e.target.value))}
            >
              {PROFICIENCY_LEVELS.map((pl) => (
                <option key={pl.level} value={pl.level}>
                  {pl.level} - {pl.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Target Level (1-5)</label>
            <select
              className="form-select"
              value={targetLevel}
              onChange={(e) => setTargetLevel(Number(e.target.value))}
            >
              {PROFICIENCY_LEVELS.map((pl) => (
                <option key={pl.level} value={pl.level}>
                  {pl.level} - {pl.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Learning Notes / Project Context</label>
          <textarea
            className="form-textarea"
            placeholder="What concepts have you learned? What are you practicing next?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" onClick={handleSubmit}>
            {initialSkill ? 'Update Skill' : 'Save Skill'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
