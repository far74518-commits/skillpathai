import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ProjectCard from '../components/projects/ProjectCard';
import { Code2, Filter, Search, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ProjectsPage() {
  const { projects } = useApp();
  const [careerFilter, setCareerFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tracks = [
    'All',
    'Frontend Developer',
    'Full-Stack Developer',
    'Python Developer',
    'Data Analyst',
    'AI / Machine Learning Engineer'
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchTrack = careerFilter === 'All' || p.careerTrack === careerFilter;
      const matchDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.skills.some(s => s.toLowerCase().includes(q));
      return matchTrack && matchDiff && matchSearch;
    });
  }, [projects, careerFilter, difficultyFilter, searchQuery]);

  const completedCount = projects.filter(p => p.completed).length;
  const inProgressCount = projects.filter(p => p.started && !p.completed).length;

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">Portfolio Projects Explorer</h1>
          <p className="page-subtitle">
            Stand out in tech interviews with production-grade capstones and interactive progress checklists.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span className="badge badge-indigo">
            {completedCount} Completed
          </span>
          <span className="badge badge-amber">
            {inProgressCount} In Progress
          </span>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Career Track Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Track:
            </span>
            {tracks.map((tr) => (
              <button
                key={tr}
                className={`tag-btn ${careerFilter === tr ? 'selected' : ''}`}
                onClick={() => setCareerFilter(tr)}
              >
                {tr}
              </button>
            ))}
          </div>

          {/* Difficulty & Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Difficulty:
              </span>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  className={`tag-btn ${difficultyFilter === diff ? 'selected' : ''}`}
                  onClick={() => setDifficultyFilter(diff)}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div className="input-with-icon" style={{ minWidth: 240 }}>
              <Search size={15} className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Search skills, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No portfolio projects match your selected filters.
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}
