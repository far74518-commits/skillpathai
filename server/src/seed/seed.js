import mongoose from 'mongoose';
import { connectDatabase, closeDatabase, isDatabaseConnected } from '../config/database.js';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Skill } from '../models/Skill.js';
import { JobApplication } from '../models/JobApplication.js';
import { Roadmap } from '../models/Roadmap.js';
import { CV } from '../models/CV.js';
import { Notification } from '../models/Notification.js';
import { Job } from '../models/Job.js';
import { JobSource } from '../models/JobSource.js';
import { STARTER_ROADMAPS } from '../services/roadmap.service.js';
import { INITIAL_JOB_SOURCES, INITIAL_PAKISTAN_JOBS } from '../data/pakistanJobsData.js';
import { generateJobContentHash } from '../utils/jobHasher.js';

const SEED_PROJECTS = [
  {
    slug: 'modern-devfolio',
    title: 'Modern DevFolio & Interactive Portfolio',
    description: 'A lightning-fast, high-converting personal developer portfolio featuring a live project showcase, filterable skill badges, dark/light theme switch, and an interactive contact modal.',
    careerCategory: 'frontend-dev',
    difficulty: 'Beginner',
    estimatedDuration: '12 - 16 hrs',
    requiredSkills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    suggestedFeatures: [
      'Accessible keyboard navigation and mobile drawer',
      'Filter projects by technology tags',
      'Smooth scroll anchors and dynamic scroll indicator',
      'Contact form with client-side regex email validation',
    ],
    learningOutcomes: [
      'Master semantic HTML5 layout and WCAG accessibility standards',
      'Deepen CSS custom property usage for seamless dark/light theming',
      'Organize modular JavaScript code without monolithic spaghetti functions',
    ],
    checklist: [
      { id: 'c1', text: 'Design mobile and desktop wireframes' },
      { id: 'c2', text: 'Set up CSS variables for color palettes and spacing' },
      { id: 'c3', text: 'Implement project filter by category' },
      { id: 'c4', text: 'Add client-side form validation and modal' },
      { id: 'c5', text: 'Deploy to GitHub Pages or Vercel and verify Lighthouse score' },
    ],
  },
  {
    slug: 'campus-food-delivery',
    title: 'Campus Food Delivery & Order Tracking App',
    description: 'A multi-vendor campus dining application enabling students to browse daily dining hall menus, customize meal options, manage a reactive shopping cart, and track order stages.',
    careerCategory: 'frontend-dev',
    difficulty: 'Intermediate',
    estimatedDuration: '20 - 25 hrs',
    requiredSkills: ['React.js', 'React Router', 'Local State', 'CSS Grid'],
    suggestedFeatures: [
      'Interactive cart drawer with dynamic price, tax, and student discount calculation',
      'Dietary filters (Vegetarian, Halal, Gluten-Free, Vegan)',
      'Order status timeline showing preparation and pickup stages',
      'Persistent cart and recent orders saved in browser storage',
    ],
    learningOutcomes: [
      'Component decomposition and prop drilling reduction with React Context',
      'Complex array transformations for cart manipulation',
      'Managing asynchronous simulated order status intervals',
    ],
    checklist: [
      { id: 'cf1', text: 'Model JSON menu data with dietary flags' },
      { id: 'cf2', text: 'Build category navigation and dietary filter chips' },
      { id: 'cf3', text: 'Implement CartContext for global cart state' },
      { id: 'cf4', text: 'Build checkout review modal with mock credit/campus card payment' },
      { id: 'cf5', text: 'Simulate live order tracker with visual timeline progress' },
    ],
  },
  {
    slug: 'student-peer-tutoring-hub',
    title: 'Student Peer Tutoring & Study Group Hub',
    description: 'An online marketplace connecting university students for 1-on-1 tutoring sessions and peer study groups with slot booking, rating reviews, and course tagging.',
    careerCategory: 'fullstack-dev',
    difficulty: 'Intermediate',
    estimatedDuration: '30 - 35 hrs',
    requiredSkills: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL / SQL'],
    suggestedFeatures: [
      'User authentication for tutors and students',
      'Tutor profile page with hourly rate, bio, and student reviews',
      'Calendar slot reservation system with conflict detection',
      'Course code tag filtering (CS101, MATH205, PHYS102)',
    ],
    learningOutcomes: [
      'Relational database modeling with foreign keys for appointments and reviews',
      'REST API design with validation middleware and error handling',
      'JWT-based secure authentication flow',
    ],
    checklist: [
      { id: 't1', text: 'Define database schema (Users, Profiles, Slots, Bookings)' },
      { id: 't2', text: 'Build authentication endpoints (register, login, me)' },
      { id: 't3', text: 'Create tutor discovery view with filters' },
      { id: 't4', text: 'Implement booking workflow with confirmation state' },
      { id: 't5', text: 'Write integration tests for booking conflict detection' },
    ],
  },
  {
    slug: 'crypto-stock-market-pulse',
    title: 'MarketPulse: Real-Time Financial Analytics Platform',
    description: 'A financial metrics visualization dashboard providing live price feeds, moving average indicators, personalized stock/crypto watchlists, and historical volume charts.',
    careerCategory: 'frontend-dev',
    difficulty: 'Advanced',
    estimatedDuration: '25 - 30 hrs',
    requiredSkills: ['React.js', 'TypeScript', 'Recharts', 'WebSockets / Polling'],
    suggestedFeatures: [
      'Live ticker stream with green/red fluctuation indicators',
      'Interactive candlestick and area charts with timeframe selectors',
      'Personal watchlist with price alert threshold notifications',
      'Export data as CSV summary',
    ],
    learningOutcomes: [
      'Strict TypeScript typings for financial API payloads',
      'Optimizing high-frequency re-renders with useMemo and React.memo',
      'Building accessible, performant chart components',
    ],
    checklist: [
      { id: 'm1', text: 'Configure TypeScript React project with linting' },
      { id: 'm2', text: 'Integrate CoinGecko or Alpha Vantage public REST API' },
      { id: 'm3', text: 'Build responsive Recharts multi-timeframe chart' },
      { id: 'm4', text: 'Implement local storage watchlist with price alerts' },
      { id: 'm5', text: 'Profile rendering performance and eliminate excess re-renders' },
    ],
  },
  {
    slug: 'research-paper-summarizer',
    title: 'ScholarDigest: AI Academic Paper Assistant',
    description: 'A study productivity tool that extracts key findings, methodology summaries, and glossary terms from uploaded academic PDFs using generative AI endpoints.',
    careerCategory: 'ai-engineer',
    difficulty: 'Intermediate',
    estimatedDuration: '20 - 25 hrs',
    requiredSkills: ['Python', 'FastAPI', 'OpenAI API / LangChain', 'React.js'],
    suggestedFeatures: [
      'Drag-and-drop PDF parser extracting text chunks',
      'Multi-section AI summary: Abstract, Methodology, Key Findings, Limitations',
      'Interactive Q&A sidebar answering questions based on the paper content',
      'Export formatted bibtex and study notes',
    ],
    learningOutcomes: [
      'Document chunking and token budget management for LLM context windows',
      'Building fast Python async APIs with FastAPI',
      'Handling multipart file uploads securely',
    ],
    checklist: [
      { id: 's1', text: 'Build FastAPI backend with PyPDF parser' },
      { id: 's2', text: 'Implement prompt engineering for structured academic extraction' },
      { id: 's3', text: 'Build frontend upload zone with progress indicators' },
      { id: 's4', text: 'Add interactive chat sidebar for document Q&A' },
      { id: 's5', text: 'Add markdown note exporter' },
    ],
  },
];

