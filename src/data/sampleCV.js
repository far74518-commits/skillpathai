export const EMPTY_CV = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: ''
  },
  professionalSummary: '',
  education: [],
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  languages: []
};

export const SAMPLE_CV = {
  personalInfo: {
    fullName: 'Farman Ali',
    title: 'Aspiring Frontend & Software Engineer',
    email: 'farman.ali@university.edu',
    phone: '+1 (555) 234-5678',
    location: 'San Jose, CA',
    website: 'https://farmanali.dev',
    linkedin: 'https://linkedin.com/in/farmanali-dev',
    github: 'https://github.com/farmanali-tech'
  },
  professionalSummary: 'Detail-oriented Computer Science undergraduate with hands-on experience building performant, accessible web applications using React, modern JavaScript (ES6+), and clean CSS3. Passionate about developer tooling, design systems, and responsive user interfaces. Proven track record of shipping full-stack student projects and collaborating in agile team sprints.',
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      institution: 'State University of Technology',
      location: 'San Jose, CA',
      startDate: '2023',
      endDate: '2027 (Expected)',
      gpa: '3.85 / 4.00',
      highlights: 'Dean’s Honor List (All Semesters), Lead Peer Tutor for Data Structures & Algorithms, President of Web Development Club.'
    }
  ],
  skills: [
    { category: 'Frontend', items: 'React.js, JavaScript (ES6+), HTML5, CSS3, Flexbox & Grid, Vite, Responsive Design' },
    { category: 'Backend & APIs', items: 'Node.js, Express.js, RESTful APIs, JSON, Fetch API' },
    { category: 'Databases & Tools', items: 'PostgreSQL, SQLite, Git, GitHub, VS Code, Figma, Postman' },
    { category: 'Soft Skills', items: 'Technical Writing, Agile Collaboration, Problem Solving, Presentation' }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Frontend Engineering Intern',
      company: 'Nova Digital Labs',
      location: 'San Francisco, CA (Remote)',
      startDate: 'Jun 2026',
      endDate: 'Aug 2026',
      bullets: [
        'Developed 8+ reusable React components adhering to strict accessibility (WCAG AA) standards, increasing test coverage by 25%.',
        'Refactored legacy CSS stylesheets into scoped CSS custom properties, decreasing bundle size by 18% and improving page load speeds.',
        'Collaborated with senior engineers in bi-weekly sprint planning, pull request code reviews, and automated CI/CD deployment checks.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Undergraduate Teaching Assistant (CS101)',
      company: 'Department of Computer Science',
      location: 'Campus',
      startDate: 'Jan 2026',
      endDate: 'May 2026',
      bullets: [
        'Mentored 60+ undergraduate students in foundational programming, debugging techniques, and algorithm analysis during weekly office hours.',
        'Designed interactive coding challenges and automated grading test scripts in Python.'
      ]
    }
  ],
  projects: [
    {
      id: 'proj-cv-1',
      name: 'SkillPath AI — Intelligent Career Planner',
      technologies: 'React, React Router, Recharts, Custom CSS3, LocalStorage',
      link: 'https://skillpath-ai.example.app',
      bullets: [
        'Architected a multi-page career development platform featuring rule-based AI career assessment, step-by-step roadmap tracking, and real-time ATS CV generation.',
        'Implemented persistent state synchronization across 8 views with zero external CSS frameworks for maximum performance and design control.'
      ]
    },
    {
      id: 'proj-cv-2',
      name: 'Campus Food Delivery & Order Tracking Hub',
      technologies: 'React, Context API, CSS Grid, LocalStorage',
      link: 'https://github.com/farmanali-tech/campus-eats',
      bullets: [
        'Created a responsive campus dining portal with dietary filtering, persistent shopping cart, and animated order status timeline.',
        'Optimized client-side rendering with memoized selectors, maintaining 60 FPS transitions across mobile viewports.'
      ]
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera / Meta',
      date: '2026',
      credentialId: 'META-FE-92841'
    },
    {
      id: 'cert-2',
      name: 'Responsive Web Design Certification',
      issuer: 'freeCodeCamp',
      date: '2025',
      credentialId: 'FCC-RWD-7712'
    }
  ],
  languages: [
    {
      id: 'lang-1',
      language: 'English',
      proficiency: 'Full Professional / Fluent'
    },
    {
      id: 'lang-2',
      language: 'Urdu',
      proficiency: 'Native / Bilingual'
    }
  ]
};

export const INITIAL_CV = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: ''
  },
  professionalSummary: '',
  education: [],
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  languages: []
};
