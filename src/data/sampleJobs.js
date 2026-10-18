export const INITIAL_JOBS = [
  {
    id: 'job-1',
    company: 'Stripe',
    position: 'Frontend Engineer Intern',
    location: 'Remote (US/Global)',
    type: 'Internship',
    url: 'https://stripe.com/jobs',
    appliedDate: '2026-10-10',
    status: 'Interview', // Saved, Applied, Interview, Offer, Rejected
    salary: '$52 / hr + housing stipend',
    notes: 'Completed technical coding screen on React state management and algorithmic array parsing. Next round: System discussion with hiring manager scheduled for next Wednesday.',
    contact: 'Sarah Chen (Campus Recruiter)',
    priority: 'High'
  },
  {
    id: 'job-2',
    company: 'Vercel',
    position: 'Junior Software Engineer (Developer Experience)',
    location: 'Remote',
    type: 'Full-time Entry',
    url: 'https://vercel.com/careers',
    appliedDate: '2026-10-04',
    status: 'Applied',
    salary: '$95,000 / yr',
    notes: 'Submitted customized CV highlighting open source contributions and Next.js / React projects. Waiting for recruiter review.',
    contact: 'tech-talent@vercel.com',
    priority: 'High'
  },
  {
    id: 'job-3',
    company: 'Spotify',
    position: 'Web Engineering Summer Intern 2027',
    location: 'New York, NY (Hybrid)',
    type: 'Internship',
    url: 'https://spotify.com/students',
    appliedDate: '2026-10-12',
    status: 'Applied',
    salary: '$48 / hr',
    notes: 'Campus recruitment referral link used. Application confirmation email received.',
    contact: 'university-hiring@spotify.com',
    priority: 'Medium'
  },
  {
    id: 'job-4',
    company: 'Linear',
    position: 'Frontend Engineer (Design Systems)',
    location: 'Remote',
    type: 'Full-time Entry',
    url: 'https://linear.app/careers',
    appliedDate: '2026-09-25',
    status: 'Offer',
    salary: '$110,000 / yr + Equity',
    notes: 'Received written offer letter! Decision deadline in 3 weeks. Comparing benefits and remote equipment budget.',
    contact: 'Marcus Lind (VP Engineering)',
    priority: 'High'
  },
  {
    id: 'job-5',
    company: 'Airbnb',
    position: 'Software Engineering Apprentice',
    location: 'San Francisco, CA',
    type: 'Apprenticeship',
    url: 'https://careers.airbnb.com',
    appliedDate: '2026-09-15',
    status: 'Rejected',
    salary: '$45 / hr',
    notes: 'Passed behavioral interview; rejected after final round due to high volume of candidates. Great feedback received on communication skills.',
    contact: 'campus-team@airbnb.com',
    priority: 'Low'
  },
  {
    id: 'job-6',
    company: 'GitHub',
    position: 'Frontend Platform Intern',
    location: 'Remote',
    type: 'Internship',
    url: 'https://github.com/about/careers',
    appliedDate: '2026-10-14',
    status: 'Saved',
    salary: '$50 / hr',
    notes: 'Drafting cover letter focusing on Git CLI experience and React component libraries.',
    contact: 'recruiting@github.com',
    priority: 'High'
  }
];

export const APPLICATION_STATUSES = [
  { value: 'All', label: 'All Statuses', color: 'var(--text-muted)' },
  { value: 'Saved', label: 'Saved', color: '#64748b', bg: '#f1f5f9' },
  { value: 'Applied', label: 'Applied', color: '#0284c7', bg: '#e0f2fe' },
  { value: 'Interview', label: 'Interview', color: '#d97706', bg: '#fef3c7' },
  { value: 'Offer', label: 'Offer', color: '#16a34a', bg: '#dcfce7' },
  { value: 'Rejected', label: 'Rejected', color: '#dc2626', bg: '#fee2e2' }
];
