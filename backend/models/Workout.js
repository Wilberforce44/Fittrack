import mongoose from 'mongoose'

const WorkoutSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    type: { type: String, required: true },
    minutes: { type: Number, required: true },
    date: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: true }
)

export default mongoose.model('Workout', WorkoutSchema)
