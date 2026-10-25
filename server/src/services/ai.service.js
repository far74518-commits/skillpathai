import OpenAI from 'openai';
import { config } from '../config/env.js';

let openaiClient = null;
let runtimeGeminiKey = null;
let runtimeGeminiModel = null;
let runtimeOpenAiKey = null;

function getGeminiApiKey() {
  return runtimeGeminiKey || config.gemini?.apiKey || process.env.GEMINI_API_KEY || '';
}

function getGeminiModel() {
  return runtimeGeminiModel || config.gemini?.model || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
}

function getOpenAiClient() {
  const key = runtimeOpenAiKey || config.openai?.apiKey || process.env.OPENAI_API_KEY || '';
  if (!key) return null;
  if (!openaiClient || openaiClient.apiKey !== key) {
    openaiClient = new OpenAI({ apiKey: key });
  }
  return openaiClient;
}

// Cleanly parse JSON from LLM outputs that may contain markdown fences or surrounding text
function extractJsonFromText(rawText) {
  if (!rawText) return null;
  const trimmed = rawText.trim();

  // Try direct parse
  try {
    return JSON.parse(trimmed);
  } catch (e) {}

  // Match ```json ... ``` or ``` ... ```
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch (e) {}
  }

  // Match the first outer curly bracket or square bracket pair
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    } catch (e) {}
  }

  return null;
}

/**
 * Direct call to Google Gemini REST API using native Node.js fetch
 */
async function callGeminiApi(prompt, isJson = true) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  const model = getGeminiModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const bodyPayload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      ...(isJson ? { responseMimeType: 'application/json' } : {}),
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyPayload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(`Google Gemini API error: ${message}`);
  }

  const result = await response.json();
  const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Google Gemini API returned empty content candidates');
  }

  if (isJson) {
    const parsed = extractJsonFromText(rawText);
    if (!parsed) {
      throw new Error('Failed to parse structured JSON from Gemini response');
    }
    return parsed;
  }

  return rawText;
}

/**
 * Call OpenAI API if configured
 */
async function callOpenAiApi(prompt, isJson = true) {
  const client = getOpenAiClient();
  if (!client) return null;

  const completion = await client.chat.completions.create({
    model: config.openai?.model || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    ...(isJson ? { response_format: { type: 'json_object' } } : {}),
    temperature: 0.7,
    max_tokens: 1500,
  });

  const rawText = completion.choices[0]?.message?.content;
  if (!rawText) return null;

  if (isJson) {
    return extractJsonFromText(rawText);
  }
  return rawText;
}

