import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    headline: {
      type: String,
      default: '',
      trim: true,
    },
    educationLevel: {
      type: String,
      default: "Bachelor's Degree",
    },
    degree: {
      type: String,
      default: '',
      trim: true,
    },
    university: {
      type: String,
      default: '',
      trim: true,
    },
    gradYear: {
      type: String,
      default: '2027',
    },
    interests: {
      type: [String],
      default: [],
    },
    existingSkills: {
      type: [String],
      default: [],
    },
    careerGoals: {
      type: String,
      default: '',
    },
    preferredWorkEnvironment: {
      type: String,
      enum: ['Remote', 'Hybrid', 'In-Office', 'Any'],
      default: 'Remote',
    },
    weeklyLearningHours: {
      type: Number,
      default: 15,
      min: [1, 'Must commit at least 1 hour'],
      max: [80, 'Cannot exceed 80 hours'],
    },
    targetCareer: {
      type: String,
      default: 'frontend-dev',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    bio: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    preferredCity: {
      type: String,
      default: 'Karachi',
    },
    notificationPreferences: {
      dailyReminder: { type: Boolean, default: true },
      jobAlerts: { type: Boolean, default: true },
      roadmapNotifications: { type: Boolean, default: true },
      careerRecommendations: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true },
    },
    privacySettings: {
      profileVisibility: {
        type: String,
        enum: ['public', 'network', 'private'],
        default: 'public',
      },
      searchIndexing: { type: Boolean, default: true },
      dataAnalytics: { type: Boolean, default: true },
      twoFactorEnabled: { type: Boolean, default: false },
    },
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark',
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.passwordHash;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before saving if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
