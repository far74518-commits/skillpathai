import mongoose from 'mongoose';

const AssessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    educationLevel: {
      type: String,
      default: '',
    },
    degree: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    preferredWorkEnv: {
      type: String,
      default: 'Remote',
    },
    careerGoal: {
      type: String,
      default: '',
    },
    weeklyHours: {
      type: Number,
      default: 15,
    },
    recommendedCareers: [
      {
        careerId: String,
        title: String,
        matchScore: Number,
        matchReasons: [String],
        matchedSkills: [mongoose.Schema.Types.Mixed],
        missingSkills: [mongoose.Schema.Types.Mixed],
        estimatedWeeksToReady: Number,
        salaryRange: String,
      },
    ],
    skillGaps: [mongoose.Schema.Types.Mixed],
  },
  {
    timestamps: true,
  }
);

export const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);
