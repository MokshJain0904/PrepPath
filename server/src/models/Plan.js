import mongoose from 'mongoose';

const weightageSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    percentage: { type: Number, required: true },
    reasoning: { type: String, required: true },
  },
  { _id: false }
);

const phaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    startDay: { type: Number, required: true },
    endDay: { type: Number, required: true },
    goals: [{ type: String, required: true }],
  },
  { _id: false }
);

const planSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    field: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    hoursPerDay: {
      type: Number,
      required: true,
      min: 1,
      max: 16,
    },
    targetType: {
      type: String,
      enum: ['internship', 'job'],
      default: 'job',
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    weightage: {
      type: [weightageSchema],
      required: true,
      validate: {
        validator: function (v) {
          if (!v || v.length === 0) return false;
          const sum = v.reduce((acc, curr) => acc + curr.percentage, 0);
          return Math.abs(sum - 100) < 1; // Allows 99-100 rounding
        },
        message: 'Weightage percentages must sum to 100',
      },
    },
    phases: {
      type: [phaseSchema],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

planSchema.index({ userId: 1, status: 1 });

export const Plan = mongoose.model('Plan', planSchema);
