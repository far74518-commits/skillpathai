import { Roadmap } from '../models/Roadmap.js';

export const STARTER_ROADMAPS = {
  'frontend-dev': {
    careerType: 'frontend-dev',
    title: 'Frontend Developer Learning Roadmap',
    description: 'Master web fundamentals, modern React, state architecture, component libraries, and testing to build production-grade web applications.',
    stages: [
      {
        id: 'stg-1',
        title: 'Stage 1: Web Foundations & Core JavaScript',
        badge: 'Foundation',
        tasks: [
          {
            id: 'task-1-1',
            title: 'Semantic HTML5, Accessibility (a11y) & ARIA',
            description: 'Master clean semantic document outline, screen-reader navigation, and WCAG AA accessibility compliance.',
            skills: ['HTML5', 'Accessibility'],
            duration: '1 week',
            project: 'Accessible Multi-page Portfolio Structure',
            completed: true,
            isCustom: false,
          },
          {
            id: 'task-1-2',
            title: 'Modern Responsive CSS, Flexbox, Grid & Variables',
            description: 'Build modern layouts with mobile-first CSS media queries, responsive CSS Grid, and custom design tokens.',
            skills: ['CSS3', 'Flexbox', 'CSS Grid'],
            duration: '1.5 weeks',
            project: 'Responsive Landing Page with Custom CSS Variables',
            completed: true,
            isCustom: false,
          },
          {
            id: 'task-1-3',
            title: 'Modern JavaScript (ES6+), Async/Await & Event Loop',
            description: 'Deep dive into closures, array pipelines, promises, fetch API, and asynchronous concurrency.',
            skills: ['JavaScript', 'Async Programming'],
            duration: '2 weeks',
            project: 'Interactive Weather & Currency Dashboard with REST API',
            completed: false,
            isCustom: false,
          },
        ],
      },
      {
        id: 'stg-2',
        title: 'Stage 2: Modern React Architecture & State Management',
        badge: 'Core Framework',
        tasks: [
          {
            id: 'task-2-1',
            title: 'React Fundamentals, JSX & Custom Hooks',
            description: 'Master useState, useEffect, useRef, and extract reusable custom hooks for form and storage state.',
            skills: ['React', 'Custom Hooks'],
            duration: '2 weeks',
            project: 'Dynamic Task & Kanban Board with Local Storage',
            completed: false,
            isCustom: false,
          },
          {
            id: 'task-2-2',
            title: 'Client-side Routing with React Router v6',
            description: 'Set up dynamic nested routes, protected authentication guards, and URL query params.',
            skills: ['React Router'],
            duration: '1 week',
            project: 'Multi-view Student Portal with Protected Routes',
            completed: false,
            isCustom: false,
          },
          {
            id: 'task-2-3',
            title: 'State Management & Global Context Architecture',
            description: 'Manage app-wide state efficiently with React Context, Reducer patterns, or lightweight stores like Zustand.',
            skills: ['State Architecture', 'Context API'],
            duration: '1.5 weeks',
            project: 'E-Commerce Shopping Cart with Filter State',
            completed: false,
            isCustom: false,
          },
        ],
      },
      {
        id: 'stg-3',
        title: 'Stage 3: TypeScript, Component Libraries & Performance',
        badge: 'Production Ready',
        tasks: [
          {
            id: 'task-3-1',
            title: 'TypeScript for React Applications',
            description: 'Type props, events, hook states, generic API payloads, and strict compiler configs.',
            skills: ['TypeScript'],
            duration: '2 weeks',
            project: 'Type-safe Analytics Dashboard with Recharts',
            completed: false,
            isCustom: false,
          },
          {
            id: 'task-3-2',
            title: 'Automated Testing with Vitest & React Testing Library',
            description: 'Write unit and integration tests for UI components, user interactions, and async API mocks.',
            skills: ['Testing', 'Vitest'],
            duration: '1.5 weeks',
            project: 'Test Suite with 85%+ Coverage for Auth & Form Flows',
            completed: false,
            isCustom: false,
          },
          {
            id: 'task-3-3',
            title: 'Production Build, CI/CD & Cloud Deployment (Vercel/Netlify)',
            description: 'Configure Vite bundling, code splitting, Lighthouse 90+ audits, and automated GitHub Actions deployment.',
            skills: ['CI/CD', 'Web Performance'],
            duration: '1 week',
            project: 'Live Production Capstone with Automated Deployment',
            completed: false,
            isCustom: false,
          },
        ],
      },
    ],
  },
  'fullstack-dev': {
    careerType: 'fullstack-dev',
    title: 'Full-Stack Developer Learning Roadmap',
    description: 'Master full-stack engineering across modern React frontend, Node/Express backend APIs, database modeling, authentication, and cloud deployment.',
    stages: [
      {
        id: 'fs-stg-1',
        title: 'Stage 1: Frontend & Fullstack Fundamentals',
        badge: 'Frontend & Foundations',
        tasks: [
          {
            id: 'fs-1-1',
            title: 'Modern JavaScript & React Component Architecture',
            description: 'Build responsive user interfaces using modular React components and state hooks.',
            skills: ['JavaScript', 'React'],
            duration: '2 weeks',
            project: 'Interactive Fullstack UI Shell',
            completed: true,
            isCustom: false,
          },
          {
            id: 'fs-1-2',
            title: 'Node.js Core & Asynchronous Runtime',
            description: 'Understand the Node event loop, file system, streams, and npm package ecosystem.',
            skills: ['Node.js'],
            duration: '1.5 weeks',
            project: 'Command-line Tool for Project Scaffolding',
            completed: false,
            isCustom: false,
          },
        ],
      },
      {
        id: 'fs-stg-2',
        title: 'Stage 2: Express.js, RESTful APIs & Authentication',
        badge: 'Backend & APIs',
        tasks: [
          {
            id: 'fs-2-1',
            title: 'Express.js REST Architecture & Middleware Pipeline',
            description: 'Design robust RESTful endpoints with input validation, rate limiting, and centralized error handling.',
            skills: ['Express.js', 'REST APIs'],
            duration: '2 weeks',
            project: 'Student Resource & Course Catalog REST API',
            completed: false,
            isCustom: false,
          },
          {
            id: 'fs-2-2',
            title: 'JWT Authentication & Password Security (bcrypt)',
            description: 'Implement secure login, registration, password hashing, and role-based authorization.',
            skills: ['JWT', 'Security', 'Authentication'],
            duration: '1.5 weeks',
            project: 'Secure Auth Service with HTTP-only Cookies',
            completed: false,
            isCustom: false,
          },
        ],
      },
      {
        id: 'fs-stg-3',
        title: 'Stage 3: Databases (MongoDB & PostgreSQL) & Cloud Deploy',
        badge: 'Data & DevOps',
        tasks: [
          {
            id: 'fs-3-1',
            title: 'MongoDB with Mongoose & PostgreSQL with Prisma/SQL',
            description: 'Design normalized and document schemas, define indexes, relations, and aggregations.',
            skills: ['MongoDB', 'PostgreSQL', 'Mongoose'],
            duration: '2.5 weeks',
            project: 'Full-Stack Job Tracker with Relational Filtering',
            completed: false,
            isCustom: false,
          },
          {
            id: 'fs-3-2',
            title: 'Docker Containerization & Cloud Deployment',
            description: 'Dockerize client and server services and deploy to Render, Railway, or AWS.',
            skills: ['Docker', 'DevOps'],
            duration: '1.5 weeks',
            project: 'Live Containerized Production Web App',
            completed: false,
            isCustom: false,
          },
        ],
      },
    ],
  },
  'python-dev': {
    careerType: 'python-dev',
    title: 'Python Developer Learning Roadmap',
    description: 'Master core Python, FastAPI/Django backends, relational database modeling, automated testing, and web scraping.',
    stages: [
      {
        id: 'py-stg-1',
        title: 'Stage 1: Core Python & Object-Oriented Programming',
        badge: 'Core Language',
        tasks: [
          {
            id: 'py-1-1',
            title: 'Advanced Python Syntax, Generators, Decorators & Type Hints',
            description: 'Master modern Python 3.11+ features, context managers, and type annotations.',
            skills: ['Python Core', 'OOP'],
            duration: '2 weeks',
            project: 'Modular CLI Automation Tool',
            completed: true,
            isCustom: false,
          },
          {
            id: 'py-1-2',
            title: 'Data Structures, Algorithms & PyTest Suite',
            description: 'Implement core data structures and write parameterized automated tests.',
            skills: ['PyTest', 'Algorithms'],
            duration: '2 weeks',
            project: 'Tested Data Processing Library',
            completed: false,
            isCustom: false,
          },
        ],
      },
      {
        id: 'py-stg-2',
        title: 'Stage 2: FastAPI, REST APIs & SQL Databases',
        badge: 'Backend Services',
        tasks: [
          {
            id: 'py-2-1',
            title: 'FastAPI High-Performance Async APIs with Pydantic',
            description: 'Build fast async endpoints, dependency injection, and automatic OpenAPI documentation.',
            skills: ['FastAPI', 'Pydantic'],
            duration: '2 weeks',
            project: 'Asynchronous Job Board API',
            completed: false,
            isCustom: false,
          },
          {
            id: 'py-2-2',
            title: 'SQLAlchemy ORM & PostgreSQL Database Migrations (Alembic)',
            description: 'Model relational schemas, foreign keys, and run versioned migrations.',
            skills: ['SQLAlchemy', 'PostgreSQL'],
            duration: '2 weeks',
            project: 'Database-backed Inventory & Reservation Service',
            completed: false,
            isCustom: false,
          },
        ],
      },
    ],
  },
  'data-analyst': {
    careerType: 'data-analyst',
    title: 'Data Analyst Learning Roadmap',
    description: 'Master SQL data extraction, exploratory data analysis with Pandas, statistical modeling, and executive storytelling with Power BI.',
    stages: [
      {
        id: 'da-stg-1',
        title: 'Stage 1: Advanced SQL & Data Extraction',
        badge: 'SQL & Querying',
        tasks: [
          {
            id: 'da-1-1',
            title: 'SQL Joins, Aggregations, Window Functions & CTEs',
            description: 'Query complex multi-table datasets, compute running totals, rankings, and lead/lag metrics.',
            skills: ['SQL', 'Window Functions'],
            duration: '2 weeks',
            project: 'Customer Retention & Cohort SQL Analysis',
            completed: true,
            isCustom: false,
          },
        ],
      },
      {
        id: 'da-stg-2',
        title: 'Stage 2: Python for Data Analysis (Pandas, NumPy, Seaborn)',
        badge: 'EDA & Python',
        tasks: [
          {
            id: 'da-2-1',
            title: 'Data Cleaning, Wrangling & Exploratory Data Analysis',
            description: 'Handle missing values, clean messy datasets, and visualize correlations with Seaborn.',
            skills: ['Pandas', 'NumPy', 'Data Cleaning'],
            duration: '2.5 weeks',
            project: 'Exploratory Analysis of Tech Salaries Dataset',
            completed: false,
            isCustom: false,
          },
        ],
      },
    ],
  },
};

