import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String, // 'YYYY-MM-DD'
      required: true,
    },
    completedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    minutesSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index so there is exactly one log per user per date
activityLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
