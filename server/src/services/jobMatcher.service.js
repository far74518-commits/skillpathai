/**
 * SkillPath AI - Production-Ready AI Career Matching Engine
 * Computes explainable compatibility scores, missing skill impact analysis,
 * and personalized learning plans based on real job listings and student profiles.
 */

export const DEFAULT_WEIGHTS = {
  skills: 0.50,
  roleRelevance: 0.20,
  location: 0.15,
  educationExperience: 0.15,
};

/**
 * Normalizes skill string for robust variant matching (e.g., "node.js" -> "nodejs", "react js" -> "react")
 */
export function normalizeSkill(skill) {
  if (!skill) return '';
  return skill
    .toLowerCase()
    .replace(/[\.\-_\s\/]/g, '')
    .trim();
}

/**
 * Common skill synonym aliases mapping for Pakistani tech market
 */
const SKILL_ALIASES = {
  'nodejs': ['node', 'express', 'expressjs'],
  'react': ['reactjs', 'reactnative'],
  'postgres': ['postgresql', 'psql'],
  'mongo': ['mongodb'],
  'k8s': ['kubernetes'],
  'ts': ['typescript'],
  'js': ['javascript', 'ecmascript'],
  'dotnet': ['csharp', 'c#', 'aspnet', 'aspnetcore'],
  'aws': ['amazonwebservices', 'cloud'],
  'docker': ['containers', 'containerization'],
  'git': ['github', 'gitlab', 'versioncontrol'],
  'python': ['fastapi', 'django', 'flask'],
  'ml': ['machinelearning', 'ai', 'artificialintelligence'],
};

/**
 * Checks if a candidate skill matches a job requirement using fuzzy synonym rules
 */
function isSkillMatch(candidateSkillNorm, jobSkillNorm) {
  if (!candidateSkillNorm || !jobSkillNorm) return false;
  if (candidateSkillNorm === jobSkillNorm) return true;
  if (candidateSkillNorm.includes(jobSkillNorm) || jobSkillNorm.includes(candidateSkillNorm)) return true;

  // Check aliases
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    const isCandInGroup = candidateSkillNorm === canonical || aliases.includes(candidateSkillNorm);
    const isJobInGroup = jobSkillNorm === canonical || aliases.includes(jobSkillNorm);
    if (isCandInGroup && isJobInGroup) return true;
  }

  return false;
}

/**
 * Computes transparent, explainable match score and diagnostics for a job given a student/user profile
 * @param {Object} job - The job document or object from real database
 * @param {Object} userProfile - The user profile object with skills, education, experience, and goals
 * @param {Object} customWeights - Optional weight overrides
 */
