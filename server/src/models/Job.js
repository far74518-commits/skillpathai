import mongoose from 'mongoose';

export const CAREER_CATEGORIES = [
  'Software Development',
  'Web, E-Commerce and Digital Technology',
  'Artificial Intelligence and Data',
  'Cybersecurity',
  'Networking, Systems and IT Support',
  'Cloud, DevOps and Infrastructure',
  'Database and Enterprise Systems',
  'Software Quality and Product',
  'UI/UX and Creative Technology',
  'Banking, Fintech and Financial Technology',
  'Telecom, Industrial and Other Sectors',
  'Internships and Entry-Level Opportunities',
];

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Internship',
  'Contract',
  'Temporary',
  'Graduate Trainee',
  'Freelance',
];

export const WORK_ARRANGEMENTS = ['On-site', 'Hybrid', 'Remote', 'Not disclosed'];

export const JOB_STATUSES = ['Active', 'Expired', 'Closed', 'Unverified'];

const JobSchema = new mongoose.Schema(
  {
    sourceId: {
      type: String,
      required: true,
      index: true,
    },
    sourceName: {
      type: String,
      default: 'Verified Employer Portal',
    },
    sourceJobId: {
      type: String,
      default: '',
    },
    sourceUrl: {
      type: String,
      default: '',
    },
    canonicalJobUrl: {
      type: String,
      required: [true, 'Application URL is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true,
    },
    normalizedTitle: {
      type: String,
      trim: true,
      lowercase: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    companyWebsite: {
      type: String,
      default: '',
    },
    companyLogo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requiredSkills: {
      type: [String],
      default: [],
      index: true,
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    minimumEducation: {
      type: String,
      default: "Bachelor's Degree in CS/IT/SE",
    },
    experienceMin: {
      type: Number,
      default: 0,
    },
    experienceMax: {
      type: Number,
      default: 2,
    },
    experienceLabel: {
      type: String,
      default: 'Fresh Graduate / Entry Level',
    },
    employmentType: {
      type: String,
      enum: EMPLOYMENT_TYPES,
      default: 'Full-time',
      index: true,
    },
    careerCategory: {
      type: String,
      enum: CAREER_CATEGORIES,
      required: true,
      index: true,
    },
    salaryMin: {
      type: Number,
      default: null,
    },
    salaryMax: {
      type: Number,
      default: null,
    },
    salaryCurrency: {
      type: String,
      default: 'PKR',
    },
    salaryPeriod: {
      type: String,
      enum: ['monthly', 'yearly', 'hourly', 'stipend'],
      default: 'monthly',
    },
    salaryDisclosureStatus: {
      type: String,
      enum: ['disclosed', 'undisclosed', 'negotiable'],
      default: 'undisclosed',
    },
    locationCity: {
      type: String,
      required: true,
      index: true,
      default: 'Karachi',
    },
    locationProvince: {
      type: String,
      default: 'Sindh',
    },
    workArrangement: {
      type: String,
      enum: WORK_ARRANGEMENTS,
      default: 'On-site',
      index: true,
    },
    eligibilityCountries: {
      type: [String],
      default: ['Pakistan'],
    },
    isInternship: {
      type: Boolean,
      default: false,
      index: true,
    },
    internshipPaidStatus: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Stipend', 'Undisclosed'],
      default: 'Undisclosed',
    },
    applicationDeadline: {
      type: Date,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    firstSeenAt: {
      type: Date,
      default: Date.now,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
    lastVerifiedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: JOB_STATUSES,
      default: 'Active',
      index: true,
    },
    verificationConfidence: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'High',
    },
    contentHash: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    savesCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    isManuallyAdded: {
      type: Boolean,
      default: false,
      index: true,
    },
    verificationBadge: {
      type: String,
      enum: ['source-verified', 'employer-direct', 'manual-entry', 'unverified', 'demo-data'],
      default: 'source-verified',
      index: true,
    },
    dataProvenance: {
      connector: { type: String, default: 'curated' },
      sourceType: { type: String, default: 'curated_feed' },
      ingestionMethod: { type: String, default: 'direct' },
      fetchedAt: { type: Date, default: Date.now },
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for high performance filtering
JobSchema.index({ status: 1, careerCategory: 1, locationCity: 1 });
JobSchema.index({ status: 1, isInternship: 1, publishedAt: -1 });
JobSchema.index({ status: 1, workArrangement: 1 });
JobSchema.index({ sourceId: 1, sourceJobId: 1 });

// Full-text search index
JobSchema.index(
  {
    title: 'text',
    companyName: 'text',
    description: 'text',
    requiredSkills: 'text',
    locationCity: 'text',
  },
  {
    weights: {
      title: 10,
      requiredSkills: 8,
      companyName: 5,
      locationCity: 3,
      description: 1,
    },
    name: 'JobTextIndex',
  }
);

export const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
