import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, Compass, Map, Award, FileText, Code2, Settings, ArrowRight, X } from 'lucide-react';
import { CAREERS } from '../../data/careers';

export default function QuickSearchModal() {
  const { isSearchOpen, setIsSearchOpen, skills, jobs, setTargetCareer } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  const quickPages = [
    { title: 'Dashboard', path: '/dashboard', icon: Compass, category: 'Pages' },
    { title: 'AI Career Assistant', path: '/assistant', icon: Compass, category: 'Pages' },
    { title: 'Personalized Roadmap', path: '/roadmap', icon: Map, category: 'Pages' },
    { title: 'Skills Progress Tracker', path: '/skills', icon: Award, category: 'Pages' },
    { title: 'Professional CV Builder', path: '/cv-builder', icon: FileText, category: 'Pages' },
    { title: 'Portfolio Projects Explorer', path: '/projects', icon: Code2, category: 'Pages' },
    { title: 'Settings & Data Management', path: '/settings', icon: Settings, category: 'Pages' }
  ];

  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return {
        pages: quickPages.slice(0, 5),
        careers: CAREERS.slice(0, 3),
        skills: []
      };
    }

    const q = query.toLowerCase();

    return {
      pages: quickPages.filter(p => p.title.toLowerCase().includes(q)),
      careers: CAREERS.filter(c => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)),
      skills: (skills || []).filter(s => s.name.toLowerCase().includes(q)).slice(0, 4)
    };
  }, [query, skills, jobs]);

  if (!isSearchOpen) return null;

  const handleSelectPage = (path) => {
    navigate(path);
    setIsSearchOpen(false);
  };

  const handleSelectCareer = (careerId) => {
    setTargetCareer(careerId);
    navigate('/roadmap');
    setIsSearchOpen(false);
  };

  const hasAnyResults =
    filteredItems.pages.length > 0 ||
    filteredItems.careers.length > 0 ||
    filteredItems.skills.length > 0 ||
    filteredItems.jobs.length > 0;

  return (
    <div className="modal-overlay" onClick={() => setIsSearchOpen(false)}>
      <div
        className="quick-search-box"
        style={{ width: '100%', maxWidth: 640 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="quick-search-header">
          <Search size={20} color="var(--primary-500)" />
          <input
            type="text"
            className="quick-search-input"
            placeholder="Search roadmaps, skills, careers, job applications, pages..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn-icon" onClick={() => setIsSearchOpen(false)} aria-label="Close search">
            <X size={18} />
          </button>
        </div>

        <div className="quick-search-results">
          {!hasAnyResults ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No results found for "{query}".
            </div>
          ) : (
            <>
              {filteredItems.pages.length > 0 && (
                <div>
                  <div className="search-result-group-title">Navigation</div>
                  {filteredItems.pages.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.path}
                        className="search-result-item"
                        onClick={() => handleSelectPage(item.path)}
                      >
                        <Icon size={16} color="var(--primary-500)" />
                        <span style={{ flex: 1, fontWeight: 500 }}>{item.title}</span>
                        <ArrowRight size={14} color="var(--text-dim)" />
                      </div>
                    );
                  })}
                </div>
              )}

              {filteredItems.careers.length > 0 && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div className="search-result-group-title">Career Paths</div>
                  {filteredItems.careers.map((career) => (
                    <div
                      key={career.id}
                      className="search-result-item"
                      onClick={() => handleSelectCareer(career.id)}
                    >
                      <Map size={16} color="var(--cyan-500)" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{career.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {career.category} • {career.difficulty}
                        </div>
                      </div>
                      <span className="badge badge-indigo">Set Target</span>
                    </div>
                  ))}
                </div>
              )}

              {filteredItems.skills.length > 0 && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div className="search-result-group-title">Your Tracked Skills</div>
                  {filteredItems.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="search-result-item"
                      onClick={() => handleSelectPage('/skills')}
                    >
                      <Award size={16} color="var(--emerald-500)" />
                      <span style={{ flex: 1, fontWeight: 500 }}>{skill.name}</span>
                      <span className="badge badge-gray">{skill.category}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Level {skill.currentLevel} / {skill.targetLevel}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
