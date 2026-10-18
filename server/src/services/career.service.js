export const CAREER_CATALOGUE = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    category: 'Engineering',
    level: 'Entry to Mid',
    salaryRange: '$75,000 - $115,000',
    description: 'Build responsive, accessible, interactive web applications using modern JavaScript/TypeScript, component frameworks, and state architectures.',
    requiredSkills: [
      { name: 'JavaScript', level: 4, category: 'programming' },
      { name: 'React', level: 4, category: 'frontend' },
      { name: 'HTML & Modern CSS', level: 4, category: 'frontend' },
      { name: 'TypeScript', level: 3, category: 'programming' },
      { name: 'Git & GitHub', level: 3, category: 'tools' },
      { name: 'Web Performance & Accessibility', level: 3, category: 'frontend' },
      { name: 'Testing (Jest/RTL)', level: 3, category: 'frontend' },
      { name: 'State Management (Redux/Zustand)', level: 3, category: 'frontend' }
    ],
    matchFactors: {
      interests: ['web development', 'frontend', 'ui/ux', 'design', 'react', 'javascript', 'interactive'],
      workEnv: ['remote', 'hybrid', 'in-office']
    }
  },
  {
    id: 'fullstack-dev',
    title: 'Full-Stack Developer',
    category: 'Engineering',
    level: 'Entry to Mid',
    salaryRange: '$85,000 - $130,000',
    description: 'Design and implement complete end-to-end web applications, encompassing user-facing frontends, robust REST/GraphQL APIs, database models, and cloud deployment pipelines.',
    requiredSkills: [
      { name: 'JavaScript / Node.js', level: 4, category: 'programming' },
      { name: 'React / Next.js', level: 4, category: 'frontend' },
      { name: 'Express / REST APIs', level: 4, category: 'backend' },
      { name: 'SQL & PostgreSQL', level: 3, category: 'databases' },
      { name: 'MongoDB / NoSQL', level: 3, category: 'databases' },
      { name: 'Git & CI/CD Basics', level: 3, category: 'tools' },
      { name: 'Docker Fundamentals', level: 2, category: 'cloud' },
      { name: 'Authentication & API Security', level: 3, category: 'backend' }
    ],
    matchFactors: {
      interests: ['full stack', 'backend', 'frontend', 'web development', 'api', 'databases', 'system design'],
      workEnv: ['remote', 'hybrid', 'in-office']
    }
  },
  {
    id: 'python-dev',
    title: 'Python Developer',
    category: 'Engineering & Automation',
    level: 'Entry to Mid',
    salaryRange: '$80,000 - $120,000',
    description: 'Develop backend services, automated scripts, data scrapers, and API integrations utilizing Python and modern frameworks like FastAPI and Django.',
    requiredSkills: [
      { name: 'Python Core', level: 4, category: 'programming' },
      { name: 'FastAPI / Django', level: 4, category: 'backend' },
      { name: 'SQL & Relational Databases', level: 3, category: 'databases' },
      { name: 'RESTful API Architecture', level: 3, category: 'backend' },
      { name: 'Git & Version Control', level: 3, category: 'tools' },
      { name: 'PyTest & Automated Testing', level: 3, category: 'tools' },
      { name: 'Docker & Containerization', level: 3, category: 'cloud' }
    ],
    matchFactors: {
      interests: ['python', 'backend', 'automation', 'data science', 'scripting', 'apis'],
      workEnv: ['remote', 'hybrid']
    }
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Analytics',
    level: 'Entry to Mid',
    salaryRange: '$70,000 - $105,000',
    description: 'Translate raw business data into actionable dashboards, KPIs, and reports using SQL queries, statistical analysis in Python, and business intelligence suites.',
    requiredSkills: [
      { name: 'SQL & Query Optimization', level: 4, category: 'databases' },
      { name: 'Python for Data (Pandas/NumPy)', level: 4, category: 'programming' },
      { name: 'Data Visualization (Power BI/Tableau)', level: 4, category: 'tools' },
      { name: 'Exploratory Data Analysis (EDA)', level: 3, category: 'analytics' },
      { name: 'Statistical Foundations', level: 3, category: 'problem-solving' },
      { name: 'Executive Presentation & Storytelling', level: 3, category: 'communication' }
    ],
    matchFactors: {
      interests: ['data analysis', 'sql', 'analytics', 'statistics', 'dashboards', 'business intelligence'],
      workEnv: ['remote', 'hybrid', 'in-office']
    }
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    category: 'Design & Product',
    level: 'Entry to Mid',
    salaryRange: '$70,000 - $110,000',
    description: 'Design intuitive, accessible user journeys, responsive wireframes, design systems, and high-fidelity prototypes based on user research.',
    requiredSkills: [
      { name: 'Figma & Design Systems', level: 4, category: 'tools' },
      { name: 'Wireframing & Prototyping', level: 4, category: 'frontend' },
      { name: 'User Research & Testing', level: 3, category: 'communication' },
      { name: 'Information Architecture', level: 3, category: 'problem-solving' },
      { name: 'HTML & CSS Foundations', level: 2, category: 'frontend' }
    ],
    matchFactors: {
      interests: ['ui/ux', 'design', 'figma', 'product design', 'creative', 'visual design'],
      workEnv: ['remote', 'hybrid']
    }
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Security & Operations',
    level: 'Entry to Mid',
    salaryRange: '$85,000 - $125,000',
    description: 'Monitor systems for security vulnerabilities, configure firewalls, conduct penetration tests, and enforce compliance and data protection policies.',
    requiredSkills: [
      { name: 'Network Fundamentals & Protocols', level: 4, category: 'tools' },
      { name: 'Security Auditing & Threat Analysis', level: 3, category: 'tools' },
      { name: 'Linux System Administration', level: 3, category: 'tools' },
      { name: 'Python / Bash Scripting', level: 3, category: 'programming' },
      { name: 'Incident Response & SIEM', level: 2, category: 'tools' }
    ],
    matchFactors: {
      interests: ['cybersecurity', 'security', 'ethical hacking', 'linux', 'networking'],
      workEnv: ['in-office', 'hybrid', 'remote']
    }
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI/ML Engineer',
    category: 'Machine Learning',
    level: 'Entry to Advanced',
    salaryRange: '$95,000 - $150,000',
    description: 'Train, evaluate, and deploy machine learning models, neural networks, and generative AI pipelines integrated into production software.',
    requiredSkills: [
      { name: 'Python Core', level: 5, category: 'programming' },
      { name: 'PyTorch / TensorFlow', level: 4, category: 'programming' },
      { name: 'Linear Algebra & Calculus', level: 4, category: 'problem-solving' },
      { name: 'LLM Fine-tuning & Embeddings', level: 3, category: 'tools' },
      { name: 'MLOps & Model Deployment', level: 3, category: 'cloud' }
    ],
    matchFactors: {
      interests: ['ai', 'machine learning', 'deep learning', 'neural networks', 'data science', 'python'],
      workEnv: ['remote', 'hybrid']
    }
  }
];

