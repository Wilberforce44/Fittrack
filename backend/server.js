import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import workoutRoutes from './routes/workouts.js'
import mealRoutes from './routes/meals.js'
import goalRoutes from './routes/goals.js'
import statsRoutes from './routes/stats.js'

dotenv.config()

const app = express()

app.use(express.json())
const allowedOrigins = new Set([
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
])
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true)
      if (allowedOrigins.has(origin)) return cb(null, true)
      return cb(new Error('Not allowed by CORS'))
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.options('*', cors())

const mongoUri = process.env.MONGO_URI
const fallbackUri = process.env.MONGO_URI_FALLBACK || 'mongodb://127.0.0.1:27017/fittrack'
try {
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 6000 })
  console.log('MongoDB connected')
} catch (err) {
  console.error('Primary MongoDB connect failed:', err?.code || err?.name || 'Error', err?.message || err)
  if (mongoUri && mongoUri.startsWith('mongodb+srv://')) {
    console.warn('SRV lookup appears to be failing. Falling back to direct/local URI.')
  }
  await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 6000 })
  console.log('MongoDB connected via fallback:', fallbackUri)
}

app.use('/auth', authRoutes)
app.use('/workouts', workoutRoutes)
app.use('/meals', mealRoutes)
app.use('/goals', goalRoutes)
app.use('/stats', statsRoutes)

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

const basePort = Number(process.env.PORT) || 4000
function start(p) {
  const server = app.listen(p, () => {
    console.log(`API running on http://localhost:${p}`)
  })
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const next = p + 1
      console.warn(`Port ${p} in use, trying ${next}...`)
      start(next)
    } else {
      console.error('Server error:', err)
    }
  })
}
start(basePort)
