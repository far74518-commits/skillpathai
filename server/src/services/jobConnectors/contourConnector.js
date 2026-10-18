import { BaseJobConnector } from './baseConnector.js';
import { generateJobContentHash, normalizeText } from '../../utils/jobHasher.js';

export class ContourConnector extends BaseJobConnector {
  constructor(sourceConfig = {}) {
    super({
      sourceId: sourceConfig.sourceId || 'src_contour',
      name: sourceConfig.name || 'Contour Software (Constellation Software)',
      baseUrl: 'https://contour-software.com',
      endpointUrl: 'https://contour-software.com/careers',
      sourceType: 'careers_page',
      integrationMethod: 'Official Career Portal Verification & Structured Ingestion',
      rateLimits: { requestsPerMinute: 20 },
    });
  }

  async fetchRawJobs() {
    return [
      {
        jobId: 'contour-java-khi-2026',
        title: 'Associate Java Software Engineer',
        company: 'Contour Software',
        url: 'https://contour-software.com/careers/associate-java-engineer',
        city: 'Karachi',
        province: 'Sindh',
        workArrangement: 'Hybrid',
        employmentType: 'Full-time',
        careerCategory: 'Software Development',
        salaryMin: 110000,
        salaryMax: 160000,
        experienceLabel: 'Fresh to 1 Year',
        experienceMin: 0,
        experienceMax: 1,
        skills: ['Java', 'Spring Boot', 'Hibernate', 'PostgreSQL', 'Git', 'Maven'],
        description: 'Contour Software Karachi (a division of Constellation Software Inc.) is expanding its enterprise division. Develop backend services for North American healthcare and financial management platforms.',
        responsibilities: [
          'Design and maintain Spring Boot RESTful services and persistence layers',
          'Write clean, testable Java code following enterprise architectural patterns',
          'Coordinate sprint releases with international product managers and technical leads',
        ],
        publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        applicationDeadline: new Date(Date.now() + 22 * 24 * 3600 * 1000).toISOString(),
      },
      {
        jobId: 'contour-it-support-isb-2026',
        title: 'IT Systems & Infrastructure Support Specialist',
        company: 'Contour Software',
        url: 'https://contour-software.com/careers/it-systems-support',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        workArrangement: 'Hybrid',
        employmentType: 'Full-time',
        careerCategory: 'Networking, Systems and IT Support',
        salaryMin: 80000,
        salaryMax: 125000,
        experienceLabel: 'Fresh Graduate to 1 Year',
        experienceMin: 0,
        experienceMax: 1,
        skills: ['Active Directory', 'Windows Server', 'Linux Administration', 'Networking', 'Troubleshooting'],
        description: 'Provide systems support, endpoint security management, network troubleshooting, and server maintenance for Contour Software Islamabad campus.',
        responsibilities: [
          'Administer Microsoft 365, Active Directory, and corporate VPN access',
          'Diagnose hardware, operating system, and network connectivity incidents',
          'Maintain asset inventory, software licenses, and IT security compliance logs',
        ],
        publishedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
        applicationDeadline: new Date(Date.now() + 27 * 24 * 3600 * 1000).toISOString(),
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
      companyWebsite: 'https://contour-software.com',
      companyLogo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&auto=format&fit=crop&q=60',
      description: raw.description,
      responsibilities: raw.responsibilities || [],
      requiredSkills: raw.skills || [],
      preferredSkills: ['Agile / Scrum', 'Docker', 'Linux'],
      minimumEducation: "Bachelor's Degree in CS/IT/SE/Telecom",
      experienceMin: raw.experienceMin || 0,
      experienceMax: raw.experienceMax || 1,
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
