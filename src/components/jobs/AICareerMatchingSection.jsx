import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { jobsApi, skillsApi } from '../../services/api';
import Button from '../common/Button';
import {
  Sparkles,
  Target,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Layers,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  SlidersHorizontal,
  Code2,
  Building2,
  ShieldCheck,
  Check,
  Zap,
  Compass,
  ArrowUpRight
} from 'lucide-react';

const PAKISTAN_TECH_CITIES = [
  'All Cities',
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Peshawar',
  'Remote',
];

const EXPERIENCE_OPTIONS = [
  { value: 'All', label: 'All Experience Levels' },
  { value: 'fresh', label: 'Fresh Graduate / Entry (0-1 yr)' },
  { value: '1-3', label: 'Mid-Level (1-3 yrs)' },
  { value: '3+', label: 'Senior / Lead (3+ yrs)' },
];

const EMPLOYMENT_OPTIONS = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];

export default function AICareerMatchingSection({ onSelectJobDetail }) {
  const { user } = useAuth();
  const { jobs: trackedApplications, addJob, skills, addToast } = useApp();

  // Recommendations state
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [topMatch, setTopMatch] = useState(null);
  const [topMissingSkills, setTopMissingSkills] = useState([]);
  const [learningPlan, setLearningPlan] = useState(null);
  const [userProfileSummary, setUserProfileSummary] = useState(null);
  const [hasSufficientData, setHasSufficientData] = useState(true);
  const [emptyReason, setEmptyReason] = useState('');

  // Interactive filters
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [internshipOnly, setInternshipOnly] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('All');
  const [minScoreFilter, setMinScoreFilter] = useState(0);

  // UI state
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [addingSkillName, setAddingSkillName] = useState(null);
  const [completedChecklistItems, setCompletedChecklistItems] = useState({});

  // Check if job is already saved in tracker
  const isJobSaved = (jobId) => {
    return trackedApplications.some(
      (a) => a.jobId === jobId || a.id === jobId || (a.position === jobId)
    );
  };

  // Fetch recommendations from production API
  const fetchRecommendations = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const params = {};
      if (selectedCity && selectedCity !== 'All Cities') params.city = selectedCity;
      if (remoteOnly) params.remote = 'true';
      if (internshipOnly) params.internship = 'true';
      if (selectedExperience && selectedExperience !== 'All') params.experience = selectedExperience;
      if (selectedEmploymentType && selectedEmploymentType !== 'All') params.employmentType = selectedEmploymentType;
      if (minScoreFilter > 0) params.minScore = minScoreFilter;

      const res = await jobsApi.getRecommendations(params);
      if (res && res.data) {
        setRecommendations(res.data.recommendations || []);
        setTopMatch(res.data.topMatch || null);
        setTopMissingSkills(res.data.topMissingSkills || []);
        setLearningPlan(res.data.learningPlan || null);
        setUserProfileSummary(res.data.userProfileSummary || null);
        setHasSufficientData(res.data.hasSufficientData !== false);
        setEmptyReason(res.data.emptyReason || '');
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError(err.message || 'Unable to load real job recommendations.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [
    selectedCity,
    remoteOnly,
    internshipOnly,
    selectedExperience,
    selectedEmploymentType,
    minScoreFilter,
  ]);

  // Initial load and filter change trigger
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // Recalculate recommendations when user's profile or skills change in context
  useEffect(() => {
    if (skills && skills.length > 0) {
      fetchRecommendations(true);
    }
  }, [skills.length]);

  // Handle Save to Tracker
  const handleSaveToTracker = (job) => {
    const newApp = {
      company: job.companyName || job.company || 'Verified Employer',
      position: job.title,
      location: job.locationCity ? `${job.locationCity} (${job.workArrangement || 'Hybrid'})` : 'Pakistan',
      type: job.employmentType || 'Full-time',
      salary: job.salaryMin ? `PKR ${job.salaryMin.toLocaleString()} - ${job.salaryMax ? job.salaryMax.toLocaleString() : '+'} / mo` : 'Market Competitive',
      jobUrl: job.applicationUrl || job.canonicalJobUrl || job.sourceUrl || '#',
      status: 'Saved',
      notes: `AI Match Score: ${job.match?.matchScore || 0}%. Source: ${job.sourceName || 'SkillPath AI'}.`,
      priority: 'High',
      jobId: job.id || job._id,
    };

    addJob(newApp);
    addToast({
      type: 'success',
      title: 'Saved to Applications! 📌',
      message: `"${job.title}" has been saved to your Application Tracker under "Saved".`,
    });
  };

  // Add missing skill to user's Skill Tracker
  const handleAddMissingSkill = async (skillName) => {
    setAddingSkillName(skillName);
    try {
      await skillsApi.create({
        name: skillName,
        category: 'technical',
        currentLevel: 1,
        targetLevel: 4,
        progress: 15,
        hoursSpent: 0,
        notes: `Identified by AI Career Matching as high-impact gap for Pakistani IT roles.`,
      });
      addToast({
        type: 'success',
        title: 'Skill Added to Tracker! 🚀',
        message: `"${skillName}" has been added to your Skills Matrix. Recalculating matches...`,
      });
      // Trigger live recalculation
      fetchRecommendations(true);
    } catch (err) {
      addToast({
        type: 'info',
        title: 'Skill Tracker',
        message: err.message || `"${skillName}" is already in your skills or logged.`,
      });
    } finally {
      setAddingSkillName(null);
    }
  };

  // Toggle checklist item completion in Learning Plan
  const toggleChecklist = (key) => {
    setCompletedChecklistItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCity('All Cities');
    setRemoteOnly(false);
    setInternshipOnly(false);
    setSelectedExperience('All');
    setSelectedEmploymentType('All');
    setMinScoreFilter(0);
  };

  return (
    <div className="ai-career-matching-wrapper animate-fade">
      {/* SECTION 1: HEADER & USER PROFILE CONTEXT */}
      <div className="ai-matching-header-card">
        <div className="ai-matching-header-left">
          <div className="ai-matching-badge">
            <Sparkles size={16} />
            <span>AI Explainable Matching Engine</span>
          </div>
          <h2 className="ai-matching-title">Real Vacancy Compatibility & Learning Roadmap</h2>
          <p className="ai-matching-subtitle">
            Every match is computed strictly against active vacancies in Pakistan software houses, banks, and telecom operators using your saved profile, skills, education, and career targets.
          </p>

          {/* Profile Context Pill Bar */}
          {userProfileSummary && (
            <div className="ai-profile-summary-pills">
              <span className="profile-pill">
                <Target size={13} />
                <strong>Target Role:</strong> {userProfileSummary.targetCareer || 'Software Engineer'}
              </span>
              <span className="profile-pill">
                <Code2 size={13} />
                <strong>Tracked Skills:</strong> {userProfileSummary.savedSkillsCount || 0} skills
              </span>
              <span className="profile-pill">
                <GraduationCap size={13} />
                <strong>Education:</strong> {userProfileSummary.degree || userProfileSummary.educationLevel || "Bachelor's"}
              </span>
              <span className="profile-pill">
                <Clock size={13} />
                <strong>Commitment:</strong> {userProfileSummary.weeklyLearningHours || 15} hrs/wk
              </span>
            </div>
          )}
        </div>

        <div className="ai-matching-header-actions">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={() => fetchRecommendations(true)}
            disabled={isRefreshing || loading}
          >
            {isRefreshing ? 'Recalculating...' : 'Recalculate Matches'}
          </Button>
        </div>
      </div>

      {/* EMPTY PROFILE NOTICE (If user has 0 skills) */}
      {userProfileSummary?.hasEmptyProfile && (
        <div className="ai-notice-banner warning">
          <AlertCircle size={20} className="notice-icon" />
          <div className="notice-content">
            <h4>Profile Incomplete — Using Entry-Level Baseline</h4>
            <p>
              You haven't tracked any skills yet. Add your programming languages, frameworks, or tools in the{' '}
              <strong>Skills Matrix</strong> or complete the <strong>Career Assessment</strong> to unlock accurate, personalized compatibility percentages.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 2: INTERACTIVE FILTER BAR */}
      <div className="ai-matching-filter-bar">
        <div className="filter-group">
          <label>City Hub</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="filter-select"
          >
            {PAKISTAN_TECH_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Experience Level</label>
          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="filter-select"
          >
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Employment</label>
          <select
            value={selectedEmploymentType}
            onChange={(e) => setSelectedEmploymentType(e.target.value)}
            className="filter-select"
          >
            {EMPLOYMENT_OPTIONS.map((emp) => (
              <option key={emp} value={emp}>{emp}</option>
            ))}
          </select>
        </div>

        <div className="filter-group-toggles">
          <button
            type="button"
            className={`filter-toggle-pill ${remoteOnly ? 'active' : ''}`}
            onClick={() => setRemoteOnly(!remoteOnly)}
          >
            <MapPin size={13} />
            <span>Remote Only</span>
          </button>

          <button
            type="button"
            className={`filter-toggle-pill ${internshipOnly ? 'active' : ''}`}
            onClick={() => setInternshipOnly(!internshipOnly)}
          >
            <GraduationCap size={13} />
            <span>Internships & Trainees</span>
          </button>
        </div>

        {(selectedCity !== 'All Cities' || remoteOnly || internshipOnly || selectedExperience !== 'All' || selectedEmploymentType !== 'All') && (
          <button
            type="button"
            className="filter-reset-btn"
            onClick={handleResetFilters}
            title="Reset all filters"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* SECTION 3: LOADING & ERROR STATES */}
      {loading ? (
        <div className="ai-matching-loading">
          <div className="loading-spinner-ring" />
          <p>Analyzing real database vacancies against your profile & calculating skill alignments...</p>
        </div>
      ) : error ? (
        <div className="ai-notice-banner error">
          <AlertCircle size={20} className="notice-icon" />
          <div className="notice-content">
            <h4>Error Loading Recommendations</h4>
            <p>{error}</p>
            <Button size="sm" variant="outline" onClick={() => fetchRecommendations()}>
              Retry
            </Button>
          </div>
        </div>
      ) : !hasSufficientData || recommendations.length === 0 ? (
        /* SECTION 4: EMPTY STATE */
        <div className="ai-empty-state-card">
          <div className="empty-state-icon">
            <Compass size={40} />
          </div>
          <h3>No Suitable Vacancies Found</h3>
          <p>
            {emptyReason ||
              'No active jobs in the verified database match your chosen filter criteria. Try adjusting your city, experience level, or remote preferences.'}
          </p>
          <Button variant="primary" size="sm" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>
      ) : (
        /* SECTION 5: RESULTS & MATCHING BREAKDOWN */
        <div className="ai-matching-results-container">
          {/* Top Spotlight Vacancy Banner (Full Width) */}
          {topMatch && (
            <div className="top-spotlight-card">
              <div className="spotlight-top-badge">
                <Zap size={14} />
                <span>Highest Compatibility Opportunity</span>
              </div>
              <div className="spotlight-main">
                <div>
                  <h3 className="spotlight-title">{topMatch.title}</h3>
                  <div className="spotlight-meta">
                    <span className="spotlight-company">
                      <Building2 size={14} />
                      {topMatch.companyName || topMatch.company}
                    </span>
                    <span className="spotlight-location">
                      <MapPin size={14} />
                      {topMatch.locationCity} ({topMatch.workArrangement || 'Hybrid'})
                    </span>
                    {topMatch.isInternship && (
                      <span className="badge badge-amber">Internship / Trainee</span>
                    )}
                  </div>
                </div>

                <div className="spotlight-score-badge">
                  <div className="score-number">{topMatch.match?.matchScore || 0}%</div>
                  <div className="score-label">Match Score</div>
                </div>
              </div>

              <p className="spotlight-explanation">
                {topMatch.match?.relevanceExplanation}
              </p>

              <div className="spotlight-actions">
                <a
                  href={topMatch.applicationUrl || topMatch.canonicalJobUrl || topMatch.sourceUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm spotlight-apply-btn"
                >
                  <span>Apply on Official Portal</span>
                  <ArrowUpRight size={15} />
                </a>

                <Button
                  variant="outline"
                  size="sm"
                  icon={isJobSaved(topMatch.id) ? BookmarkCheck : Bookmark}
                  onClick={() => handleSaveToTracker(topMatch)}
                  disabled={isJobSaved(topMatch.id)}
                >
                  {isJobSaved(topMatch.id) ? 'Saved in Tracker' : 'Save to Tracker'}
                </Button>
              </div>
            </div>
          )}

          {/* AI Career Growth & Learning Action Plan Row (Balanced 2-Column Grid) */}
          {((topMissingSkills && topMissingSkills.length > 0) || learningPlan) && (
            <div className="ai-insights-row">
              {/* CARD 1: HIGH-IMPACT SKILLS TO LEARN NEXT */}
              {topMissingSkills && topMissingSkills.length > 0 && (
                <div className="high-impact-skills-card">
                  <div className="insights-card-header">
                    <TrendingUp size={18} className="text-emerald" />
                    <div>
                      <h4>High-Impact Skills to Learn Next</h4>
                      <p className="text-muted text-xs">
                        Mastering these skills bridges qualification gaps across verified vacancies.
                      </p>
                    </div>
                  </div>

                  <div className="missing-skills-demand-list">
                    {topMissingSkills.map((item) => (
                      <div key={item.skill} className="missing-skill-item">
                        <div className="missing-skill-top">
                          <span className="missing-skill-name">{item.skill}</span>
                          <span className="boost-badge">{item.estimatedScoreBoost} Match</span>
                        </div>
                        <p className="missing-skill-rec">{item.recommendation}</p>
                        <button
                          type="button"
                          className="btn-add-skill"
                          onClick={() => handleAddMissingSkill(item.skill)}
                          disabled={addingSkillName === item.skill}
                        >
                          <PlusCircle size={12} />
                          <span>
                            {addingSkillName === item.skill
                              ? 'Adding to Tracker...'
                              : `Add ${item.skill} to My Skills`}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CARD 2: PERSONALIZED 3-STAGE LEARNING PLAN & PRACTICAL MILESTONE TASKS */}
              {learningPlan && (
                <div className="personalized-learning-plan-card">
                  <div className="insights-card-header">
                    <BookOpen size={18} className="text-cyan" />
                    <div>
                      <h4>Personalized Learning Plan & Tasks</h4>
                      <span className="plan-target-role">
                        Target: {learningPlan.targetRole} • {learningPlan.estimatedWeeksToQualify} Weeks
                      </span>
                    </div>
                  </div>

                  <p className="plan-summary-text">{learningPlan.summary}</p>

                  {/* AI Advisor Guidance Note */}
                  {learningPlan.aiAdvisorSummary && (
                    <div className="ai-advisor-guidance-box">
                      <div className="ai-guidance-tag">
                        <Sparkles size={13} />
                        <span>Live AI Career Strategy</span>
                      </div>
                      <p>{learningPlan.aiAdvisorSummary}</p>
                    </div>
                  )}

                  {/* Stage Tabs (Stage 1, Stage 2, Stage 3) */}
                  <div className="learning-stage-tabs">
                    {learningPlan.milestones?.map((milestone, idx) => (
                      <button
                        key={milestone.stage}
                        className={`stage-tab-btn ${activeStageIndex === idx ? 'active' : ''}`}
                        onClick={() => setActiveStageIndex(idx)}
                      >
                        Stage {milestone.stage}
                      </button>
                    ))}
                  </div>

                  {/* Active Stage Details & Interactive Tasks Checklist */}
                  {learningPlan.milestones && learningPlan.milestones[activeStageIndex] && (
                    <div className="active-stage-details animate-fade">
                      <div className="stage-title-row">
                        <h5>{learningPlan.milestones[activeStageIndex].title}</h5>
                        <span className="stage-duration">
                          <Clock size={12} />
                          {learningPlan.milestones[activeStageIndex].duration}
                        </span>
                      </div>
                      <p className="stage-desc">
                        {learningPlan.milestones[activeStageIndex].description}
                      </p>

                      <div className="stage-checklist">
                        <span className="checklist-heading">Practical Milestone Tasks:</span>
                        {learningPlan.milestones[activeStageIndex].checklist?.map((task, tIdx) => {
                          const checkKey = `stage_${activeStageIndex}_task_${tIdx}`;
                          const isDone = Boolean(completedChecklistItems[checkKey]);

                          return (
                            <div
                              key={tIdx}
                              className={`checklist-item ${isDone ? 'completed' : ''}`}
                              onClick={() => toggleChecklist(checkKey)}
                            >
                              <div className="checkbox-indicator">
                                {isDone && <Check size={12} />}
                              </div>
                              <span className="checklist-text">{task}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recommended Capstone Project */}
                  {learningPlan.recommendedProject && (
                    <div className="recommended-capstone-card">
                      <div className="capstone-header">
                        <Code2 size={16} />
                        <h6>Recommended Portfolio Project</h6>
                      </div>
                      <p className="capstone-title">{learningPlan.recommendedProject.title}</p>
                      <p className="capstone-desc">{learningPlan.recommendedProject.description}</p>
                    </div>
                  )}

                  {/* Curated Free Resources */}
                  {learningPlan.resources && learningPlan.resources.length > 0 && (
                    <div className="curated-resources-block">
                      <h6>Curated Free Learning Resources</h6>
                      <div className="resource-links-list">
                        {learningPlan.resources.map((res, i) => (
                          <a
                            key={i}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-link-item"
                          >
                            <div>
                              <span className="resource-title">{res.title}</span>
                              <span className="resource-provider">{res.provider} • {res.type}</span>
                            </div>
                            <ExternalLink size={14} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 3. Recommended Vacancies Section (Full Width Grid) */}
          <div className="matched-jobs-section">
            <div className="matched-jobs-list-header">
              <div>
                <h3>Recommended Vacancies ({recommendations.length})</h3>
                <span className="text-muted">Ranked by verified compatibility score</span>
              </div>
            </div>

            <div className="matched-jobs-cards">
              {recommendations.map((job) => {
                const match = job.match || {};
                const score = match.matchScore || 0;
                const isExpanded = expandedJobId === job.id;
                const scoreBadgeClass =
                  score >= 80 ? 'score-high' : score >= 60 ? 'score-medium' : 'score-low';

                return (
                  <div key={job.id} className="recommendation-card">
                    <div>
                      <div className="rec-card-header">
                        <div className="rec-card-title-group">
                          <div className="rec-company-row">
                            <span className="rec-company-name">
                              <Building2 size={13} />
                              {job.companyName || job.company}
                            </span>
                            <span className="rec-verification-tag">
                              <ShieldCheck size={12} />
                              Verified
                            </span>
                          </div>
                          <h4 className="rec-job-title">{job.title}</h4>
                          <div className="rec-meta-row">
                            <span>
                              <MapPin size={12} />
                              {job.locationCity} ({job.workArrangement || 'Hybrid'})
                            </span>
                            <span>
                              <Briefcase size={12} />
                              {job.employmentType || 'Full-time'}
                            </span>
                            {job.isInternship && (
                              <span className="badge badge-amber badge-xs">Internship</span>
                            )}
                          </div>
                        </div>

                        <div className={`rec-score-pill ${scoreBadgeClass}`}>
                          <span className="pill-number">{score}%</span>
                          <span className="pill-text">Match</span>
                        </div>
                      </div>

                      {/* Skills Summary Chips */}
                      <div className="rec-skills-section">
                        {match.matchingSkills && match.matchingSkills.length > 0 && (
                          <div className="skills-match-block">
                            <div className="skills-chip-label match">
                              <CheckCircle2 size={12} />
                              Matching Skills ({match.matchingSkills.length}):
                            </div>
                            <div className="skills-chip-list">
                              {match.matchingSkills.map((sk) => (
                                <span key={sk} className="skill-chip match">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {match.missingSkills && match.missingSkills.length > 0 && (
                          <div className="skills-missing-block">
                            <div className="skills-chip-label missing">
                              <AlertCircle size={12} />
                              Missing Skills ({match.missingSkills.length}):
                            </div>
                            <div className="skills-chip-list">
                              {match.missingSkills.slice(0, 4).map((sk) => (
                                <span key={sk} className="skill-chip missing">
                                  {sk}
                                </span>
                              ))}
                              {match.missingSkills.length > 4 && (
                                <span className="skill-chip-more">
                                  +{match.missingSkills.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Expandable Diagnostic Breakdown */}
                      {isExpanded && (
                        <div className="rec-card-breakdown animate-fade">
                          <div className="breakdown-title">
                            <Sparkles size={14} />
                            <span>Explainable Score Breakdown</span>
                          </div>

                          <div className="breakdown-bars">
                            <div className="breakdown-bar-item">
                              <div className="bar-labels">
                                <span>Technical Skills (50%)</span>
                                <span>{match.scoreBreakdown?.skillsScore || 0}%</span>
                              </div>
                              <div className="bar-track">
                                <div
                                  className="bar-fill skills"
                                  style={{ width: `${match.scoreBreakdown?.skillsScore || 0}%` }}
                                />
                              </div>
                            </div>

                            <div className="breakdown-bar-item">
                              <div className="bar-labels">
                                <span>Role / Career Goal Alignment (20%)</span>
                                <span>{match.scoreBreakdown?.roleScore || 0}%</span>
                              </div>
                              <div className="bar-track">
                                <div
                                  className="bar-fill role"
                                  style={{ width: `${match.scoreBreakdown?.roleScore || 0}%` }}
                                />
                              </div>
                            </div>

                            <div className="breakdown-bar-item">
                              <div className="bar-labels">
                                <span>Location & Work Environment (15%)</span>
                                <span>{match.scoreBreakdown?.locationScore || 0}%</span>
                              </div>
                              <div className="bar-track">
                                <div
                                  className="bar-fill location"
                                  style={{ width: `${match.scoreBreakdown?.locationScore || 0}%` }}
                                />
                              </div>
                            </div>

                            <div className="breakdown-bar-item">
                              <div className="bar-labels">
                                <span>Education & Experience Fit (15%)</span>
                                <span>{match.scoreBreakdown?.experienceScore || 0}%</span>
                              </div>
                              <div className="bar-track">
                                <div
                                  className="bar-fill experience"
                                  style={{ width: `${match.scoreBreakdown?.experienceScore || 0}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Actionable Explanation */}
                          <div className="rec-explanation-box">
                            <p>{match.relevanceExplanation}</p>
                            {match.recommendedActions && match.recommendedActions.length > 0 && (
                              <ul className="rec-actions-list">
                                {match.recommendedActions.map((act, i) => (
                                  <li key={i}>{act}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="rec-card-footer">
                      <button
                        type="button"
                        className="btn-text-link"
                        onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                      >
                        {isExpanded ? (
                          <>
                            <span>Hide Match Breakdown</span>
                            <ChevronUp size={14} />
                          </>
                        ) : (
                          <>
                            <span>View Match Breakdown & Reasons</span>
                            <ChevronDown size={14} />
                          </>
                        )}
                      </button>

                      <div className="rec-footer-buttons">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={isJobSaved(job.id) ? BookmarkCheck : Bookmark}
                          onClick={() => handleSaveToTracker(job)}
                          disabled={isJobSaved(job.id)}
                        >
                          {isJobSaved(job.id) ? 'Saved' : 'Save'}
                        </Button>

                        <a
                          href={job.applicationUrl || job.canonicalJobUrl || job.sourceUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          <span>Apply</span>
                          <ArrowUpRight size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlusCircle(props) {
  return (
    <svg
      width={props.size || 16}
      height={props.size || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}
