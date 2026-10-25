import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function JobModal({ isOpen, onClose, onSave, initialJob = null }) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: 'Remote',
    type: 'Internship',
    url: '',
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Applied',
    salary: '',
    notes: '',
    contact: '',
    priority: 'Medium'
  });

  useEffect(() => {
    if (initialJob) {
      setFormData({
        company: initialJob.company || '',
        position: initialJob.position || '',
        location: initialJob.location || 'Remote',
        type: initialJob.type || 'Internship',
        url: initialJob.url || '',
        appliedDate: initialJob.appliedDate || new Date().toISOString().split('T')[0],
        status: initialJob.status || 'Applied',
        salary: initialJob.salary || '',
        notes: initialJob.notes || '',
        contact: initialJob.contact || '',
        priority: initialJob.priority || 'Medium'
      });
    } else {
      setFormData({
        company: '',
        position: '',
        location: 'Remote',
        type: 'Internship',
        url: '',
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Applied',
        salary: '',
        notes: '',
        contact: '',
        priority: 'Medium'
      });
    }
  }, [initialJob, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.position.trim()) return;

    onSave({
      ...(initialJob ? { id: initialJob.id } : {}),
      ...formData
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialJob ? 'Edit Application Details' : 'Track New Job Application'}
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Company Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Google, Stripe, Vercel"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Position / Role *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Frontend Intern 2027"
              required
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Saved">Saved</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Application Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.appliedDate}
              onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Remote, San Francisco, CA"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Job Type</label>
            <select
              className="form-select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option>Internship</option>
              <option>Full-time Entry</option>
              <option>Part-time</option>
              <option>Apprenticeship</option>
              <option>Contract</option>
            </select>
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Job Posting URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://company.com/careers/..."
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Salary / Stipend</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. $45 / hr"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Recruiter / Referral Contact (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Sarah Chen (Campus Recruiter) - recruiter@company.com"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Interview Rounds & Follow-up Notes</label>
          <textarea
            className="form-textarea"
            placeholder="Technical screen dates, coding challenge requirements, questions asked..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialJob ? 'Save Changes' : 'Track Application'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
