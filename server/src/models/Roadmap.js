import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  skills: { type: [String], default: [] },
  duration: { type: String, default: '1 week' },
  project: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  isCustom: { type: Boolean, default: false },
});

const StageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  badge: { type: String, default: '' },
  tasks: [TaskSchema],
});

const RoadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    careerType: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    stages: [StageSchema],
    completionPercentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one roadmap per career type per user
RoadmapSchema.index({ userId: 1, careerType: 1 }, { unique: true });

// Middleware to calculate completion percentage automatically
RoadmapSchema.pre('save', function (next) {
  let totalTasks = 0;
  let completedTasks = 0;

  if (this.stages && this.stages.length > 0) {
    this.stages.forEach((stage) => {
      if (stage.tasks && stage.tasks.length > 0) {
        stage.tasks.forEach((task) => {
          totalTasks++;
          if (task.completed) {
            completedTasks++;
          }
        });
      }
    });
  }

  this.completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  next();
});

export const Roadmap = mongoose.models.Roadmap || mongoose.model('Roadmap', RoadmapSchema);
