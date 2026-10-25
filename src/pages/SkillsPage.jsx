import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SKILL_CATEGORIES, PROFICIENCY_LEVELS } from '../data/skills';
import SkillModal from '../components/skills/SkillModal';
import SkillCategoryChart from '../components/skills/SkillCategoryChart';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { Award, Plus, Search, Edit2, Trash2, ArrowUpRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';

export default function SkillsPage() {
  const { skills, addSkill, updateSkill, deleteSkill } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filter skills
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesCat = selectedCategory === 'All' || skill.category === selectedCategory;
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (skill.notes && skill.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [skills, selectedCategory, searchQuery]);

  // Largest skill gaps (where targetLevel > currentLevel)
  const largestGaps = useMemo(() => {
    return [...skills]
      .map(s => ({ ...s, gap: (s.targetLevel || 4) - (s.currentLevel || 1) }))
      .filter(s => s.gap > 0)
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 4);
  }, [skills]);

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleSaveSkill = (skillData) => {
    if (editingSkill && skillData.id) {
      updateSkill(skillData.id, skillData);
    } else {
      addSkill(skillData);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteSkill(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">Skills Matrix & Gap Radar</h1>
          <p className="page-subtitle">
            Manage your technical competencies, set target mastery levels, and eliminate hiring bottlenecks.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
          Add Tracked Skill
        </Button>
      </div>

      {/* Top Analytics Row: Chart & High-Priority Gaps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Category Radar Chart */}
        <SkillCategoryChart skills={skills} />

        {/* Top Skill Gaps to Close */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <AlertTriangle size={18} color="var(--amber-500)" />
                Largest Skill Gaps
              </h3>
              <p className="card-subtitle">Highest leverage areas where target &gt; current</p>
            </div>
            <span className="badge badge-amber">{largestGaps.length} Target Gaps</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {largestGaps.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-app)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {item.category} • Level {item.currentLevel} &rarr; Target {item.targetLevel}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-rose">+{item.gap} Levels</span>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary-400)', marginTop: 4, cursor: 'pointer' }}
                  >
                    Adjust Target
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="skills-matrix-header">
        <div className="skills-category-tabs">
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`tag-btn ${selectedCategory === cat ? 'selected' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', maxWidth: 280 }}>
          <div className="input-with-icon" style={{ width: '100%' }}>
            <Search size={15} className="input-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="skills-cards-grid">
        {filteredSkills.map((skill) => {
          const currentLabel = PROFICIENCY_LEVELS.find(p => p.level === skill.currentLevel)?.label || 'Beginner';
          const targetLabel = PROFICIENCY_LEVELS.find(p => p.level === skill.targetLevel)?.label || 'Advanced';

          return (
            <div key={skill.id} className="skill-card">
              <div>
                <div className="skill-card-top">
                  <div>
                    <span className="badge badge-gray" style={{ marginBottom: '0.35rem' }}>
                      {skill.category}
                    </span>
                    <h3 className="skill-name">{skill.name}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      className="btn-icon"
                      onClick={() => handleOpenEdit(skill)}
                      title="Edit skill"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => setDeleteConfirmId(skill.id)}
                      title="Delete skill"
                      style={{ color: 'var(--rose-500)' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Visual Proficiency Rating Strips (1 to 5) */}
                <div style={{ margin: '0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span>Current: <strong style={{ color: 'var(--text-primary)' }}>{currentLabel}</strong> (L{skill.currentLevel})</span>
                    <span>Target: <strong style={{ color: 'var(--primary-400)' }}>{targetLabel}</strong> (L{skill.targetLevel})</span>
                  </div>

                  <div className="skill-rating-strip">
                    {[1, 2, 3, 4, 5].map((lvl) => {
                      const isCurrent = lvl <= (skill.currentLevel || 1);
                      const isTarget = lvl <= (skill.targetLevel || 4);
                      return (
                        <div
                          key={lvl}
                          className={`rating-pip ${isCurrent ? 'active' : isTarget ? 'target' : ''}`}
                          title={`Level ${lvl}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {skill.notes && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '0.5rem' }}>
                    {skill.notes}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <span>Updated: {skill.lastUpdated || 'Recently'}</span>
                <button
                  onClick={() => handleOpenEdit(skill)}
                  style={{ color: 'var(--primary-400)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  Update Level <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSkills.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No skills found matching your filters.
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      <SkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSkill}
        initialSkill={editingSkill}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Skill"
        message="Are you sure you want to remove this skill from your tracking matrix?"
        confirmText="Delete"
        danger={true}
      />
    </div>
  );
}
