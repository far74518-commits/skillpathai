# SkillPath AI — Intelligent Student Career Planner

> **"Build Your Future, One Skill at a Time."**

SkillPath AI is a comprehensive, production-quality student career planning web application designed for university students, emerging engineers, and career switchers. It bridges academic studies with real industry readiness by diagnosing skill gaps, structuring milestone roadmaps, generating ATS-compliant CVs, and tracking job applications in real time.

---

## 🌟 Key Features

### 1. 🚀 Public Marketing Landing Page
- Hero section with interactive dashboard preview mockup
- Feature highlights: AI guidance, structured roadmaps, skills matrix, ATS CV builder, job tracker, and capstones
- 4-Stage "How It Works" methodology
- Popular career track cards with industry salary ranges and demand badges
- Student reviews and interactive FAQ accordion

### 2. 🔐 Authentication UI (Demo-Ready)
- Student registration and login pages with client-side regex email and password validation
- Password visibility toggles (Show/Hide)
- Forgot password simulated email reset dialog
- **1-Click Instant Demo Login** for quick testing with rich pre-loaded student portfolio data

### 3. 📊 Interactive Student Dashboard
- Personalized welcome greeting with target career indicators
- Real-time **Career Readiness Score** (weighted computation based on skill matrix coverage + roadmap completion)
- Metrics cards: Mastered skills, Skill gaps to close, Active job applications
- Recharts-powered **Weekly Learning Activity Chart** with daily goal progress
- **Active Roadmap Milestone Widget** highlighting the next recommended task
- Recommended Capstone Project with live checklist progress
- Recent activity timeline and 1-click Quick Action shortcuts

### 4. 🧠 AI Career Assistant & Skill Gap Analyzer
- 6-question career assessment evaluating education stage, degree, existing skills, excitement areas, work environment, and weekly learning availability
- **Rule-Based Recommendation Engine** scoring compatibility across 7 tech careers:
  - Frontend Developer
  - Full-Stack Developer
  - Python Developer
  - Data Analyst
  - UI/UX Product Designer
  - Cybersecurity Analyst
  - AI / Machine Learning Engineer
- Detailed **Skill Gap Reports** contrasting existing skills against required target skills
- Pluggable **AI Strategic Advisor** generating tailored weekly study schedules and learning allocations
- 1-click "Select as Target Career" which dynamically retargets the user's dashboard and roadmaps

### 5. 🗺️ Personalized Learning Roadmaps
- Multi-track career roadmaps for **Frontend, Full-Stack, Python, and Data Analytics**
- 3 structured stages per track: **Beginner (Foundations), Intermediate (Frameworks), Advanced (Production Readiness)**
- Task milestone cards with estimated hours, key skills, and practical checkpoints
- Checkbox milestone completion with instant score recalculation
- **Custom Milestone Creator**: Students can add custom university courses, boot camp tasks, or personal projects
- Filter milestones by: All, Pending, Completed

### 6. 🏆 Skills Matrix & Gap Radar
- Visual rating for skills from Level 1 (Beginner) to Level 5 (Expert)
- Categorized by: Frontend, Backend, Databases, Programming, Communication, Problem-solving
- Add, edit, and delete skills with modal dialogs
- **Radar Chart** comparing current proficiency vs target goals across skill domains
- **Top Skill Gaps Widget** highlighting highest-leverage areas where `target > current`

### 7. 📄 Professional ATS CV Builder
- Multi-section live editor: Personal Info, Professional Summary, Education, Experience, Projects, Skills, and Certifications
- **Live Split-Screen Preview** updating in real time as you type
- Two distinct professional templates:
  - **Modern Tech**: Clean two-column layout with indigo accents and skill chips
  - **Clean Executive**: Single-column ATS-compliant classic layout
- **Print / Save as PDF**: Dedicated `@media print` A4 stylesheets that hide navigation chrome and buttons for clean document printing
- "Reset to Sample Student CV" button with confirmation modal

