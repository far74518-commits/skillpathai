import mongoose from 'mongoose';

const SyncRunSchema = new mongoose.Schema(
  {
    runId: {
      type: String,
      required: true,
      index: true,
    },
    sourceId: {
      type: String,
      required: true,
      index: true,
    },
    sourceName: {
      type: String,
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    finishedAt: {
      type: Date,
      default: null,
    },
    durationMs: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['running', 'success', 'partial', 'failed'],
      default: 'running',
      index: true,
    },
    triggerType: {
      type: String,
      enum: ['scheduled', 'manual', 'startup'],
      default: 'scheduled',
    },
    jobsDiscovered: {
      type: Number,
      default: 0,
    },
    jobsInserted: {
      type: Number,
      default: 0,
    },
    jobsUpdated: {
      type: Number,
      default: 0,
    },
    jobsSkipped: {
      type: Number,
      default: 0,
    },
    jobsExpired: {
      type: Number,
      default: 0,
    },
    errorSummary: {
      type: String,
      default: null,
    },
    lastSuccessfulSync: {
      type: Date,
      default: null,
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

SyncRunSchema.index({ startedAt: -1 });
SyncRunSchema.index({ sourceId: 1, startedAt: -1 });

export const SyncRun = mongoose.models.SyncRun || mongoose.model('SyncRun', SyncRunSchema);
