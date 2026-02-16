import { Router } from 'express'
import auth from '../middleware/auth.js'
import Meal from '../models/Meal.js'

const router = Router()

router.post('/', auth, async (req, res) => {
  const { calories, category, date } = req.body
  if (!calories) return res.status(400).json({ error: 'Missing fields' })
  const doc = await Meal.create({ userId: req.user.id, calories, category, date: date ? new Date(date) : new Date() })
  res.json({ meal: doc })
})

router.get('/', auth, async (req, res) => {
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20))
  const page = Math.max(1, Number(req.query.page) || 1)
  const category = req.query.category
  const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : null
  const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : null
  const caloriesMin = req.query.caloriesMin ? Number(req.query.caloriesMin) : null
  const caloriesMax = req.query.caloriesMax ? Number(req.query.caloriesMax) : null
  const q = { userId: req.user.id }
  if (category) q.category = { $regex: new RegExp(category, 'i') }
  if (dateFrom || dateTo) q.date = {}
  if (dateFrom) q.date.$gte = dateFrom
  if (dateTo) q.date.$lte = dateTo
  if (caloriesMin != null || caloriesMax != null) q.calories = {}
  if (caloriesMin != null) q.calories.$gte = caloriesMin
  if (caloriesMax != null) q.calories.$lte = caloriesMax
  const total = await Meal.countDocuments(q)
  const docs = await Meal.find(q).sort({ date: -1 }).skip((page - 1) * limit).limit(limit)
  res.json({ meals: docs, page, total, limit })
})

router.put('/:id', auth, async (req, res) => {
  const { calories, category, date } = req.body
  const doc = await Meal.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $set: { calories, category, date: date ? new Date(date) : undefined } },
    { new: true }
  )
  if (!doc) return res.status(404).json({ error: 'Not found' })
  res.json({ meal: doc })
})

router.delete('/:id', auth, async (req, res) => {
  const doc = await Meal.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
  if (!doc) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

export default router
