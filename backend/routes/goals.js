import { Router } from 'express'
import auth from '../middleware/auth.js'
import Goal from '../models/Goal.js'

const router = Router()

router.get('/', auth, async (req, res) => {
  let goal = await Goal.findOne({ userId: req.user.id })
  if (!goal) goal = await Goal.create({ userId: req.user.id })
  res.json({ goal })
})

router.put('/', auth, async (req, res) => {
  const { dailyCalorieLimit, weeklyWorkoutTarget } = req.body
  let goal = await Goal.findOneAndUpdate(
    { userId: req.user.id },
    { $set: { dailyCalorieLimit, weeklyWorkoutTarget } },
    { new: true, upsert: true }
  )
  res.json({ goal })
})

export default router
