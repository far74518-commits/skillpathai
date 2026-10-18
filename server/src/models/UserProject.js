import mongoose from 'mongoose';

const UserChecklistItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const UserProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectSlug: {
      type: String,
      required: true,
      index: true,
    },
    started: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    checklist: [UserChecklistItemSchema],
    repoUrl: {
      type: String,
      default: '',
    },
    liveDemoUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

UserProjectSchema.index({ userId: 1, projectSlug: 1 }, { unique: true });

export const UserProject =
  mongoose.models.UserProject || mongoose.model('UserProject', UserProjectSchema);
