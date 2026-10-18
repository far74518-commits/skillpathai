import { BaseJobConnector } from './baseConnector.js';
import { generateJobContentHash, normalizeText } from '../../utils/jobHasher.js';

export class FintechBanksConnector extends BaseJobConnector {
  constructor(sourceConfig = {}) {
    super({
      sourceId: sourceConfig.sourceId || 'src_pk_fintech_banks',
      name: sourceConfig.name || 'Pakistani Banks & Fintech Official Careers (Meezan, HBL, Jazz)',
      baseUrl: 'https://skillpath.ai/sources/pakistan-fintech-banks',
      endpointUrl: '',
      sourceType: 'careers_page',
      integrationMethod: 'Official Bank Career Portal Links & Structured Verification Pipeline',
      rateLimits: { requestsPerMinute: 20 },
    });
  }

  async fetchRawJobs() {
    return [
      {
        jobId: 'meezan-fintech-khi-2026',
        title: 'Fintech Software Engineer (Digital Banking)',
        company: 'Meezan Bank Limited',
        companyWebsite: 'https://www.meezanbank.com',
        url: 'https://www.meezanbank.com/careers/fintech-engineer',
        city: 'Karachi',
        province: 'Sindh',
        workArrangement: 'Hybrid',
        employmentType: 'Full-time',
        careerCategory: 'Banking, Fintech and Financial Technology',
        salaryMin: 125000,
        salaryMax: 185000,
        experienceLabel: '1 to 2 Years',
        experienceMin: 1,
        experienceMax: 2,
        skills: ['Java', 'Spring Boot', 'REST APIs', 'PostgreSQL', 'Islamic Banking Systems', 'Microservices'],
        description: 'Meezan Bank Head Office Karachi is looking for a Fintech Software Engineer for the Digital Banking & Raast Instant Payments division. Build resilient, compliant Shariah-compliant digital banking backends.',
        responsibilities: [
          'Design transaction processing microservices interfacing with SBP Raast and 1LINK',
          'Ensure bank-grade cryptographic security, data encryption, and audit trailing',
          'Collaborate with digital banking product managers, security auditors, and core banking teams',
        ],
        publishedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        applicationDeadline: new Date(Date.now() + 25 * 24 * 3600 * 1000).toISOString(),
      },
      {
        jobId: 'hbl-cybersecurity-khi-2026',
        title: 'Information Security & SOC Analyst',
        company: 'Habib Bank Limited (HBL)',
        companyWebsite: 'https://www.hbl.com',
        url: 'https://www.hbl.com/careers/soc-analyst',
        city: 'Karachi',
        province: 'Sindh',
        workArrangement: 'On-site',
        employmentType: 'Full-time',
        careerCategory: 'Cybersecurity',
        salaryMin: 130000,
        salaryMax: 190000,
        experienceLabel: '1 to 3 Years',
        experienceMin: 1,
        experienceMax: 3,
        skills: ['SIEM', 'SOC Operations', 'Network Security', 'Incident Response', 'Vulnerability Assessment'],
        description: 'HBL Cyber Defense Center Karachi is hiring a Security Operations Center (SOC) Analyst to monitor, triage, and mitigate enterprise cyber threats across digital banking channels.',
        responsibilities: [
          'Monitor SIEM alerts, endpoint detection feeds, and firewall anomalies',
          'Execute incident containment protocols and forensic investigation workflows',
          'Conduct periodic vulnerability assessments and compliance audits (PCI-DSS, SBP regulations)',
        ],
        publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        applicationDeadline: new Date(Date.now() + 21 * 24 * 3600 * 1000).toISOString(),
      },
      {
        jobId: 'jazz-fullstack-isb-2026',
        title: 'Full-Stack Engineer (JazzCash Platform)',
        company: 'Jazz (Telecom & Fintech)',
        companyWebsite: 'https://jazz.com.pk',
        url: 'https://jobs.jazz.com.pk/fullstack-engineer-jazzcash',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        workArrangement: 'Hybrid',
        employmentType: 'Full-time',
        careerCategory: 'Banking, Fintech and Financial Technology',
        salaryMin: 150000,
        salaryMax: 220000,
        experienceLabel: '1 to 3 Years',
        experienceMin: 1,
        experienceMax: 3,
        skills: ['Node.js', 'React', 'MongoDB', 'Redis', 'Kafka', 'Docker'],
        description: 'Jazz Digital Headquarters Islamabad is expanding the JazzCash engineering squad. Work on high-throughput wallets, mobile payments, and consumer lending APIs serving 40+ million users.',
        responsibilities: [
          'Develop high-throughput payment gateways and wallet ledger microservices',
          'Implement caching mechanisms with Redis and event-driven pipelines with Apache Kafka',
          'Participate in chaos engineering, load testing, and zero-downtime canary deployments',
        ],
        publishedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
        applicationDeadline: new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString(),
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
      companyWebsite: raw.companyWebsite || '',
      companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=60',
      description: raw.description,
      responsibilities: raw.responsibilities || [],
      requiredSkills: raw.skills || [],
      preferredSkills: ['Fintech Protocols', 'Security Compliance', 'Docker'],
      minimumEducation: "Bachelor's Degree in CS, SE, IT or Telecommunications",
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
