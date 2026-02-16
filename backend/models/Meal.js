import mongoose from 'mongoose'

const MealSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    calories: { type: Number, required: true },
    category: { type: String },
    date: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: true }
)

export default mongoose.model('Meal', MealSchema)
