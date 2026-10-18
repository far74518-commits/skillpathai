import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function AddTaskModal({ isOpen, onClose, onAddTask, stages = [] }) {
  const [selectedStageId, setSelectedStageId] = useState(stages[0]?.id || 'stage-1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('8 hours');
  const [skillsStr, setSkillsStr] = useState('');
  const [project, setProject] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask(selectedStageId, {
      title: title.trim(),
      description: description.trim() || 'Custom student goal',
      duration: duration.trim() || '6 hours',
      skills: skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(Boolean) : ['Self-directed'],
      project: project.trim()
    });

    // Reset
    setTitle('');
    setDescription('');
    setDuration('8 hours');
    setSkillsStr('');
    setProject('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Custom Roadmap Milestone"
      maxWidth="540px"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Roadmap Stage</label>
          <select
            className="form-select"
            value={selectedStageId}
            onChange={(e) => setSelectedStageId(e.target.value)}
          >
            {stages.map((st) => (
              <option key={st.id} value={st.id}>
                {st.title} ({st.level})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Task Title *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Complete CS50 Week 4 Data Structures & Memory"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description / Learning Goal</label>
          <textarea
            className="form-textarea"
            placeholder="Summarize what you want to achieve or learn..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Estimated Duration</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 10 hours"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Key Skills (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. C, Memory, Pointers"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Practical Mini-Project Checkpoint (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Build a filter image processing program"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Milestone
          </Button>
        </div>
      </form>
    </Modal>
  );
}
