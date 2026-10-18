import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      default: null,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position title is required'],
      trim: true,
    },
    location: {
      type: String,
      default: 'Remote',
    },
    type: {
      type: String,
      default: 'Full-time',
    },
    salary: {
      type: String,
      default: '',
    },
    jobUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'],
      default: 'Saved',
      index: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    interviewDate: {
      type: Date,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

JobApplicationSchema.index({ userId: 1, appliedDate: -1 });

export const JobApplication =
  mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);
