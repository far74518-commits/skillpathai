import React from 'react';

export default function CleanExecutiveTemplate({ cvData }) {
  const {
    personalInfo = {},
    professionalSummary = '',
    education = [],
    skills = [],
    experience = [],
    projects = [],
    certifications = [],
    languages = []
  } = cvData || {};

  return (
    <div className="cv-print-document cv-template-executive">
      {/* Header */}
      <div className="cv-header">
        <h1 className="cv-name">{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.title ? (
          <div style={{ fontSize: '1.05rem', color: '#334155', fontWeight: 600, marginTop: '0.2rem' }}>
            {personalInfo.title}
          </div>
        ) : null}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '0.5rem',
            fontSize: '0.82rem',
            color: '#475569'
          }}
        >
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && <span>• {personalInfo.website.replace('https://', '')}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin.replace('https://linkedin.com/in/', 'linkedin/')}</span>}
        </div>
      </div>

      {/* Summary */}
      {professionalSummary && (
        <div className="cv-section" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0f172a', borderBottom: '1px solid #94a3b8', paddingBottom: '0.2rem', marginBottom: '0.45rem' }}>
            Executive Summary
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.55 }}>
            {professionalSummary}
          </p>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="cv-section" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0f172a', borderBottom: '1px solid #94a3b8', paddingBottom: '0.2rem', marginBottom: '0.65rem' }}>
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{edu.institution}</strong>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#334155', fontStyle: 'italic' }}>
                {edu.degree} {edu.gpa ? `— GPA: ${edu.gpa}` : ''}
              </div>
              {edu.highlights && (
                <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.15rem' }}>
                  {edu.highlights}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="cv-section" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0f172a', borderBottom: '1px solid #94a3b8', paddingBottom: '0.2rem', marginBottom: '0.65rem' }}>
            Work Experience & Internships
          </h2>
          {experience.map((exp, idx) => (
            <div key={exp.id || idx} style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                  {exp.role} — <span style={{ fontWeight: 600 }}>{exp.company}</span>
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <ul style={{ paddingLeft: '1.1rem', listStyleType: 'disc', fontSize: '0.82rem', color: '#334155', lineHeight: 1.45, marginTop: '0.3rem' }}>
                {(exp.bullets || []).map((b, bIdx) => (
                  <li key={bIdx} style={{ marginBottom: '0.2rem' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="cv-section" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0f172a', borderBottom: '1px solid #94a3b8', paddingBottom: '0.2rem', marginBottom: '0.65rem' }}>
            Technical Projects
          </h2>
          {projects.map((proj, idx) => (
            <div key={proj.id || idx} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  {proj.name}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {proj.technologies}
                </span>
              </div>
              <ul style={{ paddingLeft: '1.1rem', listStyleType: 'disc', fontSize: '0.82rem', color: '#334155', lineHeight: 1.45, marginTop: '0.2rem' }}>
                {(proj.bullets || []).map((b, bIdx) => (
                  <li key={bIdx} style={{ marginBottom: '0.15rem' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="cv-section" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0f172a', borderBottom: '1px solid #94a3b8', paddingBottom: '0.2rem', marginBottom: '0.5rem' }}>
            Skills & Competencies
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
            {skills.map((sk, idx) => (
              <div key={idx}>
                <strong>{sk.category}: </strong>
                <span style={{ color: '#475569' }}>{sk.items}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="cv-section">
          <h2 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0f172a', borderBottom: '1px solid #94a3b8', paddingBottom: '0.2rem', marginBottom: '0.5rem' }}>
            Certifications & Honors
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem' }}>
            {certifications.map((cert, idx) => (
              <div key={cert.id || idx}>
                <strong>{cert.name}</strong> — {cert.issuer} ({cert.date})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="cv-section" style={{ marginTop: '1.25rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0f172a', borderBottom: '1px solid #94a3b8', paddingBottom: '0.2rem', marginBottom: '0.5rem' }}>
            Languages
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.82rem' }}>
            {languages.map((lang, idx) => (
              <div key={lang.id || idx}>
                <strong>{lang.language}:</strong> <span style={{ color: '#475569' }}>{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
