export const CAREERS = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    category: 'Software Engineering',
    tagline: 'Craft visually stunning, interactive, and responsive web experiences',
    description: 'Frontend developers bridge the gap between design and technology. They build the client-facing side of web applications that millions of users touch every day, mastering layout, accessibility, state management, and modern animations.',
    difficulty: 'Beginner Friendly',
    estimatedMonths: '4 - 6 months',
    avgSalary: '$78,000 - $115,000 / yr',
    demand: 'High Growth',
    matchFactors: {
      interests: ['Frontend & Web', 'UI/UX & Design', 'Creative Coding'],
      workEnv: ['Remote Friendly', 'Flexible Hours', 'Agile Tech Team'],
      targetRoles: ['Frontend Engineer', 'Web Developer', 'UI Engineer'],
      keyKeywords: ['html', 'css', 'javascript', 'react', 'tailwind', 'vue', 'typescript', 'figma', 'responsive']
    },
    requiredSkills: [
      { name: 'HTML5 & Semantic Markup', category: 'Frontend', level: 4, essential: true },
      { name: 'CSS3, Flexbox & Grid', category: 'Frontend', level: 4, essential: true },
      { name: 'Modern JavaScript (ES6+)', category: 'Programming', level: 4, essential: true },
      { name: 'React.js & State Management', category: 'Frontend', level: 4, essential: true },
      { name: 'REST APIs & Fetching', category: 'Frontend', level: 3, essential: true },
      { name: 'Git & GitHub Collaboration', category: 'Problem-solving', level: 3, essential: true },
      { name: 'Responsive Web Design', category: 'Frontend', level: 4, essential: true },
      { name: 'Web Performance & SEO', category: 'Frontend', level: 3, essential: false },
      { name: 'TypeScript Basics', category: 'Programming', level: 3, essential: false },
      { name: 'UI/UX Fundamentals', category: 'Communication', level: 3, essential: false }
    ],
    starterProjects: [
      { id: 'fe-p1', title: 'Interactive Recipe & Meal Finder', time: '12 hours', difficulty: 'Beginner' },
      { id: 'fe-p2', title: 'Real-time Crypto & Finance Dashboard', time: '20 hours', difficulty: 'Intermediate' },
      { id: 'fe-p3', title: 'Collaborative Kanban Task Board', time: '25 hours', difficulty: 'Intermediate' }
    ],
    recommendedActions: [
      'Master DOM manipulation and ES6 JavaScript array methods.',
      'Build 3 polished portfolio projects with custom CSS and React.',
      'Deploy applications live on Vercel or Netlify with custom domain names.',
      'Contribute to an open-source student community repository.'
    ]
  },
  {
    id: 'fullstack-dev',
    title: 'Full-Stack Developer',
    category: 'Software Engineering',
    tagline: 'Architect complete end-to-end digital platforms from database to UI',
    description: 'Full-stack engineers have a holistic view of modern web applications. They craft intuitive frontends, design scalable backend APIs, optimize relational/NoSQL databases, and deploy secure services to the cloud.',
    difficulty: 'Moderate',
    estimatedMonths: '6 - 9 months',
    avgSalary: '$88,000 - $130,000 / yr',
    demand: 'Very High',
    matchFactors: {
      interests: ['Frontend & Web', 'Backend & Cloud', 'Database Architecture'],
      workEnv: ['Startup Pace', 'Hybrid', 'Full-cycle Ownership'],
      targetRoles: ['Full-Stack Engineer', 'Software Engineer', 'Web Applications Engineer'],
      keyKeywords: ['javascript', 'react', 'node', 'express', 'sql', 'mongodb', 'rest', 'docker', 'api']
    },
    requiredSkills: [
      { name: 'Modern JavaScript (ES6+)', category: 'Programming', level: 4, essential: true },
      { name: 'React.js Frontend Architecture', category: 'Frontend', level: 4, essential: true },
      { name: 'Node.js & Express.js', category: 'Backend', level: 4, essential: true },
      { name: 'PostgreSQL / SQL Databases', category: 'Databases', level: 4, essential: true },
      { name: 'RESTful API & Auth (JWT/OAuth)', category: 'Backend', level: 4, essential: true },
      { name: 'MongoDB / Document Stores', category: 'Databases', level: 3, essential: false },
      { name: 'Git & Version Control', category: 'Problem-solving', level: 4, essential: true },
      { name: 'Docker & Cloud Deployment Basics', category: 'Backend', level: 3, essential: false },
      { name: 'System Design Fundamentals', category: 'Problem-solving', level: 3, essential: false }
    ],
    starterProjects: [
      { id: 'fs-p1', title: 'Full-Stack Student E-Commerce Store', time: '35 hours', difficulty: 'Intermediate' },
      { id: 'fs-p2', title: 'Campus Event Ticketing Platform with Auth', time: '40 hours', difficulty: 'Advanced' }
    ],
    recommendedActions: [
      'Build a REST API backend with Express and connect it to a React SPA.',
      'Model relational schemas with PostgreSQL and understand foreign keys & indexing.',
      'Implement secure token-based user authentication and role-based permissions.'
    ]
  },
  {
    id: 'python-dev',
    title: 'Python Developer',
    category: 'Software & Automation',
    tagline: 'Harness clean code for automation, backend web services, and scripting',
    description: 'Python developers build robust backend services using FastAPI and Django, write automation scripts, scrape web data, and build data pipelines. Python is versatile, readable, and in high demand across fintech, web, and enterprise domains.',
    difficulty: 'Beginner Friendly',
    estimatedMonths: '4 - 7 months',
    avgSalary: '$82,000 - $120,000 / yr',
    demand: 'High Growth',
    matchFactors: {
      interests: ['Backend & Cloud', 'Data & Analytics', 'Automation & Scripting'],
      workEnv: ['Remote Friendly', 'Enterprise or Startup', 'Structured Workflows'],
      targetRoles: ['Python Developer', 'Backend Software Engineer', 'Automation Engineer'],
      keyKeywords: ['python', 'django', 'fastapi', 'flask', 'sql', 'git', 'pytest', 'celery']
    },
    requiredSkills: [
      { name: 'Core Python & OOP Principles', category: 'Programming', level: 4, essential: true },
      { name: 'FastAPI or Django Frameworks', category: 'Backend', level: 4, essential: true },
      { name: 'SQL & Relational ORMs (SQLAlchemy)', category: 'Databases', level: 4, essential: true },
      { name: 'Unit Testing with PyTest', category: 'Problem-solving', level: 3, essential: true },
      { name: 'Asynchronous Programming in Python', category: 'Programming', level: 3, essential: false },
      { name: 'Web Scraping (BeautifulSoup/Playwright)', category: 'Programming', level: 3, essential: false },
      { name: 'Git & CI/CD Pipelines', category: 'Problem-solving', level: 3, essential: true }
    ],
    starterProjects: [
      { id: 'py-p1', title: 'Automated Job Market Scraper & Alert CLI', time: '18 hours', difficulty: 'Beginner' },
      { id: 'py-p2', title: 'High-Performance REST API with FastAPI & SQLite', time: '25 hours', difficulty: 'Intermediate' }
    ],
    recommendedActions: [
      'Write clean, idiomatic Python following PEP 8 conventions.',
      'Build a production-style REST API with FastAPI and automated interactive Swagger docs.',
      'Practice data structures and algorithmic problem solving on LeetCode.'
    ]
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Data & Analytics',
    tagline: 'Transform raw data into actionable business intelligence and dashboards',
    description: 'Data Analysts uncover hidden trends, solve business problems, and present data-driven narratives to stakeholders. They clean messy data, write analytical SQL queries, and build interactive dashboards that drive strategic decisions.',
    difficulty: 'Beginner Friendly',
    estimatedMonths: '4 - 6 months',
    avgSalary: '$72,000 - $105,000 / yr',
    demand: 'High Growth',
    matchFactors: {
      interests: ['Data & Analytics', 'Business Strategy', 'Visualization & Charts'],
      workEnv: ['Corporate', 'Consulting', 'Hybrid / Remote'],
      targetRoles: ['Data Analyst', 'Business Intelligence Analyst', 'Operations Analyst'],
      keyKeywords: ['sql', 'excel', 'power bi', 'tableau', 'python', 'pandas', 'statistics', 'charts']
    },
    requiredSkills: [
      { name: 'Advanced SQL (Joins, CTEs, Window Functions)', category: 'Databases', level: 4, essential: true },
      { name: 'Python for Data Analysis (Pandas, NumPy)', category: 'Programming', level: 4, essential: true },
      { name: 'Data Visualization (PowerBI / Tableau / Seaborn)', category: 'Communication', level: 4, essential: true },
      { name: 'Applied Business Statistics', category: 'Problem-solving', level: 3, essential: true },
      { name: 'Spreadsheets & Pivot Tables (Excel/Sheets)', category: 'Databases', level: 4, essential: true },
      { name: 'Data Storytelling & Presentation', category: 'Communication', level: 4, essential: true }
    ],
    starterProjects: [
      { id: 'da-p1', title: 'University Graduate Employment Trends Analysis', time: '16 hours', difficulty: 'Beginner' },
      { id: 'da-p2', title: 'Interactive Customer Churn Analysis Dashboard', time: '24 hours', difficulty: 'Intermediate' }
    ],
    recommendedActions: [
      'Master SQL window functions and CTEs using real-world public datasets.',
      'Learn exploratory data analysis (EDA) workflows with Pandas and Matplotlib/Seaborn.',
      'Publish a case study portfolio piece on GitHub / Kaggle with clear executive summaries.'
    ]
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Product Designer',
    category: 'Design & Experience',
    tagline: 'Design user-centric products that are delightful, intuitive, and accessible',
    description: 'UI/UX designers craft the look, feel, and flow of software applications. They conduct user research, create wireframes, test prototypes, and establish comprehensive design systems that solve real user friction.',
    difficulty: 'Beginner Friendly',
    estimatedMonths: '3 - 6 months',
    avgSalary: '$75,000 - $110,000 / yr',
    demand: 'Moderate',
    matchFactors: {
      interests: ['UI/UX & Design', 'Creative Coding', 'Psychology & Research'],
      workEnv: ['Design Agencies', 'Product Teams', 'Creative Studios'],
      targetRoles: ['Product Designer', 'UI/UX Designer', 'Interaction Designer'],
      keyKeywords: ['figma', 'wireframing', 'prototyping', 'user research', 'design system', 'usability']
    },
    requiredSkills: [
      { name: 'Figma & Component Auto-Layout', category: 'Frontend', level: 5, essential: true },
      { name: 'User Research & Persona Building', category: 'Communication', level: 4, essential: true },
      { name: 'Wireframing & Interactive Prototyping', category: 'Frontend', level: 4, essential: true },
      { name: 'Visual Hierarchy, Typography & Color', category: 'Frontend', level: 4, essential: true },
      { name: 'Design Systems & Token Management', category: 'Frontend', level: 3, essential: true },
      { name: 'Web Accessibility (WCAG standards)', category: 'Problem-solving', level: 3, essential: true }
    ],
    starterProjects: [
      { id: 'ux-p1', title: 'Campus Shuttle Bus Real-Time Booking App Redesign', time: '20 hours', difficulty: 'Beginner' },
      { id: 'ux-p2', title: 'Comprehensive SaaS Design System & UI Kit in Figma', time: '30 hours', difficulty: 'Intermediate' }
    ],
    recommendedActions: [
      'Document design thinking case studies focusing on problem framing and iteration.',
      'Build interactive prototypes in Figma with smooth component variants and smart animations.',
      'Conduct usability tests with 5 peers to gather qualitative user insights.'
    ]
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Security & Infrastructure',
    tagline: 'Defend systems, networks, and data against emerging digital threats',
    description: 'Cybersecurity analysts monitor networks, detect intrusions, perform vulnerability assessments, and implement security controls. In an increasingly connected world, protecting confidential data is a top global priority.',
    difficulty: 'Moderate to High',
    estimatedMonths: '6 - 10 months',
    avgSalary: '$85,000 - $125,000 / yr',
    demand: 'Critically High',
    matchFactors: {
      interests: ['Security & Networks', 'Systems & Cloud', 'Problem-solving'],
      workEnv: ['Security Operations Center (SOC)', 'Defense / Banking', 'Hybrid'],
      targetRoles: ['Security Analyst', 'SOC Analyst', 'Vulnerability Assessor'],
      keyKeywords: ['networking', 'wireshark', 'linux', 'siem', 'cryptography', 'owasp', 'python', 'soc']
    },
    requiredSkills: [
      { name: 'Computer Networking (TCP/IP, DNS, OSI)', category: 'Backend', level: 4, essential: true },
      { name: 'Linux System Administration & Bash', category: 'Programming', level: 4, essential: true },
      { name: 'Threat Detection & SIEM Tools', category: 'Problem-solving', level: 3, essential: true },
      { name: 'Vulnerability Assessment (Nmap, Wireshark)', category: 'Problem-solving', level: 3, essential: true },
      { name: 'OWASP Top 10 Web Vulnerabilities', category: 'Frontend', level: 3, essential: true },
      { name: 'Security Compliance (CompTIA Security+ basics)', category: 'Communication', level: 3, essential: false }
    ],
    starterProjects: [
      { id: 'sec-p1', title: 'Home Lab Network Packet Analysis with Wireshark', time: '16 hours', difficulty: 'Beginner' },
      { id: 'sec-p2', title: 'Automated Port Scanner & Vulnerability Checker in Python', time: '22 hours', difficulty: 'Intermediate' }
    ],
    recommendedActions: [
      'Set up a virtualized Linux home lab with VirtualBox or VMware.',
      'Practice CTF (Capture The Flag) challenges on TryHackMe or HackTheBox.',
      'Study fundamentals for foundational certifications like CompTIA Security+.'
    ]
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI / Machine Learning Engineer',
    category: 'Artificial Intelligence',
    tagline: 'Develop predictive models, intelligent agents, and neural networks',
    description: 'AI/ML engineers build, train, and deploy intelligent models that learn from vast datasets. They work with deep learning, natural language processing, LLMs, and computer vision to solve complex predictive challenges.',
    difficulty: 'Challenging',
    estimatedMonths: '8 - 12 months',
    avgSalary: '$98,000 - $150,000 / yr',
    demand: 'Explosive Growth',
    matchFactors: {
      interests: ['Artificial Intelligence', 'Data & Analytics', 'Mathematics & Algorithms'],
      workEnv: ['AI Research Lab', 'Big Tech', 'Cutting-edge AI Startup'],
      targetRoles: ['Machine Learning Engineer', 'AI Developer', 'NLP Specialist'],
      keyKeywords: ['python', 'pytorch', 'tensorflow', 'scikit-learn', 'linear algebra', 'deep learning', 'llm']
    },
    requiredSkills: [
      { name: 'Advanced Python & Math (Calculus/Linear Algebra)', category: 'Programming', level: 4, essential: true },
      { name: 'Classical Machine Learning (Scikit-Learn)', category: 'Problem-solving', level: 4, essential: true },
      { name: 'Deep Learning Frameworks (PyTorch or TensorFlow)', category: 'Programming', level: 3, essential: true },
      { name: 'Data Preprocessing & Feature Engineering', category: 'Databases', level: 4, essential: true },
      { name: 'LLM Prompt Engineering & LangChain Basics', category: 'Programming', level: 3, essential: false },
      { name: 'Model Deployment & API Serving', category: 'Backend', level: 3, essential: false }
    ],
    starterProjects: [
      { id: 'ai-p1', title: 'Student Grade & Dropout Risk Classifier', time: '20 hours', difficulty: 'Intermediate' },
      { id: 'ai-p2', title: 'Context-Aware AI Document Q&A Agent using Embeddings', time: '35 hours', difficulty: 'Advanced' }
    ],
    recommendedActions: [
      'Master Scikit-Learn workflows: split, scale, cross-validate, and evaluate metrics.',
      'Implement an end-to-end PyTorch neural network for image or text classification.',
      'Deploy your model behind a FastAPI endpoint so frontend apps can query it.'
    ]
  }
];
