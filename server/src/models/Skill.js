import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: ['programming', 'frontend', 'backend', 'databases', 'communication', 'problem-solving', 'tools', 'cloud', 'other'],
      default: 'frontend',
    },
    currentLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 1,
    },
    targetLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 4,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 20,
    },
    hoursSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

SkillSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
