export const INITIAL_ROADMAPS = {
  'frontend-dev': {
    careerId: 'frontend-dev',
    title: 'Frontend Development Mastery',
    description: 'From semantic HTML and modern CSS architecture to React component state, asynchronous data fetching, and production deployments.',
    stages: [
      {
        id: 'stage-1',
        title: 'Stage 1: Web Foundations & Core JavaScript',
        level: 'Beginner',
        estimatedWeeks: '4 - 6 weeks',
        description: 'Understand the building blocks of the web: semantic HTML, modern responsive CSS layouts, and idiomatic ES6 JavaScript.',
        tasks: [
          {
            id: 'fe-task-1',
            title: 'HTML5 Semantic Structure & Accessibility (a11y)',
            description: 'Learn modern semantic tags (header, main, section, nav), ARIA attributes, forms, and validation.',
            skills: ['HTML5', 'Accessibility'],
            duration: '8 hours',
            project: 'Build an accessible personal bio and contact page',
            completed: true,
            isCustom: false
          },
          {
            id: 'fe-task-2',
            title: 'Modern CSS3: Flexbox, CSS Grid & Responsive Design',
            description: 'Master 1-dimensional Flexbox layouts, 2-dimensional Grid layouts, media queries, and mobile-first principles.',
            skills: ['CSS3', 'Flexbox', 'CSS Grid', 'Responsive Design'],
            duration: '14 hours',
            project: 'Build a multi-device responsive landing page',
            completed: true,
            isCustom: false
          },
          {
            id: 'fe-task-3',
            title: 'Modern JavaScript (ES6+): DOM & Event Loop',
            description: 'Arrow functions, destructuring, template literals, map/filter/reduce, DOM manipulation, and asynchronous promises.',
            skills: ['JavaScript', 'DOM Manipulation', 'Async/Await'],
            duration: '20 hours',
            project: 'Create an interactive task manager with local storage',
            completed: true,
            isCustom: false
          },
          {
            id: 'fe-task-4',
            title: 'Git Version Control & GitHub Collaborative Workflows',
            description: 'Branching, committing, pull requests, resolving merge conflicts, and publishing repos.',
            skills: ['Git', 'GitHub'],
            duration: '6 hours',
            project: 'Initialize and push a project with clear README markdown',
            completed: false,
            isCustom: false
          }
        ]
      },
      {
        id: 'stage-2',
        title: 'Stage 2: Modern React & State Management',
        level: 'Intermediate',
        estimatedWeeks: '6 - 8 weeks',
        description: 'Deep dive into component-driven architecture, custom hooks, client-side routing, and external REST API consumption.',
        tasks: [
          {
            id: 'fe-task-5',
            title: 'React Fundamentals: JSX, Props & State',
            description: 'Deconstruct complex UIs into clean functional components with useState and conditional rendering.',
            skills: ['React.js', 'Component Architecture'],
            duration: '15 hours',
            project: 'Build an interactive product catalog with search & filter',
            completed: false,
            isCustom: false
          },
          {
            id: 'fe-task-6',
            title: 'React Hooks Mastery: useEffect, useMemo, useRef & Custom Hooks',
            description: 'Managing side effects, component lifecycles, performance caching, and extracting reusable domain logic.',
            skills: ['React Hooks', 'Custom Hooks'],
            duration: '16 hours',
            project: 'Build a custom useLocalStorage and useDebounce hook library',
            completed: false,
            isCustom: false
          },
          {
            id: 'fe-task-7',
            title: 'Client-Side Routing with React Router v6',
            description: 'Nested routes, URL params, navigation guards, 404 pages, and dynamic breadcrumbs.',
            skills: ['React Router', 'SPA Navigation'],
            duration: '10 hours',
            project: 'Implement a multi-page student portal with route parameters',
            completed: false,
            isCustom: false
          },
          {
            id: 'fe-task-8',
            title: 'Asynchronous Data Fetching & Error Boundaries',
            description: 'Fetching REST APIs with fetch/axios, handling loading skeletons, network retry logic, and error boundaries.',
            skills: ['REST APIs', 'Async State', 'Error Handling'],
            duration: '12 hours',
            project: 'Weather & Forecast Dashboard connected to OpenWeather API',
            completed: false,
            isCustom: false
          }
        ]
      },
      {
        id: 'stage-3',
        title: 'Stage 3: Advanced Frontend & Production Readiness',
        level: 'Advanced',
        estimatedWeeks: '4 - 6 weeks',
        description: 'Optimize web performance, master TypeScript type safety, implement automated testing, and deploy CI/CD pipelines.',
        tasks: [
          {
            id: 'fe-task-9',
            title: 'Frontend Performance & Core Web Vitals Optimization',
            description: 'Code splitting, dynamic imports (React.lazy), asset compression, lazy loading images, and Lighthouse audits.',
            skills: ['Web Performance', 'Core Web Vitals'],
            duration: '14 hours',
            project: 'Audit and achieve 95+ Lighthouse score on a complex web app',
            completed: false,
            isCustom: false
          },
          {
            id: 'fe-task-10',
            title: 'TypeScript with React Essentials',
            description: 'Static typing for props, state, event handlers, generics, and strict null checks.',
            skills: ['TypeScript', 'Static Typing'],
            duration: '18 hours',
            project: 'Refactor a standard React component set into strict TypeScript',
            completed: false,
            isCustom: false
          },
          {
            id: 'fe-task-11',
            title: 'Automated Testing: Vitest & React Testing Library',
            description: 'Unit testing utility functions, component rendering tests, and simulating user interactions.',
            skills: ['Unit Testing', 'React Testing Library'],
            duration: '15 hours',
            project: 'Write 10+ comprehensive unit and integration tests for a checkout form',
            completed: false,
            isCustom: false
          }
        ]
      }
    ]
  },
  'fullstack-dev': {
    careerId: 'fullstack-dev',
    title: 'Full-Stack Developer Roadmap',
    description: 'Master full-cycle web engineering from interactive React frontends to robust Node.js/Express backends and SQL databases.',
    stages: [
      {
        id: 'fs-stage-1',
        title: 'Stage 1: Frontend Foundations & UI Architecture',
        level: 'Beginner',
        estimatedWeeks: '6 weeks',
        description: 'Build strong frontend capabilities in HTML5, CSS3, JavaScript ES6+, and React state management.',
        tasks: [
          {
            id: 'fs-task-1',
            title: 'Frontend Fundamentals & React Components',
            description: 'Learn modern React hooks, state management, and responsive CSS styling.',
            skills: ['React.js', 'CSS3', 'JavaScript'],
            duration: '20 hours',
            project: 'Frontend UI for an e-commerce catalog',
            completed: true,
            isCustom: false
          },
          {
            id: 'fs-task-2',
            title: 'Git Workflows & Collaborative Branching',
            description: 'Feature branching, git rebase, pull request reviews, and issue tracking.',
            skills: ['Git', 'GitHub'],
            duration: '8 hours',
            project: 'Create a clean repository with branch protection rules',
            completed: true,
            isCustom: false
          }
        ]
      },
      {
        id: 'fs-stage-2',
        title: 'Stage 2: Backend REST APIs & Relational Databases',
        level: 'Intermediate',
        estimatedWeeks: '8 weeks',
        description: 'Server architecture with Node.js, Express, PostgreSQL relational modeling, and secure JWT authentication.',
        tasks: [
          {
            id: 'fs-task-3',
            title: 'Node.js & Express REST API Architecture',
            description: 'Routing, middleware, request validation, error handling, and environment variables.',
            skills: ['Node.js', 'Express.js', 'REST APIs'],
            duration: '22 hours',
            project: 'Full CRUD REST API for a student course management system',
            completed: false,
            isCustom: false
          },
          {
            id: 'fs-task-4',
            title: 'PostgreSQL Relational Data Modeling & SQL Queries',
            description: 'Table schemas, foreign keys, inner/outer joins, transactions, and indexing.',
            skills: ['PostgreSQL', 'SQL', 'Databases'],
            duration: '20 hours',
            project: 'Schema design and relational queries for an orders & customers platform',
            completed: false,
            isCustom: false
          },
          {
            id: 'fs-task-5',
            title: 'User Authentication with JWT & Bcrypt Password Hashing',
            description: 'Secure password hashing, token expiration, refresh tokens, and protected API routes.',
            skills: ['Authentication', 'JWT', 'Security'],
            duration: '16 hours',
            project: 'Complete auth system with login, register, and role authorization',
            completed: false,
            isCustom: false
          }
        ]
      },
      {
        id: 'fs-stage-3',
        title: 'Stage 3: Full-Stack Integration, Docker & Deployment',
        level: 'Advanced',
        estimatedWeeks: '6 weeks',
        description: 'Deploy full-stack applications to cloud servers, containerize with Docker, and configure automated CI/CD.',
        tasks: [
          {
            id: 'fs-task-6',
            title: 'Docker Containerization for Full-Stack Apps',
            description: 'Writing Dockerfiles, multi-stage builds, and Docker Compose for frontend, backend, and PostgreSQL.',
            skills: ['Docker', 'DevOps', 'Containers'],
            duration: '16 hours',
            project: 'Containerize an Express + Postgres + React app with docker-compose up',
            completed: false,
            isCustom: false
          },
          {
            id: 'fs-task-7',
            title: 'Cloud Deployment & CI/CD GitHub Actions',
            description: 'Automated test runners, deploying backend to Render/Fly.io, and frontend to Vercel.',
            skills: ['CI/CD', 'Cloud Deployment'],
            duration: '14 hours',
            project: 'Deploy a live full-stack application with automated staging deployments',
            completed: false,
            isCustom: false
          }
        ]
      }
    ]
  },
  'python-dev': {
    careerId: 'python-dev',
    title: 'Python Software Engineer Roadmap',
    description: 'Master core Python, object-oriented software design, asynchronous FastAPI backends, and automated web scrapers.',
    stages: [
      {
        id: 'py-stage-1',
        title: 'Stage 1: Core Python & Object-Oriented Programming',
        level: 'Beginner',
        estimatedWeeks: '4 - 5 weeks',
        description: 'Python syntax, data structures (lists, dicts, sets, tuples), OOP classes, exceptions, and file I/O.',
        tasks: [
          {
            id: 'py-task-1',
            title: 'Python Syntax, Control Flow & Data Structures',
            description: 'List comprehensions, dictionary operations, generators, and standard library modules.',
            skills: ['Python', 'Data Structures'],
            duration: '16 hours',
            project: 'Command-line student gradebook and GPA calculator',
            completed: true,
            isCustom: false
          },
          {
            id: 'py-task-2',
            title: 'Object-Oriented Programming & Clean Architecture',
            description: 'Classes, inheritance, polymorphism, encapsulation, dunder methods, and dataclasses.',
            skills: ['OOP', 'Python'],
            duration: '18 hours',
            project: 'Bank account simulator with transaction logs and exception handling',
            completed: false,
            isCustom: false
          }
        ]
      },
      {
        id: 'py-stage-2',
        title: 'Stage 2: FastAPI, Databases & Async Programming',
        level: 'Intermediate',
        estimatedWeeks: '6 - 8 weeks',
        description: 'Build fast asynchronous REST APIs with FastAPI, Pydantic data validation, and SQLAlchemy ORM.',
        tasks: [
          {
            id: 'py-task-3',
            title: 'FastAPI Backend Architecture & Pydantic Validation',
            description: 'Dependency injection, path parameters, automatic OpenAPI documentation, and response schemas.',
            skills: ['FastAPI', 'REST APIs', 'Pydantic'],
            duration: '20 hours',
            project: 'Build a production-ready Books & Authors API with automatic Swagger docs',
            completed: false,
            isCustom: false
          },
          {
            id: 'py-task-4',
            title: 'SQLAlchemy 2.0 ORM & Database Migrations (Alembic)',
            description: 'Database models, asynchronous sessions, foreign keys, migrations, and query optimization.',
            skills: ['SQLAlchemy', 'Databases', 'Alembic'],
            duration: '18 hours',
            project: 'Integrate persistent SQLite/PostgreSQL into your FastAPI application',
            completed: false,
            isCustom: false
          }
        ]
      },
      {
        id: 'py-stage-3',
        title: 'Stage 3: Testing, Automation & Production Pipelines',
        level: 'Advanced',
        estimatedWeeks: '4 - 6 weeks',
        description: 'Automated testing with PyTest, background task queues with Celery, and packaging Python applications.',
        tasks: [
          {
            id: 'py-task-5',
            title: 'Automated Testing with PyTest & Mocking',
            description: 'Fixtures, parameterized tests, test coverage metrics, and mock external API dependencies.',
            skills: ['PyTest', 'Testing', 'Mocking'],
            duration: '15 hours',
            project: 'Write 90%+ coverage test suite for the FastAPI backend',
            completed: false,
            isCustom: false
          },
          {
            id: 'py-task-6',
            title: 'Web Scraping & Background Automation',
            description: 'Scraping web data with BeautifulSoup and Playwright, handling pagination and rate limiting.',
            skills: ['Web Scraping', 'Automation'],
            duration: '16 hours',
            project: 'Automated tech internship scraper sending daily summary email digests',
            completed: false,
            isCustom: false
          }
        ]
      }
    ]
  },
  'data-analyst': {
    careerId: 'data-analyst',
    title: 'Data Analyst Career Roadmap',
    description: 'Transform raw datasets into actionable executive insights with advanced SQL, Python data wrangling, and BI dashboards.',
    stages: [
      {
        id: 'da-stage-1',
        title: 'Stage 1: Excel Mastery & Analytical SQL',
        level: 'Beginner',
        estimatedWeeks: '4 - 6 weeks',
        description: 'Master spreadsheets, exploratory data cleaning, and core SQL queries with joins and aggregations.',
        tasks: [
          {
            id: 'da-task-1',
            title: 'Advanced Spreadsheets (Excel & Google Sheets)',
            description: 'Pivot tables, XLOOKUP, INDEX/MATCH, conditional formatting, and chart building.',
            skills: ['Excel', 'Spreadsheets', 'Data Cleaning'],
            duration: '14 hours',
            project: 'Clean and summarize a 10,000-row retail sales dataset with pivot dashboards',
            completed: true,
            isCustom: false
          },
          {
            id: 'da-task-2',
            title: 'SQL for Data Analysis: Joins, Group By & Subqueries',
            description: 'Filtering, grouping, aggregate functions, multiple table joins, and nested subqueries.',
            skills: ['SQL', 'Data Querying', 'Databases'],
            duration: '18 hours',
            project: 'Answer 15 real-world business intelligence questions on a sample database',
            completed: false,
            isCustom: false
          }
        ]
      },
      {
        id: 'da-stage-2',
        title: 'Stage 2: Python for Data Analysis (Pandas, NumPy)',
        level: 'Intermediate',
        estimatedWeeks: '6 - 8 weeks',
        description: 'Clean messy real-world data, perform statistical analysis, and generate exploratory charts with Pandas and Seaborn.',
        tasks: [
          {
            id: 'da-task-3',
            title: 'Data Wrangling & Cleaning with Pandas',
            description: 'DataFrames, handling missing values, date manipulation, merging datasets, and groupby aggregations.',
            skills: ['Python', 'Pandas', 'Data Wrangling'],
            duration: '22 hours',
            project: 'Clean and normalize messy public health or education datasets',
            completed: false,
            isCustom: false
          },
          {
            id: 'da-task-4',
            title: 'Data Visualization & Statistical Storytelling',
            description: 'Chart types selection, distribution analysis, correlation heatmaps with Matplotlib and Seaborn.',
            skills: ['Data Visualization', 'Storytelling', 'Statistics'],
            duration: '16 hours',
            project: 'Publish a comprehensive Exploratory Data Analysis (EDA) Jupyter notebook',
            completed: false,
            isCustom: false
          }
        ]
      },
      {
        id: 'da-stage-3',
        title: 'Stage 3: Advanced SQL, BI Dashboards & Stakeholder Reporting',
        level: 'Advanced',
        estimatedWeeks: '4 - 6 weeks',
        description: 'SQL window functions, Common Table Expressions (CTEs), and building interactive Power BI or Tableau dashboards.',
        tasks: [
          {
            id: 'da-task-5',
            title: 'Advanced SQL: Window Functions & CTEs',
            description: 'ROW_NUMBER, RANK, DENSE_RANK, LAG/LEAD, running totals, and recursive queries.',
            skills: ['Advanced SQL', 'Window Functions', 'CTEs'],
            duration: '16 hours',
            project: 'Compute monthly retention rates, churn, and cohort metrics using SQL',
            completed: false,
            isCustom: false
          },
          {
            id: 'da-task-6',
            title: 'Interactive Dashboard Building (Power BI / Tableau / Metabase)',
            description: 'Data modeling, DAX / calculated fields, KPI cards, filters, and executive storytelling.',
            skills: ['Power BI', 'Business Intelligence', 'Dashboards'],
            duration: '20 hours',
            project: 'Build an executive SaaS metrics dashboard with live filter controls',
            completed: false,
            isCustom: false
          }
        ]
      }
    ]
  },
  'cybersecurity-analyst': {
    careerId: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst & Threat Defense Roadmap',
    description: 'Master network security protocols, vulnerability assessments, SIEM log analysis, penetration testing tools, and SOC incident response.',
    stages: [
      {
        id: 'cyber-stage-1',
        title: 'Stage 1: Security Foundations, Linux & Networking',
        level: 'Beginner',
        estimatedWeeks: '6 - 8 weeks',
        description: 'Understand core network protocols (TCP/IP), master Linux command-line system administration, and learn defensive security principles.',
        tasks: [
          {
            id: 'cyber-task-1',
            title: 'Networking Fundamentals & TCP/IP Architecture',
            description: 'Master OSI 7-layer model, TCP 3-way handshake, subnetting, IPv4/IPv6, DNS, DHCP, ARP, and HTTP/HTTPS protocols.',
            skills: ['Network Protocols (TCP/IP)', 'Networking', 'DNS'],
            duration: '18 hours',
            project: 'Inspect TCP three-way handshakes and DNS queries using Wireshark',
            completed: true,
            isCustom: false
          },
          {
            id: 'cyber-task-2',
            title: 'Linux Administration for Security Professionals',
            description: 'Linux file permissions (chmod/chown), process auditing (ps/top), SSH key hardening, systemd services, and bash scripting.',
            skills: ['Linux Administration', 'Bash Scripting', 'SSH'],
            duration: '20 hours',
            project: 'Harden a Linux server configuration with UFW firewall and automated audit logs',
            completed: true,
            isCustom: false
          },
          {
            id: 'cyber-task-3',
            title: 'Applied Cryptography & Public Key Infrastructure (PKI)',
            description: 'Symmetric encryption (AES-256), asymmetric cryptography (RSA, ECC), cryptographic hashing (SHA-256), and SSL/TLS certificates.',
            skills: ['Cryptography', 'PKI', 'SSL/TLS'],
            duration: '14 hours',
            project: 'Build a secure file encryptor and integrity verification tool in Python',
            completed: false,
            isCustom: false
          }
        ]
      },
      {
        id: 'cyber-stage-2',
        title: 'Stage 2: Threat Detection, OWASP & Vulnerability Assessment',
        level: 'Intermediate',
        estimatedWeeks: '8 - 10 weeks',
        description: 'Analyze network packets with Wireshark, audit web vulnerabilities via OWASP Top 10, and perform host-based threat hunting.',
        tasks: [
          {
            id: 'cyber-task-4',
            title: 'Wireshark Deep Packet Inspection & Traffic Forensics',
            description: 'Capturing live network traffic, display filters, detecting SYN flood attacks, ARP poisoning, credential sniffing, and malware beaconing.',
            skills: ['Wireshark Packet Analysis', 'Network Forensics', 'Traffic Analysis'],
            duration: '22 hours',
            project: 'Investigate a simulated pcap network breach and identify compromised host IPs',
            completed: false,
            isCustom: false
          },
          {
            id: 'cyber-task-5',
            title: 'OWASP Top 10 Web Application Vulnerabilities',
            description: 'Understanding and exploiting SQL injection, XSS, CSRF, broken access control, security misconfigurations, and SSRF remediation.',
            skills: ['OWASP Top 10 Security', 'Web Security', 'Vulnerability Assessment'],
            duration: '24 hours',
            project: 'Audit OWASP Juice Shop or DVWA and produce an executive vulnerability remediation report',
            completed: false,
            isCustom: false
          },
          {
            id: 'cyber-task-6',
            title: 'Threat Detection & Endpoint Security (EDR / Antivirus)',
            description: 'Host-based intrusion detection, Windows Event Log analysis, Sysinternals tools (Sysmon), and endpoint detection & response.',
            skills: ['Threat Detection', 'Endpoint Security', 'Sysmon'],
            duration: '18 hours',
            project: 'Deploy Sysmon on Windows/Linux and configure alerts for suspicious PowerShell executions',
            completed: false,
            isCustom: false
          }
        ]
      },
      {
        id: 'cyber-stage-3',
        title: 'Stage 3: SIEM Operations, SOC Incident Response & Cloud Security',
        level: 'Advanced',
        estimatedWeeks: '6 - 8 weeks',
        description: 'Deploy SIEM platforms (Splunk / Elastic ELK / Wazuh), map attacks with MITRE ATT&CK, and execute incident response procedures.',
        tasks: [
          {
            id: 'cyber-task-7',
            title: 'SIEM Operations with Splunk & Wazuh',
            description: 'Log ingestion, writing SPL / KQL search queries, creating SOC correlation rules, and designing executive security dashboards.',
            skills: ['SIEM (Splunk / Wazuh)', 'SOC Operations', 'Log Analysis'],
            duration: '25 hours',
            project: 'Build a centralized Wazuh SOC dashboard alerting on brute-force login attempts',
            completed: false,
            isCustom: false
          },
          {
            id: 'cyber-task-8',
            title: 'Incident Response & MITRE ATT&CK Framework',
            description: 'NIST incident response phases (Preparation, Detection, Containment, Eradication, Recovery), malware triage, and attack chain mapping.',
            skills: ['Incident Response', 'MITRE ATT&CK', 'Forensics'],
            duration: '20 hours',
            project: 'Simulate a ransomware outbreak and write a complete Incident Response Playbook',
            completed: false,
            isCustom: false
          },
          {
            id: 'cyber-task-9',
            title: 'Cloud Security Posture & Zero-Trust Architecture',
            description: 'Cloud IAM least privilege, AWS GuardDuty/CloudTrail audit, network segmentation, and Zero Trust access management.',
            skills: ['Cloud Security', 'Zero Trust', 'IAM Policies'],
            duration: '16 hours',
            project: 'Perform a comprehensive cloud security posture assessment on AWS/Azure infrastructure',
            completed: false,
            isCustom: false
          }
        ]
      }
    ]
  },
  'devops-engineer': {
    careerId: 'devops-engineer',
    title: 'DevOps & Cloud Systems Engineer Roadmap',
    description: 'Master Linux systems, Docker containerization, Kubernetes cluster orchestration, Terraform Infrastructure as Code, and CI/CD automation.',
    stages: [
      {
        id: 'devops-stage-1',
        title: 'Stage 1: Linux, Networking & Version Control Mastery',
        level: 'Beginner',
        estimatedWeeks: '6 - 8 weeks',
        description: 'Build strong systems foundations in Linux, Bash automation, TCP/IP networking, and collaborative Git branching.',
        tasks: [
          {
            id: 'devops-task-1',
            title: 'Linux Systems Administration & Bash Automation',
            description: 'Master Linux CLI, cron automation, process management (systemd, journalctl), file permissions, and shell scripting.',
            skills: ['Linux & Bash Scripting', 'System Administration', 'Automation'],
            duration: '20 hours',
            project: 'Create an automated server health monitor and rotating backup script',
            completed: true,
            isCustom: false
          },
          {
            id: 'devops-task-2',
            title: 'Networking, Nginx Reverse Proxy & SSL Certificates',
            description: 'DNS records (A, CNAME, MX), HTTP/HTTPS, SSL/TLS Let’s Encrypt Certbot, Nginx reverse proxy configuration, and load balancing.',
            skills: ['Nginx', 'Networking Protocols', 'SSL/TLS'],
            duration: '16 hours',
            project: 'Configure Nginx as a reverse proxy with SSL termination and rate limiting',
            completed: true,
            isCustom: false
          },
          {
            id: 'devops-task-3',
            title: 'Git Version Control & GitOps Collaboration',
            description: 'Branching strategies (Trunk-based, GitFlow), merge conflicts, rebase, and semantic release tagging.',
            skills: ['Git Version Control', 'GitOps'],
            duration: '10 hours',
            project: 'Set up a repository with branch protection rules, linting, and semantic versioning',
            completed: false,
            isCustom: false
          }
        ]
      },
      {
        id: 'devops-stage-2',
        title: 'Stage 2: Docker Containers & Automated CI/CD Pipelines',
        level: 'Intermediate',
        estimatedWeeks: '8 - 10 weeks',
        description: 'Containerize multi-tier applications, manage registries, and build automated build/test/deploy pipelines.',
        tasks: [
          {
            id: 'devops-task-4',
            title: 'Docker Containerization & Multi-Stage Builds',
            description: 'Writing production Dockerfiles, image layer caching, non-root user security, and multi-service Docker Compose networks.',
            skills: ['Docker Containers', 'Containerization', 'Docker Compose'],
            duration: '22 hours',
            project: 'Containerize a 3-tier web application (React, Node API, PostgreSQL) with Docker Compose',
            completed: false,
            isCustom: false
          },
          {
            id: 'devops-task-5',
            title: 'CI/CD Pipelines with GitHub Actions & GitLab CI',
            description: 'Workflow triggers, test automation, matrix builds, secret management, Docker image publishing to GitHub Container Registry.',
            skills: ['CI/CD Pipelines', 'GitHub Actions', 'Automation'],
            duration: '20 hours',
            project: 'Build an automated CI/CD pipeline that tests code and pushes tagged Docker images on pull request merge',
            completed: false,
            isCustom: false
          },
          {
            id: 'devops-task-6',
            title: 'Cloud Infrastructure Essentials (AWS / Azure)',
            description: 'Virtual Private Cloud (VPC), EC2/VM instances, S3 object storage, IAM roles, security groups, and cloud pricing.',
            skills: ['AWS / Azure Cloud', 'Cloud Computing', 'IAM'],
            duration: '18 hours',
            project: 'Deploy a resilient web application on AWS EC2 behind an Application Load Balancer',
            completed: false,
            isCustom: false
          }
        ]
      },
      {
        id: 'devops-stage-3',
        title: 'Stage 3: Kubernetes Orchestration, Terraform IaC & Observability',
        level: 'Advanced',
        estimatedWeeks: '6 - 8 weeks',
        description: 'Deploy Kubernetes clusters, automate infrastructure with Terraform, and configure Prometheus/Grafana monitoring.',
        tasks: [
          {
            id: 'devops-task-7',
            title: 'Kubernetes Cluster Architecture & Helm Deployments',
            description: 'Pods, ReplicaSets, Deployments, Services (ClusterIP/NodePort/LoadBalancer), Ingress NGINX, ConfigMaps, Secrets, and Helm packaging.',
            skills: ['Kubernetes Clusters', 'Helm', 'Container Orchestration'],
            duration: '26 hours',
            project: 'Deploy a high-availability microservice application to a Kubernetes cluster using custom Helm charts',
            completed: false,
            isCustom: false
          },
          {
            id: 'devops-task-8',
            title: 'Infrastructure as Code (IaC) with Terraform',
            description: 'Terraform providers, state locking with S3/DynamoDB, reusable modules, variable interpolation, and plan/apply workflows.',
            skills: ['Terraform', 'Infrastructure as Code', 'Cloud Automation'],
            duration: '20 hours',
            project: 'Provision a complete cloud VPC, database cluster, and compute network entirely through Terraform code',
            completed: false,
            isCustom: false
          },
          {
            id: 'devops-task-9',
            title: 'Observability & Monitoring (Prometheus & Grafana)',
            description: 'Metrics scraping with Prometheus, alerting rules, Alertmanager, custom Grafana dashboards, and distributed tracing.',
            skills: ['Prometheus', 'Grafana', 'Observability'],
            duration: '16 hours',
            project: 'Build a production Grafana dashboard monitoring cluster CPU, memory, request latency, and HTTP 5xx error spikes',
            completed: false,
            isCustom: false
          }
        ]
      }
    ]
  },
  'backend-dev': {
    careerId: 'backend-dev',
    title: 'Backend Developer & API Architecture Roadmap',
    description: 'Design robust server architectures, relational and NoSQL databases, secure authentication systems, caching layers, and microservices.',
    stages: [
      {
        id: 'be-stage-1',
        title: 'Stage 1: Server Runtime, REST APIs & SQL Modeling',
        level: 'Beginner',
        estimatedWeeks: '6 - 8 weeks',
        description: 'Server fundamentals in Node.js/Express or Python, relational database modeling with PostgreSQL, and RESTful API conventions.',
        tasks: [
          {
            id: 'be-task-1',
            title: 'Node.js & Express REST API Architecture',
            description: 'HTTP methods, routing, controller-service pattern, middleware, error handling, and environment variables.',
            skills: ['Node.js & Express.js', 'RESTful API & Auth', 'Backend Architecture'],
            duration: '22 hours',
            project: 'Build a comprehensive REST API for a course enrollment system with input validation',
            completed: true,
            isCustom: false
          },
          {
            id: 'be-task-2',
            title: 'PostgreSQL Relational Schema Design & SQL Queries',
            description: 'Table schemas, primary/foreign keys, joins, aggregations, database indexing, transactions, and ACID compliance.',
            skills: ['PostgreSQL / SQL', 'Database Design', 'Relational Modeling'],
            duration: '20 hours',
            project: 'Design normalized schema and complex analytics queries for an online marketplace',
            completed: true,
            isCustom: false
          },
          {
            id: 'be-task-3',
            title: 'Authentication & Authorization with JWT & Bcrypt',
            description: 'Password hashing, access tokens, refresh tokens, role-based access control (RBAC), and protected route middleware.',
            skills: ['RESTful API & Auth', 'JWT', 'Security'],
            duration: '16 hours',
            project: 'Implement a secure authentication microservice with refresh token rotation',
            completed: false,
            isCustom: false
          }
        ]
      },
      {
        id: 'be-stage-2',
        title: 'Stage 2: Python / FastAPI, Caching & Task Queues',
        level: 'Intermediate',
        estimatedWeeks: '8 - 10 weeks',
        description: 'High-performance Python/FastAPI services, Redis in-memory caching, and asynchronous background worker queues.',
        tasks: [
          {
            id: 'be-task-4',
            title: 'Python & FastAPI High-Performance Microservices',
            description: 'Async/await runtime, Pydantic type validation, dependency injection, and automatic OpenAPI documentation.',
            skills: ['Python & FastAPI', 'Asynchronous APIs', 'Pydantic'],
            duration: '20 hours',
            project: 'Build a high-throughput search and filtering API with FastAPI and SQLite/Postgres',
            completed: false,
            isCustom: false
          },
          {
            id: 'be-task-5',
            title: 'Redis In-Memory Caching & Rate Limiting',
            description: 'Cache-aside strategy, TTL expiration, cache invalidation patterns, and Redis token-bucket rate limiters.',
            skills: ['Redis', 'Caching', 'Performance Optimization'],
            duration: '14 hours',
            project: 'Accelerate API response times by 80% using Redis caching for database queries',
            completed: false,
            isCustom: false
          },
          {
            id: 'be-task-6',
            title: 'Background Task Processing with BullMQ / Celery',
            description: 'Message queues, job workers, scheduled cron tasks, retry policies, and dead-letter queues.',
            skills: ['Task Queues', 'Background Workers', 'Asynchronous Processing'],
            duration: '16 hours',
            project: 'Build an automated background email dispatch and invoice PDF generation worker',
            completed: false,
            isCustom: false
          }
        ]
      },
      {
        id: 'be-stage-3',
        title: 'Stage 3: Docker, System Design & Cloud Production',
        level: 'Advanced',
        estimatedWeeks: '6 - 8 weeks',
        description: 'Containerize backend services, design scalable distributed systems, and implement automated testing & cloud CI/CD.',
        tasks: [
          {
            id: 'be-task-7',
            title: 'Docker Basics & Multi-Container Systems',
            description: 'Dockerfiles for backend runtimes, multi-stage builds, docker-compose orchestration with databases and Redis.',
            skills: ['Docker Basics', 'Containers', 'DevOps'],
            duration: '16 hours',
            project: 'Containerize backend API, PostgreSQL database, and Redis cache with one-command launch',
            completed: false,
            isCustom: false
          },
          {
            id: 'be-task-8',
            title: 'System Design: Scalability, Load Balancing & Sharding',
            description: 'Vertical vs horizontal scaling, database replication, read replicas, database sharding, and CDN caching.',
            skills: ['System Design', 'Scalability', 'Database Replication'],
            duration: '20 hours',
            project: 'Write an architectural technical spec for scaling a system to 100,000 concurrent users',
            completed: false,
            isCustom: false
          },
          {
            id: 'be-task-9',
            title: 'Automated Testing, CI/CD & Production Deployment',
            description: 'Unit & integration testing with Jest/Supertest or PyTest, GitHub Actions CI/CD, and deploying to cloud containers.',
            skills: ['Git Workflows', 'Testing', 'Cloud Deployment'],
            duration: '18 hours',
            project: 'Deploy a live containerized REST API with 90%+ automated test coverage',
            completed: false,
            isCustom: false
          }
        ]
      }
    ]
  },
  'ui-ux-designer': {
    careerId: 'ui-ux-designer',
    title: 'UI/UX Product Designer Roadmap',
    description: 'Master user research, wireframing, Figma design systems, interactive prototyping, usability testing, and developer handoff.',
    stages: [
      {
        id: 'ux-stage-1',
        title: 'Stage 1: Design Fundamentals, UX Research & Wireframing',
        level: 'Beginner',
        estimatedWeeks: '4 - 6 weeks',
        description: 'Understand user experience principles, conduct empathetic user research, and sketch intuitive wireframes.',
        tasks: [
          {
            id: 'ux-task-1',
            title: 'User Research, Personas & Customer Journey Mapping',
            description: 'Conducting user interviews, empathy maps, target personas, problem framing, and mapping end-to-end user journeys.',
            skills: ['User Research & Personas', 'UX Strategy', 'Journey Mapping'],
            duration: '16 hours',
            project: 'Conduct user research and produce 2 detailed persona profiles with journey pain-points',
            completed: true,
            isCustom: false
          },
          {
            id: 'ux-task-2',
            title: 'Information Architecture & Low-Fidelity Wireframes',
            description: 'Sitemaps, card sorting, low-fidelity wireframing in Figma, and defining user navigation flows.',
            skills: ['Wireframing & Prototyping', 'Information Architecture'],
            duration: '18 hours',
            project: 'Create low-fidelity wireframes for a 5-screen student internship application flow',
            completed: true,
            isCustom: false
          },
          {
            id: 'ux-task-3',
            title: 'Visual Design Fundamentals: Typography & Color Theory',
            description: '8pt grid system, typographic hierarchy, color psychology, 60-30-10 color rule, and optical balance.',
            skills: ['Visual Design', 'Typography', 'Color Theory'],
            duration: '14 hours',
            project: 'Design a harmonious design style guide including font scales and color palettes',
            completed: false,
            isCustom: false
          }
        ]
      },
      {
        id: 'ux-stage-2',
        title: 'Stage 2: Advanced Figma Mastery & Design Systems',
        level: 'Intermediate',
        estimatedWeeks: '6 - 8 weeks',
        description: 'Build production-grade Figma design systems using nested auto-layout, component variants, and accessibility standards.',
        tasks: [
          {
            id: 'ux-task-4',
            title: 'Figma Auto-Layout & Component Variants',
            description: 'Master nested auto-layout (fill, hug, fixed), component properties (boolean, text, instance swap), and interactive states.',
            skills: ['Figma Auto-Layout', 'Design Systems', 'UI Components'],
            duration: '22 hours',
            project: 'Build a comprehensive UI component library with buttons, text fields, cards, and navigation bars',
            completed: false,
            isCustom: false
          },
          {
            id: 'ux-task-5',
            title: 'Design Systems & WCAG Accessibility Standards',
            description: 'Design tokens, color contrast compliance (WCAG 2.1 AA/AAA), keyboard accessibility, and screen reader considerations.',
            skills: ['Design Systems', 'WCAG Accessibility', 'Design Tokens'],
            duration: '18 hours',
            project: 'Conduct an accessibility audit on an existing interface and publish an accessible design system',
            completed: false,
            isCustom: false
          },
          {
            id: 'ux-task-6',
            title: 'Interactive High-Fidelity Prototyping & Micro-Interactions',
            description: 'Smart animate transitions, interactive component states, mobile gestures, modal overlays, and micro-interactions.',
            skills: ['Wireframing & Prototyping', 'Micro-Interactions', 'Smart Animate'],
            duration: '20 hours',
            project: 'Create a fully interactive clickable prototype of a mobile banking dashboard in Figma',
            completed: false,
            isCustom: false
          }
        ]
      },
      {
        id: 'ux-stage-3',
        title: 'Stage 3: Usability Testing, Developer Handoff & Portfolio',
        level: 'Advanced',
        estimatedWeeks: '4 - 6 weeks',
        description: 'Validate designs through usability testing, prepare developer handoff specifications, and publish polished case studies.',
        tasks: [
          {
            id: 'ux-task-7',
            title: 'Usability Testing & Iterative Design Refinement',
            description: 'Moderated user testing sessions, task completion metrics, heatmaps, synthesizing feedback, and design iterations.',
            skills: ['Usability Testing', 'User Research & Personas', 'Feedback Synthesis'],
            duration: '16 hours',
            project: 'Conduct 5 usability testing sessions on your prototype and document design iterations',
            completed: false,
            isCustom: false
          },
          {
            id: 'ux-task-8',
            title: 'Developer Handoff & HTML/CSS Principles',
            description: 'Redline documentation, exporting assets, understanding CSS Flexbox/Grid constraints, and developer handoff meetings.',
            skills: ['HTML & CSS Basics', 'Developer Handoff', 'Design Specs'],
            duration: '14 hours',
            project: 'Prepare a production-ready Figma handoff file with spacing tokens, specs, and CSS exports',
            completed: false,
            isCustom: false
          },
          {
            id: 'ux-task-9',
            title: 'Publishing a Comprehensive UX Portfolio Case Study',
            description: 'Structuring a case study: problem statement, research findings, wireframes, iterations, final solution, and measurable impact.',
            skills: ['Case Study Writing', 'Portfolio Presentation', 'UX Storytelling'],
            duration: '20 hours',
            project: 'Publish an in-depth end-to-end UX case study with polished mockups and design rationale',
            completed: false,
            isCustom: false
          }
        ]
      }
    ]
  }
};