async function seedDatabase() {
  console.log('[Seed] Starting SkillPath AI database seeding...');

  await connectDatabase();

  if (!isDatabaseConnected()) {
    console.warn('[Seed Warning] MongoDB connection is not active. Please ensure MongoDB is running to execute database seeding.');
    process.exit(0);
  }

  try {
    // 1. Seed Projects
    console.log('[Seed] Seeding Portfolio Projects...');
    for (const proj of SEED_PROJECTS) {
      await Project.findOneAndUpdate(
        { slug: proj.slug },
        proj,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`[Seed] Seeded ${SEED_PROJECTS.length} portfolio projects.`);

    // 2. Seed Demo User
    const demoEmail = 'alex.chen@university.edu';
    console.log(`[Seed] Checking demo user (${demoEmail})...`);
    
    let demoUser = await User.findOne({ email: demoEmail });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex Chen',
        email: demoEmail,
        passwordHash: 'Password123!', // Automatically hashed by pre-save hook
        headline: 'Aspiring Frontend & Full-Stack Engineer | CS Junior @ Stanford',
        university: 'Stanford University',
        degree: 'B.S. in Computer Science',
        gradYear: '2027',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
        targetCareer: 'frontend-dev',
        weeklyLearningHours: 18,
        preferredWorkEnvironment: 'Hybrid',
        interests: ['React', 'TypeScript', 'UI/UX Design', 'Full-Stack Development'],
        existingSkills: ['HTML5 & Modern CSS', 'JavaScript', 'React', 'Git & GitHub'],
      });
      console.log('[Seed] Created demo user: Alex Chen (alex.chen@university.edu / Password123!)');
    } else {
      console.log('[Seed] Demo user already exists.');
    }

    const userId = demoUser._id;

    // 3. Seed Skills for Demo User
    const starterSkills = [
      { name: 'JavaScript', category: 'programming', currentLevel: 4, targetLevel: 5, progress: 80, hoursSpent: 45 },
      { name: 'React', category: 'frontend', currentLevel: 4, targetLevel: 5, progress: 75, hoursSpent: 50 },
      { name: 'HTML & Modern CSS', category: 'frontend', currentLevel: 4, targetLevel: 4, progress: 95, hoursSpent: 30 },
      { name: 'TypeScript', category: 'programming', currentLevel: 2, targetLevel: 4, progress: 40, hoursSpent: 18 },
      { name: 'Git & GitHub', category: 'tools', currentLevel: 3, targetLevel: 4, progress: 65, hoursSpent: 22 },
      { name: 'Node.js & Express', category: 'backend', currentLevel: 2, targetLevel: 4, progress: 35, hoursSpent: 15 },
      { name: 'SQL & PostgreSQL', category: 'databases', currentLevel: 2, targetLevel: 3, progress: 30, hoursSpent: 12 },
    ];

    for (const skill of starterSkills) {
      await Skill.findOneAndUpdate(
        { userId, name: skill.name },
        { ...skill, userId },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`[Seed] Seeded ${starterSkills.length} student skills.`);

    // 4. Seed Job Applications for Demo User
    const starterJobs = [
      {
        company: 'Stripe',
        position: 'Frontend Software Engineering Intern (Summer 2027)',
        location: 'San Francisco, CA / Remote',
        type: 'Internship',
        salary: '$55/hr ($115k annualized)',
        jobUrl: 'https://stripe.com/jobs',
        status: 'Interview',
        notes: 'Technical screen completed with recruiter. Next round: 60-min live coding with React senior engineer.',
      },
      {
        company: 'Vercel',
        position: 'Junior Developer Experience Engineer',
        location: 'Remote (US)',
        type: 'Full-time',
        salary: '$95,000 - $110,000',
        jobUrl: 'https://vercel.com/careers',
        status: 'Applied',
        notes: 'Applied with custom portfolio link and tailored Next.js project case study.',
      },
      {
        company: 'Figma',
        position: 'Product Engineering Intern',
        location: 'San Francisco, CA',
        type: 'Internship',
        salary: '$60/hr',
        jobUrl: 'https://figma.com/careers',
        status: 'Saved',
        notes: 'Application opens next week. Need to polish Canvas / WebGL portfolio demo.',
      },
      {
        company: 'Linear',
        position: 'Full-Stack Engineering Apprentice',
        location: 'Remote',
        type: 'Apprenticeship',
        salary: '$80,000',
        jobUrl: 'https://linear.app/careers',
        status: 'Offer',
        notes: 'Received written offer! Reviewing team placement and start date.',
      },
    ];

    for (const job of starterJobs) {
      await JobApplication.findOneAndUpdate(
        { userId, company: job.company, position: job.position },
        { ...job, userId },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`[Seed] Seeded ${starterJobs.length} student job applications.`);

    // 5. Seed Starter Roadmap for Demo User
    const starterRoadmap = STARTER_ROADMAPS['frontend-dev'];
    if (starterRoadmap) {
      await Roadmap.findOneAndUpdate(
        { userId, careerType: 'frontend-dev' },
        {
          userId,
          careerType: 'frontend-dev',
          title: starterRoadmap.title,
          description: starterRoadmap.description,
          stages: starterRoadmap.stages,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log('[Seed] Seeded frontend-dev roadmap for demo user.');
    }

    // 6. Seed Starter CV Profile
    await CV.findOneAndUpdate(
      { userId },
      {
        userId,
        selectedTemplate: 'modern',
        personalInfo: {
          fullName: 'Alex Chen',
          title: 'Aspiring Frontend & Full-Stack Engineer',
          email: 'alex.chen@university.edu',
          phone: '+1 (555) 234-5678',
          location: 'San Francisco, CA',
          website: 'https://alexchen.dev',
          github: 'https://github.com/alexchen',
          linkedin: 'https://linkedin.com/in/alexchen-dev',
          summary: 'Motivated Computer Science student at Stanford University with hands-on experience building performant, accessible React applications, full-stack REST APIs, and responsive web user interfaces.',
        },
        education: [
          {
            id: 'edu-1',
            school: 'Stanford University',
            degree: 'B.S. in Computer Science',
            fieldOfStudy: 'Software Systems',
            startDate: 'Sept 2023',
            endDate: 'June 2027 (Expected)',
            gpa: '3.85 / 4.0',
            highlights: ['Dean’s Honor List (2024, 2025)', 'Coursework: Data Structures & Algorithms, Web Applications, Database Systems'],
          },
        ],
        experience: [
          {
            id: 'exp-1',
            company: 'Campus Tech Solutions',
            role: 'Student Frontend Developer',
            location: 'Stanford, CA',
            startDate: 'Sept 2024',
            endDate: 'Present',
            current: true,
            description: 'Maintain and enhance internal portal serving 15,000+ undergraduate students.',
            bullets: [
              'Migrated legacy jQuery views to React 18 and modular CSS variables, reducing page load times by 38%',
              'Implemented accessible keyboard shortcuts and ARIA landmark navigation across 24 core pages',
            ],
          },
        ],
        projects: [
          {
            id: 'p-1',
            name: 'MarketPulse Financial Dashboard',
            technologies: 'React 18, TypeScript, Recharts, REST APIs',
            liveUrl: 'https://marketpulse.demo',
            githubUrl: 'https://github.com/alexchen/marketpulse',
            description: 'Engineered responsive financial tracking dashboard rendering high-frequency price updates and moving averages with Recharts.',
          },
        ],
        skills: {
          technical: ['JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3 / CSS Grid', 'Node.js', 'Express.js', 'PostgreSQL'],
          frameworks: ['React.js', 'Next.js', 'Tailwind CSS'],
          tools: ['Git & GitHub', 'Vite', 'Postman', 'Docker', 'VS Code'],
          soft: ['Problem Solving', 'Technical Communication', 'Agile / Scrum', 'Pair Programming'],
        },
        certifications: [
          {
            id: 'cert-1',
            name: 'Meta Front-End Developer Professional Certificate',
            issuer: 'Coursera / Meta',
            issueDate: '2024',
            credentialUrl: 'https://coursera.org/verify/sample',
          },
        ],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('[Seed] Seeded ATS-compliant student CV profile.');

    // 7. Seed Notifications
    const seedNotifications = [
      {
        userId,
        title: 'Interview Milestone Tracked 🚀',
        message: 'Upcoming interview with Stripe for Frontend Intern role next week.',
        type: 'interview',
        read: false,
      },
      {
        userId,
        title: 'Stage 1 Completed!',
        message: 'You completed Stage 1: Web Foundations & Core JavaScript in your Frontend Roadmap.',
        type: 'milestone',
        read: false,
      },
      {
        userId,
        title: 'Target Career Set',
        message: 'Target career active: Frontend Developer. Check your updated readiness score on the Dashboard.',
        type: 'system',
        read: true,
      },
    ];

    for (const notif of seedNotifications) {
      await Notification.findOneAndUpdate(
        { userId, title: notif.title },
        { ...notif, userId },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`[Seed] Seeded ${seedNotifications.length} student notifications.`);

    // 8. Seed Pakistan IT Job Sources & Verified Vacancies Catalogue
    for (const src of INITIAL_JOB_SOURCES) {
      await JobSource.findOneAndUpdate(
        { sourceId: src.sourceId },
        { ...src },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`[Seed] Seeded ${INITIAL_JOB_SOURCES.length} verified job sources.`);

    let seededJobCount = 0;
    for (const jobData of INITIAL_PAKISTAN_JOBS) {
      const contentHash = generateJobContentHash(jobData);
      await Job.findOneAndUpdate(
        { contentHash },
        { ...jobData, contentHash, status: 'Active' },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      seededJobCount++;
    }
    console.log(`[Seed] Seeded ${seededJobCount} verified Pakistan IT jobs across all sectors.`);

    console.log('[Seed] Seeding completed successfully! 🌟');
  } catch (error) {
    console.error('[Seed Error] Failed to complete database seeding:', error);
  } finally {
    await closeDatabase();
    process.exit(0);
  }
}

seedDatabase();