export function calculateJobMatch(job, userProfile = {}, customWeights = DEFAULT_WEIGHTS) {
  const profile = userProfile || {};

  // Extract candidate skills (from profile.existingSkills, profile.skills, or tracked skills)
  let rawUserSkills = [];
  if (Array.isArray(profile.existingSkills)) {
    rawUserSkills.push(...profile.existingSkills);
  }
  if (Array.isArray(profile.skills)) {
    rawUserSkills.push(...profile.skills.map((s) => (typeof s === 'string' ? s : s?.name || '')));
  }
  rawUserSkills = rawUserSkills.filter(Boolean);

  const candidateSkills = Array.from(new Set(rawUserSkills.map(normalizeSkill)));
  const jobRequired = (job.requiredSkills || []).map(normalizeSkill);
  const jobPreferred = (job.preferredSkills || []).map(normalizeSkill);

  // If candidate has 0 skills and empty profile, return clean empty state
  if (candidateSkills.length === 0 && (!profile.targetCareer && !profile.degree)) {
    return {
      matchScore: 20,
      matchingSkills: [],
      missingSkills: job.requiredSkills || [],
      scoreBreakdown: {
        skillsScore: 0,
        roleScore: 30,
        locationScore: 50,
        experienceScore: 50,
      },
      relevanceExplanation: `Add your technical skills and education details to unlock accurate personalized matching for ${job.title} at ${job.companyName || job.company}.`,
      recommendedActions: [
        'Add your programming languages and frameworks in the Skills Matrix.',
        'Complete the AI Career Assessment to configure your target career path.',
      ],
      eligibilityConfidence: 'Needs Profile Setup',
    };
  }

  // 1. Core Skills Match
  const matchingSkills = [];
  const missingSkills = [];

  (job.requiredSkills || []).forEach((origSkill, idx) => {
    const norm = jobRequired[idx];
    const isMatch = candidateSkills.some((cs) => isSkillMatch(cs, norm));
    if (isMatch) {
      matchingSkills.push(origSkill);
    } else {
      missingSkills.push(origSkill);
    }
  });

  const reqCount = jobRequired.length || 1;
  const reqMatchRatio = matchingSkills.length / reqCount;

  // Preferred skills bonus (up to +10%)
  const matchedPreferred = (job.preferredSkills || []).filter((origSkill, idx) => {
    const norm = jobPreferred[idx];
    return candidateSkills.some((cs) => isSkillMatch(cs, norm));
  });
  const prefBonus = jobPreferred.length > 0 ? (matchedPreferred.length / jobPreferred.length) * 0.1 : 0.05;

  const rawSkillsScore = Math.min(1.0, reqMatchRatio + prefBonus);

  // 2. Role / Target Career & Career Goals Relevance
  let roleScore = 0.5; // baseline moderate
  const targetCareer = (profile.targetCareer || '').toLowerCase();
  const careerGoals = (profile.careerGoals || '').toLowerCase();
  const jobCategory = (job.careerCategory || '').toLowerCase();
  const jobTitle = (job.title || '').toLowerCase();

  const roleText = `${targetCareer} ${careerGoals}`;

  if (roleText.includes('frontend') && (jobCategory.includes('software') || jobTitle.includes('frontend') || jobTitle.includes('react') || jobTitle.includes('web'))) {
    roleScore = 1.0;
  } else if (roleText.includes('backend') && (jobTitle.includes('backend') || jobTitle.includes('node') || jobTitle.includes('python') || jobTitle.includes('java') || jobTitle.includes('.net'))) {
    roleScore = 1.0;
  } else if (roleText.includes('fullstack') && (jobTitle.includes('fullstack') || jobTitle.includes('full-stack') || jobCategory.includes('software'))) {
    roleScore = 1.0;
  } else if (roleText.includes('ai') || roleText.includes('data') || roleText.includes('machine learning')) {
    if (jobCategory.includes('intelligence') || jobCategory.includes('data') || jobTitle.includes('machine learning') || jobTitle.includes('data')) {
      roleScore = 1.0;
    }
  } else if (roleText.includes('cyber') && jobCategory.includes('cyber')) {
    roleScore = 1.0;
  } else if ((roleText.includes('cloud') || roleText.includes('devops')) && (jobCategory.includes('cloud') || jobCategory.includes('devops'))) {
    roleScore = 1.0;
  } else if (roleText.includes('fintech') && (jobCategory.includes('fintech') || jobCategory.includes('banking'))) {
    roleScore = 1.0;
  } else if (jobTitle.includes(targetCareer) || targetCareer.includes(jobTitle)) {
    roleScore = 0.9;
  }

  // 3. Location & Work Arrangement Compatibility
  let locationScore = 0.7;
  const userCity = (profile.preferredCity || profile.location || '').toLowerCase();
  const jobCity = (job.locationCity || '').toLowerCase();
  const userWorkEnv = (profile.preferredWorkEnvironment || 'Any').toLowerCase();
  const jobArrangement = (job.workArrangement || '').toLowerCase();

  if (jobArrangement === 'remote' || jobCity.includes('remote')) {
    locationScore = 1.0;
  } else if (userCity && jobCity.includes(userCity)) {
    locationScore = 1.0;
  } else if (userWorkEnv === 'any' || userWorkEnv === jobArrangement) {
    locationScore = 0.85;
  } else {
    locationScore = 0.55;
  }

  // 4. Education & Experience Compatibility
  let eduExpScore = 0.8;
  const currentYear = new Date().getFullYear();
  const gradYearNum = parseInt(profile.gradYear, 10);
  const isFreshOrStudent = (gradYearNum && gradYearNum >= currentYear - 1) ||
    profile.educationLevel?.toLowerCase().includes('bachelor') ||
    profile.experienceLevel?.toLowerCase().includes('entry') ||
    profile.experienceLevel?.toLowerCase().includes('fresh');

  if (job.isInternship && isFreshOrStudent) {
    eduExpScore = 1.0;
  } else if (job.experienceMin <= 1 && isFreshOrStudent) {
    eduExpScore = 0.95;
  } else if (job.experienceMin > 2 && isFreshOrStudent) {
    eduExpScore = 0.65; // Eligible to stretch, but requires extra preparation
  }

  // Weighted total score
  const totalScore =
    rawSkillsScore * customWeights.skills +
    roleScore * customWeights.roleRelevance +
    locationScore * customWeights.location +
    eduExpScore * customWeights.educationExperience;

  const matchPercentage = Math.round(Math.max(15, Math.min(99, totalScore * 100)));

  // Score breakdown for transparent UI visualization
  const scoreBreakdown = {
    skillsScore: Math.round(rawSkillsScore * 100),
    roleScore: Math.round(roleScore * 100),
    locationScore: Math.round(locationScore * 100),
    experienceScore: Math.round(eduExpScore * 100),
  };

  // Generate actionable explanation and recommended steps
  let relevanceExplanation = '';
  const recommendedActions = [];
  const compName = job.companyName || job.company || 'the employer';

  if (matchPercentage >= 80) {
    relevanceExplanation = `Excellent Match (${matchPercentage}%): You satisfy ${matchingSkills.length} of ${reqCount} core requirements for ${job.title} at ${compName}. Your background strongly aligns with this vacancy.`;
    if (missingSkills.length > 0) {
      recommendedActions.push(`Brush up on ${missingSkills.slice(0, 2).join(', ')} to stand out in the technical interview.`);
    }
    recommendedActions.push(`Review the job requirements and submit your application on the official portal.`);
  } else if (matchPercentage >= 60) {
    relevanceExplanation = `Promising Match (${matchPercentage}%): You possess a solid foundation with ${matchingSkills.length} matching skills, but adding ${missingSkills.slice(0, 2).join(' and ')} will make you a top-tier candidate.`;
    recommendedActions.push(`Add ${missingSkills.slice(0, 2).join(' & ')} to your learning plan.`);
    recommendedActions.push(`Build a demonstrable project highlighting ${matchingSkills[0] || 'core technologies'}.`);
  } else {
    relevanceExplanation = `Growth Opportunity (${matchPercentage}%): This role seeks specialization in ${missingSkills.slice(0, 3).join(', ')}. Complete targeted roadmap stages to close these gaps.`;
    recommendedActions.push(`Start with foundational modules in ${missingSkills[0] || 'the required technologies'}.`);
  }

  return {
    matchScore: matchPercentage,
    matchingSkills,
    missingSkills,
    scoreBreakdown,
    relevanceExplanation,
    recommendedActions,
    eligibilityConfidence: matchPercentage >= 75 ? 'High' : matchPercentage >= 50 ? 'Medium' : 'Needs Preparation',
  };
}

