import { Router } from 'express'
import auth from '../middleware/auth.js'
import Workout from '../models/Workout.js'
import Meal from '../models/Meal.js'

const router = Router()

router.get('/today', auth, async (req, res) => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const workouts = await Workout.find({ userId: req.user.id, date: { $gte: start, $lt: end } })
  const meals = await Meal.find({ userId: req.user.id, date: { $gte: start, $lt: end } })
  const minutes = workouts.reduce((s, w) => s + (w.minutes || 0), 0)
  const calories = meals.reduce((s, m) => s + (m.calories || 0), 0)
  res.json({ workoutsCount: workouts.length, minutesTotal: minutes, caloriesTotal: calories })
})

router.get('/week', auth, async (req, res) => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
  const workouts = await Workout.find({ userId: req.user.id, date: { $gte: start, $lte: now } })
  const meals = await Meal.find({ userId: req.user.id, date: { $gte: start, $lte: now } })
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1)
    const wDay = workouts.filter((w) => w.date >= d && w.date < next)
    const mDay = meals.filter((m) => m.date >= d && m.date < next)
    const calories = mDay.reduce((s, m) => s + (m.calories || 0), 0)
    const minutes = wDay.reduce((s, w) => s + (w.minutes || 0), 0)
    days.push({
      date: d.toISOString().slice(0, 10),
      workouts: wDay.length,
      minutes,
      calories,
    })
  }
  const totals = {
    workouts: days.reduce((s, d) => s + d.workouts, 0),
    minutes: days.reduce((s, d) => s + d.minutes, 0),
    calories: days.reduce((s, d) => s + d.calories, 0),
    avgCaloriesPerDay: Math.round(days.reduce((s, d) => s + d.calories, 0) / 7),
  }
  res.json({ days, totals })
})

export default router
