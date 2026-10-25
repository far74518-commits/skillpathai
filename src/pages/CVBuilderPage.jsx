import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SAMPLE_CV, EMPTY_CV } from '../data/sampleCV';
import ModernTechTemplate from '../components/cv/ModernTechTemplate';
import CleanExecutiveTemplate from '../components/cv/CleanExecutiveTemplate';
import ConfirmDialog from '../components/common/ConfirmDialog';
import AIAtsReviewModal from '../components/cv/AIAtsReviewModal';
import html2pdf from 'html2pdf.js';
import {
  FileText,
  Printer,
  RotateCcw,
  Layout,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Check,
  Download,
  FileDown,
  Sparkles,
  Award,
  Globe2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import Button from '../components/common/Button';

export default function CVBuilderPage() {
  const { cvData, updateCVData, addToast } = useApp();
  const [template, setTemplate] = useState('modern'); // 'modern' | 'executive'
  const [activeTab, setActiveTab] = useState('personal'); // personal | summary | education | experience | projects | skills | certs | languages
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearAllConfirmOpen, setIsClearAllConfirmOpen] = useState(false);
  const [isAiReviewOpen, setIsAiReviewOpen] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(1); // 0.85 | 1 | 1.15

  // Helper to update deeply nested fields
  const handlePersonalInfoChange = (field, value) => {
    updateCVData({
      ...cvData,
      personalInfo: {
        ...(cvData?.personalInfo || {}),
        [field]: value
      }
    });
  };

  const handleSummaryChange = (value) => {
    updateCVData({
      ...cvData,
      professionalSummary: value
    });
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEdu = {
      id: 'edu_' + Date.now(),
      degree: 'B.S. in Computer Science',
      institution: 'University Name',
      location: 'City, State',
      startDate: '2023',
      endDate: '2027',
      gpa: '3.80 / 4.00',
      highlights: 'Dean’s Honor List, Relevant Coursework: Data Structures, Web Systems'
    };
    updateCVData({
      ...cvData,
      education: [...(cvData?.education || []), newEdu]
    });
  };

  const handleUpdateEducation = (id, field, value) => {
    updateCVData({
      ...cvData,
      education: (cvData?.education || []).map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  const handleDeleteEducation = (id) => {
    updateCVData({
      ...cvData,
      education: (cvData?.education || []).filter(e => e.id !== id)
    });
  };

  // Experience handlers
  const handleAddExperience = () => {
    const newExp = {
      id: 'exp_' + Date.now(),
      role: 'Frontend Engineering Intern',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA (Remote)',
      startDate: 'Jun 2026',
      endDate: 'Aug 2026',
      bullets: [
        'Built 6+ reusable accessible components in React, improving lighthouse performance score by 22%.',
        'Collaborated in bi-weekly agile sprint reviews and pair programming sessions.'
      ]
    };
    updateCVData({
      ...cvData,
      experience: [...(cvData?.experience || []), newExp]
    });
  };

  const handleUpdateExperience = (id, field, value) => {
    updateCVData({
      ...cvData,
      experience: (cvData?.experience || []).map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  const handleUpdateExpBullet = (expId, bulletIndex, value) => {
    updateCVData({
      ...cvData,
      experience: (cvData?.experience || []).map(e => {
        if (e.id !== expId) return e;
        const newBullets = [...(e.bullets || [])];
        newBullets[bulletIndex] = value;
        return { ...e, bullets: newBullets };
      })
    });
  };

  const handleAddExpBullet = (expId) => {
    updateCVData({
      ...cvData,
      experience: (cvData?.experience || []).map(e => {
        if (e.id !== expId) return e;
        return { ...e, bullets: [...(e.bullets || []), 'Collaborated across teams to optimize user workflows.'] };
      })
    });
  };

  const handleDeleteExpBullet = (expId, bulletIndex) => {
    updateCVData({
      ...cvData,
      experience: (cvData?.experience || []).map(e => {
        if (e.id !== expId) return e;
        return { ...e, bullets: (e.bullets || []).filter((_, idx) => idx !== bulletIndex) };
      })
    });
  };

  const handleDeleteExperience = (id) => {
    updateCVData({
      ...cvData,
      experience: (cvData?.experience || []).filter(e => e.id !== id)
    });
  };

  // Projects handlers
  const handleAddProject = () => {
    const newProj = {
      id: 'proj_' + Date.now(),
      name: 'Interactive Career Tracker',
      technologies: 'React 18, Vite, Custom CSS3, LocalStorage',
      link: 'https://github.com/my-profile/project',
      bullets: [
        'Engineered responsive web app with state management across 8 views without external CSS bloat.',
        'Implemented ATS-compliant PDF generation and real-time form state persistence.'
      ]
    };
    updateCVData({
      ...cvData,
      projects: [...(cvData?.projects || []), newProj]
    });
  };

  const handleUpdateProject = (id, field, value) => {
    updateCVData({
      ...cvData,
      projects: (cvData?.projects || []).map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  const handleUpdateProjBullet = (projId, bulletIndex, value) => {
    updateCVData({
      ...cvData,
      projects: (cvData?.projects || []).map(p => {
        if (p.id !== projId) return p;
        const newBullets = [...(p.bullets || [])];
        newBullets[bulletIndex] = value;
        return { ...p, bullets: newBullets };
      })
    });
  };

  const handleAddProjBullet = (projId) => {
    updateCVData({
      ...cvData,
      projects: (cvData?.projects || []).map(p => {
        if (p.id !== projId) return p;
        return { ...p, bullets: [...(p.bullets || []), 'Optimized bundle rendering time by 28%.'] };
      })
    });
  };

  const handleDeleteProjBullet = (projId, bulletIndex) => {
    updateCVData({
      ...cvData,
      projects: (cvData?.projects || []).map(p => {
        if (p.id !== projId) return p;
        return { ...p, bullets: (p.bullets || []).filter((_, idx) => idx !== bulletIndex) };
      })
    });
  };

  const handleDeleteProject = (id) => {
    updateCVData({
      ...cvData,
      projects: (cvData?.projects || []).filter(p => p.id !== id)
    });
  };

  // Skills handlers
  const handleAddSkillGroup = () => {
    const newGroup = { category: 'Tools & Technologies', items: 'Git, GitHub, VS Code, Postman, Docker' };
    updateCVData({
      ...cvData,
      skills: [...(cvData?.skills || []), newGroup]
    });
  };

  const handleUpdateSkillGroup = (index, field, value) => {
    const updated = [...(cvData?.skills || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateCVData({
      ...cvData,
      skills: updated
    });
  };

  const handleDeleteSkillGroup = (index) => {
    updateCVData({
      ...cvData,
      skills: (cvData?.skills || []).filter((_, idx) => idx !== index)
    });
  };

  // Certifications handlers
  const handleAddCertification = () => {
    const newCert = {
      id: 'cert_' + Date.now(),
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera / Meta',
      date: '2026',
      credentialId: 'META-FE-' + Math.floor(10000 + Math.random() * 90000)
    };
    updateCVData({
      ...cvData,
      certifications: [...(cvData?.certifications || []), newCert]
    });
  };

  const handleUpdateCertification = (id, field, value) => {
    updateCVData({
      ...cvData,
      certifications: (cvData?.certifications || []).map(c => c.id === id ? { ...c, [field]: value } : c)
    });
  };

  const handleDeleteCertification = (id) => {
    updateCVData({
      ...cvData,
      certifications: (cvData?.certifications || []).filter(c => c.id !== id)
    });
  };

  // Languages handlers
  const handleAddLanguage = () => {
    const newLang = {
      id: 'lang_' + Date.now(),
      language: 'English',
      proficiency: 'Full Professional'
    };
    updateCVData({
      ...cvData,
      languages: [...(cvData?.languages || []), newLang]
    });
  };

  const handleUpdateLanguage = (id, field, value) => {
    updateCVData({
      ...cvData,
      languages: (cvData?.languages || []).map(l => l.id === id ? { ...l, [field]: value } : l)
    });
  };

  const handleDeleteLanguage = (id) => {
    updateCVData({
      ...cvData,
      languages: (cvData?.languages || []).filter(l => l.id !== id)
    });
  };

  // 1-Click Direct Download to User's Downloads Folder as PDF
  const handleDownloadPDF = async () => {
    const element = document.getElementById('cv-preview-container');
    if (!element) {
      window.print();
      return;
    }

    setIsDownloadingPDF(true);
    addToast({
      type: 'info',
      title: 'Generating PDF...',
      message: 'Preparing your high-resolution ATS CV for download.'
    });

    try {
      const rawName = cvData?.personalInfo?.fullName || 'Student';
      const safeName = rawName.trim().replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_') || 'Student';
      const fileName = `${safeName}_CV.pdf`;

      const opt = {
        margin: [8, 8, 8, 8], // mm
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();

      addToast({
        type: 'success',
        title: 'CV Downloaded Successfully! 📄',
        message: `"${fileName}" has been saved in your Downloads folder.`
      });
    } catch (error) {
      console.error('PDF generation error, falling back to print dialog:', error);
      window.print();
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // Direct Download to Downloads Folder as Word (.doc) document
  const handleDownloadWord = () => {
    const element = document.getElementById('cv-preview-container');
    if (!element) return;

    const rawName = cvData?.personalInfo?.fullName || 'Student';
    const safeName = rawName.trim().replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_') || 'Student';
    const fileName = `${safeName}_CV.doc`;

    const content = element.innerHTML;
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${rawName} CV</title>
    <style>
      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.45; }
      h1 { font-size: 20pt; color: #0f172a; margin-bottom: 2pt; font-weight: bold; }
      h2 { font-size: 13pt; color: #334155; border-bottom: 1.5pt solid #cbd5e1; padding-bottom: 3pt; margin-top: 12pt; text-transform: uppercase; }
      p { margin: 4pt 0; }
      ul { margin: 3pt 0; padding-left: 18pt; }
      li { margin-bottom: 2pt; }
    </style></head><body>`;
    const footer = `</body></html>`;

    const blob = new Blob(['\ufeff' + header + content + footer], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Word Document Downloaded! 📝',
      message: `"${fileName}" has been saved in your Downloads folder.`
    });
  };

  // Browser Native Print / System PDF Dialog
  const handlePrint = () => {
    window.print();
  };

  // Reset / Auto-fill complete student sample CV
  const handleResetToSample = () => {
    updateCVData(SAMPLE_CV);
    setIsResetConfirmOpen(false);
    addToast({
      type: 'success',
      title: 'Complete Sample CV Loaded! ✨',
      message: 'All 8 sections filled with polished student data. Edit any field and download!'
    });
  };

  // Clear everything to blank
  const handleStartBlankCV = () => {
    updateCVData(EMPTY_CV);
    setIsClearAllConfirmOpen(false);
    addToast({
      type: 'info',
      title: 'Blank CV Initialized',
      message: 'All fields have been cleared so you can enter your CV from scratch.'
    });
  };

  // Preset summary starters
  const applySummaryPreset = (type) => {
    const presets = {
      frontend:
        'Detail-oriented Frontend Software Engineer with expertise in React, TypeScript, and modern CSS architectures. Proven track record of shipping accessible, high-performance web applications and collaborating in agile product teams.',
      fullstack:
        'Versatile Full-Stack Developer proficient in React, Node.js, Express, and SQL/NoSQL databases. Passionate about building resilient microservices, responsive web portals, and clean RESTful APIs.',
      student:
        'Driven Computer Science undergraduate with hands-on experience in modern web development, algorithms, and collaborative team projects. Quick learner committed to engineering clean code and delivering impact.'
    };
    handleSummaryChange(presets[type] || '');
  };

  const tabs = [
    { id: 'personal', label: '1. Personal Info' },
    { id: 'summary', label: '2. Summary' },
    { id: 'education', label: '3. Education' },
    { id: 'experience', label: '4. Experience' },
    { id: 'projects', label: '5. Projects' },
    { id: 'skills', label: '6. Skills' },
    { id: 'certs', label: '7. Certifications' },
    { id: 'languages', label: '8. Languages' }
  ];

  return (
    <div className="animate-fade">
      {/* Page Header */}
      <div className="page-header no-print">
        <div>
          <h1 className="page-title">Professional ATS CV Builder</h1>
          <p className="page-subtitle">
            Enter every detail, customize sections with live real-time preview, and download straight to your Downloads folder.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            size="sm"
            icon={Trash2}
            onClick={() => setIsClearAllConfirmOpen(true)}
            style={{ color: 'var(--rose-400)', borderColor: 'rgba(244, 63, 94, 0.35)' }}
          >
            Clear to Blank
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Sparkles}
            onClick={() => setIsAiReviewOpen(true)}
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.12) 100%)',
              borderColor: 'rgba(99, 102, 241, 0.5)',
              color: '#818cf8',
              fontWeight: 700,
              boxShadow: '0 2px 10px rgba(99, 102, 241, 0.2)'
            }}
          >
            AI ATS Review
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={Sparkles}
            onClick={() => setIsResetConfirmOpen(true)}
            style={{ color: 'var(--primary-400)', borderColor: 'rgba(99, 102, 241, 0.35)' }}
          >
            Auto-Fill Complete CV
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={FileDown}
            onClick={handleDownloadWord}
            title="Download editable Microsoft Word document into your Downloads folder"
          >
            Word (.doc)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
            title="Open browser print dialog"
          >
            Print
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Download}
            onClick={handleDownloadPDF}
            disabled={isDownloadingPDF}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            {isDownloadingPDF ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      {/* CV Builder Split View */}
      <div className="cv-builder-container">
        {/* Left Side: Comprehensive Editor Panel */}
        <div className="cv-editor-panel no-print">
          {/* Section Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`tag-btn ${activeTab === t.id ? 'selected' : ''}`}
                style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem', whiteSpace: 'nowrap' }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Personal Info */}
          {activeTab === 'personal' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Personal & Contact Information
                </h3>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Full Name"
                  value={cvData?.personalInfo?.fullName || ''}
                  onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Target Headline</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Aspiring Frontend & Software Engineer"
                  value={cvData?.personalInfo?.title || ''}
                  onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. student@university.edu"
                    value={cvData?.personalInfo?.email || ''}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. +1 (555) 234-5678"
                    value={cvData?.personalInfo?.phone || ''}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City, State / Country</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. San Jose, CA"
                    value={cvData?.personalInfo?.location || ''}
                    onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Portfolio / Website URL</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. https://yourportfolio.dev"
                    value={cvData?.personalInfo?.website || ''}
                    onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. https://linkedin.com/in/yourprofile"
                    value={cvData?.personalInfo?.linkedin || ''}
                    onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub Profile URL</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. https://github.com/yourusername"
                    value={cvData?.personalInfo?.github || ''}
                    onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Professional Summary */}
          {activeTab === 'summary' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Professional Executive Summary
                </h3>
              </div>

              {/* Quick Preset Starters */}
              <div style={{ marginBottom: '1rem', background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  Quick Pre-Fill Starters:
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="tag-btn"
                    onClick={() => applySummaryPreset('frontend')}
                    style={{ fontSize: '0.78rem' }}
                  >
                    Frontend Engineer
                  </button>
                  <button
                    type="button"
                    className="tag-btn"
                    onClick={() => applySummaryPreset('fullstack')}
                    style={{ fontSize: '0.78rem' }}
                  >
                    Full-Stack Developer
                  </button>
                  <button
                    type="button"
                    className="tag-btn"
                    onClick={() => applySummaryPreset('student')}
                    style={{ fontSize: '0.78rem' }}
                  >
                    CS Student / Intern
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Summary Statement (2 - 4 sentences)</label>
                <textarea
                  className="form-textarea"
                  rows={6}
                  placeholder="Highlight your technical strengths, core frameworks, academic standing, and what value you bring to engineering teams..."
                  value={cvData?.professionalSummary || ''}
                  onChange={(e) => handleSummaryChange(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 3: Education */}
          {activeTab === 'education' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Education & Academic Degrees
                </h3>
                <Button size="sm" variant="secondary" icon={Plus} onClick={handleAddEducation}>
                  Add Degree
                </Button>
              </div>

              {(cvData?.education || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No education entries added yet.</p>
                  <Button size="sm" variant="secondary" icon={Plus} onClick={handleAddEducation}>
                    Add Your University / Degree
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {(cvData?.education || []).map((edu, idx) => (
                    <div
                      key={edu.id || idx}
                      style={{
                        background: 'var(--bg-surface)',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-subtle)',
                        position: 'relative'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteEducation(edu.id)}
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'none',
                          border: 'none',
                          color: 'var(--rose-400)',
                          cursor: 'pointer'
                        }}
                        title="Delete Degree"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Degree & Major</label>
                          <input
                            type="text"
                            className="form-input"
                            value={edu.degree || ''}
                            onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                            placeholder="e.g. B.S. in Computer Science"
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">University / College</label>
                          <input
                            type="text"
                            className="form-input"
                            value={edu.institution || ''}
                            onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                            placeholder="e.g. State University of Technology"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">City, State</label>
                          <input
                            type="text"
                            className="form-input"
                            value={edu.location || ''}
                            onChange={(e) => handleUpdateEducation(edu.id, 'location', e.target.value)}
                            placeholder="e.g. San Jose, CA"
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Timeline (Start - End)</label>
                          <input
                            type="text"
                            className="form-input"
                            value={`${edu.startDate || ''} - ${edu.endDate || ''}`}
                            onChange={(e) => {
                              const parts = e.target.value.split('-');
                              handleUpdateEducation(edu.id, 'startDate', parts[0]?.trim() || '');
                              handleUpdateEducation(edu.id, 'endDate', parts[1]?.trim() || '');
                            }}
                            placeholder="e.g. 2023 - 2027"
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">GPA (Optional)</label>
                          <input
                            type="text"
                            className="form-input"
                            value={edu.gpa || ''}
                            onChange={(e) => handleUpdateEducation(edu.id, 'gpa', e.target.value)}
                            placeholder="e.g. 3.85 / 4.00"
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Coursework & Honors</label>
                        <input
                          type="text"
                          className="form-input"
                          value={edu.highlights || ''}
                          onChange={(e) => handleUpdateEducation(edu.id, 'highlights', e.target.value)}
                          placeholder="e.g. Dean's Honor List, Data Structures, Web Systems"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Experience */}
          {activeTab === 'experience' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Work Experience & Internships
                </h3>
                <Button size="sm" variant="secondary" icon={Plus} onClick={handleAddExperience}>
                  Add Position
                </Button>
              </div>

              {(cvData?.experience || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No work experience added yet.</p>
                  <Button size="sm" variant="secondary" icon={Plus} onClick={handleAddExperience}>
                    Add First Position / Internship
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {(cvData?.experience || []).map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      style={{
                        background: 'var(--bg-surface)',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-subtle)',
                        position: 'relative'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(exp.id)}
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'none',
                          border: 'none',
                          color: 'var(--rose-400)',
                          cursor: 'pointer'
                        }}
                        title="Delete Role"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Position / Job Title</label>
                          <input
                            type="text"
                            className="form-input"
                            value={exp.role || ''}
                            onChange={(e) => handleUpdateExperience(exp.id, 'role', e.target.value)}
                            placeholder="e.g. Frontend Engineering Intern"
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Company / Organization</label>
                          <input
                            type="text"
                            className="form-input"
                            value={exp.company || ''}
                            onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                            placeholder="e.g. Nova Digital Labs"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Location (e.g. City or Remote)</label>
                          <input
                            type="text"
                            className="form-input"
                            value={exp.location || ''}
                            onChange={(e) => handleUpdateExperience(exp.id, 'location', e.target.value)}
                            placeholder="e.g. San Francisco, CA (Remote)"
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Date Range</label>
                          <input
                            type="text"
                            className="form-input"
                            value={`${exp.startDate || ''} - ${exp.endDate || ''}`}
                            onChange={(e) => {
                              const parts = e.target.value.split('-');
                              handleUpdateExperience(exp.id, 'startDate', parts[0]?.trim() || '');
                              handleUpdateExperience(exp.id, 'endDate', parts[1]?.trim() || '');
                            }}
                            placeholder="e.g. Jun 2026 - Aug 2026"
                          />
                        </div>
                      </div>

                      {/* Bullet points */}
                      <div style={{ marginTop: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <label className="form-label" style={{ margin: 0 }}>Key Responsibilities & Impact</label>
                          <button
                            type="button"
                            onClick={() => handleAddExpBullet(exp.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--primary-400)', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <Plus size={14} /> Add Bullet
                          </button>
                        </div>

                        {(exp.bullets || []).map((bullet, bIdx) => (
                          <div key={bIdx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>•</span>
                            <input
                              type="text"
                              className="form-input"
                              value={bullet}
                              onChange={(e) => handleUpdateExpBullet(exp.id, bIdx, e.target.value)}
                              placeholder="Describe your achievement with metrics..."
                              style={{ flex: 1 }}
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteExpBullet(exp.id, bIdx)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                              title="Delete bullet"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Projects */}
          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Key Portfolio Projects
                </h3>
                <Button size="sm" variant="secondary" icon={Plus} onClick={handleAddProject}>
                  Add Project
                </Button>
              </div>

              {(cvData?.projects || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No projects added yet.</p>
                  <Button size="sm" variant="secondary" icon={Plus} onClick={handleAddProject}>
                    Add Your First Project
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {(cvData?.projects || []).map((proj, idx) => (
                    <div
                      key={proj.id || idx}
                      style={{
                        background: 'var(--bg-surface)',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-subtle)',
                        position: 'relative'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj.id)}
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'none',
                          border: 'none',
                          color: 'var(--rose-400)',
                          cursor: 'pointer'
                        }}
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Project Title</label>
                          <input
                            type="text"
                            className="form-input"
                            value={proj.name || ''}
                            onChange={(e) => handleUpdateProject(proj.id, 'name', e.target.value)}
                            placeholder="e.g. SkillPath AI"
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Live Link / GitHub</label>
                          <input
                            type="text"
                            className="form-input"
                            value={proj.link || ''}
                            onChange={(e) => handleUpdateProject(proj.id, 'link', e.target.value)}
                            placeholder="e.g. https://github.com/project"
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label">Technologies Used</label>
                        <input
                          type="text"
                          className="form-input"
                          value={proj.technologies || ''}
                          onChange={(e) => handleUpdateProject(proj.id, 'technologies', e.target.value)}
                          placeholder="e.g. React 18, Vite, Custom CSS3, LocalStorage"
                        />
                      </div>

                      {/* Project Bullets */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <label className="form-label" style={{ margin: 0 }}>Project Highlights</label>
                          <button
                            type="button"
                            onClick={() => handleAddProjBullet(proj.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--primary-400)', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <Plus size={14} /> Add Highlight
                          </button>
                        </div>

                        {(proj.bullets || []).map((bullet, bIdx) => (
                          <div key={bIdx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>•</span>
                            <input
                              type="text"
                              className="form-input"
                              value={bullet}
                              onChange={(e) => handleUpdateProjBullet(proj.id, bIdx, e.target.value)}
                              placeholder="Describe technical architecture or results..."
                              style={{ flex: 1 }}
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteProjBullet(proj.id, bIdx)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                              title="Delete highlight"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Skills */}
          {activeTab === 'skills' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Categorized Skills Matrix
                </h3>
                <Button size="sm" variant="secondary" icon={Plus} onClick={handleAddSkillGroup}>
                  Add Skill Category
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(cvData?.skills || []).map((sk, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-surface)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-subtle)',
                      position: 'relative'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleDeleteSkillGroup(idx)}
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--rose-400)',
                        cursor: 'pointer'
                      }}
                      title="Delete category"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <label className="form-label">Category Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={sk.category || ''}
                        onChange={(e) => handleUpdateSkillGroup(idx, 'category', e.target.value)}
                        placeholder="e.g. Frontend, Backend, Databases"
                        style={{ maxWidth: '320px' }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Skills (comma-separated)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={sk.items || ''}
                        onChange={(e) => handleUpdateSkillGroup(idx, 'items', e.target.value)}
                        placeholder="e.g. React.js, JavaScript (ES6+), HTML5, CSS3, Flexbox & Grid"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: Certifications */}
          {activeTab === 'certs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Certifications & Honors
                </h3>
                <Button size="sm" variant="secondary" icon={Plus} onClick={handleAddCertification}>
                  Add Certificate
                </Button>
              </div>

              {(cvData?.certifications || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                  <Award size={36} color="var(--primary-400)" style={{ margin: '0 auto 0.75rem', opacity: 0.6 }} />
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No certifications added yet.</p>
                  <Button size="sm" variant="secondary" icon={Plus} onClick={handleAddCertification}>
                    Add First Certification
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(cvData?.certifications || []).map((cert, idx) => (
                    <div
                      key={cert.id || idx}
                      style={{
                        background: 'var(--bg-surface)',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-subtle)',
                        position: 'relative'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteCertification(cert.id)}
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'none',
                          border: 'none',
                          color: 'var(--rose-400)',
                          cursor: 'pointer'
                        }}
                        title="Delete certification"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label">Certificate / Course Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cert.name || ''}
                          onChange={(e) => handleUpdateCertification(cert.id, 'name', e.target.value)}
                          placeholder="e.g. Meta Front-End Developer Professional Certificate"
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Issuer</label>
                          <input
                            type="text"
                            className="form-input"
                            value={cert.issuer || ''}
                            onChange={(e) => handleUpdateCertification(cert.id, 'issuer', e.target.value)}
                            placeholder="e.g. Coursera / Meta"
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Year / Date</label>
                          <input
                            type="text"
                            className="form-input"
                            value={cert.date || ''}
                            onChange={(e) => handleUpdateCertification(cert.id, 'date', e.target.value)}
                            placeholder="e.g. 2026"
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Credential ID / Link</label>
                          <input
                            type="text"
                            className="form-input"
                            value={cert.credentialId || ''}
                            onChange={(e) => handleUpdateCertification(cert.id, 'credentialId', e.target.value)}
                            placeholder="e.g. META-FE-92841"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: Languages */}
          {activeTab === 'languages' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Languages & Spoken Proficiency
                </h3>
                <Button size="sm" variant="secondary" icon={Plus} onClick={handleAddLanguage}>
                  Add Language
                </Button>
              </div>

              {(cvData?.languages || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                  <Globe2 size={36} color="var(--primary-400)" style={{ margin: '0 auto 0.75rem', opacity: 0.6 }} />
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No languages specified yet.</p>
                  <Button size="sm" variant="secondary" icon={Plus} onClick={handleAddLanguage}>
                    Add Language
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(cvData?.languages || []).map((lang, idx) => (
                    <div
                      key={lang.id || idx}
                      style={{
                        background: 'var(--bg-surface)',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-subtle)',
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 1.5fr auto',
                        gap: '1rem',
                        alignItems: 'end'
                      }}
                    >
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Language</label>
                        <input
                          type="text"
                          className="form-input"
                          value={lang.language || ''}
                          onChange={(e) => handleUpdateLanguage(lang.id, 'language', e.target.value)}
                          placeholder="e.g. English, Urdu"
                        />
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Proficiency Level</label>
                        <select
                          className="form-select"
                          value={lang.proficiency || 'Full Professional / Fluent'}
                          onChange={(e) => handleUpdateLanguage(lang.id, 'proficiency', e.target.value)}
                        >
                          <option value="Native / Bilingual">Native / Bilingual</option>
                          <option value="Full Professional / Fluent">Full Professional / Fluent</option>
                          <option value="Working Proficiency">Working Proficiency</option>
                          <option value="Conversational">Conversational</option>
                          <option value="Elementary">Elementary</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteLanguage(lang.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--rose-400)',
                          cursor: 'pointer',
                          padding: '0.6rem'
                        }}
                        title="Delete language"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Live Real-Time CV Preview & Download */}
        <div className="cv-preview-wrapper">
          {/* Template & Export Toolbar */}
          <div className="cv-preview-toolbar no-print">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Layout size={16} color="var(--primary-400)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Template:</span>
              <button
                className={`tag-btn ${template === 'modern' ? 'selected' : ''}`}
                onClick={() => setTemplate('modern')}
              >
                Modern Tech
              </button>
              <button
                className={`tag-btn ${template === 'executive' ? 'selected' : ''}`}
                onClick={() => setTemplate('executive')}
              >
                Clean Executive
              </button>
            </div>

            {/* Quick Zoom Preview Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                type="button"
                className="tag-btn"
                onClick={() => setPreviewZoom(z => Math.max(0.75, z - 0.1))}
                title="Zoom Out"
                style={{ padding: '0.25rem 0.5rem' }}
              >
                <ZoomOut size={14} />
              </button>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: '40px', textAlign: 'center' }}>
                {Math.round(previewZoom * 100)}%
              </span>
              <button
                type="button"
                className="tag-btn"
                onClick={() => setPreviewZoom(z => Math.min(1.25, z + 0.1))}
                title="Zoom In"
                style={{ padding: '0.25rem 0.5rem' }}
              >
                <ZoomIn size={14} />
              </button>
            </div>

            {/* Big Download PDF Button */}
            <Button
              size="sm"
              variant="primary"
              icon={Download}
              onClick={handleDownloadPDF}
              disabled={isDownloadingPDF}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                fontWeight: 700
              }}
            >
              {isDownloadingPDF ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          </div>

          {/* Actual Rendered CV Document (Direct Export Target) */}
          <div
            id="cv-preview-container"
            style={{
              transform: previewZoom !== 1 ? `scale(${previewZoom})` : 'none',
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease',
              width: '100%',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
            }}
          >
            {template === 'modern' ? (
              <ModernTechTemplate cvData={cvData} />
            ) : (
              <CleanExecutiveTemplate cvData={cvData} />
            )}
          </div>
        </div>
      </div>

      {/* Auto-Fill Sample Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetToSample}
        title="Auto-Fill Complete Student CV"
        message="This will fill all 8 sections (Personal, Summary, Education, Experience, Projects, Skills, Certifications, Languages) with comprehensive sample student data. You can then edit every field to make it your own. Proceed?"
        confirmText="Auto-Fill CV"
        danger={false}
      />

      {/* Clear Blank CV Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isClearAllConfirmOpen}
        onClose={() => setIsClearAllConfirmOpen(false)}
        onConfirm={handleStartBlankCV}
        title="Start Fresh Blank CV"
        message="This will clear all fields so you can build your CV completely from scratch. Proceed?"
        confirmText="Clear All Fields"
        danger={true}
      />

      {/* AI ATS Resume Review & Optimizer Modal */}
      <AIAtsReviewModal
        isOpen={isAiReviewOpen}
        onClose={() => setIsAiReviewOpen(false)}
        cvData={cvData}
        targetRole={cvData?.personalInfo?.headline || 'Software Engineer'}
        onApplySummary={(improvedSummary) => {
          handleSummaryChange(improvedSummary);
          addToast({
            type: 'success',
            title: 'ATS Summary Applied! ✨',
            message: 'High-impact professional summary updated in your CV.'
          });
        }}
        onApplyBullet={(bullet) => {
          const firstProj = cvData?.projects?.[0];
          if (firstProj) {
            handleAddProjBullet(firstProj.id);
            addToast({
              type: 'success',
              title: 'Bullet Suggestion Added! 💼',
              message: `Appended to "${firstProj.title}" project.`
            });
          } else {
            addToast({
              type: 'info',
              title: 'Copied to Clipboard! 📋',
              message: 'Add a project in Tab 5 to insert bullet points.'
            });
          }
        }}
      />
    </div>
  );
}