### 8. 🇵🇰 Pakistan IT Job Intelligence & Career Application Tracker
- **Pakistan-Wide Vacancy Discovery**: Live, verified tech opportunities aggregated across Pakistan's major IT hubs: Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, Multan, and verified Pakistan-eligible remote roles.
- **12 Comprehensive IT Sectors**: Software Development, Web & E-Commerce, AI & Data Science, Cloud & DevOps, Cybersecurity, Banking & Fintech (HBL, Meezan, JazzCash, SadaPay), Telecom (Jazz, Telenor), QA & Testing, UI/UX, and Student Internships.
- **Intelligent Career Matching Engine**: Calculates candidate compatibility percentage (0-100%) against candidate skills and target career path, displaying matching vs missing skills with actionable learning recommendations.
- **Full Pipeline Application Tracker**: Preserves 100% of candidate tracking with Saved, Applied, Interview, Offer, and Rejected statuses, notes, and follow-ups.
- **1-Click Save to Tracker & Direct Portal Apply**: Saves discovered vacancies straight to personal trackers and links directly to official employer career sites.
- **Verified Source Registry**: Multi-source ingestion pipeline with content hash deduplication, automated freshness checks, and rate-limited connector abstractions.
- **REST APIs (`/api/v1/jobs`)**: Complete search, facet filtering (`/filters`, `/categories`, `/locations`, `/companies`), recommendations, and alert subscriptions.

### 9. 💻 Portfolio Projects Explorer
- Filter projects by Career Track and Difficulty (Beginner, Intermediate, Advanced)
- Project cards with estimated hours, key skills, and learning outcomes
- **Interactive Project Checklist**: Students can check off steps as they build
- "Start Project" and "Mark Completed" state synchronization

### 10. ⚙️ Profile & Settings
- Student profile customization (display name, headline, university, target career)
- Study pacing goal slider (5 to 40 hours per week)
- Notification toggles for daily reminders and job alerts
- **Light / Dark Mode Switcher** with smooth CSS variable transitions
- **Data Export & Import**: Download your entire workspace as a JSON file or restore from a previous backup
- Factory Reset with destructive action confirmation modal

### 11. 🔍 Global Cmd/Ctrl+K Quick Search
- Press `Ctrl + K` (or `Cmd + K` on Mac) anywhere to open global quick search across navigation routes, career paths, tracked skills, and job applications.

---

## 🛠️ Technology Stack

- **Framework**: React 18 with Vite
- **Language**: JavaScript (ES6+)
- **Styling**: Pure Custom CSS3 with design tokens and CSS variables (No Tailwind, No Bootstrap)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **State & Storage**: React Context + Safe LocalStorage Persistence

---

## 📁 Project Architecture & Folder Structure

```
skillpath-ai/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── context/
    │   ├── AppContext.jsx          # Central reactive state hub
    │   ├── AuthContext.jsx         # Demo auth session & student profile
    │   └── ThemeContext.jsx        # Light / Dark theme tokens
    ├── data/
    │   ├── careers.js              # 7 in-depth career tracks & skill maps
    │   ├── roadmaps.js             # Beginner/Intermediate/Advanced stages
    │   ├── skills.js               # Skills matrix & categories
    │   ├── projects.js             # Portfolio project blueprints & checklists
    │   ├── sampleJobs.js           # Sample job applications & pipeline statuses
    │   ├── sampleCV.js             # Student CV sample data
    │   └── faqs.js                 # Testimonials and FAQ content
    ├── services/
    │   ├── storageService.js       # LocalStorage wrapper, export/import JSON
    │   ├── careerService.js        # Rule-based assessment & readiness scoring
    │   └── aiService.js            # Pluggable backend adapter & offline simulation
    ├── components/
    │   ├── common/
    │   │   ├── Button.jsx
    │   │   ├── Badge.jsx
    │   │   ├── Modal.jsx
    │   │   ├── Toast.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   └── QuickSearchModal.jsx
    │   ├── layout/
    │   │   ├── AppLayout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── MobileNav.jsx
    │   │   └── NotificationsDropdown.jsx
    │   ├── dashboard/
    │   │   ├── StatCard.jsx
    │   │   ├── WeeklyActivityChart.jsx
    │   │   ├── RoadmapProgressWidget.jsx
    │   │   ├── RecentActivityFeed.jsx
    │   │   └── QuickActions.jsx
    │   ├── careers/
    │   │   ├── CareerCard.jsx
    │   │   └── AssessmentForm.jsx
    │   ├── roadmap/
    │   │   ├── TaskItem.jsx
    │   │   └── AddTaskModal.jsx
    │   ├── skills/
    │   │   ├── SkillModal.jsx
    │   │   └── SkillCategoryChart.jsx
    │   ├── cv/
    │   │   ├── ModernTechTemplate.jsx
    │   │   └── CleanExecutiveTemplate.jsx
    │   ├── jobs/
    │   │   ├── JobModal.jsx
    │   │   └── JobStatusChart.jsx
    │   └── projects/
    │       └── ProjectCard.jsx
    ├── pages/
    │   ├── LandingPage.jsx
    │   ├── LoginPage.jsx
    │   ├── SignupPage.jsx
    │   ├── DashboardPage.jsx
    │   ├── CareerAssistantPage.jsx
    │   ├── RoadmapPage.jsx
    │   ├── SkillsPage.jsx
    │   ├── CVBuilderPage.jsx
    │   ├── JobTrackerPage.jsx
    │   ├── ProjectsPage.jsx
    │   ├── SettingsPage.jsx
    │   └── NotFoundPage.jsx
    └── styles/
        ├── variables.css           # Color tokens, fonts, spacing, shadows
        ├── global.css              # Typography, reset, animations
        ├── layout.css              # App shell, sidebar, navbar, responsive
        ├── components.css          # Buttons, badges, cards, forms, modals, toasts
        ├── pages.css               # Page-specific views and dashboard grids
        └── print.css               # Clean A4 print rules for PDF export
```

