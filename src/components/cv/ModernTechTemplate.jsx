import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export default function ModernTechTemplate({ cvData }) {
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
    <div className="cv-print-document cv-template-modern">
      {/* Header */}
      <div className="cv-header">
        <h1 className="cv-name">{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.title ? (
          <div className="cv-role">{personalInfo.title}</div>
        ) : null}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.85rem',
            marginTop: '0.65rem',
            fontSize: '0.82rem',
            color: '#475569'
          }}
        >
          {personalInfo.email && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Mail size={13} color="#6366f1" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Phone size={13} color="#6366f1" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={13} color="#6366f1" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Globe size={13} color="#6366f1" />
              {personalInfo.website.replace('https://', '')}
            </span>
          )}
          {personalInfo.github && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Github size={13} color="#6366f1" />
              {personalInfo.github.replace('https://github.com/', 'github/')}
            </span>
          )}
        </div>
      </div>

      {/* Left Column (Summary, Experience, Projects) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Summary */}
        {professionalSummary && (
          <div className="cv-section">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1b4b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Professional Summary
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
              {professionalSummary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="cv-section">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1b4b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Experience & Internships
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {experience.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
                      {exp.role}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#6366f1', fontWeight: 600, marginBottom: '0.35rem' }}>
                    {exp.company} {exp.location ? `• ${exp.location}` : ''}
                  </div>
                  <ul style={{ paddingLeft: '1rem', listStyleType: 'disc', fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>
                    {(exp.bullets || []).map((b, bIdx) => (
                      <li key={bIdx} style={{ marginBottom: '0.2rem' }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="cv-section">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1b4b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Key Technical Projects
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {projects.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                      {proj.name}
                    </span>
                    {proj.link && (
                      <span style={{ fontSize: '0.75rem', color: '#6366f1' }}>
                        {proj.link.replace('https://', '')}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', marginBottom: '0.25rem' }}>
                    {proj.technologies}
                  </div>
                  <ul style={{ paddingLeft: '1rem', listStyleType: 'disc', fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>
                    {(proj.bullets || []).map((b, bIdx) => (
                      <li key={bIdx} style={{ marginBottom: '0.15rem' }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column (Education, Skills, Certs) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Education */}
        {education.length > 0 && (
          <div className="cv-section">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1b4b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Education
            </h2>
            {education.map((edu, idx) => (
              <div key={edu.id || idx} style={{ marginBottom: '0.65rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  {edu.degree}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#6366f1', fontWeight: 600 }}>
                  {edu.institution}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 1 }}>
                  {edu.startDate} - {edu.endDate} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                </div>
                {edu.highlights && (
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.25rem', lineHeight: 1.4 }}>
                    {edu.highlights}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="cv-section">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1b4b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Technical Skills
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {skills.map((skGroup, idx) => (
                <div key={idx} style={{ fontSize: '0.82rem' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{skGroup.category}: </span>
                  <span style={{ color: '#475569' }}>{skGroup.items}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="cv-section">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1b4b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Certifications
            </h2>
            {certifications.map((cert, idx) => (
              <div key={cert.id || idx} style={{ marginBottom: '0.5rem', fontSize: '0.82rem' }}>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{cert.name}</div>
                <div style={{ color: '#64748b' }}>
                  {cert.issuer} • {cert.date}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="cv-section">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1b4b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Languages
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
              {languages.map((lang, idx) => (
                <div key={lang.id || idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{lang.language}</span>
                  <span style={{ color: '#64748b' }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
