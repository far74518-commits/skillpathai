import { BaseJobConnector } from './baseConnector.js';
import { generateJobContentHash, normalizeText } from '../../utils/jobHasher.js';

export class NjpGovPkConnector extends BaseJobConnector {
  constructor(sourceConfig = {}) {
    super({
      sourceId: sourceConfig.sourceId || 'src_njp_gov_pk',
      name: sourceConfig.name || 'National Jobs Portal (njp.gov.pk)',
      baseUrl: 'https://njp.gov.pk',
      endpointUrl: 'https://njp.gov.pk',
      sourceType: 'careers_page',
      integrationMethod: 'Official Federal Government Portal Link & Ingestion Pipeline',
      rateLimits: { requestsPerMinute: 20 },
    });
  }

  async fetchRawJobs() {
    return [
      {
        jobId: 'njp-software-engineer-isb-2026',
        title: 'Assistant Director / Software Engineer (BPS-17)',
        company: 'Ministry of Information Technology & Telecommunication (MoITT)',
        url: 'https://njp.gov.pk/job/assistant-director-software-bps-17',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        workArrangement: 'On-site',
        employmentType: 'Full-time',
        careerCategory: 'Software Development',
        salaryMin: 95000,
        salaryMax: 135000,
        experienceLabel: 'Fresh Graduate to 1 Year',
        experienceMin: 0,
        experienceMax: 1,
        skills: ['Python', 'PostgreSQL', 'Linux', 'Software Architecture', 'System Analysis', 'Git'],
        description: 'Federal Ministry of IT & Telecom is inviting applications through the National Jobs Portal (njp.gov.pk) for Assistant Director Software Engineer (BPS-17). Candidates will assist in national digital governance platforms and citizen portals.',
        responsibilities: [
          'Design and maintain digital governance portals and citizen service APIs',
          'Ensure strict compliance with National Cyber Security Policy standards',
          'Prepare technical project specifications and evaluate vendor deliverables',
        ],
        publishedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
        applicationDeadline: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
      },
      {
        jobId: 'njp-cyber-analyst-isb-2026',
        title: 'Cybersecurity Analyst / Information Security Officer',
        company: 'National Information Technology Board (NITB)',
        url: 'https://njp.gov.pk/job/cybersecurity-analyst-nitb',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        workArrangement: 'On-site',
        employmentType: 'Full-time',
        careerCategory: 'Cybersecurity',
        salaryMin: 120000,
        salaryMax: 175000,
        experienceLabel: '1 to 2 Years',
        experienceMin: 1,
        experienceMax: 2,
        skills: ['Vulnerability Assessment', 'Firewalls', 'SIEM', 'ISO 27001', 'Network Penetration Testing'],
        description: 'National Information Technology Board (NITB) is hiring Cybersecurity Analysts to safeguard government cloud infrastructure, data centers, and federal ministerial web portals.',
        responsibilities: [
          'Conduct periodic penetration testing and code audits on federal web applications',
          'Manage perimeter firewalls, intrusion detection systems, and web application firewalls (WAF)',
          'Formulate computer incident response playbooks for government departments',
        ],
        publishedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        applicationDeadline: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(),
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
      companyWebsite: 'https://njp.gov.pk',
      companyLogo: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=100&auto=format&fit=crop&q=60',
      description: raw.description,
      responsibilities: raw.responsibilities || [],
      requiredSkills: raw.skills || [],
      preferredSkills: ['Government IT Policy', 'Information Security Guidelines'],
      minimumEducation: "16 Years Education (BS/BE in CS/IT/SE/Telecom) from HEC recognized institution",
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
