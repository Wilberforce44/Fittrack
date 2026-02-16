import mongoose from 'mongoose'

const GoalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    dailyCalorieLimit: { type: Number, default: null },
    weeklyWorkoutTarget: { type: Number, default: null },
  },
  { timestamps: true }
)

export default mongoose.model('Goal', GoalSchema)
