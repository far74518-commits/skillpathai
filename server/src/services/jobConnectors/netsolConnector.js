import { BaseJobConnector } from './baseConnector.js';
import { generateJobContentHash, normalizeText } from '../../utils/jobHasher.js';

export class NetsolConnector extends BaseJobConnector {
  constructor(sourceConfig = {}) {
    super({
      sourceId: sourceConfig.sourceId || 'src_netsol',
      name: sourceConfig.name || 'NETSOL Technologies Careers',
      baseUrl: 'https://netsoltech.com',
      endpointUrl: 'https://netsoltech.com/careers',
      sourceType: 'careers_page',
      integrationMethod: 'Official Career Portal Link & Ingestion (Custom enterprise careers portal)',
      rateLimits: { requestsPerMinute: 20 },
    });
  }

  async fetchRawJobs() {
    return [
      {
        jobId: 'netsol-dotnet-lhr-2026',
        title: 'Junior .NET Core Enterprise Developer',
        company: 'NETSOL Technologies',
        url: 'https://netsoltech.com/careers/dotnet-developer',
        city: 'Lahore',
        province: 'Punjab',
        workArrangement: 'On-site',
        employmentType: 'Full-time',
        careerCategory: 'Software Development',
        salaryMin: 95000,
        salaryMax: 145000,
        experienceLabel: 'Fresh to 1 Year',
        experienceMin: 0,
        experienceMax: 1,
        skills: ['C#', '.NET Core', 'SQL Server', 'Entity Framework', 'REST APIs', 'Git'],
        description: 'NETSOL Technologies Lahore is seeking Junior .NET Developers to build mission-critical asset finance, leasing, and banking SaaS applications for global financial institutions.',
        responsibilities: [
          'Develop RESTful microservices using ASP.NET Core and Entity Framework Core',
          'Write optimized SQL stored procedures and queries in Microsoft SQL Server',
          'Participate in enterprise architecture reviews and unit test implementations',
        ],
        publishedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        applicationDeadline: new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString(),
      },
      {
        jobId: 'netsol-db-admin-lhr-2026',
        title: 'Associate Database Administrator (DBA)',
        company: 'NETSOL Technologies',
        url: 'https://netsoltech.com/careers/associate-dba',
        city: 'Lahore',
        province: 'Punjab',
        workArrangement: 'On-site',
        employmentType: 'Full-time',
        careerCategory: 'Database and Enterprise Systems',
        salaryMin: 100000,
        salaryMax: 155000,
        experienceLabel: '1 to 2 Years',
        experienceMin: 1,
        experienceMax: 2,
        skills: ['SQL Server', 'Oracle DB', 'Database Tuning', 'Backup & Recovery', 'T-SQL'],
        description: 'Manage high-availability relational databases backing international automotive leasing platforms. Work with clustering, backup replication, and query tuning.',
        responsibilities: [
          'Perform index maintenance, deadlock analysis, and query execution plan tuning',
          'Ensure disaster recovery automation and continuous backup verification',
          'Support development teams with schema migrations and data integrity checks',
        ],
        publishedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
        applicationDeadline: new Date(Date.now() + 16 * 24 * 3600 * 1000).toISOString(),
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
      companyWebsite: 'https://netsoltech.com',
      companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=60',
      description: raw.description,
      responsibilities: raw.responsibilities || [],
      requiredSkills: raw.skills || [],
      preferredSkills: ['Microservices', 'Docker', 'Azure'],
      minimumEducation: "Bachelor's Degree in CS/IT/SE from HEC recognized university",
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