---

## ⚡ Quick Start & Installation

### 1. Frontend Setup & Launch
```bash
# Install frontend dependencies
npm install

# Start Vite frontend development server
npm run dev
```
Open your browser at `http://localhost:3000`.

### 2. Backend REST API Setup & Launch
```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# (Optional) Seed MongoDB with portfolio projects and demo student user
npm run seed

# Run automated backend test suite (12 native unit & integration tests)
npm test

# Start Express server with auto-restart
npm run dev
```
The REST API runs on `http://localhost:5000` and health diagnostics are available at `http://localhost:5000/health`. The Vite dev server automatically proxies `/api/*` to `http://localhost:5000`.

### 3. Production Build & Verification
```bash
npm run build
```
Generates an optimized, production-ready bundle in `dist/`.

---

## 📡 Backend REST API Endpoints Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/health` | Server uptime & DB connection diagnostics | Public |
| `POST` | `/api/auth/register` | Student registration with validation | Public |
| `POST` | `/api/auth/login` | Student login returning JWT Bearer token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated student profile | Bearer Token |
| `GET` | `/api/careers` | Browse 7 in-depth career tracks & skills | Public |
| `POST` | `/api/careers/assess` | Rule-based assessment & readiness scoring | Public / Auth |
| `GET` | `/api/roadmaps` | Starter roadmaps across career tracks | Public |
| `PATCH` | `/api/roadmaps/:career/tasks/:taskId` | Toggle milestone task completion | Bearer Token |
| `GET` | `/api/skills` | Tracked student skills & category metrics | Bearer Token |
| `POST` | `/api/skills` | Add new skill to matrix tracker | Bearer Token |
| `PATCH` | `/api/skills/:id/progress` | Update proficiency level & logged hours | Bearer Token |
| `GET` | `/api/jobs` | Student job application pipeline | Bearer Token |
| `POST` | `/api/jobs` | Track new job application | Bearer Token |
| `PATCH` | `/api/jobs/:id/status` | Move stage (Saved, Applied, Interview, Offer) | Bearer Token |
| `GET` | `/api/cv` | Retrieve student ATS CV profile | Bearer Token |
| `PUT` | `/api/cv` | Update student CV sections & template | Bearer Token |
| `GET` | `/api/projects` | Portfolio projects blueprint catalogue | Public / Auth |
| `POST` | `/api/projects/:id/checklist` | Toggle interactive project checklist step | Bearer Token |
| `GET` | `/api/dashboard/summary` | Real-time readiness & activity calculations | Bearer Token |
| `GET` | `/api/notifications` | Student reminders and job milestone alerts | Bearer Token |
| `GET` | `/api/v1/jobs` | Pakistan IT vacancies with search, city/sector/exp filters, and pagination | Public / Auth |
| `GET` | `/api/v1/jobs/:id` | Detailed vacancy view with explainable match score & skill breakdown | Public / Auth |
| `GET` | `/api/v1/jobs/filters` | Dynamic facet filters (cities, categories, experience, work modes) | Public |
| `GET` | `/api/v1/jobs/sources` | Verified source registry, legal access methods, and connector health | Public |
| `POST` | `/api/v1/jobs/:id/save` | 1-Click save discovered vacancy to student application tracker | Bearer Token |
| `POST` | `/api/v1/jobs/admin/sync` | Trigger scheduled ingestion across all live connectors with deduplication | Admin Token |
| `POST` | `/api/v1/jobs/admin/manual`| Register verified employer opportunity with duplicate prevention | Admin Token |
| `GET` | `/api/v1/jobs/admin/sync-runs`| Retrieve audit log of recent background and manual sync runs with pagination | Admin Token |
| `GET` | `/api/v1/jobs/admin/source-health`| Source health diagnostics, last sync times, error summaries & metrics | Admin Token |

