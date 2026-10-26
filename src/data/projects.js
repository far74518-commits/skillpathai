export const PORTFOLIO_PROJECTS = [
  {
    id: 'proj-1',
    title: 'Modern DevFolio & Interactive Portfolio',
    careerTrack: 'Frontend Developer',
    difficulty: 'Beginner',
    estimatedHours: '12 - 16 hrs',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    description: 'A lightning-fast, high-converting personal developer portfolio featuring a live project showcase, filterable skill badges, dark/light theme switch, and an interactive contact modal.',
    features: [
      'Accessible keyboard navigation and mobile-responsive drawer',
      'Filter projects by technology tags (React, Node, SQL)',
      'Smooth scroll anchors and dynamic scroll indicator bar',
      'Contact form with client-side regex email validation and success toast'
    ],
    learningOutcomes: [
      'Master semantic HTML5 layout and WCAG accessibility standards',
      'Deepen CSS custom property usage for seamless dark/light theming',
      'Organize modular JavaScript code without monolithic spaghetti functions'
    ],
    checklist: [
      { id: 'c1', text: 'Design mobile and desktop wireframes', completed: false },
      { id: 'c2', text: 'Set up CSS variables for color palettes and spacing', completed: false },
      { id: 'c3', text: 'Implement project filter by category', completed: false },
      { id: 'c4', text: 'Add client-side form validation and modal', completed: false },
      { id: 'c5', text: 'Deploy to GitHub Pages or Vercel and verify Lighthouse score', completed: false }
    ],
    started: true,
    completed: false
  },
  {
    id: 'proj-2',
    title: 'Campus Food Delivery & Order Tracking App',
    careerTrack: 'Frontend Developer',
    difficulty: 'Intermediate',
    estimatedHours: '20 - 25 hrs',
    skills: ['React.js', 'React Router', 'Local State', 'CSS Grid'],
    description: 'A multi-vendor campus dining application enabling students to browse daily dining hall menus, customize meal options, manage a reactive shopping cart, and track order stages.',
    features: [
      'Interactive cart drawer with dynamic price, tax, and student discount calculation',
      'Dietary filters (Vegetarian, Halal, Gluten-Free, Vegan)',
      'Order status timeline showing preparation and pickup stages',
      'Persistent cart and recent orders saved in browser storage'
    ],
    learningOutcomes: [
      'Component decomposition and prop drilling reduction with React Context',
      'Complex array transformations for cart manipulation (quantity, addons)',
      'Managing asynchronous simulated order status intervals'
    ],
    checklist: [
      { id: 'cf1', text: 'Model JSON menu data with dietary flags', completed: true },
      { id: 'cf2', text: 'Build category navigation and dietary filter chips', completed: true },
      { id: 'cf3', text: 'Implement CartContext for global cart state', completed: false },
      { id: 'cf4', text: 'Build checkout review modal with mock credit/campus card payment', completed: false },
      { id: 'cf5', text: 'Simulate live order tracker with visual timeline progress', completed: false }
    ],
    started: false,
    completed: false
  },
  {
    id: 'proj-3',
    title: 'Student Peer Tutoring & Study Group Hub',
    careerTrack: 'Full-Stack Developer',
    difficulty: 'Intermediate',
    estimatedHours: '30 - 35 hrs',
    skills: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL / SQL'],
    description: 'An online marketplace connecting university students for 1-on-1 tutoring sessions and peer study groups with slot booking, rating reviews, and course tagging.',
    features: [
      'User authentication for tutors and students',
      'Tutor profile page with hourly rate, bio, and student reviews',
      'Calendar slot reservation system with conflict detection',
      'REST API backend with PostgreSQL relational schema'
    ],
    learningOutcomes: [
      'Relational schema normalization (Users, Courses, Bookings, Reviews)',
      'Building REST endpoints with query parameter filters and pagination',
      'State synchronization between frontend form and backend API'
    ],
    checklist: [
      { id: 'pt1', text: 'Design PostgreSQL schema with foreign keys and constraints', completed: false },
      { id: 'pt2', text: 'Create Express backend endpoints with validation', completed: false },
      { id: 'pt3', text: 'Build React frontend search interface with subject filters', completed: false },
      { id: 'pt4', text: 'Connect booking calendar with backend conflict checks', completed: false },
      { id: 'pt5', text: 'Implement review rating cards and aggregate tutor star ratings', completed: false }
    ],
    started: false,
    completed: false
  },
  {
    id: 'proj-4',
    title: 'Automated Tech Internship Scraper & Alert Engine',
    careerTrack: 'Python Developer',
    difficulty: 'Beginner',
    estimatedHours: '15 - 18 hrs',
    skills: ['Python', 'BeautifulSoup', 'SQLite', 'Automation'],
    description: 'A Python command-line utility and scheduled automation script that scrapes entry-level student job postings across major job boards, filters by keyword, and stores unique listings in SQLite.',
    features: [
      'HTML parsing with BeautifulSoup to extract company, title, date, and link',
      'Deduplication algorithm to avoid repeating previously seen job posts',
      'SQLite database storage with timestamps and application status flags',
      'Automated email notification or Discord webhook alerts for new matches'
    ],
    learningOutcomes: [
      'Web scraping ethics, request headers, rate limiting, and exception handling',
      'Interacting with relational databases through Python sqlite3 module',
      'Cron scheduling and environment variable security (.env)'
    ],
    checklist: [
      { id: 'sc1', text: 'Inspect target career site DOM structure and selectors', completed: true },
      { id: 'sc2', text: 'Write parsing function with robust try/except error guards', completed: true },
      { id: 'sc3', text: 'Create SQLite table and deduplication logic', completed: false },
      { id: 'sc4', text: 'Implement Discord webhook notification payload', completed: false },
      { id: 'sc5', text: 'Add command-line flags (--keyword, --remote, --limit)', completed: false }
    ],
    started: false,
    completed: false
  },
  {
    id: 'proj-5',
    title: 'University Career Outcomes & Salary BI Dashboard',
    careerTrack: 'Data Analyst',
    difficulty: 'Intermediate',
    estimatedHours: '20 - 24 hrs',
    skills: ['Python', 'Pandas', 'SQL', 'Data Visualization', 'Power BI / Tableau'],
    description: 'An executive analytics case study analyzing graduate employment rates, median starting salaries, industry migration patterns, and degree return-on-investment across 50,000 alumni records.',
    features: [
      'Data cleaning pipeline in Python handling missing values and salary normalization',
      'SQL cohort queries analyzing employment duration after graduation',
      'Interactive dashboard featuring KPI cards, salary distribution boxplots, and geo maps',
      'Executive 1-page PDF business report summarizing key hiring insights'
    ],
    learningOutcomes: [
      'Exploratory data analysis (EDA) techniques with Pandas and statistical distributions',
      'Writing performant SQL aggregations for analytical reporting',
      'Translating complex metrics into intuitive visual storytelling for stakeholders'
    ],
    checklist: [
      { id: 'da1', text: 'Clean raw CSV dataset and handle outlier values in Python', completed: false },
      { id: 'da2', text: 'Load cleaned data into SQL database and write analytical queries', completed: false },
      { id: 'da3', text: 'Design interactive dashboard wireframe with core metrics', completed: false },
      { id: 'da4', text: 'Build KPI cards, bar charts, and drill-down filters', completed: false },
      { id: 'da5', text: 'Draft executive summary with 4 actionable recommendations', completed: false }
    ],
    started: false,
    completed: false
  },
  {
    id: 'proj-6',
    title: 'Student Wellness & Habit Tracker AI Assistant',
    careerTrack: 'AI / Machine Learning Engineer',
    difficulty: 'Advanced',
    estimatedHours: '28 - 35 hrs',
    skills: ['Python', 'FastAPI', 'Scikit-Learn', 'React.js'],
    description: 'An intelligent study habits optimizer that predicts student burnout risks based on sleep, study hours, and exam schedules, offering personalized recovery recommendations.',
    features: [
      'Supervised regression model predicting energy levels based on weekly logs',
      'FastAPI inference endpoint serving predictions in under 50ms',
      'React frontend dashboard with daily habit check-in and trend charts',
      'Automated suggestions for optimal study breaks and exam pacing'
    ],
    learningOutcomes: [
      'Feature engineering, scaling, and train/test cross-validation with Scikit-Learn',
      'Exporting trained models with Joblib and serving via asynchronous FastAPI',
      'Connecting a modern React interface with an ML inference backend'
    ],
    checklist: [
      { id: 'ml1', text: 'Generate and normalize student habit time-series dataset', completed: false },
      { id: 'ml2', text: 'Train and evaluate Random Forest and Linear Regression models', completed: false },
      { id: 'ml3', text: 'Create FastAPI endpoint with Pydantic payload validation', completed: false },
      { id: 'ml4', text: 'Build React UI with habit sliders and burnout gauge', completed: false }
    ],
    started: false,
    completed: false
  }
];
