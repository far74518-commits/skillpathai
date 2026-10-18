import mongoose from 'mongoose';

const ChecklistTemplateSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
});

const ProjectSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    careerCategory: {
      type: String,
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    estimatedDuration: {
      type: String,
      default: '2 weeks',
    },
    suggestedFeatures: {
      type: [String],
      default: [],
    },
    learningOutcomes: {
      type: [String],
      default: [],
    },
    checklist: [ChecklistTemplateSchema],
    githubTemplateUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