export const careerService = {
  getAllCareers() {
    return CAREER_CATALOGUE;
  },

  getCareerById(id) {
    return CAREER_CATALOGUE.find((c) => c.id === id) || CAREER_CATALOGUE[0];
  },

  evaluateAssessment(formData, userSkills = []) {
    const {
      existingSkills = [],
      interests = [],
      preferredWorkEnv = '',
      weeklyHours = 15,
    } = formData;

    const userSkillNames = (existingSkills || []).map((s) =>
      typeof s === 'string' ? s.toLowerCase().trim() : (s.name || '').toLowerCase().trim()
    );
    const userInterestList = (interests || []).map((i) => i.toLowerCase().trim());

    const scoredCareers = CAREER_CATALOGUE.map((career) => {
      let score = 30; // base score
      const matchReasons = [];

      // Interest Match (up to 30 pts)
      const matchedInterests = career.matchFactors.interests.filter((int) =>
        userInterestList.some(
          (userInt) => userInt.includes(int.toLowerCase()) || int.toLowerCase().includes(userInt)
        )
      );

      if (matchedInterests.length > 0) {
        const interestPoints = Math.min(30, matchedInterests.length * 15);
        score += interestPoints;
        matchReasons.push(`Strong alignment with your interest in ${matchedInterests.join(', ')}`);
      }

      // Existing Skills Match (up to 30 pts)
      const matchedSkills = [];
      const missingSkills = [];

      career.requiredSkills.forEach((req) => {
        const reqLower = req.name.toLowerCase();
        const found = userSkillNames.some(
          (userSk) => reqLower.includes(userSk) || userSk.includes(reqLower)
        );
        if (found) {
          matchedSkills.push(req);
        } else {
          missingSkills.push(req);
        }
      });

      const skillMatchRatio = matchedSkills.length / Math.max(1, career.requiredSkills.length);
      const skillPoints = Math.round(skillMatchRatio * 30);
      score += skillPoints;

      if (matchedSkills.length > 0) {
        matchReasons.push(
          `You already possess foundational skills: ${matchedSkills
            .slice(0, 3)
            .map((s) => s.name)
            .join(', ')}`
        );
      }

      // Work Environment Match (up to 10 pts)
      if (
        preferredWorkEnv &&
        career.matchFactors.workEnv.some((env) =>
          env.toLowerCase().includes(preferredWorkEnv.toLowerCase())
        )
      ) {
        score += 10;
        matchReasons.push(`Matches your preferred ${preferredWorkEnv} working setup`);
      }

      // Weekly Hours Feasibility
      const hours = Number(weeklyHours) || 15;
      let estimatedWeeksToReady = Math.round((missingSkills.length * 28) / Math.max(5, hours));
      if (estimatedWeeksToReady < 8) estimatedWeeksToReady = 8;
      if (estimatedWeeksToReady > 52) estimatedWeeksToReady = 52;

      // Realistic UX score clamp (45% to 98%)
      const finalScore = Math.min(98, Math.max(48, Math.round(score)));

      return {
        careerId: career.id,
        id: career.id,
        title: career.title,
        category: career.category,
        salaryRange: career.salaryRange,
        description: career.description,
        matchScore: finalScore,
        matchReasons:
          matchReasons.length > 0
            ? matchReasons
            : ['Solid entry pathway based on industry demand and fundamental skills.'],
        matchedSkills,
        missingSkills,
        estimatedWeeksToReady,
        hoursPerWeek: hours,
      };
    });

    scoredCareers.sort((a, b) => b.matchScore - a.matchScore);
    return scoredCareers;
  },

  calculateReadiness(targetCareerId, userSkills = [], roadmapStages = []) {
    const career = this.getCareerById(targetCareerId);
    if (!career) {
      return { overall: 65, skillsScore: 60, roadmapScore: 70, missingCount: 3, targetCareerTitle: 'Software Engineering' };
    }

    const required = career.requiredSkills || [];
    let acquiredPoints = 0;
    let totalTargetPoints = 0;
    let missingCount = 0;

    required.forEach((req) => {
      const found = userSkills.find((s) => {
        const sName = (s.name || '').toLowerCase();
        const reqName = req.name.toLowerCase();
        return sName.includes(reqName) || reqName.includes(sName);
      });

      totalTargetPoints += req.level * 20;
      if (found) {
        acquiredPoints += (found.currentLevel || 1) * 20;
        if ((found.currentLevel || 1) < req.level) {
          missingCount++;
        }
      } else {
        missingCount++;
      }
    });

    const skillsScore = totalTargetPoints > 0 ? Math.round((acquiredPoints / totalTargetPoints) * 100) : 60;

    // Roadmap completion calculation
    let totalTasks = 0;
    let completedTasks = 0;

    if (roadmapStages && Array.isArray(roadmapStages)) {
      roadmapStages.forEach((stage) => {
        (stage.tasks || []).forEach((t) => {
          totalTasks++;
          if (t.completed) completedTasks++;
        });
      });
    }

    const roadmapScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 40;
    const overall = Math.min(99, Math.max(25, Math.round(skillsScore * 0.55 + roadmapScore * 0.45)));

    return {
      overall,
      skillsScore,
      roadmapScore,
      missingCount,
      targetCareerTitle: career.title,
    };
  },
};
