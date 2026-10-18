import mongoose from 'mongoose';

const CVSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      title: { type: String, default: '' },
      summary: { type: String, default: '' },
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    education: [
      {
        id: String,
        degree: String,
        school: String,
        location: String,
        gradYear: String,
        gpa: String,
      },
    ],
    experience: [
      {
        id: String,
        role: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        bullets: [String],
      },
    ],
    projects: [
      {
        id: String,
        name: String,
        description: String,
        technologies: [String],
        githubUrl: String,
        liveUrl: String,
      },
    ],
    skills: {
      technical: { type: [String], default: [] },
      frameworks: { type: [String], default: [] },
      tools: { type: [String], default: [] },
      soft: { type: [String], default: [] },
    },
    certifications: [
      {
        id: String,
        name: String,
        issuer: String,
        date: String,
        url: String,
      },
    ],
    selectedTemplate: {
      type: String,
      enum: ['modern', 'minimal', 'compact', 'technical'],
      default: 'modern',
    },
  },
  {
    timestamps: true,
  }
);

export const CV = mongoose.models.CV || mongoose.model('CV', CVSchema);
