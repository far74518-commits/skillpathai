import mongoose from 'mongoose';

const JobSourceSchema = new mongoose.Schema(
  {
    sourceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sourceType: {
      type: String,
      enum: ['api', 'rss_atom', 'careers_page', 'curated_feed', 'manual'],
      default: 'curated_feed',
    },
    baseUrl: {
      type: String,
      required: true,
    },
    endpointUrl: {
      type: String,
      default: '',
    },
    integrationMethod: {
      type: String,
      default: 'Authorized REST/JSON feed with validation pipeline',
    },
    officialCareersUrl: {
      type: String,
      default: '',
    },
    isAutomated: {
      type: Boolean,
      default: false,
    },
    requiresAuth: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['healthy', 'warning', 'error', 'disabled'],
      default: 'healthy',
      index: true,
    },
    lastSuccessfulSync: {
      type: Date,
      default: null,
    },
    lastSyncAttempt: {
      type: Date,
      default: null,
    },
    lastError: {
      type: String,
      default: null,
    },
    rateLimits: {
      requestsPerMinute: { type: Number, default: 30 },
      retryAfterSeconds: { type: Number, default: 60 },
    },
    supportedCategories: {
      type: [String],
      default: [],
    },
    supportedLocations: {
      type: [String],
      default: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Remote (Pakistan)'],
    },
    syncIntervalMinutes: {
      type: Number,
      default: 60,
    },
    totalJobsIngested: {
      type: Number,
      default: 0,
    },
    activeJobsCount: {
      type: Number,
      default: 0,
    },
    attribution: {
      type: String,
      default: 'Direct verified employer posting',
    },
  },
  {
    timestamps: true,
  }
);

export const JobSource =
  mongoose.models.JobSource || mongoose.model('JobSource', JobSourceSchema);
