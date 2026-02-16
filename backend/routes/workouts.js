import { Router } from 'express'
import auth from '../middleware/auth.js'
import Workout from '../models/Workout.js'

const router = Router()

router.post('/', auth, async (req, res) => {
  const { type, minutes, date } = req.body
  if (!type || !minutes) return res.status(400).json({ error: 'Missing fields' })
  const doc = await Workout.create({ userId: req.user.id, type, minutes, date: date ? new Date(date) : new Date() })
  res.json({ workout: doc })
})

router.get('/', auth, async (req, res) => {
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20))
  const page = Math.max(1, Number(req.query.page) || 1)
  const type = req.query.type
  const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : null
  const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : null
  const minutesMin = req.query.minutesMin ? Number(req.query.minutesMin) : null
  const minutesMax = req.query.minutesMax ? Number(req.query.minutesMax) : null
  const q = { userId: req.user.id }
  if (type) q.type = { $regex: new RegExp(type, 'i') }
  if (dateFrom || dateTo) q.date = {}
  if (dateFrom) q.date.$gte = dateFrom
  if (dateTo) q.date.$lte = dateTo
  if (minutesMin != null || minutesMax != null) q.minutes = {}
  if (minutesMin != null) q.minutes.$gte = minutesMin
  if (minutesMax != null) q.minutes.$lte = minutesMax
  const total = await Workout.countDocuments(q)
  const docs = await Workout.find(q).sort({ date: -1 }).skip((page - 1) * limit).limit(limit)
  res.json({ workouts: docs, page, total, limit })
})

router.put('/:id', auth, async (req, res) => {
  const { type, minutes, date } = req.body
  const doc = await Workout.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $set: { type, minutes, date: date ? new Date(date) : undefined } },
    { new: true }
  )
  if (!doc) return res.status(404).json({ error: 'Not found' })
  res.json({ workout: doc })
})

router.delete('/:id', auth, async (req, res) => {
  const doc = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
  if (!doc) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

export default router