/**
 * Computes high-leverage missing skills impact analysis and generates a structured
 * 3-stage Personalized Learning Plan across the candidate's top matched vacancies.
 */
export function generateCareerMatchingInsights(jobsWithMatch = [], userProfile = {}) {
  const profile = userProfile || {};
  const missingSkillFrequency = {};
  const relevantJobs = jobsWithMatch.filter((j) => (j.match?.matchScore || 0) >= 35);

  relevantJobs.forEach((j) => {
    (j.match?.missingSkills || []).forEach((skill) => {
      const clean = skill.trim();
      missingSkillFrequency[clean] = (missingSkillFrequency[clean] || 0) + 1;
    });
  });

  // Rank missing skills by demand frequency across matched jobs
  const topMissingSkills = Object.entries(missingSkillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill, count]) => {
      const boost = Math.min(25, Math.round((count / Math.max(1, relevantJobs.length)) * 30 + 5));
      return {
        skill,
        jobDemandCount: count,
        estimatedScoreBoost: `+${boost}%`,
        recommendation: `Appears in ${count} of your matched vacancies. Mastering ${skill} can boost your match by up to +${boost}%.`,
      };
    });

  // Target career and primary skill gaps for learning roadmap formulation
  const primaryGaps = topMissingSkills.map((s) => s.skill).slice(0, 3);
  const gap1 = primaryGaps[0] || 'Modern Cloud Architecture';
  const gap2 = primaryGaps[1] || 'Automated Testing & CI/CD';
  const gap3 = primaryGaps[2] || 'Production Performance Tuning';

  const weeklyHours = profile.weeklyLearningHours || 15;

  // Curated learning resources with verified URLs
  const curatedResources = [
    {
      title: 'Official Documentation & Guides',
      provider: 'Official Open Source Docs',
      url: 'https://developer.mozilla.org',
      type: 'Documentation',
      topics: [gap1, 'System Architecture'],
    },
    {
      title: 'Full-Stack Open (University of Helsinki)',
      provider: 'University of Helsinki',
      url: 'https://fullstackopen.com',
      type: 'Interactive Course',
      topics: ['React', 'Node.js', 'REST APIs', 'PostgreSQL', 'Testing'],
    },
    {
      title: 'Docker & Microservices Mastery',
      provider: 'Docker Official Community',
      url: 'https://docs.docker.com/get-started',
      type: 'Practical Hands-on',
      topics: ['Docker', 'Containers', 'CI/CD Pipelines'],
    },
    {
      title: 'Roadmap.sh Software Engineering Guides',
      provider: 'Roadmap.sh',
      url: 'https://roadmap.sh',
      type: 'Visual Roadmaps',
      topics: ['Backend', 'Frontend', 'DevOps', 'Cybersecurity'],
    },
  ];

  // Estimated learning time
  const totalEstimatedHours = 45;
  const estimatedWeeks = Math.max(2, Math.ceil(totalEstimatedHours / Math.max(5, weeklyHours)));

  const learningPlan = {
    targetRole: profile.targetCareer || 'Software Engineer',
    weeklyCommitmentHours: weeklyHours,
    estimatedWeeksToQualify: estimatedWeeks,
    summary: `Structured ${estimatedWeeks}-week learning strategy to bridge ${primaryGaps.length} critical skill gaps and maximize interview qualifications for Pakistani IT roles.`,
    milestones: [
      {
        stage: 1,
        title: `Foundations: ${gap1} Core Concepts`,
        duration: `${Math.round(estimatedWeeks * 0.35)} weeks (${Math.round(totalEstimatedHours * 0.35)} hrs)`,
        focusSkills: [gap1],
        description: `Deep dive into the architecture, fundamentals, and syntax of ${gap1}. Understand production design patterns and core APIs.`,
        checklist: [
          `Read core architectural specifications and official guides for ${gap1}`,
          `Implement 3 self-contained exercise scripts solving real-world data flow problems`,
          `Write unit test coverage verifying edge cases and error handling`,
        ],
      },
      {
        stage: 2,
        title: `Integration: ${gap2} & Automated Verification`,
        duration: `${Math.round(estimatedWeeks * 0.35)} weeks (${Math.round(totalEstimatedHours * 0.35)} hrs)`,
        focusSkills: [gap2],
        description: `Integrate ${gap2} into an existing application pipeline with automated CI/CD checks and database transactions.`,
        checklist: [
          `Connect persistence layer and optimize transactional queries`,
          `Set up automated linting, test suites, and GitHub Actions pipelines`,
          `Benchmark latency and optimize performance under concurrent requests`,
        ],
      },
      {
        stage: 3,
        title: `Portfolio Capstone: Production-Grade Project`,
        duration: `${Math.max(1, Math.round(estimatedWeeks * 0.3))} weeks (${Math.round(totalEstimatedHours * 0.3)} hrs)`,
        focusSkills: [gap1, gap2, gap3],
        description: `Build, containerize, and deploy a full-scale portfolio capstone project tailored to Pakistan employer requirements (e.g. Fintech payments, high-concurrency portal).`,
        checklist: [
          `Architect complete multi-tier solution with comprehensive README and system design diagram`,
          `Containerize application with Docker and deploy to public cloud or Vercel/Render`,
          `Record a 2-minute demo walkthrough and link repository directly on your CV`,
        ],
      },
    ],
    recommendedProject: {
      title: `Full-Stack Enterprise Hub with ${gap1}`,
      description: `A production-ready enterprise application demonstrating authentication, ${gap1} processing, and REST APIs, designed specifically to satisfy requirements of top Pakistani tech employers.`,
      targetSkills: primaryGaps,
    },
    resources: curatedResources,
  };

  return {
    topMissingSkills,
    learningPlan,
  };
}