export const roadmapService = {
  getStarterRoadmap(careerType = 'frontend-dev') {
    return STARTER_ROADMAPS[careerType] || STARTER_ROADMAPS['frontend-dev'];
  },

  async getUserRoadmap(userId, careerType = 'frontend-dev') {
    let roadmap = await Roadmap.findOne({ userId, careerType });

    if (!roadmap) {
      // Seed starter roadmap for this user
      const starter = this.getStarterRoadmap(careerType);
      roadmap = await Roadmap.create({
        userId,
        careerType,
        title: starter.title,
        description: starter.description,
        stages: starter.stages,
      });
    }

    return roadmap;
  },

  async toggleTask(userId, careerType, taskId) {
    const roadmap = await this.getUserRoadmap(userId, careerType);
    let taskFound = null;

    roadmap.stages.forEach((stage) => {
      stage.tasks.forEach((t) => {
        if (t.id === taskId) {
          t.completed = !t.completed;
          taskFound = t;
        }
      });
    });

    if (!taskFound) {
      return null;
    }

    await roadmap.save();
    return { roadmap, task: taskFound };
  },

  async addCustomTask(userId, careerType, stageId, taskData) {
    const roadmap = await this.getUserRoadmap(userId, careerType);
    const targetStage = roadmap.stages.find((s) => s.id === stageId) || roadmap.stages[0];

    const newTask = {
      id: 'task_' + Date.now(),
      title: taskData.title,
      description: taskData.description || 'Custom student milestone',
      skills: taskData.skills || ['Self-directed'],
      duration: taskData.duration || '1 week',
      project: taskData.project || '',
      completed: false,
      isCustom: true,
    };

    targetStage.tasks.push(newTask);
    await roadmap.save();
    return { roadmap, task: newTask };
  },

  getNextRecommendedTask(stages = []) {
    for (const stage of stages) {
      for (const task of stage.tasks || []) {
        if (!task.completed) {
          return {
            stageTitle: stage.title,
            ...task.toObject ? task.toObject() : task,
          };
        }
      }
    }
    return null;
  },
};
