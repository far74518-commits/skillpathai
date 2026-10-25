import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { useApp } from '../context/AppContext';
import { CareerService } from '../services/careerService';
import { INITIAL_ROADMAPS } from '../data/roadmaps';
import TaskItem from '../components/roadmap/TaskItem';
import AddTaskModal from '../components/roadmap/AddTaskModal';
import AIRoadmapGeneratorModal from '../components/roadmap/AIRoadmapGeneratorModal';
import { AIService } from '../services/aiService';
import {
  Briefcase,
  TrendingUp,
  Sparkles,
  ChevronDown,
  Clock,
  Plus,
  CheckCircle2,
  Flame,
  Zap,
  Sprout,
  GraduationCap,
  Layers,
  BookOpen,
  Download,
  FileDown,
  Loader2,
  Share2
} from 'lucide-react';
import Button from '../components/common/Button';

export default function RoadmapPage() {
  const { targetCareerId, setTargetCareer, roadmaps, toggleTaskCompleted, addCustomTask, addToast } = useApp();

  const DEGREES = [
    {
      id: 'bscs',
      label: 'BS Computer Science (BSCS)',
      short: 'BSCS',
      icon: '🎓',
      defaultRole: 'frontend-dev',
      description: 'Computing theory, algorithms, web platforms & core software systems'
    },
    {
      id: 'bsse',
      label: 'BS Software Engineering (BSSE)',
      short: 'BSSE',
      icon: '💻',
      defaultRole: 'fullstack-dev',
      description: 'System design, full-stack architecture, testing & cloud deployment'
    },
    {
      id: 'bsds',
      label: 'BS Data Science & AI (BSDS / BSAI)',
      short: 'BSDS',
      icon: '📊',
      defaultRole: 'data-analyst',
      description: 'Data analytics, predictive models, machine learning & Python pipelines'
    },
    {
      id: 'bsit',
      label: 'BS Information Technology (BSIT)',
      short: 'BSIT',
      icon: '☁️',
      defaultRole: 'devops-engineer',
      description: 'Cloud infrastructure, Linux systems, networking & DevOps CI/CD'
    },
    {
      id: 'cyber',
      label: 'BS Cyber Security (BSCS-Cyber)',
      short: 'CyberSec',
      icon: '🛡️',
      defaultRole: 'cybersecurity-analyst',
      description: 'Defensive security, penetration testing, network protocols & forensics'
    },
    {
      id: 'design',
      label: 'BS Multimedia & UI/UX Design',
      short: 'UI/UX',
      icon: '🎨',
      defaultRole: 'ui-ux-designer',
      description: 'Product wireframes, Figma design systems, usability & frontend UI'
    }
  ];

  const careerRoles = [
    {
      id: 'frontend-dev',
      label: 'Frontend Developer',
      degreeId: 'bscs',
      degreeName: 'BS Computer Science / Software Engineering',
      icon: '🌐',
      duration: '6-9 months',
      skills: ['HTML5 & Modern CSS', 'JavaScript (ES6+)', 'React.js Architecture', 'REST APIs & Fetching', 'Git & GitHub', 'Responsive Web UI'],
      courses: [
        {
          code: 'CS-201',
          title: 'Web Technologies & Semantic Layouts',
          requiredPercentage: 90,
          semester: 'Semester 2 - 3',
          importance: 'Essential Foundation (Must Learn 90%)',
          hours: '30 Hours',
          topics: ['HTML5 Semantic Elements', 'CSS3 Flexbox & Grid', 'Responsive Media Queries', 'WCAG Accessibility']
        },
        {
          code: 'CS-305',
          title: 'Advanced JavaScript (ES6+) & Async Programming',
          requiredPercentage: 95,
          semester: 'Semester 3 - 4',
          importance: 'Core Technical (Must Learn 95%)',
          hours: '45 Hours',
          topics: ['Event Loop & Promises', 'Async/Await & Fetch', 'Closures & Scope', 'DOM Manipulation']
        },
        {
          code: 'CS-412',
          title: 'Component Architecture & React.js State',
          requiredPercentage: 88,
          semester: 'Semester 4 - 5',
          importance: 'Industry Standard (Must Learn 88%)',
          hours: '50 Hours',
          topics: ['Functional Components', 'Hooks (useState, useEffect, useMemo)', 'Custom Hooks', 'Client-side Routing']
        },
        {
          code: 'SE-210',
          title: 'Version Control & Collaborative Git Workflows',
          requiredPercentage: 80,
          semester: 'Semester 2',
          importance: 'Must Learn (80%)',
          hours: '20 Hours',
          topics: ['Branching & Merging', 'Pull Requests & Code Reviews', 'Git Rebase', 'GitHub CI Basics']
        },
        {
          code: 'CS-425',
          title: 'Frontend Performance & Automated Testing',
          requiredPercentage: 75,
          semester: 'Semester 5 - 6',
          importance: 'Production Ready (Must Learn 75%)',
          hours: '35 Hours',
          topics: ['Core Web Vitals', 'Lazy Loading & Code Splitting', 'Vitest & Testing Library', 'TypeScript Typing']
        }
      ]
    },
    {
      id: 'backend-dev',
      label: 'Backend Developer',
      degreeId: 'bscs',
      degreeName: 'BS Computer Science / IT',
      icon: '⚙️',
      duration: '8-12 months',
      skills: ['Node.js & Express.js', 'Python & FastAPI', 'PostgreSQL / SQL', 'RESTful API & Auth', 'Docker Basics', 'Git Workflows'],
      courses: [
        {
          code: 'CS-302',
          title: 'Server Runtime Architecture (Node.js & Python)',
          requiredPercentage: 92,
          semester: 'Semester 3 - 4',
          importance: 'Core Technical (Must Learn 92%)',
          hours: '45 Hours',
          topics: ['Express.js & FastAPI Frameworks', 'Routing & Middleware', 'Error Handling & Validation', 'Environment Security']
        },
        {
          code: 'CS-320',
          title: 'Relational Database Design & PostgreSQL',
          requiredPercentage: 90,
          semester: 'Semester 3',
          importance: 'Must Learn (90%)',
          hours: '40 Hours',
          topics: ['SQL Joins & Aggregations', 'Schema Normalization (3NF)', 'Indexing & Query Optimization', 'Transactions & ACID']
        },
        {
          code: 'SEC-330',
          title: 'API Authentication & Cryptographic Security',
          requiredPercentage: 85,
          semester: 'Semester 4',
          importance: 'Security Core (Must Learn 85%)',
          hours: '30 Hours',
          topics: ['JWT Access & Refresh Tokens', 'Bcrypt Password Hashing', 'Role-Based Access Control', 'CORS & Rate Limiting']
        },
        {
          code: 'CS-440',
          title: 'Caching Strategies & Background Worker Queues',
          requiredPercentage: 80,
          semester: 'Semester 5',
          importance: 'Performance (Must Learn 80%)',
          hours: '35 Hours',
          topics: ['Redis Cache-Aside Pattern', 'BullMQ & Celery Workers', 'Scheduled Cron Tasks', 'Pub/Sub Messaging']
        },
        {
          code: 'SE-460',
          title: 'Docker Containerization & System Design',
          requiredPercentage: 78,
          semester: 'Semester 5 - 6',
          importance: 'Advanced Architecture (Must Learn 78%)',
          hours: '35 Hours',
          topics: ['Docker Compose Multi-Tier', 'Scalability & Load Balancing', 'Database Sharding & Replicas', 'Microservice Patterns']
        }
      ]
    },
    {
      id: 'fullstack-dev',
      label: 'Full Stack Developer',
      degreeId: 'bsse',
      degreeName: 'BS Software Engineering / Computer Science',
      icon: '🚀',
      duration: '8-12 months',
      skills: ['React.js Components', 'Node.js Backend', 'PostgreSQL / MongoDB', 'System Design', 'Docker Containers', 'CI/CD Pipelines'],
      courses: [
        {
          code: 'SE-301',
          title: 'Full-Stack Web Engineering & React UIs',
          requiredPercentage: 90,
          semester: 'Semester 3 - 4',
          importance: 'Core Frontend (Must Learn 90%)',
          hours: '45 Hours',
          topics: ['React Component Systems', 'State Management & Hooks', 'REST API Integration', 'Responsive Design']
        },
        {
          code: 'SE-320',
          title: 'Server-Side Architecture & RESTful APIs',
          requiredPercentage: 92,
          semester: 'Semester 4',
          importance: 'Core Backend (Must Learn 92%)',
          hours: '45 Hours',
          topics: ['Node.js & Express.js', 'JWT Authentication', 'MVC Architecture', 'Middleware & Routing']
        },
        {
          code: 'CS-322',
          title: 'Relational & NoSQL Database Modeling',
          requiredPercentage: 86,
          semester: 'Semester 4 - 5',
          importance: 'Database Core (Must Learn 86%)',
          hours: '40 Hours',
          topics: ['PostgreSQL & MongoDB', 'Data Schemas & Indexing', 'CRUD Operations', 'Object-Relational Mapping (ORM)']
        },
        {
          code: 'SE-420',
          title: 'Cloud DevOps, Docker & CI/CD Pipelines',
          requiredPercentage: 80,
          semester: 'Semester 5 - 6',
          importance: 'Deployment Ready (Must Learn 80%)',
          hours: '35 Hours',
          topics: ['Docker Containerization', 'GitHub Actions Automation', 'Cloud Hosting (Render/AWS)', 'Environment Configs']
        }
      ]
    },
    {
      id: 'data-analyst',
      label: 'Data Scientist & Analyst',
      degreeId: 'bsds',
      degreeName: 'BS Data Science & Artificial Intelligence',
      icon: '📊',
      duration: '10-14 months',
      skills: ['Python (Pandas, NumPy)', 'Advanced SQL Queries', 'Machine Learning Basics', 'Data Visualization', 'Statistics', 'Power BI'],
      courses: [
        {
          code: 'DS-201',
          title: 'Advanced Spreadsheets & Analytical SQL',
          requiredPercentage: 94,
          semester: 'Semester 2 - 3',
          importance: 'Absolute Must (Must Learn 94%)',
          hours: '45 Hours',
          topics: ['Complex SQL Joins & Subqueries', 'Window Functions & CTEs', 'Excel Pivot Tables & XLOOKUP', 'Data Cleaning']
        },
        {
          code: 'DS-301',
          title: 'Python for Data Science (Pandas & NumPy)',
          requiredPercentage: 92,
          semester: 'Semester 3 - 4',
          importance: 'Core Programming (Must Learn 92%)',
          hours: '50 Hours',
          topics: ['DataFrames & Series', 'Handling Missing Values', 'Data Reshaping & Aggregations', 'Statistical Summaries']
        },
        {
          code: 'DS-320',
          title: 'Exploratory Data Visualization & Storytelling',
          requiredPercentage: 85,
          semester: 'Semester 4',
          importance: 'Insight Presentation (Must Learn 85%)',
          hours: '30 Hours',
          topics: ['Matplotlib & Seaborn', 'Distribution & Correlation Plots', 'Chart Selection Guidelines', 'Executive Visual Storytelling']
        },
        {
          code: 'DS-410',
          title: 'Business Intelligence Dashboards (Power BI / Tableau)',
          requiredPercentage: 82,
          semester: 'Semester 4 - 5',
          importance: 'Corporate Benchmark (Must Learn 82%)',
          hours: '35 Hours',
          topics: ['Data Modeling & Star Schema', 'DAX Calculations & Measures', 'Interactive KPI Filters', 'Publishing Dashboards']
        }
      ]
    },
    {
      id: 'devops-engineer',
      label: 'DevOps & Cloud Engineer',
      degreeId: 'bsit',
      degreeName: 'BS Information Technology / Software Engineering',
      icon: '🔧',
      duration: '10-14 months',
      skills: ['Linux & Bash Scripting', 'Docker Containers', 'Kubernetes Clusters', 'CI/CD Pipelines', 'AWS / Azure Cloud', 'Git Version Control'],
      courses: [
        {
          code: 'IT-301',
          title: 'Linux Systems & Shell Automation (Bash)',
          requiredPercentage: 92,
          semester: 'Semester 3',
          importance: 'Fundamental (Must Learn 92%)',
          hours: '40 Hours',
          topics: ['Linux CLI Mastery', 'systemd Services & Permissions', 'Shell Scripts & Automation', 'Cron Scheduling']
        },
        {
          code: 'IT-340',
          title: 'Docker Containers & Multi-Service Compose',
          requiredPercentage: 90,
          semester: 'Semester 4',
          importance: 'Core Containerization (Must Learn 90%)',
          hours: '40 Hours',
          topics: ['Dockerfile Optimization', 'Multi-Stage Builds', 'Volume & Network Persistence', 'Docker Compose Networking']
        },
        {
          code: 'IT-410',
          title: 'CI/CD Pipelines & Version Automation',
          requiredPercentage: 86,
          semester: 'Semester 4 - 5',
          importance: 'Pipeline Essential (Must Learn 86%)',
          hours: '35 Hours',
          topics: ['GitHub Actions Workflows', 'Automated Testing & Linters', 'Docker Registry Publishing', 'Staging & Production Deployments']
        },
        {
          code: 'IT-450',
          title: 'Kubernetes Orchestration & Helm Packaging',
          requiredPercentage: 80,
          semester: 'Semester 5 - 6',
          importance: 'Cloud Native (Must Learn 80%)',
          hours: '45 Hours',
          topics: ['Pods, Deployments & Services', 'Ingress & ConfigMaps', 'Helm Chart Management', 'Cluster Troubleshooting']
        },
        {
          code: 'IT-470',
          title: 'Infrastructure as Code (Terraform) & Monitoring',
          requiredPercentage: 76,
          semester: 'Semester 6',
          importance: 'Advanced Operations (Must Learn 76%)',
          hours: '35 Hours',
          topics: ['Terraform Cloud Providers', 'State Management & Modules', 'Prometheus Metrics Scraping', 'Grafana Dashboards']
        }
      ]
    },
    {
      id: 'cybersecurity-analyst',
      label: 'Cybersecurity Analyst',
      degreeId: 'cyber',
      degreeName: 'BS Cyber Security',
      icon: '🛡️',
      duration: '8-12 months',
      skills: ['Network Protocols (TCP/IP)', 'Linux Administration', 'OWASP Top 10 Security', 'Wireshark Packet Analysis', 'Threat Detection', 'Cryptography'],
      courses: [
        {
          code: 'SEC-301',
          title: 'Computer Networks & TCP/IP Architecture',
          requiredPercentage: 92,
          semester: 'Semester 3',
          importance: 'Crucial Foundation (Must Learn 92%)',
          hours: '40 Hours',
          topics: ['OSI 7-Layer Model', 'TCP/IP Handshake & Sockets', 'Subnetting & Routing', 'DNS/DHCP Protocols']
        },
        {
          code: 'SEC-315',
          title: 'Linux Systems Administration & Shell Hardening',
          requiredPercentage: 88,
          semester: 'Semester 3 - 4',
          importance: 'Core Technical (Must Learn 88%)',
          hours: '35 Hours',
          topics: ['Linux CLI & Permissions', 'SSH Hardening & UFW Firewall', 'Process Auditing & cron', 'Bash Scripting']
        },
        {
          code: 'SEC-402',
          title: 'Web Application Security & OWASP Top 10',
          requiredPercentage: 90,
          semester: 'Semester 4 - 5',
          importance: 'High Priority (Must Learn 90%)',
          hours: '45 Hours',
          topics: ['SQL Injection Remediation', 'XSS & CSRF Prevention', 'Broken Auth & Access Control', 'Security Headers']
        },
        {
          code: 'SEC-410',
          title: 'Network Traffic Analysis & Wireshark Forensics',
          requiredPercentage: 82,
          semester: 'Semester 4 - 5',
          importance: 'SOC Essential (Must Learn 82%)',
          hours: '30 Hours',
          topics: ['Live Packet Captures (pcap)', 'Protocol Dissection', 'Detecting SYN Flood & ARP Spoofs', 'Malware Beacon Analysis']
        },
        {
          code: 'SEC-430',
          title: 'SIEM Operations & Incident Response Playbooks',
          requiredPercentage: 78,
          semester: 'Semester 5 - 6',
          importance: 'Industry Ready (Must Learn 78%)',
          hours: '40 Hours',
          topics: ['Splunk / Wazuh Log Ingestion', 'MITRE ATT&CK Matrix Mapping', 'SOC Alert Rule Authoring', 'Incident Containment']
        }
      ]
    },
    {
      id: 'ui-ux-designer',
      label: 'UI/UX Product Designer',
      degreeId: 'design',
      degreeName: 'BS Multimedia & Interaction Design',
      icon: '🎨',
      duration: '4-7 months',
      skills: ['Figma Auto-Layout', 'Wireframing & Prototyping', 'User Research & Personas', 'Design Systems', 'WCAG Accessibility', 'HTML & CSS Basics'],
      courses: [
        {
          code: 'DES-201',
          title: 'User Experience Research & Personas',
          requiredPercentage: 90,
          semester: 'Semester 2',
          importance: 'Research Foundation (Must Learn 90%)',
          hours: '35 Hours',
          topics: ['User Interviews & Empathy Maps', 'Problem Statements', 'User Personas', 'Customer Journey Mapping']
        },
        {
          code: 'DES-301',
          title: 'Wireframing & Information Architecture',
          requiredPercentage: 88,
          semester: 'Semester 3',
          importance: 'UX Core (Must Learn 88%)',
          hours: '35 Hours',
          topics: ['Sitemaps & Card Sorting', 'Low-Fidelity Wireframes in Figma', 'User Navigation Flows', 'Layout Hierarchies']
        },
        {
          code: 'DES-320',
          title: 'Figma Auto-Layout & Design Systems',
          requiredPercentage: 95,
          semester: 'Semester 3 - 4',
          importance: 'Design Standard (Must Learn 95%)',
          hours: '45 Hours',
          topics: ['Nested Auto-Layout (Fill/Hug)', 'Component Variants & Properties', 'Color & Spacing Tokens', 'WCAG AA/AAA Accessibility']
        },
        {
          code: 'DES-410',
          title: 'Interactive Prototyping & Usability Testing',
          requiredPercentage: 82,
          semester: 'Semester 4 - 5',
          importance: 'Product Polish (Must Learn 82%)',
          hours: '40 Hours',
          topics: ['Smart Animate & Micro-Interactions', 'Interactive States', 'Moderated Usability Sessions', 'Synthesizing User Feedback']
        }
      ]
    }
  ];

  const experienceLevels = [
    { id: 'Beginner', label: 'Beginner', icon: '🌱' },
    { id: 'Intermediate', label: 'Intermediate', icon: '⚡' },
    { id: 'Advanced', label: 'Advanced', icon: '🔥' }
  ];

  const [selectedDegree, setSelectedDegree] = useState('bscs');
  const [selectedRole, setSelectedRole] = useState(targetCareerId || 'frontend-dev');
  const [experienceLevel, setExperienceLevel] = useState('Advanced'); // Beginner | Intermediate | Advanced
  const [isDegreeDropdownOpen, setIsDegreeDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isExpDropdownOpen, setIsExpDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiRoadmapModalOpen, setIsAiRoadmapModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const handleAdoptCustomRoadmap = (aiRoadmap) => {
    // Automatically inject the generated AI milestones into current roadmap stages
    if (aiRoadmap?.stages) {
      aiRoadmap.stages.forEach((stage, sIdx) => {
        const stageTargetId = sIdx === 0 ? 'stage_1' : sIdx === 1 ? 'stage_2' : 'stage_3';
        (stage.milestones || []).forEach((m) => {
          addCustomTask(selectedRole, stageTargetId, {
            title: m.title,
            description: m.description,
            estimatedHours: m.estimatedHours || 12,
            skills: m.skills || []
          });
        });
      });
    }

    addToast({
      type: 'success',
      title: 'Custom AI Roadmap Adopted! 🚀',
      message: `Curriculum from ${aiRoadmap.source || 'Google Gemini AI'} has been integrated into your active learning path.`
    });

    const targetElement = document.getElementById('roadmap-curriculum-section');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentDegreeObj = DEGREES.find(d => d.id === selectedDegree) || DEGREES[0];
  const currentRoleObj = careerRoles.find(r => r.id === selectedRole) || careerRoles[0];
  const currentExpObj = experienceLevels.find(e => e.id === experienceLevel) || experienceLevels[2];

  // Current roadmap data: dynamically resolves to the exact selected career role
  const currentRoadmap =
    roadmaps[selectedRole] ||
    INITIAL_ROADMAPS[selectedRole] ||
    roadmaps['frontend-dev'] ||
    INITIAL_ROADMAPS['frontend-dev'];

  // Handle roadmap generation
  const handleGenerate = () => {
    setIsGenerating(true);
    setTargetCareer(selectedRole);
    setTimeout(() => {
      setIsGenerating(false);
      addToast({
        type: 'success',
        title: 'Roadmap Generated! 🚀',
        message: `Personalized AI path for ${currentRoleObj.label} (${currentDegreeObj.short} • ${experienceLevel}) is ready.`
      });
      // Smoothly scroll down to the generated roadmap curriculum
      const targetElement = document.getElementById('roadmap-curriculum-section');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400);
  };

  // Direct Download to Downloads Folder as PDF
  const handleDownloadPDF = async () => {
    if (isDownloadingPDF) return;
    setIsDownloadingPDF(true);

    try {
      const element = document.getElementById('roadmap-export-container');
      if (!element) {
        throw new Error('Roadmap container not found');
      }

      const rawRole = currentRoleObj.label || 'Career';
      const safeFileName = `${rawRole.trim().replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_')}_Roadmap.pdf`;

      const opt = {
        margin: [8, 8, 8, 8], // mm
        filename: safeFileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          backgroundColor: '#0a0d1e'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();

      addToast({
        type: 'success',
        title: 'Roadmap PDF Downloaded! 📄',
        message: `"${safeFileName}" has been saved in your Downloads folder.`
      });
    } catch (err) {
      console.error('PDF generation error, fallback to print:', err);
      window.print();
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // Compute stage task metrics
  let totalTasks = 0;
  let completedTasks = 0;
  if (currentRoadmap && currentRoadmap.stages) {
    currentRoadmap.stages.forEach(st => {
      (st.tasks || []).forEach(t => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });
  }
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="animate-fade" style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Page Title & Subtitle */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: 'clamp(1.65rem, 5vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            lineHeight: 1.2
          }}
        >
          Generate Your{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #38bdf8 50%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Career Roadmap
          </span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.45rem', maxWidth: 680 }}>
          Select your degree program and career goal to get a personalized, AI-powered learning path with targeted skills.
        </p>
      </div>

      {/* Generator Card Container */}
      <div className="roadmap-generator-card">
        <div className="roadmap-inputs-grid">
          {/* 1. Academic Degree Program Dropdown */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.65rem'
              }}
            >
              <GraduationCap size={16} color="var(--primary-400)" />
              <span>Degree / Major Program</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsDegreeDropdownOpen(!isDegreeDropdownOpen);
                setIsRoleDropdownOpen(false);
                setIsExpDropdownOpen(false);
              }}
              style={{
                width: '100%',
                background: '#101328',
                border: '1px solid #232849',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.15rem',
                color: '#ffffff',
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{currentDegreeObj.icon}</span>
                <span style={{ fontWeight: 600 }}>{currentDegreeObj.label}</span>
              </span>
              <ChevronDown
                size={18}
                color="var(--text-muted)"
                style={{
                  transform: isDegreeDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>

            {/* Custom Degree Dropdown Menu */}
            {isDegreeDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  background: '#141830',
                  border: '1px solid #282f58',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
                  zIndex: 70,
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '0.65rem 1rem', fontSize: '0.78rem', color: 'var(--text-dim)', borderBottom: '1px solid var(--border-subtle)' }}>
                  Select your university degree...
                </div>
                {DEGREES.map((deg) => (
                  <button
                    key={deg.id}
                    type="button"
                    onClick={() => {
                      setSelectedDegree(deg.id);
                      setSelectedRole(deg.defaultRole);
                      setIsDegreeDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.15rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      background: selectedDegree === deg.id ? '#232a54' : 'transparent',
                      color: '#ffffff',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600, fontSize: '0.92rem' }}>
                      <span>{deg.icon}</span>
                      <span>{deg.label}</span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', paddingLeft: '1.75rem' }}>
                      {deg.description}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Career Role Dropdown */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.65rem'
              }}
            >
              <Briefcase size={16} color="var(--primary-400)" />
              <span>Career Role</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsRoleDropdownOpen(!isRoleDropdownOpen);
                setIsDegreeDropdownOpen(false);
                setIsExpDropdownOpen(false);
              }}
              style={{
                width: '100%',
                background: '#101328',
                border: '1px solid #232849',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.15rem',
                color: '#ffffff',
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{currentRoleObj.icon}</span>
                <span style={{ fontWeight: 600 }}>{currentRoleObj.label}</span>
              </span>
              <ChevronDown
                size={18}
                color="var(--text-muted)"
                style={{
                  transform: isRoleDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>

            {/* Custom Role Dropdown Menu with Degree Headings & Skills */}
            {isRoleDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  background: '#141830',
                  border: '1px solid #282f58',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
                  zIndex: 70,
                  maxHeight: '380px',
                  overflowY: 'auto'
                }}
              >
                <div style={{ padding: '0.65rem 1rem', fontSize: '0.78rem', color: 'var(--text-dim)', borderBottom: '1px solid var(--border-subtle)' }}>
                  Choose your target role & degree track...
                </div>
                {careerRoles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.id);
                      setSelectedDegree(role.degreeId);
                      setIsRoleDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.15rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      background: selectedRole === role.id ? '#232a54' : 'transparent',
                      color: '#ffffff',
                      border: 'none',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600, fontSize: '0.92rem' }}>
                        <span>{role.icon}</span>
                        <span>{role.label}</span>
                      </div>
                      <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                        {role.duration}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.74rem', color: 'var(--primary-400)', paddingLeft: '1.75rem' }}>
                      Degree: {role.degreeName.split('/')[0]}
                    </div>

                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', paddingLeft: '1.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Skills: {role.skills.slice(0, 4).join(', ')}...
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Experience Level Dropdown */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.65rem'
              }}
            >
              <TrendingUp size={16} color="var(--primary-400)" />
              <span>Experience Level</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsExpDropdownOpen(!isExpDropdownOpen);
                setIsDegreeDropdownOpen(false);
                setIsRoleDropdownOpen(false);
              }}
              style={{
                width: '100%',
                background: '#101328',
                border: '1px solid #232849',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.15rem',
                color: '#ffffff',
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{currentExpObj.icon}</span>
                <span style={{ fontWeight: 600 }}>{currentExpObj.label}</span>
              </span>
              <ChevronDown
                size={18}
                color="var(--text-muted)"
                style={{
                  transform: isExpDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>

            {/* Custom Exp Dropdown Menu */}
            {isExpDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  background: '#141830',
                  border: '1px solid #282f58',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
                  zIndex: 70,
                  overflow: 'hidden'
                }}
              >
                {experienceLevels.map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => {
                      setExperienceLevel(exp.id);
                      setIsExpDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.15rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: experienceLevel === exp.id ? '#232a54' : 'transparent',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{exp.icon}</span>
                    <span>{exp.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DYNAMIC DEGREE & TARGET SKILLS SHOWCASE */}
        <div className="degree-skills-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(139, 92, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}
              >
                {currentDegreeObj.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  {currentDegreeObj.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Selected Role: <strong style={{ color: '#38bdf8' }}>{currentRoleObj.label}</strong> • Est: {currentRoleObj.duration}
                </div>
              </div>
            </div>

            <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Layers size={13} /> {currentRoleObj.skills.length} Target Skills Mapped
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
            Required Skills for this Degree & Career Track:
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {currentRoleObj.skills.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Generate Buttons: Standard + Custom AI Gemini Track */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              padding: '0.85rem 2.25rem',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.45)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={18} />
            <span>{isGenerating ? 'Synthesizing Path...' : 'Generate My Roadmap'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAiRoadmapModalOpen(true)}
            style={{
              background: 'rgba(56, 189, 248, 0.12)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.85rem 1.85rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 12px rgba(56, 189, 248, 0.2)'
            }}
          >
            <Zap size={18} />
            <span>Custom AI Track Generator</span>
          </button>
        </div>
      </div>

      {/* Quick Career Selector Cards with Degree & Skills */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
              Explore Degree Career Tracks
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Click any degree track to immediately load its curriculum and mapped technical skills.
            </p>
          </div>
        </div>

        <div className="roadmap-career-cards-grid">
          {careerRoles.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <div
                key={role.id}
                onClick={() => {
                  setSelectedRole(role.id);
                  setSelectedDegree(role.degreeId);
                }}
                style={{
                  background: isSelected ? '#1b2044' : 'var(--bg-surface)',
                  border: `1.5px solid ${isSelected ? '#8b5cf6' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 24px rgba(139, 92, 246, 0.3)' : 'var(--shadow-sm)',
                  position: 'relative'
                }}
              >
                {/* Icon box */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-lg)',
                    background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    marginBottom: '0.75rem',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {role.icon}
                </div>

                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                  {role.label}
                </div>

                <span className="badge badge-indigo" style={{ fontSize: '0.72rem', marginBottom: '0.45rem' }}>
                  🎓 {role.degreeName.split('/')[0]}
                </span>

                <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600, marginBottom: '0.75rem' }}>
                  ⏱ {role.duration}
                </div>

                {/* Top 3 Skills for this degree role */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center' }}>
                  {role.skills.slice(0, 3).map((sk, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {sk.split('&')[0]}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generated Career Roadmap Stages & Milestones */}
      <div id="roadmap-curriculum-section" style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
              Curriculum Path: {currentRoleObj.label}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 3 }}>
              {completedTasks} of {totalTasks} milestones completed ({completionPct}%) • Degree: <strong style={{ color: '#ffffff' }}>{currentDegreeObj.label}</strong> • Level: {experienceLevel}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloadingPDF}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.55rem 1.15rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: isDownloadingPDF ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              {isDownloadingPDF ? (
                <>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTopColor: '#ffffff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }}
                  />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Milestone
            </Button>
          </div>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {['All', 'Pending', 'Completed'].map((st) => (
            <button
              key={st}
              className={`tag-btn ${statusFilter === st ? 'selected' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Printable & Exportable Roadmap Container */}
        <div id="roadmap-export-container" style={{ padding: '0.5rem 0' }}>
          {/* PDF Branding Header */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{currentDegreeObj.icon}</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>SkillPath AI</span>
                <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>Personalized Career Blueprint</span>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Degree Program: <strong style={{ color: '#ffffff' }}>{currentDegreeObj.label}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#38bdf8' }}>
                {currentRoleObj.label}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Track: {experienceLevel} • Est. Duration: {currentRoleObj.duration}
              </div>
            </div>
          </div>

          {/* DEGREE COURSES & PERCENTAGE MASTERY BREAKDOWN (KITNA % SEEKHNA CHAHIYE) */}
          <div
            style={{
              background: '#0d1127',
              border: '1.5px solid rgba(139, 92, 246, 0.35)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              marginBottom: '2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              pageBreakInside: 'avoid'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                  <BookOpen size={20} color="var(--primary-400)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    Degree Course Curriculum & Target Learning Percentages
                  </h3>
                  <span
                    className="badge badge-emerald"
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      background: 'rgba(16, 185, 129, 0.18)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    🎯 Kitna % Seekhna Chahiye
                  </span>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0, maxWidth: 820 }}>
                  Har course aur subject ke sath required percentage (Job-Ready Benchmark) di gayi hai taake aapko exact pata ho kitna seekhna zaroori hai.
                </p>
              </div>

              <span className="badge badge-indigo" style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}>
                🎓 {currentRoleObj.courses?.length || 5} Core Courses Mapped
              </span>
            </div>

            {/* Grid of Courses with Percentage Bars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1rem' }}>
              {(currentRoleObj.courses || []).map((course, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#131838',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                    pageBreakInside: 'avoid'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                      <span className="badge badge-gray" style={{ fontSize: '0.72rem', fontFamily: 'monospace' }}>
                        {course.code} • {course.semester}
                      </span>
                      <span
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          color: course.requiredPercentage >= 90 ? '#34d399' : '#38bdf8',
                          background: course.requiredPercentage >= 90 ? 'rgba(52, 211, 153, 0.14)' : 'rgba(56, 189, 248, 0.14)',
                          padding: '0.22rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          border: `1px solid ${course.requiredPercentage >= 90 ? 'rgba(52, 211, 153, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        🎯 {course.requiredPercentage}% Seekhna Chahiye
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.45rem', lineHeight: 1.3 }}>
                      {course.title}
                    </h4>

                    {/* Percentage Progress Bar */}
                    <div style={{ marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        <span>Target Mastery Benchmark</span>
                        <strong style={{ color: course.requiredPercentage >= 90 ? '#34d399' : '#38bdf8' }}>
                          {course.requiredPercentage}% Required
                        </strong>
                      </div>
                      <div style={{ width: '100%', height: 8, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 4, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${course.requiredPercentage}%`,
                            height: '100%',
                            background: course.requiredPercentage >= 90
                              ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                              : 'linear-gradient(90deg, #6366f1 0%, #38bdf8 100%)',
                            borderRadius: 4
                          }}
                        />
                      </div>
                    </div>

                    {/* Topics Covered */}
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '0.35rem', fontWeight: 600 }}>
                      Syllabus Topics to Master:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {course.topics.map((top, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          • {top}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    <span>⏳ Est. Study: <strong style={{ color: '#ffffff' }}>{course.hours}</strong></span>
                    <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>{course.importance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Roadmap Stage Cards */}
          <div className="roadmap-stages-list">
            {currentRoadmap?.stages?.map((stage) => {
              const stageTasks = stage.tasks || [];
              const stageCompleted = stageTasks.filter(t => t.completed).length;
              const stagePct = stageTasks.length > 0 ? Math.round((stageCompleted / stageTasks.length) * 100) : 0;

              const filteredTasks = stageTasks.filter(t => {
                if (statusFilter === 'Pending') return !t.completed;
                if (statusFilter === 'Completed') return t.completed;
                return true;
              });

              return (
                <div key={stage.id} className="roadmap-stage-card" style={{ pageBreakInside: 'avoid' }}>
                  <div className="stage-header">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                        <span className="badge badge-indigo">{stage.level}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={12} /> {stage.estimatedWeeks}
                        </span>
                      </div>
                      <h3 className="stage-title">{stage.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                        {stage.description}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                        {stagePct}%
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {stageCompleted} / {stageTasks.length} Done
                      </div>
                    </div>
                  </div>

                  <div className="tasks-list">
                    {filteredTasks.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No {statusFilter.toLowerCase()} tasks in this stage.
                      </div>
                    ) : (
                      filteredTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggle={() => toggleTaskCompleted(selectedRole, stage.id, task.id)}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={(stageId, taskData) => addCustomTask(selectedRole, stageId, taskData)}
        stages={currentRoadmap?.stages || []}
      />

      {/* AI Smart Roadmap Generator Modal */}
      <AIRoadmapGeneratorModal
        isOpen={isAiRoadmapModalOpen}
        onClose={() => setIsAiRoadmapModalOpen(false)}
        initialTargetRole={currentRoleObj.label}
        initialSkills={currentRoleObj.skills.slice(0, 4)}
        onAdoptRoadmap={handleAdoptCustomRoadmap}
      />
    </div>
  );
}
