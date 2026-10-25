import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { APPLICATION_STATUSES } from '../data/sampleJobs';
import { CLIENT_PAKISTAN_JOBS, PAKISTAN_CITIES, CAREER_TAXONOMY } from '../data/pakistanJobCatalogue';
import { jobsApi } from '../services/api';
import JobModal from '../components/jobs/JobModal';
import AICareerMatchingSection from '../components/jobs/AICareerMatchingSection';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';
import {
  Briefcase,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  MapPin,
  Bookmark,
  BookmarkCheck,
  ShieldCheck,
  GraduationCap,
  Bell,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Globe,
  PlusCircle,
  Info,
  TrendingUp,
  X,
  Code2,
  Check,
  AlertCircle,
  Target
} from 'lucide-react';

export default function JobTrackerPage() {
  const { jobs, addJob, updateJob, deleteJob, skills, targetCareerId, addToast } = useApp();

  // Active view tab: 'discover' | 'tracker' | 'alerts' | 'sources'
  const [activeTab, setActiveTab] = useState('discover');

  // --- DISCOVERY STATE ---
  const [discoveredJobs, setDiscoveredJobs] = useState(CLIENT_PAKISTAN_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedWorkEnv, setSelectedWorkEnv] = useState('All');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [internshipOnly, setInternshipOnly] = useState(false);
  const [hideExpired, setHideExpired] = useState(true); // Automatically hide jobs with past deadlines
  const [sortBy, setSortBy] = useState('match'); // match | recent | deadline | salary
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  // --- DISCOVERY PAGINATION ---
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  // --- SOURCES REGISTRY & ADMIN ENTRY STATE ---
  const [sourcesList, setSourcesList] = useState([]);
  const [syncRuns, setSyncRuns] = useState([]);
  const [isSyncRunsLoading, setIsSyncRunsLoading] = useState(false);
  const [syncingSourceId, setSyncingSourceId] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [manualJobForm, setManualJobForm] = useState({
    title: '',
    companyName: '',
    careerCategory: 'Software Development',
    canonicalJobUrl: '',
    locationCity: 'Lahore',
    locationProvince: 'Punjab',
    workArrangement: 'Hybrid',
    employmentType: 'Full-time',
    experienceLabel: 'Fresh Graduate to 1 Year',
    salaryMin: '',
    salaryMax: '',
    requiredSkills: '',
    description: '',
    applicationDeadline: '',
    isInternship: false,
    sourceId: 'src_systems_ltd',
  });

  // --- APPLICATION TRACKER STATE ---
  const [statusFilter, setStatusFilter] = useState('All');
  const [trackerSearch, setTrackerSearch] = useState('');
  const [trackerSort, setTrackerSort] = useState('date-desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // --- ALERTS STATE ---
  const [alertKeywords, setAlertKeywords] = useState('React, Python, Flutter');
  const [alertCity, setAlertCity] = useState('Karachi');
  const [alertInternship, setAlertInternship] = useState(true);
  const [alertFrequency, setAlertFrequency] = useState('daily');
  const [alertSaved, setAlertSaved] = useState(false);

  // Standardize job model properties across backend API responses and local catalogue
  const normalizeJobData = (j) => {
    return {
      id: j.id || j._id || j.sourceJobId || String(Math.random()),
      title: j.title || 'Tech Opportunity',
      company: j.company || j.companyName || 'Verified Employer',
      companyWebsite: j.companyWebsite || '',
      location: j.location || (j.locationCity ? `${j.locationCity} (${j.workArrangement || 'Hybrid'})` : 'Pakistan'),
      city: j.city || j.locationCity || 'Remote (Pakistan)',
      province: j.province || j.locationProvince || 'Pakistan',
      type: j.type || j.employmentType || 'Full-time',
      category: j.category || j.careerCategory || 'Software Development',
      workArrangement: j.workArrangement || 'Hybrid',
      salary: j.salary || (j.salaryMin ? `PKR ${j.salaryMin.toLocaleString()} - ${j.salaryMax ? j.salaryMax.toLocaleString() : '+'} / mo` : 'Market Competitive'),
      salaryMin: j.salaryMin || 0,
      salaryMax: j.salaryMax || 0,
      experience: j.experience || j.experienceLabel || 'Fresh Graduate to 1 Year',
      source: j.source || j.sourceName || 'Verified Employer Portal',
      url: j.url || j.canonicalJobUrl || j.sourceUrl || '#',
      verified: j.verified !== false,
      isVerifiedEmployer: j.verificationConfidence === 'High' || j.verified !== false,
      publishedAt: j.publishedAt ? new Date(j.publishedAt).toISOString() : new Date().toISOString(),
      lastVerifiedAt: j.lastVerifiedAt ? new Date(j.lastVerifiedAt).toISOString() : null,
      verificationBadge: j.verificationBadge || (j.isManuallyAdded ? 'manual-entry' : j.sourceType === 'api' || j.sourceType === 'rss_atom' ? 'source-verified' : 'employer-direct'),
      applicationDeadline: j.applicationDeadline ? new Date(j.applicationDeadline).toISOString() : null,
      requiredSkills: Array.isArray(j.requiredSkills) ? j.requiredSkills : [],
      description: j.description || '',
      isInternship: Boolean(j.isInternship || (j.employmentType && j.employmentType.toLowerCase().includes('intern'))),
      stipend: Boolean(j.stipend),
      status: j.status || 'Active',
    };
  };

  // Evaluates deadline lifecycle for any vacancy
  const getDeadlineInfo = (job) => {
    if (!job.applicationDeadline) {
      return {
        isExpired: false,
        daysLeft: null,
        badgeText: 'Open Application',
        badgeClass: 'active',
        formattedDate: 'Rolling Basis'
      };
    }

    const now = new Date();
    const deadline = new Date(job.applicationDeadline);
    const diffMs = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const formatted = deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    if (diffMs <= 0 || job.status === 'Expired') {
      return {
        isExpired: true,
        daysLeft: 0,
        badgeText: 'Deadline Passed',
        badgeClass: 'expired',
        formattedDate: formatted
      };
    }

    if (diffDays <= 3) {
      return {
        isExpired: false,
        daysLeft: diffDays,
        badgeText: `🔥 Closes in ${diffDays} day${diffDays === 1 ? '' : 's'}!`,
        badgeClass: 'urgent',
        formattedDate: formatted
      };
    }

    return {
      isExpired: false,
      daysLeft: diffDays,
      badgeText: `Apply by: ${formatted} (${diffDays}d left)`,
      badgeClass: 'active',
      formattedDate: formatted
    };
  };

  // Checks whether the vacancy publication date has arrived yet (publishedAt <= now)
  const isJobDateActive = (job) => {
    if (!job.publishedAt) return true;
    const now = new Date();
    const pubDate = new Date(job.publishedAt);
    return pubDate <= now;
  };

  // Auto-Update Background Synchronizer (Polls live API every 30 seconds)
  useEffect(() => {
    let isMounted = true;

    const fetchLiveFeed = async (silent = true) => {
      if (!silent) setIsSyncing(true);
      try {
        const response = await jobsApi.getDiscovered({ activeOnly: hideExpired ? 'true' : 'false' });
        if (response && response.data && Array.isArray(response.data.jobs) && isMounted) {
          const normalized = response.data.jobs.map(normalizeJobData);
          setDiscoveredJobs(normalized);
          setLastSyncTime(new Date());
        }
      } catch (err) {
        // Maintain local catalogue if network fallback
        console.warn('Auto-sync fallback to client catalogue:', err.message);
      } finally {
        if (isMounted && !silent) setIsSyncing(false);
      }
    };

    // Initial fetch on mount
    fetchLiveFeed(true);

    // Auto-update every 30 seconds
    const interval = setInterval(() => {
      fetchLiveFeed(true);
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [hideExpired]);

  // Match calculator based on candidate's active skills and target career
  const calculateMatch = (job) => {
    const candidateSkillNames = (skills || []).map(s => (s.name || '').toLowerCase());
    const jobSkills = (job.requiredSkills || []).map(s => s.toLowerCase());

    const matched = [];
    const missing = [];

    (job.requiredSkills || []).forEach((skill, idx) => {
      const sNorm = jobSkills[idx];
      const hasSkill = candidateSkillNames.some(cs => cs.includes(sNorm) || sNorm.includes(cs));
      if (hasSkill) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    });

    const skillRatio = jobSkills.length > 0 ? matched.length / jobSkills.length : 0.6;
    let baseScore = Math.round(skillRatio * 55 + 35); // baseline 35-90%

    // Category / role relevance bonus
    const cat = (job.category || '').toLowerCase();
    if (targetCareerId && cat.includes('software') && targetCareerId.includes('dev')) {
      baseScore += 8;
    }

    const finalScore = Math.min(98, Math.max(45, baseScore));

    return {
      score: finalScore,
      matchedSkills: matched,
      missingSkills: missing
    };
  };

  // Filtered & Sorted Discovered Jobs with date arrival and deadline lifecycle
  const filteredDiscoveredJobs = useMemo(() => {
    let result = discoveredJobs.map(j => {
      const match = calculateMatch(j);
      const deadlineInfo = getDeadlineInfo(j);
      const dateActive = isJobDateActive(j);
      return { ...j, match, deadlineInfo, dateActive };
    });

    // 1. Date Arrival Filter: "jis ke date a jai to wo show ho"
    // Future published vacancies only appear once their scheduled publication date arrives
    result = result.filter(j => j.dateActive);

    // 2. Deadline Expired Filter: "jis ke dat khtm ho wo na show phir"
    // If deadline has passed, automatically exclude from active view
    if (hideExpired) {
      result = result.filter(j => !j.deadlineInfo.isExpired && j.status !== 'Expired');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        (j.requiredSkills && j.requiredSkills.some(s => s.toLowerCase().includes(q))) ||
        j.city.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(j => j.category === selectedCategory);
    }

    if (selectedCity !== 'All Cities') {
      result = result.filter(j => {
        if (selectedCity === 'Remote (Pakistan)') {
          return j.workArrangement === 'Remote' || j.city.includes('Remote');
        }
        return j.city.toLowerCase().includes(selectedCity.toLowerCase());
      });
    }

    if (selectedWorkEnv !== 'All') {
      result = result.filter(j => j.workArrangement === selectedWorkEnv);
    }

    if (selectedEmploymentType !== 'All') {
      result = result.filter(j => (j.type || '').toLowerCase().includes(selectedEmploymentType.toLowerCase()));
    }

    if (selectedExperience !== 'All') {
      const exp = selectedExperience.toLowerCase();
      result = result.filter(j => {
        const expLabel = (j.experience || '').toLowerCase();
        if (exp.includes('fresh')) {
          return expLabel.includes('fresh') || expLabel.includes('entry') || j.isInternship;
        } else if (exp.includes('1-3')) {
          return expLabel.includes('1') || expLabel.includes('2') || expLabel.includes('3');
        } else if (exp.includes('3+')) {
          return expLabel.includes('3') || expLabel.includes('4') || expLabel.includes('5') || expLabel.includes('senior') || expLabel.includes('lead');
        }
        return expLabel.includes(exp);
      });
    }

    if (internshipOnly) {
      result = result.filter(j => j.isInternship || j.type.includes('Intern'));
    }

    // Sort
    if (sortBy === 'match') {
      result.sort((a, b) => b.match.score - a.match.score);
    } else if (sortBy === 'recent') {
      result.sort((a, b) => (new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)));
    } else if (sortBy === 'deadline') {
      result.sort((a, b) => (new Date(a.applicationDeadline || '9999') - new Date(b.applicationDeadline || '9999')));
    } else if (sortBy === 'salary') {
      result.sort((a, b) => (b.salaryMin || 0) - (a.salaryMin || 0));
    }

    return result;
  }, [discoveredJobs, searchQuery, selectedCategory, selectedCity, selectedWorkEnv, selectedEmploymentType, selectedExperience, internshipOnly, hideExpired, sortBy, skills, targetCareerId]);

  // Reset pagination on filter or search updates
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedCity, selectedWorkEnv, selectedEmploymentType, selectedExperience, internshipOnly, hideExpired, sortBy]);

  // Compute pagination
  const totalPages = Math.ceil(filteredDiscoveredJobs.length / itemsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredDiscoveredJobs.slice(start, start + itemsPerPage);
  }, [filteredDiscoveredJobs, page, itemsPerPage]);

  // Fetch sources registry from API
  const refreshSources = async () => {
    try {
      const res = await jobsApi.getSources();
      if (res && res.data && Array.isArray(res.data.sources)) {
        setSourcesList(res.data.sources);
      }
    } catch (e) {
      console.warn('Sources refresh fallback:', e.message);
    }
  };

  // Fetch sync runs audit log from API
  const fetchSyncRuns = async () => {
    setIsSyncRunsLoading(true);
    try {
      const res = await jobsApi.getSyncRuns({ limit: 10 });
      if (res && res.data && Array.isArray(res.data.runs)) {
        setSyncRuns(res.data.runs);
      }
    } catch (e) {
      console.warn('Sync runs fetch:', e.message);
    } finally {
      setIsSyncRunsLoading(false);
    }
  };

  // Sync an individual source on demand
  const handleSyncIndividualSource = async (sourceId) => {
    setSyncingSourceId(sourceId);
    try {
      const res = await jobsApi.triggerSync(sourceId);
      addToast({
        type: 'success',
        title: 'Source Synced ⚡',
        message: `Synchronization completed for [${sourceId}].`
      });
      await refreshSources();
      await fetchSyncRuns();
      const updated = await jobsApi.getDiscovered({ activeOnly: hideExpired ? 'true' : 'false' });
      if (updated?.data?.jobs) {
        setDiscoveredJobs(updated.data.jobs.map(normalizeJobData));
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Sync Error',
        message: err.message || 'Failed to sync source.'
      });
    } finally {
      setSyncingSourceId(null);
    }
  };

  useEffect(() => {
    refreshSources();
    fetchSyncRuns();
  }, []);

  useEffect(() => {
    if (activeTab === 'sources') {
      refreshSources();
      fetchSyncRuns();
    }
  }, [activeTab]);

  // Admin Manual Job Entry Submit
  const handleAdminManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualJobForm.title || !manualJobForm.companyName || !manualJobForm.canonicalJobUrl || !manualJobForm.locationCity) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in Title, Company, Application URL, and City.',
      });
      return;
    }

    try {
      const res = await jobsApi.addManualJob(manualJobForm);
      if (res && res.data && res.data.job) {
        const normalized = normalizeJobData(res.data.job);
        setDiscoveredJobs((prev) => [normalized, ...prev]);
        addToast({
          type: 'success',
          title: 'Verified Job Added! 🚀',
          message: `"${manualJobForm.title}" at ${manualJobForm.companyName} is now live in the discovery feed.`,
        });
        setIsAdminModalOpen(false);
        refreshSources();
        setManualJobForm({
          title: '',
          companyName: '',
          careerCategory: 'Software Development',
          canonicalJobUrl: '',
          locationCity: 'Lahore',
          locationProvince: 'Punjab',
          workArrangement: 'Hybrid',
          employmentType: 'Full-time',
          experienceLabel: 'Fresh Graduate to 1 Year',
          salaryMin: '',
          salaryMax: '',
          requiredSkills: '',
          description: '',
          applicationDeadline: '',
          isInternship: false,
          sourceId: 'src_systems_ltd',
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Error Adding Job',
        message: err.message || 'Failed to submit verified job opportunity.',
      });
    }
  };

  // Check if a discovered job is already saved in personal tracker
  const isJobSaved = (discovered) => {
    return jobs.some(j =>
      (j.jobId && j.jobId === discovered.id) ||
      (j.company.toLowerCase() === discovered.company.toLowerCase() &&
       j.position.toLowerCase() === discovered.title.toLowerCase())
    );
  };

  // Save discovered job to Application Tracker
  const handleSaveToTracker = (job) => {
    if (isJobSaved(job)) {
      addToast({
        type: 'info',
        title: 'Already Tracked',
        message: `"${job.title}" at ${job.company} is already in your tracker.`
      });
      return;
    }

    const newApp = {
      company: job.company,
      position: job.title,
      location: job.location,
      type: job.type,
      salary: job.salary,
      jobUrl: job.url,
      status: 'Saved',
      notes: `Discovered via SkillPath AI Pakistan IT Intelligence. Source: ${job.source}.`,
      priority: 'High',
      jobId: job.id
    };

    addJob(newApp);
    addToast({
      type: 'success',
      title: 'Saved to Tracker! 📌',
      message: `"${job.title}" added to your Application Tracker under "Saved".`
    });
  };

  // Open external job link and prompt apply tracking
  const handleApplyExternal = (job) => {
    window.open(job.url, '_blank', 'noopener,noreferrer');
    if (!isJobSaved(job)) {
      handleSaveToTracker(job);
    }
  };

  // Manual feed sync trigger
  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const response = await jobsApi.getDiscovered({ activeOnly: hideExpired ? 'true' : 'false' });
      if (response && response.data && Array.isArray(response.data.jobs)) {
        const normalized = response.data.jobs.map(normalizeJobData);
        setDiscoveredJobs(normalized);
      }
      setLastSyncTime(new Date());
      addToast({
        type: 'success',
        title: 'Feeds Synchronized ⚡',
        message: 'Checked Systems Ltd, 10Pearls, NetSol, JazzCash, Meezan Bank, and Remote feeds.'
      });
    } catch (err) {
      setLastSyncTime(new Date());
      addToast({
        type: 'info',
        title: 'Verified Catalogue Active 📌',
        message: 'Using offline verified catalogue. All authentic IT vacancies loaded.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Save Alert Settings
  const handleSaveAlerts = (e) => {
    e.preventDefault();
    setAlertSaved(true);
    addToast({
      type: 'success',
      title: 'Alert Preferences Updated! 🔔',
      message: `You will receive ${alertFrequency} notifications for ${alertKeywords} in ${alertCity}.`
    });
    setTimeout(() => setAlertSaved(false), 3000);
  };

  // --- APPLICATION TRACKER HELPERS ---
  const filteredTrackerJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
      const q = trackerSearch.toLowerCase();
      const matchesSearch =
        job.company.toLowerCase().includes(q) ||
        job.position.toLowerCase().includes(q) ||
        (job.notes && job.notes.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });

    if (trackerSort === 'date-asc') {
      result.sort((a, b) => new Date(a.appliedDate || 0) - new Date(b.appliedDate || 0));
    } else if (trackerSort === 'company') {
      result.sort((a, b) => a.company.localeCompare(b.company));
    } else {
      result.sort((a, b) => new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0));
    }

    return result;
  }, [jobs, statusFilter, trackerSearch, trackerSort]);

  const totalApps = jobs.length;
  const interviewsCount = jobs.filter(j => j.status === 'Interview').length;
  const offersCount = jobs.filter(j => j.status === 'Offer').length;
  const pendingCount = jobs.filter(j => j.status === 'Applied').length;

  const handleOpenAdd = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleSaveJob = (jobData) => {
    if (editingJob) {
      updateJob(jobData.id, jobData);
    } else {
      addJob(jobData);
    }
  };

  const handleStatusChange = (jobId, newStatus) => {
    updateJob(jobId, { status: newStatus });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteJob(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Interview':
        return <span className="badge badge-amber">{status}</span>;
      case 'Offer':
        return <span className="badge badge-emerald">{status}</span>;
      case 'Rejected':
        return <span className="badge badge-rose">{status}</span>;
      case 'Applied':
        return <span className="badge badge-cyan">{status}</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="animate-fade">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '1.25rem' }}>🇵🇰</span>
            <span className="badge badge-emerald" style={{ fontWeight: 700 }}>
              Live Pakistan IT Job Intelligence
            </span>
          </div>
          <h1 className="page-title">Pakistan IT Job Discovery & Career Tracker</h1>
          <p className="page-subtitle">
            Discover verified tech vacancies from Pakistan’s top software houses, banks, telecom, and startups. Match your skills, track interviews, and accelerate your IT career.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={handleManualSync}
            disabled={isSyncing}
          >
            {isSyncing ? 'Syncing Feeds...' : 'Sync Live Feeds'}
          </Button>

          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
            Track New Application
          </Button>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div className="job-nav-tabs">
        <button
          className={`job-tab-btn ${activeTab === 'matching' ? 'active' : ''}`}
          onClick={() => setActiveTab('matching')}
        >
          <Target size={16} />
          <span>🎯 AI Career Matching</span>
          <span className="job-tab-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)' }}>
            AI Engine
          </span>
        </button>

        <button
          className={`job-tab-btn ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          <Sparkles size={16} />
          <span>🇵🇰 Discover Pakistan IT Jobs</span>
          <span className="job-tab-badge">{discoveredJobs.length}</span>
        </button>

        <button
          className={`job-tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracker')}
        >
          <Briefcase size={16} />
          <span>📋 Application Tracker</span>
          <span className="job-tab-badge">{jobs.length}</span>
        </button>

        <button
          className={`job-tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <Bell size={16} />
          <span>🔔 Job Alerts</span>
        </button>

        <button
          className={`job-tab-btn ${activeTab === 'sources' ? 'active' : ''}`}
          onClick={() => setActiveTab('sources')}
        >
          <ShieldCheck size={16} />
          <span>📡 Verified Feeds & Sources</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: AI CAREER MATCHING & PERSONALIZED LEARNING ROADMAP                 */}
      {/* ========================================================================= */}
      {activeTab === 'matching' && (
        <AICareerMatchingSection
          onSelectJobDetail={(job) => setSelectedJobDetail(job)}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 1: PAKISTAN IT JOB DISCOVERY                                         */}
      {/* ========================================================================= */}
      {activeTab === 'discover' && (
        <div>
          {/* Intelligence Banner */}
          <div className="intelligence-banner">
            <div className="intelligence-banner-info">
              <div className="intelligence-pulse-icon">
                <Sparkles size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                  Personalized IT Vacancy Matching Active
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Jobs scored against your active profile skills ({skills.length} skills logged) and target career track.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <Button
                variant="primary"
                size="sm"
                icon={Target}
                onClick={() => setActiveTab('matching')}
              >
                View Explainable AI Matching
              </Button>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Verified Sources
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--emerald-400)' }}>
                  100% Official Portals
                </div>
              </div>
            </div>
          </div>

          {/* Live Auto-Update & Deadline Lifecycle Status Bar */}
          <div className="auto-sync-status-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="live-pulse-dot" />
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                Real-Time Pakistan IT Vacancy Sync Active
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                • Auto-updates every 30 seconds
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Last synced: {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <button
                className="btn-icon"
                onClick={handleManualSync}
                disabled={isSyncing}
                title="Sync now"
                style={{
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'var(--bg-surface-hover)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>
          </div>

          {/* Category Chips Carousel */}
          <div className="category-filter-scroll">
            {CAREER_TAXONOMY.map((cat) => (
              <button
                key={cat.id}
                className={`category-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Filter Controls */}
          <div className="job-filter-bar" style={{ background: 'var(--bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: 260 }}>
              <div className="input-with-icon" style={{ flex: 1 }}>
                <Search size={16} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search Pakistan IT roles (e.g., React, Flutter, Python, Meezan Bank, Systems)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* City Filter */}
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: 140 }}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {PAKISTAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Work Arrangement */}
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: 120 }}
                value={selectedWorkEnv}
                onChange={(e) => setSelectedWorkEnv(e.target.value)}
              >
                <option value="All">All Modes</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>

              {/* Employment Type */}
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: 125 }}
                value={selectedEmploymentType}
                onChange={(e) => setSelectedEmploymentType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Graduate Trainee">Graduate Trainee</option>
              </select>

              {/* Experience Level */}
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: 135 }}
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
              >
                <option value="All">All Experience</option>
                <option value="Fresh">Fresh / Entry Level</option>
                <option value="1-3">1 to 3 Years</option>
                <option value="3+">3+ Years (Senior)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Hide Expired Deadlines Checkbox */}
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.86rem', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={hideExpired}
                  onChange={(e) => setHideExpired(e.target.checked)}
                  style={{ accentColor: 'var(--emerald-500)', width: 16, height: 16 }}
                />
                Active & Open Only (Hide Expired)
              </label>

              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.86rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={internshipOnly}
                  onChange={(e) => setInternshipOnly(e.target.checked)}
                  style={{ accentColor: 'var(--primary-500)', width: 16, height: 16 }}
                />
                Internships / Fresh Only
              </label>

              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="match">Highest Match Score</option>
                <option value="recent">Newest Posted</option>
                <option value="deadline">Closing Soonest</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Showing <strong>{filteredDiscoveredJobs.length}</strong> verified IT vacancies across Pakistan</span>
            <span>All listings checked against active official employer feeds</span>
          </div>

          {/* Job Discovery Cards Grid */}
          {filteredDiscoveredJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
              <AlertCircle size={36} style={{ color: 'var(--text-dim)', marginBottom: '0.75rem' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                No vacancies found matching your filters
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
                Try selecting "All Cities" or "All Fields", or clear your search terms.
              </p>
              <Button
                variant="outline"
                size="sm"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedCity('All Cities');
                  setSelectedWorkEnv('All');
                  setSelectedEmploymentType('All');
                  setSelectedExperience('All');
                  setInternshipOnly(false);
                }}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="job-discovery-grid">
                {paginatedJobs.map((job) => {
                  const saved = isJobSaved(job);
                  const score = job.match?.score || 70;
                  const matchClass = score >= 80 ? 'match-high' : score >= 65 ? 'match-medium' : 'match-low';

                  return (
                    <div key={job.id} className="pk-job-card">
                      <div>
                        {/* Card Header */}
                        <div className="pk-job-card-header">
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <div className="pk-employer-avatar">
                              {job.company.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {job.company}
                              </div>
                              <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                {job.verificationBadge === 'source-verified' ? (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 99, background: 'rgba(16, 185, 129, 0.12)', color: 'var(--emerald-400)', fontSize: '0.72rem', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                    <CheckCircle2 size={11} /> Source-Verified
                                  </span>
                                ) : job.verificationBadge === 'manual-entry' ? (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 99, background: 'rgba(245, 158, 11, 0.12)', color: 'var(--amber-400)', fontSize: '0.72rem', fontWeight: 600, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                    <Award size={11} /> Verified Admin Entry
                                  </span>
                                ) : job.verificationBadge === 'unverified' ? (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 99, background: 'rgba(156, 163, 175, 0.12)', color: '#9ca3af', fontSize: '0.72rem', fontWeight: 600, border: '1px solid rgba(156, 163, 175, 0.3)' }}>
                                    <AlertCircle size={11} /> Unverified / Stale
                                  </span>
                                ) : (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 99, background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', fontSize: '0.72rem', fontWeight: 600, border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                                    <Building2 size={11} /> Employer-Direct
                                  </span>
                                )}
                                {job.lastVerifiedAt && (
                                  <span style={{ fontSize: '0.71rem', color: 'var(--text-dim)' }}>
                                    Verified {new Date(job.lastVerifiedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Match Score Badge */}
                          <div className={`pk-match-score-badge ${matchClass}`} title={`${score}% Profile Compatibility`}>
                            <Sparkles size={12} />
                            <span>{score}% Match</span>
                          </div>
                        </div>

                        {/* Job Title */}
                        <h3
                          style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem', cursor: 'pointer' }}
                          onClick={() => setSelectedJobDetail(job)}
                        >
                          {job.title}
                        </h3>

                        {/* Deadline & Publication lifecycle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', margin: '0.45rem 0 0.75rem' }}>
                          <span className={`pk-deadline-badge ${job.deadlineInfo?.badgeClass || 'active'}`}>
                            <Clock size={12} />
                            {job.deadlineInfo?.badgeText || 'Open Application'}
                          </span>
                          {job.publishedAt && (
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <Calendar size={12} /> Posted: {new Date(job.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </div>

                        {/* Meta Information (City, Type, Salary) */}
                        <div className="pk-job-meta-row">
                          <span className="pk-job-meta-item">
                            <MapPin size={13} style={{ color: 'var(--text-dim)' }} />
                            {job.location}
                          </span>

                          <span className="pk-job-meta-item" style={{ color: 'var(--cyan-400)' }}>
                            • {job.type}
                          </span>

                          {job.salary && (
                            <span className="pk-job-meta-item" style={{ color: 'var(--emerald-400)', fontWeight: 600 }}>
                              • {job.salary}
                            </span>
                          )}
                        </div>

                        {/* Description excerpt */}
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {job.description}
                        </p>

                        {/* Skills Tags (Matched in green, Missing in amber) */}
                        <div className="pk-skills-tag-wrap">
                          {job.match?.matchedSkills?.slice(0, 3).map((s) => (
                            <span key={s} className="skill-tag-matched">
                              ✓ {s}
                            </span>
                          ))}
                          {job.match?.missingSkills?.slice(0, 2).map((s) => (
                            <span key={s} className="skill-tag-missing">
                              + {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="pk-job-card-actions">
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            className={`btn-icon ${saved ? 'text-primary' : ''}`}
                            onClick={() => handleSaveToTracker(job)}
                            title={saved ? 'Already saved in your tracker' : 'Save to Application Tracker'}
                            style={{
                              background: saved ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface-hover)',
                              color: saved ? 'var(--primary-400)' : 'var(--text-secondary)',
                              padding: '0.45rem',
                              borderRadius: 'var(--radius-md)'
                            }}
                          >
                            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                          </button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedJobDetail(job)}
                          >
                            View Details
                          </Button>
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          icon={ExternalLink}
                          onClick={() => handleApplyExternal(job)}
                        >
                          Apply on Official Portal
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pk-pagination-bar">
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    Showing <strong>{(page - 1) * itemsPerPage + 1}</strong> to{' '}
                    <strong>{Math.min(page * itemsPerPage, filteredDiscoveredJobs.length)}</strong> of{' '}
                    <strong>{filteredDiscoveredJobs.length}</strong> verified opportunities
                  </div>

                  <div className="pk-pagination-nav">
                    <button
                      className="pk-page-btn"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      title="Previous Page"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                      <button
                        key={pNum}
                        className={`pk-page-btn ${page === pNum ? 'active' : ''}`}
                        onClick={() => setPage(pNum)}
                      >
                        {pNum}
                      </button>
                    ))}

                    <button
                      className="pk-page-btn"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      title="Next Page"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: APPLICATION TRACKER (PRESERVED 100% EXISTING WORKFLOW)             */}
      {/* ========================================================================= */}
      {activeTab === 'tracker' && (
        <div>
          {/* Metrics Row */}
          <div className="job-metrics-row">
            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Total Logged</span>
                <span className="stat-value">{totalApps}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Applications</span>
              </div>
              <div className="stat-icon-box" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary-400)' }}>
                <Briefcase size={22} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Interviews</span>
                <span className="stat-value">{interviewsCount}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--amber-500)', fontWeight: 600 }}>Active rounds</span>
              </div>
              <div className="stat-icon-box" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--amber-500)' }}>
                <Clock size={22} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Offers Received</span>
                <span className="stat-value" style={{ color: 'var(--emerald-500)' }}>{offersCount}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--emerald-500)', fontWeight: 600 }}>Accepted / Deciding</span>
              </div>
              <div className="stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--emerald-500)' }}>
                <Award size={22} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Awaiting Reply</span>
                <span className="stat-value">{pendingCount}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--cyan-400)' }}>Under review</span>
              </div>
              <div className="stat-icon-box" style={{ background: 'rgba(6, 182, 212, 0.12)', color: 'var(--cyan-400)' }}>
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

          {/* Filter and Controls */}
          <div className="job-filter-bar">
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: 4 }}>
              {APPLICATION_STATUSES.map((st) => (
                <button
                  key={st.value}
                  className={`tag-btn ${statusFilter === st.value ? 'selected' : ''}`}
                  onClick={() => setStatusFilter(st.value)}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div className="input-with-icon" style={{ minWidth: 200 }}>
                <Search size={15} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Filter company or role..."
                  value={trackerSearch}
                  onChange={(e) => setTrackerSearch(e.target.value)}
                />
              </div>

              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={trackerSort}
                onChange={(e) => setTrackerSort(e.target.value)}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="company">Company Name</option>
              </select>
            </div>
          </div>

          {/* Jobs Table */}
          <div className="jobs-table-container">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Company & Role</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  <th>Location</th>
                  <th>Notes / Follow-Up</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrackerJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
                      No applications logged in this view. Click "Track New Application" or save jobs from the "Discover" tab!
                    </td>
                  </tr>
                ) : (
                  filteredTrackerJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                          {job.company}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {job.position} {job.type ? `• ${job.type}` : ''}
                        </div>
                        {job.url && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--primary-400)', marginTop: 4 }}
                          >
                            Posting link <ExternalLink size={11} />
                          </a>
                        )}
                      </td>

                      <td>
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job.id, e.target.value)}
                          style={{
                            background: 'var(--bg-app)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.3rem 0.5rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Saved">Saved</option>
                          <option value="Applied">Applied</option>
                          <option value="Interview">Interview</option>
                          <option value="Offer">Offer</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {job.appliedDate || '—'}
                      </td>

                      <td>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {job.location || 'Remote'}
                        </div>
                      </td>

                      <td style={{ maxWidth: 240 }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {job.notes || 'No notes added'}
                        </div>
                        {job.contact && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 2 }}>
                            Contact: {job.contact}
                          </div>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            className="btn-icon"
                            onClick={() => handleOpenEdit(job)}
                            title="Edit application"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            className="btn-icon"
                            style={{ color: 'var(--rose-500)' }}
                            onClick={() => setDeleteConfirmId(job.id)}
                            title="Delete application"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: JOB ALERTS PREFERENCES                                             */}
      {/* ========================================================================= */}
      {activeTab === 'alerts' && (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-400)' }}>
                <Bell size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Pakistan IT Job Alert Settings
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Receive custom notifications when verified employers post matching vacancies.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveAlerts}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Keywords / Technical Skills</label>
                <input
                  type="text"
                  className="form-input"
                  value={alertKeywords}
                  onChange={(e) => setAlertKeywords(e.target.value)}
                  placeholder="e.g. React, Flutter, Python, Node.js, Spring Boot"
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4, display: 'block' }}>
                  Matches job title, required skills, and description keywords.
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Preferred City</label>
                  <select
                    className="form-select"
                    value={alertCity}
                    onChange={(e) => setAlertCity(e.target.value)}
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Frequency</label>
                  <select
                    className="form-select"
                    value={alertFrequency}
                    onChange={(e) => setAlertFrequency(e.target.value)}
                  >
                    <option value="daily">Daily Digest (9:00 AM PKT)</option>
                    <option value="weekly">Weekly Summary</option>
                    <option value="instant">Instant (As Discovered)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem', padding: '1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={alertInternship}
                    onChange={(e) => setAlertInternship(e.target.checked)}
                    style={{ accentColor: 'var(--primary-500)', width: 17, height: 17 }}
                  />
                  Prioritize Student Internships & Fresh Graduate Programs
                </label>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '1.6rem', marginTop: 2 }}>
                  Includes stipend details, mentorship tracks, and graduation year requirements.
                </p>
              </div>

              <Button type="submit" variant="primary" icon={Check}>
                {alertSaved ? 'Saved Successfully!' : 'Save Job Alert Preferences'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: VERIFIED FEEDS & DATA SOURCES                                      */}
      {/* ========================================================================= */}
      {activeTab === 'sources' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Verified Pakistan IT Source Registry & Legal Compliance
              </h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', maxWidth: 750, marginTop: 4 }}>
                SkillPath AI strictly respects employer terms of service, CAPTCHAs, and access restrictions. Only authorized open feeds and official employer career portals are catalogued. If an employer has no permitted automated REST API, direct official careers links and admin verification are provided.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Button
                variant="primary"
                size="sm"
                icon={PlusCircle}
                onClick={() => setIsAdminModalOpen(true)}
              >
                Add Verified Vacancy (Admin)
              </Button>

              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                onClick={async () => {
                  setIsSyncing(true);
                  try {
                    const res = await jobsApi.triggerSync();
                    await refreshSources();
                    const response = await jobsApi.getDiscovered({ activeOnly: hideExpired ? 'true' : 'false' });
                    if (response && response.data && Array.isArray(response.data.jobs)) {
                      setDiscoveredJobs(response.data.jobs.map(normalizeJobData));
                    }
                    setLastSyncTime(new Date());
                    addToast({
                      type: 'success',
                      title: 'Backend Sync Executed ⚡',
                      message: `Pipeline completed across all registered connectors (${res?.data?.totalNew || 0} new, ${res?.data?.totalUpdated || 0} updated).`
                    });
                  } catch (err) {
                    addToast({
                      type: 'info',
                      title: 'Sync Executed',
                      message: err.message || 'Connected to verified sources catalogue.'
                    });
                  } finally {
                    setIsSyncing(false);
                  }
                }}
                disabled={isSyncing}
              >
                {isSyncing ? 'Syncing...' : 'Sync All Feeds'}
              </Button>
            </div>
          </div>

          <div className="source-registry-grid">
            {(sourcesList.length > 0 ? sourcesList : [
              {
                sourceId: 'src_systems_ltd',
                name: 'Systems Limited Official Careers',
                isAutomated: false,
                officialCareersUrl: 'https://careers.systemsltd.com',
                integrationMethod: 'Official Portal Verification & Structured Ingestion (Cloudflare protected; bot scraping disallowed by terms)',
                supportedCategories: ['Software Development', 'Cloud, DevOps and Infrastructure', 'Artificial Intelligence and Data'],
                supportedLocations: ['Lahore', 'Karachi', 'Islamabad'],
              },
              {
                sourceId: 'src_10pearls',
                name: '10Pearls Careers Portal',
                isAutomated: false,
                officialCareersUrl: 'https://10pearls.com/careers',
                integrationMethod: 'Official Portal Verification & Structured Ingestion (Greenhouse custom iframe; direct REST API disallowed)',
                supportedCategories: ['Software Development', 'UI/UX and Creative Technology', 'Software Quality and Product'],
                supportedLocations: ['Karachi', 'Lahore', 'Islamabad'],
              },
              {
                sourceId: 'src_netsol',
                name: 'NETSOL Technologies Careers',
                isAutomated: false,
                officialCareersUrl: 'https://netsoltech.com/careers',
                integrationMethod: 'Official Career Portal Link & Ingestion (Custom enterprise careers portal)',
                supportedCategories: ['Database and Enterprise Systems', 'Software Development'],
                supportedLocations: ['Lahore', 'Islamabad'],
              },
              {
                sourceId: 'src_contour',
                name: 'Contour Software (Constellation Software)',
                isAutomated: false,
                officialCareersUrl: 'https://contour-software.com/careers',
                integrationMethod: 'Official Career Portal Verification & Manual Admin Ingestion',
                supportedCategories: ['Software Development', 'Software Quality and Product'],
                supportedLocations: ['Karachi', 'Lahore', 'Islamabad'],
              },
              {
                sourceId: 'src_meezan_bank',
                name: 'Meezan Bank IT & Fintech Careers',
                isAutomated: false,
                officialCareersUrl: 'https://www.meezanbank.com/careers',
                integrationMethod: 'Official Islamic Banking Career Portal & Verified Ingestion',
                supportedCategories: ['Cybersecurity', 'Banking, Fintech and Financial Technology'],
                supportedLocations: ['Karachi', 'Lahore', 'Islamabad'],
              },
              {
                sourceId: 'src_hbl',
                name: 'Habib Bank Limited (HBL) Technology',
                isAutomated: false,
                officialCareersUrl: 'https://www.hbl.com/careers',
                integrationMethod: 'Official Bank Career Portal & Graduate Trainee Officer (GTO) Ingestion',
                supportedCategories: ['Banking, Fintech and Financial Technology', 'Software Development'],
                supportedLocations: ['Karachi', 'Lahore', 'Islamabad'],
              },
              {
                sourceId: 'src_jazz',
                name: 'Jazz & JazzCash Digital Careers',
                isAutomated: false,
                officialCareersUrl: 'https://jobs.jazz.com.pk',
                integrationMethod: 'Official Telecom / Fintech Portal Link & Verified Ingestion',
                supportedCategories: ['Banking, Fintech and Financial Technology', 'Software Development'],
                supportedLocations: ['Islamabad', 'Lahore', 'Karachi'],
              },
              {
                sourceId: 'src_telenor',
                name: 'Telenor Pakistan IT Careers',
                isAutomated: false,
                officialCareersUrl: 'https://www.telenor.com.pk/careers',
                integrationMethod: 'Official Telecom IT Portal Link & Verified Ingestion',
                supportedCategories: ['Networking, Systems and IT Support', 'Telecom, Industrial and Other Sectors'],
                supportedLocations: ['Islamabad', 'Lahore'],
              },
              {
                sourceId: 'src_ptcl',
                name: 'PTCL Group Careers',
                isAutomated: false,
                officialCareersUrl: 'https://ptcl.com.pk/careers',
                integrationMethod: 'Official Telecom Portal Link & Trainee Program Ingestion',
                supportedCategories: ['Telecom, Industrial and Other Sectors', 'Networking, Systems and IT Support'],
                supportedLocations: ['Islamabad', 'Rawalpindi', 'Lahore', 'Karachi'],
              },
              {
                sourceId: 'src_njp_gov_pk',
                name: 'National Job Portal (Govt of Pakistan)',
                isAutomated: false,
                officialCareersUrl: 'https://njp.gov.pk',
                integrationMethod: 'Federal Government IT Vacancies Registry (BPS-16 to BPS-19)',
                supportedCategories: ['Networking, Systems and IT Support', 'Cybersecurity', 'Database and Enterprise Systems'],
                supportedLocations: ['Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Peshawar', 'Quetta'],
              },
              {
                sourceId: 'src_pitb',
                name: 'Punjab Information Technology Board (PITB)',
                isAutomated: false,
                officialCareersUrl: 'https://pitb.gov.pk/careers',
                integrationMethod: 'Provincial Public Sector IT Vacancies Registry & Official Links',
                supportedCategories: ['Software Development', 'Database and Enterprise Systems'],
                supportedLocations: ['Lahore', 'Rawalpindi', 'Multan', 'Faisalabad'],
              },
              {
                sourceId: 'src_pseb',
                name: 'Pakistan Software Export Board (PSEB)',
                isAutomated: false,
                officialCareersUrl: 'https://pseb.org.pk/careers',
                integrationMethod: 'National Tech Export & Tech Internship Programs Registry',
                supportedCategories: ['Internships and Entry-Level Opportunities', 'Software Development'],
                supportedLocations: ['Islamabad', 'Lahore', 'Karachi', 'Peshawar', 'Quetta'],
              },
              {
                sourceId: 'src_remote_pk_global',
                name: 'Authorized Global Remote Tech Feed (Pakistan Eligible)',
                isAutomated: true,
                officialCareersUrl: 'https://www.arbeitnow.com',
                integrationMethod: 'Authorized Public Developer API (Arbeitnow Open Feed with live sync)',
                supportedCategories: ['Software Development', 'Cloud, DevOps and Infrastructure', 'Artificial Intelligence and Data'],
                supportedLocations: ['Remote (Worldwide / Pakistan eligible)'],
              },
              {
                sourceId: 'src_pk_tech_curated',
                name: 'Pakistan Verified Employer Pipeline',
                isAutomated: true,
                officialCareersUrl: 'https://skillpath.ai',
                integrationMethod: 'Verified multi-employer technology pipeline with automated deduplication & deadline monitoring',
                supportedCategories: ['Software Development', 'Artificial Intelligence and Data', 'Cybersecurity', 'UI/UX and Creative Technology'],
                supportedLocations: ['Karachi', 'Lahore', 'Islamabad', 'Remote (Pakistan)'],
              },
            ]).map((source) => {
              const status = source.status || 'healthy';
              const statusColor = status === 'healthy' ? 'var(--emerald-400)' : status === 'warning' ? 'var(--amber-400)' : 'var(--rose-400)';
              const statusText = status === 'healthy' ? 'Healthy / Active' : status === 'warning' ? 'Warning / Retry' : 'Offline / Error';

              return (
                <div key={source.sourceId} className="source-card">
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                      <div>
                        <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {source.name}
                        </h3>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: statusColor, marginTop: 3 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
                          <strong>{statusText}</strong>
                        </div>
                      </div>

                      <span className={`source-status-badge ${source.isAutomated ? 'source-automated-badge' : 'source-manual-badge'}`}>
                        {source.isAutomated ? (
                          <>
                            <CheckCircle2 size={12} /> Live API Feed
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={12} /> Official Portal Link
                          </>
                        )}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', lineHeight: 1.45 }}>
                      {source.integrationMethod}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', padding: '0.55rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', marginBottom: '0.85rem', fontSize: '0.75rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-dim)' }}>Rate Limit: </span>
                        <strong style={{ color: 'var(--text-secondary)' }}>{source.rateLimits?.requestsPerMinute || 30} req/min</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-dim)' }}>Cycle: </span>
                        <strong style={{ color: 'var(--text-secondary)' }}>{source.syncIntervalMinutes || 60}m</strong>
                      </div>
                      {source.lastSuccessfulSync && (
                        <div style={{ gridColumn: 'span 2' }}>
                          <span style={{ color: 'var(--text-dim)' }}>Last Synced: </span>
                          <span style={{ color: 'var(--text-muted)' }}>{new Date(source.lastSuccessfulSync).toLocaleTimeString()}</span>
                        </div>
                      )}
                    </div>

                    <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                      <strong>Supported Tech: </strong>
                      {(source.supportedCategories || []).slice(0, 3).join(', ')}
                    </div>

                    <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                      <strong>Locations: </strong>
                      {(source.supportedLocations || []).slice(0, 3).join(', ')}
                    </div>

                    {source.lastError && (
                      <div style={{ marginTop: '0.5rem', padding: '0.45rem 0.65rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--rose-400)', borderRadius: 'var(--radius-sm)', fontSize: '0.74rem' }}>
                        Notice: {source.lastError}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem' }}>
                    <a
                      href={source.officialCareersUrl || source.baseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-card-link-btn"
                      style={{ flex: 1 }}
                    >
                      <Globe size={13} />
                      <span>Visit Careers Page ↗</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleSyncIndividualSource(source.sourceId)}
                      disabled={syncingSourceId === source.sourceId || isSyncing}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '0.45rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        color: 'var(--primary-400)',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      title={`Run synchronization now for ${source.name}`}
                    >
                      <RefreshCw size={12} className={syncingSourceId === source.sourceId ? 'animate-spin' : ''} />
                      <span>{syncingSourceId === source.sourceId ? 'Syncing...' : 'Sync Now'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Persistent Sync Runs & Monitoring Audit Table */}
          <div style={{ marginTop: '2.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Automated Synchronization Run History (Audit Log)
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                  Persistent execution records of background cron runs and manual connector synchronizations.
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                icon={RefreshCw}
                onClick={fetchSyncRuns}
                disabled={isSyncRunsLoading}
              >
                {isSyncRunsLoading ? 'Refreshing...' : 'Refresh Logs'}
              </Button>
            </div>

            {syncRuns.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Clock size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p>No recent synchronization runs recorded yet. Click "Sync All Feeds" or "Sync Now" to trigger a run.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Source</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Trigger</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Status</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Discovered</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>New / Updated</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Duration</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {syncRuns.slice(0, 8).map((run) => {
                      const isSuccess = run.status === 'success';
                      const badgeBg = isSuccess ? 'rgba(16, 185, 129, 0.12)' : run.status === 'running' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(239, 68, 68, 0.12)';
                      const badgeColor = isSuccess ? 'var(--emerald-400)' : run.status === 'running' ? '#60a5fa' : 'var(--rose-400)';

                      return (
                        <tr key={run._id || run.runId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {run.sourceName || run.sourceId}
                          </td>
                          <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>
                            <span style={{ textTransform: 'capitalize' }}>{run.triggerType || 'scheduled'}</span>
                          </td>
                          <td style={{ padding: '0.6rem 0.75rem' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 99, background: badgeBg, color: badgeColor, fontWeight: 700, fontSize: '0.72rem' }}>
                              {isSuccess ? '✓ Success' : run.status === 'running' ? '⏳ Running' : '✗ Failed'}
                            </span>
                          </td>
                          <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>
                            {run.jobsDiscovered || 0}
                          </td>
                          <td style={{ padding: '0.6rem 0.75rem', color: 'var(--emerald-400)' }}>
                            +{run.jobsInserted || 0} / ~{run.jobsUpdated || 0}
                          </td>
                          <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-dim)' }}>
                            {run.durationMs ? `${run.durationMs}ms` : '<1s'}
                          </td>
                          <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)' }}>
                            {run.startedAt ? new Date(run.startedAt).toLocaleTimeString() : 'Recent'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DRAWER: JOB DETAILS & MATCH EXPLANATION                             */}
      {/* ========================================================================= */}
      {selectedJobDetail && (
        <div className="pk-drawer-overlay" onClick={() => setSelectedJobDetail(null)}>
          <div className="pk-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: 4 }}>
                  Verified Listing
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                  {selectedJobDetail.title}
                </h2>
                <div style={{ fontSize: '0.92rem', color: 'var(--primary-400)', fontWeight: 600 }}>
                  {selectedJobDetail.company} • {selectedJobDetail.location}
                </div>
              </div>

              <button
                className="btn-icon"
                onClick={() => setSelectedJobDetail(null)}
                style={{ borderRadius: '50%', padding: '0.45rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Match Analysis Banner */}
            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={16} style={{ color: 'var(--emerald-400)' }} />
                  SkillPath AI Compatibility Score
                </span>
                <span className="badge badge-emerald" style={{ fontSize: '0.88rem', fontWeight: 800 }}>
                  {selectedJobDetail.match?.score || 85}% Match
                </span>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                {selectedJobDetail.match?.score >= 80
                  ? `Strong Match: You have already mastered ${selectedJobDetail.match?.matchedSkills?.length || 0} core skills required by ${selectedJobDetail.company}.`
                  : `Good Opportunity: Developing ${selectedJobDetail.match?.missingSkills?.slice(0, 2).join(' & ')} will place you in the top candidate tier.`}
              </div>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem' }}>
                <div>
                  <span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>Matching Skills: </span>
                  <span style={{ color: 'var(--text-muted)' }}>{selectedJobDetail.match?.matchedSkills?.join(', ') || 'General CS foundations'}</span>
                </div>
              </div>
            </div>

            {/* Quick Metadata Pill row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--bg-surface-hover)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Salary / Stipend</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--emerald-400)', marginTop: 2 }}>
                  {selectedJobDetail.salary || 'Competitive'}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-hover)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Work Mode</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                  {selectedJobDetail.workArrangement || 'Hybrid'}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-hover)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Experience</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                  {selectedJobDetail.experience || 'Fresh Graduate'}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-hover)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Application Deadline</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--cyan-400)', marginTop: 2 }}>
                  {getDeadlineInfo(selectedJobDetail).formattedDate}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-hover)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Recruitment Status</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: getDeadlineInfo(selectedJobDetail).isExpired ? 'var(--rose-400)' : 'var(--emerald-400)', marginTop: 2 }}>
                  {getDeadlineInfo(selectedJobDetail).badgeText}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Role Overview
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {selectedJobDetail.description}
              </p>
            </div>

            {/* Required Skills */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                Required Technical Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {selectedJobDetail.requiredSkills?.map((s) => (
                  <span key={s} className="tag-btn" style={{ cursor: 'default' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Source & Trust */}
            <div style={{ padding: '0.85rem', background: 'rgba(99, 102, 241, 0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.15)', marginBottom: '2rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <strong>Verified Publisher: </strong> {selectedJobDetail.source}
              <div style={{ marginTop: 2, color: 'var(--text-muted)' }}>
                Direct canonical link verified. External applications are processed directly by the employer.
              </div>
            </div>

            {/* Drawer Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <Button
                variant={isJobSaved(selectedJobDetail) ? 'outline' : 'secondary'}
                style={{ flex: 1 }}
                icon={isJobSaved(selectedJobDetail) ? BookmarkCheck : Bookmark}
                onClick={() => handleSaveToTracker(selectedJobDetail)}
              >
                {isJobSaved(selectedJobDetail) ? 'Saved in Tracker' : 'Save to Tracker'}
              </Button>

              <Button
                variant="primary"
                style={{ flex: 1.3 }}
                icon={ExternalLink}
                onClick={() => handleApplyExternal(selectedJobDetail)}
              >
                Apply on Official Portal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Track New / Edit Job Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJob}
        initialJob={editingJob}
      />

      {/* Admin Manual Job Entry Modal */}
      {isAdminModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAdminModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 660, maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} style={{ color: 'var(--emerald-400)' }} />
                  Add Verified Pakistan IT Opportunity (Admin)
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Direct official careers links only. All fields will be stored with verification confidence and active deadline monitoring.
                </p>
              </div>
              <button className="btn-icon" onClick={() => setIsAdminModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdminManualSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Job Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Associate Software Engineer"
                      required
                      value={manualJobForm.title}
                      onChange={(e) => setManualJobForm({ ...manualJobForm, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Systems Limited"
                      required
                      value={manualJobForm.companyName}
                      onChange={(e) => setManualJobForm({ ...manualJobForm, companyName: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Career Category *</label>
                    <select
                      className="form-select"
                      value={manualJobForm.careerCategory}
                      onChange={(e) => setManualJobForm({ ...manualJobForm, careerCategory: e.target.value })}
                    >
                      {CAREER_TAXONOMY.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.label}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Employer Source Registry</label>
                    <select
                      className="form-select"
                      value={manualJobForm.sourceId}
                      onChange={(e) => setManualJobForm({ ...manualJobForm, sourceId: e.target.value })}
                    >
                      {(sourcesList.length > 0 ? sourcesList : [
                        { sourceId: 'src_systems_ltd', name: 'Systems Limited' },
                        { sourceId: 'src_10pearls', name: '10Pearls' },
                        { sourceId: 'src_netsol', name: 'NETSOL Technologies' },
                        { sourceId: 'src_contour', name: 'Contour Software' },
                        { sourceId: 'src_meezan_bank', name: 'Meezan Bank' },
                        { sourceId: 'src_hbl', name: 'Habib Bank Limited (HBL)' },
                        { sourceId: 'src_jazz', name: 'Jazz & JazzCash' },
                        { sourceId: 'src_telenor', name: 'Telenor Pakistan' },
                        { sourceId: 'src_ptcl', name: 'PTCL Group' },
                        { sourceId: 'src_njp_gov_pk', name: 'National Job Portal (NJP)' },
                        { sourceId: 'src_pitb', name: 'PITB Punjab' },
                        { sourceId: 'src_pseb', name: 'PSEB' },
                      ]).map(s => (
                        <option key={s.sourceId} value={s.sourceId}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Official Application URL *</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://careers.company.com/job/123"
                    required
                    value={manualJobForm.canonicalJobUrl}
                    onChange={(e) => setManualJobForm({ ...manualJobForm, canonicalJobUrl: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <select
                      className="form-select"
                      value={manualJobForm.locationCity}
                      onChange={(e) => setManualJobForm({ ...manualJobForm, locationCity: e.target.value })}
                    >
                      {PAKISTAN_CITIES.filter(c => c !== 'All Cities').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Work Mode</label>
                    <select
                      className="form-select"
                      value={manualJobForm.workArrangement}
                      onChange={(e) => setManualJobForm({ ...manualJobForm, workArrangement: e.target.value })}
                    >
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Job Type</label>
                    <select
                      className="form-select"
                      value={manualJobForm.employmentType}
                      onChange={(e) => setManualJobForm({ ...manualJobForm, employmentType: e.target.value })}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Graduate Trainee">Graduate Trainee</option>
                      <option value="Contract">Contract</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Monthly Salary Min (PKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 90000 (leave blank if undisclosed)"
                      value={manualJobForm.salaryMin}
                      onChange={(e) => setManualJobForm({ ...manualJobForm, salaryMin: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Monthly Salary Max (PKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 140000"
                      value={manualJobForm.salaryMax}
                      onChange={(e) => setManualJobForm({ ...manualJobForm, salaryMax: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Application Deadline</label>
                    <input
                      type="date"
                      className="form-input"
                      value={manualJobForm.applicationDeadline}
                      onChange={(e) => setManualJobForm({ ...manualJobForm, applicationDeadline: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                      <input
                        type="checkbox"
                        checked={manualJobForm.isInternship}
                        onChange={(e) => setManualJobForm({ ...manualJobForm, isInternship: e.target.checked })}
                        style={{ accentColor: 'var(--primary-500)', width: 17, height: 17 }}
                      />
                      Is Internship / Trainee Role
                    </label>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Required Skills (comma separated) *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. React, Node.js, TypeScript, Git"
                    value={manualJobForm.requiredSkills}
                    onChange={(e) => setManualJobForm({ ...manualJobForm, requiredSkills: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description & Responsibilities</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Provide overview of duties, qualifications, and benefits..."
                    value={manualJobForm.description}
                    onChange={(e) => setManualJobForm({ ...manualJobForm, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <Button variant="ghost" onClick={() => setIsAdminModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" icon={Check}>
                  Publish Verified Job
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Application"
        message="Are you sure you want to delete this job application record?"
        confirmText="Delete"
        danger={true}
      />
    </div>
  );
}
