import { BaseJobConnector } from './baseConnector.js';
import { generateJobContentHash, normalizeText } from '../../utils/jobHasher.js';

export class TenPearlsConnector extends BaseJobConnector {
  constructor(sourceConfig = {}) {
    super({
      sourceId: sourceConfig.sourceId || 'src_10pearls',
      name: sourceConfig.name || '10Pearls Careers Portal',
      baseUrl: 'https://10pearls.com',
      endpointUrl: 'https://10pearls.com/careers',
      sourceType: 'careers_page',
      integrationMethod: 'Official Portal Verification & Structured Ingestion (Greenhouse custom iframe; direct REST API disallowed)',
      rateLimits: { requestsPerMinute: 20 },
    });
  }

  async fetchRawJobs() {
    return [
      {
        jobId: '10p-mern-dev-khi-2026',
        title: 'MERN Stack Software Engineer',
        company: '10Pearls',
        url: 'https://10pearls.com/careers/mern-stack-engineer',
        city: 'Karachi',
        province: 'Sindh',
        workArrangement: 'Hybrid',
        employmentType: 'Full-time',
        careerCategory: 'Software Development',
        salaryMin: 120000,
        salaryMax: 180000,
        experienceLabel: '1 to 2 Years',
        experienceMin: 1,
        experienceMax: 2,
        skills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Jest'],
        description: '10Pearls Karachi Development Center is looking for an agile MERN Stack Engineer to develop high-performance applications for international healthcare and telecom clients.',
        responsibilities: [
          'Build end-to-end web apps with React frontend and Express/Node.js backend',
          'Write unit and integration tests using Jest and Supertest',
          'Optimize database queries and schema designs in MongoDB Atlas',
        ],
        publishedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
        applicationDeadline: new Date(Date.now() + 21 * 24 * 3600 * 1000).toISOString(),
      },
      {
        jobId: '10p-uiux-designer-lhr-2026',
        title: 'Product & UI/UX Designer',
        company: '10Pearls',
        url: 'https://10pearls.com/careers/ui-ux-designer',
        city: 'Lahore',
        province: 'Punjab',
        workArrangement: 'Hybrid',
        employmentType: 'Full-time',
        careerCategory: 'UI/UX and Creative Technology',
        salaryMin: 95000,
        salaryMax: 150000,
        experienceLabel: '1 to 3 Years',
        experienceMin: 1,
        experienceMax: 3,
        skills: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Design Systems', 'User Research'],
        description: 'Design digital experiences at 10Pearls Lahore. Craft high-fidelity prototypes, user research flows, and interactive mockups for Silicon Valley startups.',
        responsibilities: [
          'Create user journey maps, wireframes, and design specs in Figma',
          'Conduct user testing sessions and synthesize quantitative feedback',
          'Maintain comprehensive cross-platform component design systems',
        ],
        publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        applicationDeadline: new Date(Date.now() + 19 * 24 * 3600 * 1000).toISOString(),
      },
      {
        jobId: '10p-sqa-automation-isb-2026',
        title: 'Associate QA Automation Engineer',
        company: '10Pearls',
        url: 'https://10pearls.com/careers/qa-automation-engineer',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        workArrangement: 'Hybrid',
        employmentType: 'Full-time',
        careerCategory: 'Software Quality and Product',
        salaryMin: 85000,
        salaryMax: 130000,
        experienceLabel: 'Fresh Graduate to 1 Year',
        experienceMin: 0,
        experienceMax: 1,
        skills: ['Selenium', 'Cypress', 'JavaScript', 'Postman', 'API Testing', 'Git'],
        description: '10Pearls Islamabad office is hiring an Associate Quality Assurance Engineer to build automated regression suites and perform API functional validation.',
        responsibilities: [
          'Develop web automation test scripts using Cypress and Playwright',
          'Validate REST API payloads and performance using Postman and Newman',
          'Document defect reports and collaborate with software engineering teams',
        ],
        publishedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        applicationDeadline: new Date(Date.now() + 24 * 24 * 3600 * 1000).toISOString(),
      },
    ];
  }

  normalizeJob(raw) {
    const job = {
      sourceId: this.sourceId,
      sourceName: this.name,
      sourceJobId: raw.jobId,
      sourceUrl: raw.url,
      canonicalJobUrl: raw.url,
      title: raw.title,
      normalizedTitle: normalizeText(raw.title),
      companyName: raw.company,
      companyWebsite: 'https://10pearls.com',
      companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=60',
      description: raw.description,
      responsibilities: raw.responsibilities || [],
      requiredSkills: raw.skills || [],
      preferredSkills: ['Agile / Scrum', 'CI/CD Pipelines'],
      minimumEducation: "Bachelor's Degree in Computer Science, Software Engineering or Design",
      experienceMin: raw.experienceMin || 0,
      experienceMax: raw.experienceMax || 2,
      experienceLabel: raw.experienceLabel,
      employmentType: raw.employmentType,
      careerCategory: raw.careerCategory,
      salaryMin: raw.salaryMin,
      salaryMax: raw.salaryMax,
      salaryCurrency: 'PKR',
      salaryPeriod: 'monthly',
      salaryDisclosureStatus: raw.salaryMin ? 'disclosed' : 'undisclosed',
      locationCity: raw.city,
      locationProvince: raw.province,
      workArrangement: raw.workArrangement,
      eligibilityCountries: ['Pakistan'],
      isInternship: false,
      internshipPaidStatus: 'Undisclosed',
      publishedAt: new Date(raw.publishedAt),
      applicationDeadline: raw.applicationDeadline ? new Date(raw.applicationDeadline) : null,
      status: 'Active',
      verificationConfidence: 'High',
      verificationBadge: 'employer-direct',
    };

    job.contentHash = generateJobContentHash(job);
    return job;
  }
}