export const aiService = {
  isConfigured() {
    return Boolean(getGeminiApiKey() || getOpenAiClient());
  },

  getProviderStatus() {
    const hasGemini = Boolean(getGeminiApiKey());
    const hasOpenAI = Boolean(getOpenAiClient());

    let activeProvider = 'rule-engine';
    let providerName = 'SkillPath Intelligent Deterministic Engine';
    let model = 'Deterministic Semantic Engine (Offline-Ready)';

    if (hasGemini) {
      activeProvider = 'gemini';
      providerName = 'Google Gemini AI (Live)';
      model = getGeminiModel();
    } else if (hasOpenAI) {
      activeProvider = 'openai';
      providerName = 'OpenAI GPT (Live)';
      model = config.openai?.model || 'gpt-4o-mini';
    }

    return {
      activeProvider,
      providerName,
      model,
      isLive: hasGemini || hasOpenAI,
      hasGemini,
      hasOpenAI,
      supportedModels: [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-2.0-flash',
        'gpt-4o-mini',
        'gpt-4o',
      ],
    };
  },

  setRuntimeKey({ apiKey, provider = 'gemini', model }) {
    if (provider === 'gemini') {
      runtimeGeminiKey = apiKey || null;
      if (model) runtimeGeminiModel = model;
    } else if (provider === 'openai') {
      runtimeOpenAiKey = apiKey || null;
      openaiClient = null;
    }
    return this.getProviderStatus();
  },

  /**
   * 1. Smart Career Guidance & Study Routine
   */
  async generateCareerGuidance(profile = {}) {
    const {
      targetRole = 'Software Engineer',
      weeklyHours = 15,
      missingSkills = [],
      existingSkills = [],
      educationLevel = "Bachelor's Degree",
      degree = 'Computer Science',
      interests = [],
    } = profile;

    const existingNames = (existingSkills || []).map((s) => s.name || s).join(', ') || 'Core programming basics';
    const missingNames = (missingSkills || []).map((s) => s.name || s).join(', ') || 'Full-stack architecture';

    const prompt = `
You are an expert tech career advisor for university students and career switchers entering the modern software & tech industry.
Student Profile:
- Target Role: ${targetRole}
- Available Hours: ${weeklyHours} hrs/week
- Degree: ${degree} (${educationLevel})
- Existing Skills: ${existingNames}
- Missing / Skill Gaps: ${missingNames}
- Areas of Interest: ${(interests || []).join(', ') || 'Software Engineering'}

Generate a JSON object with this exact structure:
{
  "advice": "2-3 sentences of motivating, highly actionable career advice tailored to their exact profile and market demand.",
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "suggestedWeeklyRoutine": [
    "Task 1 with specific hours allocated (summing to ${weeklyHours} hours total)",
    "Task 2 with specific hours allocated",
    "Task 3 with specific hours allocated"
  ],
  "topMilestone": "One high-impact milestone project or certification to build next."
}
Return strictly JSON.
`;

    // Try Google Gemini
    if (getGeminiApiKey()) {
      try {
        const geminiResult = await callGeminiApi(prompt, true);
        if (geminiResult && geminiResult.advice) {
          return {
            source: `Google Gemini AI (${getGeminiModel()})`,
            advice: geminiResult.advice,
            keyStrengths: geminiResult.keyStrengths || [],
            suggestedWeeklyRoutine: geminiResult.suggestedWeeklyRoutine || [],
            topMilestone: geminiResult.topMilestone || 'Build and deploy an end-to-end portfolio project',
            configured: true,
            provider: 'gemini',
          };
        }
      } catch (err) {
        console.warn('[AI Service] Gemini call failed, trying secondary fallback:', err.message);
      }
    }

    // Try OpenAI
    if (getOpenAiClient()) {
      try {
        const openAiResult = await callOpenAiApi(prompt, true);
        if (openAiResult && openAiResult.advice) {
          return {
            source: `OpenAI GPT (${config.openai?.model || 'gpt-4o-mini'})`,
            advice: openAiResult.advice,
            keyStrengths: openAiResult.keyStrengths || [],
            suggestedWeeklyRoutine: openAiResult.suggestedWeeklyRoutine || [],
            topMilestone: openAiResult.topMilestone || 'Build and deploy a full-stack portfolio application',
            configured: true,
            provider: 'openai',
          };
        }
      } catch (err) {
        console.warn('[AI Service] OpenAI call failed:', err.message);
      }
    }

    // High quality intelligent deterministic fallback
    const keyGaps = (missingSkills || []).slice(0, 3).map((s) => s.name || s).join(', ') || 'Production system design and automated testing';
    return {
      source: 'SkillPath Intelligent Engine (Offline Mode)',
      advice: `Based on your target of ${targetRole}, dedicating ${weeklyHours} hours/week is a solid pace. Your highest-leverage learning investment right now should focus on: ${keyGaps}. Prioritize building 2 complete capstone projects with clean Git commits over passive video tutorials.`,
      keyStrengths: [
        'Clear learning commitment with realistic weekly time allocation',
        'Strong baseline logic and problem-solving analytical foundations',
        'Direct alignment with high-demand Pakistan IT and global remote roles',
      ],
      suggestedWeeklyRoutine: [
        `Devote ${Math.round(weeklyHours * 0.4)} hours to focused deep concept mastery (${keyGaps.split(',')[0] || 'Core principles'}).`,
        `Devote ${Math.round(weeklyHours * 0.35)} hours to hands-on project implementation and portfolio commits.`,
        `Devote ${Math.max(2, Math.round(weeklyHours * 0.25))} hours to code review, documentation, and technical interview questions.`,
      ],
      topMilestone: `Build and deploy a full-stack portfolio application demonstrating ${keyGaps.split(',')[0] || 'modern tech'}.`,
      configured: false,
      provider: 'rule-engine',
      notice: 'To activate live Generative AI, enter your free Google Gemini API Key in Settings or server/.env.',
    };
  },

  /**
   * 2. Smart Personalized Career Roadmap Generator
   */
  async generateSmartRoadmap(params = {}) {
    const {
      targetRole = 'Full-Stack Developer',
      experienceLevel = 'Beginner / University Student',
      weeklyHours = 15,
      currentSkills = ['HTML', 'CSS', 'JavaScript'],
      focusAreas = ['React', 'Node.js', 'Databases', 'Cloud Deployment'],
    } = params;

    const prompt = `
You are a senior tech curriculum architect. Create a structured, highly practical 3-stage learning roadmap for a student targeting: "${targetRole}".
Parameters:
- Experience Level: ${experienceLevel}
- Available Hours/Week: ${weeklyHours}
- Current Skills: ${currentSkills.join(', ')}
- Desired Focus Areas: ${focusAreas.join(', ')}

Return a JSON object with this exact schema:
{
  "roadmapTitle": "Roadmap title tailored to targetRole",
  "summary": "Brief 2-sentence overview of the learning journey",
  "totalEstimatedWeeks": 12,
  "stages": [
    {
      "stageNumber": 1,
      "title": "Stage 1: Foundations & Core Architecture",
      "duration": "Weeks 1-4",
      "milestones": [
        {
          "title": "Milestone title",
          "description": "Milestone description",
          "estimatedHours": 10,
          "skills": ["Skill1", "Skill2"],
          "actionItems": ["Action 1", "Action 2", "Action 3"]
        }
      ]
    },
    {
      "stageNumber": 2,
      "title": "Stage 2: Production Frameworks & APIs",
      "duration": "Weeks 5-8",
      "milestones": [
        {
          "title": "Milestone title",
          "description": "Milestone description",
          "estimatedHours": 14,
          "skills": ["Skill3", "Skill4"],
          "actionItems": ["Action 1", "Action 2"]
        }
      ]
    },
    {
      "stageNumber": 3,
      "title": "Stage 3: Enterprise Capstone & Deployment",
      "duration": "Weeks 9-12",
      "milestones": [
        {
          "title": "Milestone title",
          "description": "Milestone description",
          "estimatedHours": 16,
          "skills": ["Skill5", "Skill6"],
          "actionItems": ["Action 1", "Action 2"]
        }
      ]
    }
  ]
}
Return strictly JSON.
`;

    // Try Google Gemini
    if (getGeminiApiKey()) {
      try {
        const geminiResult = await callGeminiApi(prompt, true);
        if (geminiResult && geminiResult.stages) {
          return {
            source: `Google Gemini AI (${getGeminiModel()})`,
            provider: 'gemini',
            ...geminiResult,
          };
        }
      } catch (err) {
        console.warn('[AI Service] Gemini roadmap generation failed, falling back:', err.message);
      }
    }

    // Try OpenAI
    if (getOpenAiClient()) {
      try {
        const openAiResult = await callOpenAiApi(prompt, true);
        if (openAiResult && openAiResult.stages) {
          return {
            source: `OpenAI GPT (${config.openai?.model || 'gpt-4o-mini'})`,
            provider: 'openai',
            ...openAiResult,
          };
        }
      } catch (err) {}
    }

    // Deterministic High-Quality Fallback Roadmap
    return {
      source: 'SkillPath Intelligent Curriculum Engine',
      provider: 'rule-engine',
      roadmapTitle: `${targetRole} Accelerated Industry Roadmap`,
      summary: `Tailored curriculum designed for ${weeklyHours} hrs/week commitment. Transitions from foundational patterns to production capstone deployment with ATS portfolio artifacts.`,
      totalEstimatedWeeks: 12,
      stages: [
        {
          stageNumber: 1,
          title: 'Stage 1: Core Fundamentals & Modern Tooling',
          duration: 'Weeks 1-4',
          milestones: [
            {
              title: 'Modern Language Fundamentals & Asynchronous Patterns',
              description: `Deep dive into advanced JavaScript/Python primitives, closures, event loop, and asynchronous operations.`,
              estimatedHours: Math.round(weeklyHours * 1.5),
              skills: ['Core Logic', 'Async/Await', 'Data Structures', 'Git Workflow'],
              actionItems: [
                'Complete 15 algorithmic challenges focusing on arrays and hash maps',
                'Implement robust error handling and defensive coding patterns',
                'Setup GitHub repository with Conventional Commits',
              ],
            },
            {
              title: 'Clean Architecture & Component Design',
              description: 'Modular separation of concerns, state management principles, and reusable component patterns.',
              estimatedHours: Math.round(weeklyHours * 1.5),
              skills: ['Component Design', 'RESTful APIs', 'State Management'],
              actionItems: [
                'Construct reusable UI components using design tokens',
                'Connect to public REST APIs with resilient fetch and error states',
              ],
            },
          ],
        },
        {
          stageNumber: 2,
          title: 'Stage 2: Full-Stack Integration & Database Modeling',
          duration: 'Weeks 5-8',
          milestones: [
            {
              title: 'Secure Backend Services & Relational/NoSQL Schemas',
              description: 'Build authenticated REST APIs with validation, rate limiting, and indexed database queries.',
              estimatedHours: Math.round(weeklyHours * 2),
              skills: ['Express/Node.js', 'PostgreSQL / MongoDB', 'JWT Auth', 'Zod Validation'],
              actionItems: [
                'Model data schemas with relational foreign keys and indexes',
                'Implement JWT authentication with refresh tokens and HTTP-only cookies',
                'Enforce strict input schema validation on all mutation endpoints',
              ],
            },
          ],
        },
        {
          stageNumber: 3,
          title: 'Stage 3: Production Capstone, CI/CD & Cloud Deployment',
          duration: 'Weeks 9-12',
          milestones: [
            {
              title: 'Production Deployment & Automated Pipeline',
              description: 'Deploy full-stack application to cloud hosting with SSL, environment secrets, and automated testing.',
              estimatedHours: Math.round(weeklyHours * 2),
              skills: ['Docker / Cloud Hosting', 'CI/CD Pipelines', 'Automated Testing', 'Performance Optimization'],
              actionItems: [
                'Configure automated test suites with code coverage reporting',
                'Deploy frontend to Vercel and backend to Render/Railway with health checks',
                'Record a 2-minute Loom demo and link live URL on your CV and LinkedIn',
              ],
            },
          ],
        },
      ],
    };
  },

  /**
   * 3. AI ATS Resume / CV Reviewer & Enhancer
   */
  async reviewATSResume({ cvData = {}, targetRole = 'Software Engineer' } = {}) {
    const {
      personal = {},
      summary = '',
      experience = [],
      education = [],
      projects = [],
      skills = [],
      certifications = [],
    } = cvData;

    const prompt = `
You are a Principal Technical Recruiter and ATS (Applicant Tracking System) Specialist for top tier technology firms.
Review the following student / candidate CV for the target position: "${targetRole}".

Candidate CV Data:
- Name: ${personal.fullName || 'Candidate'}
- Headline: ${personal.headline || 'Student'}
- Professional Summary: "${summary || 'No summary provided'}"
- Technical Skills: ${(skills || []).join(', ') || 'Not specified'}
- Work Experience (${experience.length} entries):
${(experience || [])
  .map(
    (exp) =>
      `  * ${exp.position || exp.role} at ${exp.company} (${exp.period}): ${exp.description || (exp.bullets || []).join('; ')}`
  )
  .join('\n') || '  (No experience listed)'}
- Projects (${projects.length} entries):
${(projects || [])
  .map(
    (p) =>
      `  * ${p.title || p.name}: ${p.description || (p.bullets || []).join('; ')} (Tech: ${(p.technologies || p.tech || []).join(', ')})`
  )
  .join('\n') || '  (No projects listed)'}
- Education: ${(education || []).map((e) => `${e.degree} from ${e.institution} (${e.year})`).join(', ') || 'Degree in progress'}

Evaluate this CV against ATS parsing standards and target role expectations.
Return a JSON object with this exact structure:
{
  "atsScore": 82, // integer between 0 and 100
  "ratingLabel": "Competitive" // e.g. Needs Improvement (<60), Moderate (60-74), Competitive (75-89), Exceptional (90+)
  "strengths": [
    "3 specific, positive observations regarding their qualifications and layout."
  ],
  "criticalGaps": [
    "2-3 high-impact weaknesses or missing elements that reduce interview callbacks."
  ],
  "foundKeywords": ["List of relevant industry keywords detected"],
  "missingKeywords": ["4-6 high-value ATS keywords relevant to targetRole that are currently missing"],
  "actionVerbFeedback": "Feedback on whether bullet points start with strong impact action verbs (e.g. Architected, Engineered, Optimized) vs passive verbs.",
  "improvedSummary": "A polished, 3-sentence high-impact ATS-friendly professional summary tailored for ${targetRole} with quantifiable metrics.",
  "bulletImprovements": [
    {
      "original": "Example bullet that could be improved",
      "improved": "Engineered RESTful microservice handling 1,500 daily requests, reducing API response latency by 28% using Redis caching.",
      "reason": "Quantified impact with specific metrics and technologies."
    }
  ]
}
Return strictly JSON.
`;

    // Try Google Gemini
    if (getGeminiApiKey()) {
      try {
        const geminiResult = await callGeminiApi(prompt, true);
        if (geminiResult && typeof geminiResult.atsScore === 'number') {
          return {
            source: `Google Gemini AI (${getGeminiModel()})`,
            provider: 'gemini',
            ...geminiResult,
          };
        }
      } catch (err) {
        console.warn('[AI Service] Gemini CV review failed, falling back:', err.message);
      }
    }

    // Try OpenAI
    if (getOpenAiClient()) {
      try {
        const openAiResult = await callOpenAiApi(prompt, true);
        if (openAiResult && typeof openAiResult.atsScore === 'number') {
          return {
            source: `OpenAI GPT (${config.openai?.model || 'gpt-4o-mini'})`,
            provider: 'openai',
            ...openAiResult,
          };
        }
      } catch (err) {}
    }

    // High quality deterministic ATS evaluation
    const skillCount = (skills || []).length;
    const projectCount = (projects || []).length;
    const hasSummary = Boolean(summary && summary.length > 50);
    const hasExp = (experience || []).length > 0;

    let computedScore = 55;
    if (skillCount >= 8) computedScore += 15;
    else if (skillCount >= 4) computedScore += 8;

    if (projectCount >= 2) computedScore += 15;
    else if (projectCount === 1) computedScore += 7;

    if (hasSummary) computedScore += 8;
    if (hasExp) computedScore += 7;

    computedScore = Math.min(94, Math.max(48, computedScore));

    const ratingLabel =
      computedScore >= 90
        ? 'Exceptional'
        : computedScore >= 75
        ? 'Competitive'
        : computedScore >= 60
        ? 'Moderate'
        : 'Needs Improvement';

    return {
      source: 'SkillPath Intelligent ATS Evaluator (Rule Engine)',
      provider: 'rule-engine',
      atsScore: computedScore,
      ratingLabel,
      strengths: [
        `Structured format with ${projectCount} demonstrable technical portfolio project(s)`,
        `Explicit technical skill indexing with ${skillCount} detected technology tags`,
        personal.email && personal.phone
          ? 'Complete professional contact header compliant with automated parser scrapers'
          : 'Clear academic credentials and degree progression',
      ],
      criticalGaps: [
        'Bullet points lack quantified business metrics (e.g., % speed improvement, numbers of active users, latency reduction)',
        'Summary section can be made significantly more assertive by highlighting specialization in ' + targetRole,
      ],
      foundKeywords: (skills || []).slice(0, 8),
      missingKeywords: [
        'Automated Testing (Jest/PyTest)',
        'CI/CD Pipelines (GitHub Actions)',
        'Docker & Containerization',
        'System Design',
        'RESTful API Architecture',
      ],
      actionVerbFeedback: 'Several descriptions use passive statements like "worked on" or "responsible for". Upgrade to high-impact verbs like "Engineered", "Orchestrated", "Refactored", or "Deployed".',
      improvedSummary: `Results-driven ${targetRole} with hands-on experience developing responsive web applications and scalable backend APIs. Adept at transforming complex requirements into maintainable, high-performance software with clean Git version control and modern framework architectures. Passionate about building reliable student and enterprise tech solutions.`,
      bulletImprovements: [
        {
          original: (projects[0]?.description || 'Built a web application using modern technologies'),
          improved: `Architected full-stack ${projects[0]?.title || 'web platform'} with modular component hierarchy, integrating 5+ RESTful endpoints and decreasing page load duration by 34%.`,
          reason: 'Adds measurable performance results, active engineering verbs, and architecture depth.',
        },
      ],
      notice: 'Connect your free Google Gemini API key in Settings to activate deep real-time LLM critique.',
    };
  },

  /**
   * 4. Interactive AI Career Assistant Chat
   */
  async askCareerAssistant({ question = '', context = {}, targetCareer = 'Software Engineer' } = {}) {
    if (!question || !question.trim()) {
      throw new Error('Question is required');
    }

    const prompt = `
You are SkillPath AI, an encouraging and deeply knowledgeable senior career mentor for tech students and developers in Pakistan and international remote tech markets.
Context:
- Target Career: ${targetCareer}
- Current Tracked Career: ${context.career || targetCareer}
- Tracked Skills: ${(context.skills || []).join(', ') || 'Programming fundamentals'}

User Question: "${question}"

Provide a direct, inspiring, and concrete answer (3-4 paragraphs) covering:
1. Direct answer with practical steps.
2. What tech employers (e.g. Systems Limited, Contour, 10Pearls, or US/EU remote teams) look for in candidates.
3. 2 immediate action items the student can do today.

Keep tone professional, encouraging, and actionable. Avoid generic fluff.
`;

    // Try Google Gemini
    if (getGeminiApiKey()) {
      try {
        const text = await callGeminiApi(prompt, false);
        if (text) {
          return {
            source: `Google Gemini AI (${getGeminiModel()})`,
            provider: 'gemini',
            answer: text,
          };
        }
      } catch (err) {
        console.warn('[AI Service] Gemini chat failed:', err.message);
      }
    }

    // Try OpenAI
    if (getOpenAiClient()) {
      try {
        const text = await callOpenAiApi(prompt, false);
        if (text) {
          return {
            source: `OpenAI GPT (${config.openai?.model || 'gpt-4o-mini'})`,
            provider: 'openai',
            answer: text,
          };
        }
      } catch (err) {}
    }

    // High quality intelligent response fallback
    return {
      source: 'SkillPath Intelligent Assistant (Offline Mode)',
      provider: 'rule-engine',
      answer: `To excel as a **${targetCareer}**, hiring teams at leading firms (such as Systems Limited, Contour Software, 10Pearls, and international remote startups) evaluate three core pillars beyond academic grades:

1. **Demonstrable Code on GitHub**: Rather than listing generic course assignments, showcase 2 full-stack projects featuring clean Git commit histories, automated unit tests, and a live deployed URL (e.g., on Vercel or Render).
2. **Architecture & Problem-Solving**: Be prepared to explain *why* you chose specific database schemas, state management tools, and how you prevent security vulnerabilities (like SQL injection or SSRF).
3. **Continuous Learning Pacing**: Dedicate 10-15 hours weekly to building real features rather than passively watching tutorials.

**2 Action Steps for Today:**
- Pick one core project and write a comprehensive \`README.md\` featuring an architectural diagram, tech stack badges, and local setup instructions.
- Practice 2 algorithmic interview questions on LeetCode / HackerRank focusing on hash maps and two-pointer traversal.`,
      notice: 'To get real-time generative responses with live web intelligence, configure your free Google Gemini API key.',
    };
  },
};
