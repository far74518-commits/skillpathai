export const INITIAL_SKILLS = [
  // Frontend
  {
    id: 'sk-1',
    name: 'HTML5 & Semantic Elements',
    category: 'Frontend',
    currentLevel: 4, // 1 to 5 scale
    targetLevel: 5,
    notes: 'Comfortable with semantic elements, forms, and accessibility basics.',
    lastUpdated: '2026-10-10'
  },
  {
    id: 'sk-2',
    name: 'CSS3, Flexbox & Grid',
    category: 'Frontend',
    currentLevel: 4,
    targetLevel: 5,
    notes: 'Strong in flexbox, CSS grid, transitions, and media queries.',
    lastUpdated: '2026-10-12'
  },
  {
    id: 'sk-3',
    name: 'React.js & Hooks',
    category: 'Frontend',
    currentLevel: 3,
    targetLevel: 5,
    notes: 'Good understanding of useState, useEffect, props, and custom hooks.',
    lastUpdated: '2026-10-14'
  },
  {
    id: 'sk-4',
    name: 'Responsive Web Design',
    category: 'Frontend',
    currentLevel: 4,
    targetLevel: 4,
    notes: 'Mobile-first layout design and fluid typography.',
    lastUpdated: '2026-10-08'
  },

  // Programming
  {
    id: 'sk-5',
    name: 'Modern JavaScript (ES6+)',
    category: 'Programming',
    currentLevel: 3,
    targetLevel: 5,
    notes: 'Practicing async/await, closures, promises, and array methods.',
    lastUpdated: '2026-10-15'
  },
  {
    id: 'sk-6',
    name: 'Python Fundamentals',
    category: 'Programming',
    currentLevel: 2,
    targetLevel: 4,
    notes: 'Completed basic OOP, lists, dictionaries, and file I/O.',
    lastUpdated: '2026-09-28'
  },
  {
    id: 'sk-7',
    name: 'TypeScript Basics',
    category: 'Programming',
    currentLevel: 1,
    targetLevel: 4,
    notes: 'Want to learn interfaces, types, and generic parameters.',
    lastUpdated: '2026-10-01'
  },

  // Backend
  {
    id: 'sk-8',
    name: 'Node.js & Express.js',
    category: 'Backend',
    currentLevel: 2,
    targetLevel: 4,
    notes: 'Built basic REST endpoints with Express.',
    lastUpdated: '2026-10-05'
  },
  {
    id: 'sk-9',
    name: 'RESTful API Design',
    category: 'Backend',
    currentLevel: 3,
    targetLevel: 4,
    notes: 'HTTP verbs, status codes, JSON payloads, and error contracts.',
    lastUpdated: '2026-10-11'
  },

  // Databases
  {
    id: 'sk-10',
    name: 'SQL & Relational Databases',
    category: 'Databases',
    currentLevel: 3,
    targetLevel: 4,
    notes: 'Wrote queries with SELECT, WHERE, JOIN, GROUP BY, and aggregate functions.',
    lastUpdated: '2026-10-03'
  },
  {
    id: 'sk-11',
    name: 'MongoDB / NoSQL Basics',
    category: 'Databases',
    currentLevel: 2,
    targetLevel: 3,
    notes: 'Basic document CRUD operations with Mongoose.',
    lastUpdated: '2026-09-20'
  },

  // Problem-solving
  {
    id: 'sk-12',
    name: 'Data Structures & Algorithms',
    category: 'Problem-solving',
    currentLevel: 2,
    targetLevel: 4,
    notes: 'Practicing arrays, hash tables, two pointers, and binary search on LeetCode.',
    lastUpdated: '2026-10-13'
  },
  {
    id: 'sk-13',
    name: 'Git & Version Control',
    category: 'Problem-solving',
    currentLevel: 3,
    targetLevel: 5,
    notes: 'Daily git commits, branching, merging, and PR workflows.',
    lastUpdated: '2026-10-14'
  },

  // Communication
  {
    id: 'sk-14',
    name: 'Technical Writing & Documentation',
    category: 'Communication',
    currentLevel: 3,
    targetLevel: 4,
    notes: 'Writing clear READMEs, PR summaries, and architectural notes.',
    lastUpdated: '2026-10-04'
  },
  {
    id: 'sk-15',
    name: 'Presentation & Team Collaboration',
    category: 'Communication',
    currentLevel: 3,
    targetLevel: 4,
    notes: 'Presenting sprint demos and participating in peer code reviews.',
    lastUpdated: '2026-10-09'
  }
];

export const SKILL_CATEGORIES = [
  'All',
  'Frontend',
  'Backend',
  'Databases',
  'Programming',
  'Communication',
  'Problem-solving'
];

export const PROFICIENCY_LEVELS = [
  { level: 1, label: 'Beginner', desc: 'Basic conceptual understanding' },
  { level: 2, label: 'Elementary', desc: 'Can follow guides and build simple features' },
  { level: 3, label: 'Intermediate', desc: 'Builds functional solutions independently' },
  { level: 4, label: 'Advanced', desc: 'Deep fluency, optimizes code and follows patterns' },
  { level: 5, label: 'Expert', desc: 'Mentors others, masters edge cases and architecture' }
];