---

## 🇵🇰 Automated Pakistan IT Job Synchronization System

The synchronization system automatically discovers, normalizes, deduplicates, verifies, and expires real vacancies from Pakistani tech houses, banks, fintech companies, telecoms, and government portals.

### ⚙️ Environment Variables (`server/.env`)

```env
# Server Core
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/skillpathai
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_super_secure_jwt_secret_key_2026
JWT_EXPIRES_IN=7d

# Automated Job Synchronization
JOB_SYNC_ENABLED=true                # Enable background scheduler (default: true)
JOB_SYNC_INTERVAL_HOURS=6            # Synchronization cycle in hours (default: 6)
JOB_SYNC_INITIAL_RUN=false           # Trigger initial sync 5s after startup (default: false)
JOB_STALENESS_DAYS=30                # Mark unverified listings older than N days (default: 30)
JOB_SYNC_MAX_RETRIES=2               # Max exponential backoff retries per source (default: 2)
JOB_SYNC_TIMEOUT_MS=8000             # Request timeout in milliseconds (default: 8000)
```

### 🔄 How Automatic Scheduling Works

1. **Single-Instance Startup**: On application launch (`server.js`), `JobSyncService.startAutoScheduler()` verifies that only one scheduler runs per node instance.
2. **Scheduled Cycle**: Defaults to running every **6 hours** (`JOB_SYNC_INTERVAL_HOURS=6`).
3. **Concurrency Lock**: Employs an atomic concurrency lock with a 10-minute self-healing TTL to prevent overlapping sync operations.
4. **Resilient Pipeline**:
   - Throttles requests per source (token bucket rate limiting).
   - Retries temporary failures with exponential backoff and random jitter.
   - Enforces strict SSRF protection (`isSafeOutboundUrl`) blocking private and internal IP ranges.
   - Cleans untrusted HTML descriptions with `sanitizeHtmlText`.
5. **Atomic Deduplication**:
   - Computes deterministic SHA-256 `contentHash` based on normalized title, company, location, and source ID.
   - Updates existing records' `lastSeenAt` and `lastVerifiedAt` without changing their `_id`, ensuring user application histories and saved jobs are never orphaned.
6. **Safe Expiration Rules**:
   - Expired Deadlines: Jobs where `applicationDeadline < now` are automatically marked `Expired`.
   - Temporary Source Failure Safety: If a connector experiences network failure, existing active jobs are **preserved** (never prematurely expired).
   - Staleness Threshold: Listings not re-verified within `JOB_STALENESS_DAYS` (30 days) are transitioned to `Unverified`.
7. **Graceful Shutdown**: Listens for `SIGINT` / `SIGTERM` signals and cleanly clears timers via `JobSyncService.stopAutoScheduler()`.

### ⚡ Running a Manual Sync

- **Via Frontend Dashboard**:
  1. Open `/jobs` and switch to the **Verified Feeds & Sources** tab.
  2. Click **Sync All Feeds** to synchronize all 9 connectors.
  3. Or click **Sync Now** on an individual employer card to test and sync only that connector.
- **Via API**:
  ```bash
  # Sync all sources
  curl -X POST http://localhost:5000/api/v1/jobs/admin/sync \
    -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"

  # Sync an individual source
  curl -X POST http://localhost:5000/api/v1/jobs/admin/sync \
    -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"sourceId": "src_systems_ltd"}'
  ```

### 📋 Viewing Sync Logs & Source Health

