import mongoose from 'mongoose';

const JobAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      default: 'My Pakistan IT Job Alert',
      trim: true,
    },
    keywords: {
      type: [String],
      default: [],
    },
    categories: {
      type: [String],
      default: [],
    },
    cities: {
      type: [String],
      default: [],
    },
    workArrangements: {
      type: [String],
      default: ['On-site', 'Hybrid', 'Remote'],
    },
    isInternshipOnly: {
      type: Boolean,
      default: false,
    },
    paidInternshipOnly: {
      type: Boolean,
      default: false,
    },
    experienceLevel: {
      type: String,
      default: 'Any',
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'instant'],
      default: 'daily',
    },
    channels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastSentAt: {
      type: Date,
      default: null,
    },
    deliveryHistory: [
      {
        sentAt: { type: Date, default: Date.now },
        jobCount: { type: Number, default: 0 },
        channel: { type: String, default: 'in-app' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const JobAlert =
  mongoose.models.JobAlert || mongoose.model('JobAlert', JobAlertSchema);