- **Via Frontend**: Inspect the **Automated Synchronization Run History (Audit Log)** table in the **Verified Feeds & Sources** tab. Shows status (`Success`, `Failed`, `Running`), duration, discovered, new, and updated metrics.
- **Via API**:
  ```bash
  # View recent sync run history
  curl http://localhost:5000/api/v1/jobs/admin/sync-runs?limit=10 \
    -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"

  # View source-by-source health diagnostics
  curl http://localhost:5000/api/v1/jobs/admin/source-health \
    -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
  ```

### ➕ Adding or Disabling a Source

1. **Add a Connector**: Subclass `BaseJobConnector` in `server/src/services/jobConnectors/` and implement `fetchRawJobs()` and `normalizeJob()`.
2. **Register Connector**: Add the connector instance to `JobSyncService.getConnectors()`.
3. **Add Registry Metadata**: Add source description and official careers URL to `INITIAL_JOB_SOURCES` in `server/src/data/pakistanJobsData.js`.
4. **Disable a Source**: In the database, set `enabled: false` on the corresponding `JobSource` record, or set `status: 'disabled'`.

### 🧪 Running Automated Tests

```bash
# Run backend test suite (52 tests across 22 suites)
cd server
npm test

# Run frontend production build verification
npm run build
```

---

## 🇵🇰 Pakistan IT Source Registry & Legal Integration Status

SkillPath AI strictly respects employer terms of service, robots.txt, Cloudflare protections, and user privacy:

| Organization / Source | Type | Status | Integration Method & Legal Policy |
|---|---|---|---|
| **Arbeitnow Remote API** | Open REST API | 🟢 Live Automated | Authorized public developer feed (`/api/job-board-api`) filtered for Pakistan-eligible roles |
| **Global Tech RSS Feed** | RSS 2.0 / Atom | 🟢 Live Automated | Open developer RSS stream parsed via `RssFeedConnector` with rate limiting & exponential backoff |
| **Verified Multi-Employer Pipeline** | Curated Feed | 🟢 Live Automated | Normalized pipeline with 32-character SHA-256 deduplication and deadline expiration |
| **Systems Limited** | Official Careers | 🔗 Portal Link + Admin Entry | Cloudflare bot protection active; scraping disallowed by ToS; direct portal verification provided |
| **10Pearls** | Official Careers | 🔗 Portal Link + Admin Entry | Custom iframe / Greenhouse; direct automated scraping prohibited; direct careers link provided |
| **NETSOL Technologies** | Official Careers | 🔗 Portal Link + Admin Entry | Enterprise portal verification and manual administrative ingestion |
| **Contour Software** | Official Careers | 🔗 Portal Link + Admin Entry | Constellation Software division portal; direct official application link |
| **Meezan Bank** | Official Careers | 🔗 Portal Link + Admin Entry | Premier Islamic bank IT & Fintech portal link |
| **Habib Bank Limited (HBL)** | Official Careers | 🔗 Portal Link + Admin Entry | Graduate Trainee Officer (GTO) & Technology careers link |
| **Jazz & JazzCash** | Official Careers | 🔗 Portal Link + Admin Entry | Digital telecom & microfinance career portal link |
| **Telenor Pakistan** | Official Careers | 🔗 Portal Link + Admin Entry | Telecom IT & engineering careers link |
| **PTCL & Ufone Group** | Official Careers | 🔗 Portal Link + Admin Entry | Management Trainee & enterprise network engineering portal |
| **National Job Portal (NJP)** | Govt Portal | 🔗 Portal Link + Admin Entry | Federal Government IT Vacancies Registry (BPS-16 to BPS-19) |
| **PITB** | Govt Portal | 🔗 Portal Link + Admin Entry | Punjab Information Technology Board public sector openings |
| **PSEB** | Govt Portal | 🔗 Portal Link + Admin Entry | Pakistan Software Export Board tech internship and export programs |

---

## 🛡️ Demo Mode & Offline Fallback

- **Zero-Config Offline Fallback**: If local MongoDB is not running, the backend operates in structured in-memory demo fallback mode, ensuring zero crashes during testing or local demonstrations.
- **Frontend Hybrid Sync**: The frontend `api.js` client communicates directly with the Express API when available and seamlessly preserves student data in browser `LocalStorage` if the backend is unreachable.
- **Privacy Notice**: Please do not enter real sensitive personal identification numbers (SSN, national ID cards, banking info) into the CV Builder or Job Tracker.

---

## 📄 License

MIT License. Built with precision for students and aspiring software engineers worldwide.
