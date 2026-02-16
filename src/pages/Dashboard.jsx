import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { FaDumbbell, FaFire, FaFlagCheckered, FaCalendarWeek } from 'react-icons/fa6'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [today, setToday] = useState({ workoutsCount: null, caloriesTotal: null })
  const [week, setWeek] = useState({ workouts: null, minutes: null, calories: null, avgCaloriesPerDay: null })
  const [goals, setGoals] = useState({ dailyCalorieLimit: null, weeklyWorkoutTarget: null, metDaily: null, metWeekly: null })
  const [weekDays, setWeekDays] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.hash = 'login'
      return
    }
    ;(async () => {
      try {
        const res = await fetch('https://fittrack-6smg.onrender.com/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          window.location.hash = 'login'
          return
        }
        const data = await res.json()
        setUser(data.user)
        const tRes = await fetch('https://fittrack-6smg.onrender.com/stats/today', { headers: { Authorization: `Bearer ${token}` } })
        const tData = await tRes.json()
        const wRes = await fetch('https://fittrack-6smg.onrender.com/stats/week', { headers: { Authorization: `Bearer ${token}` } })
        const wData = await wRes.json()
        setToday({ workoutsCount: tData.workoutsCount ?? null, caloriesTotal: tData.caloriesTotal ?? null })
        const gRes = await fetch('https://fittrack-6smg.onrender.com/goals', { headers: { Authorization: `Bearer ${token}` } })
        const gData = await gRes.json()
        setWeek({
          workouts: wData.totals?.workouts ?? null,
          minutes: wData.totals?.minutes ?? null,
          calories: wData.totals?.calories ?? null,
          avgCaloriesPerDay: wData.totals?.avgCaloriesPerDay ?? null,
        })
        setWeekDays(wData.days || [])
        const dailyLimit = gData.goal?.dailyCalorieLimit ?? null
        const weeklyTarget = gData.goal?.weeklyWorkoutTarget ?? null
        const metDaily = dailyLimit != null && tData.caloriesTotal != null ? tData.caloriesTotal <= dailyLimit : null
        const metWeekly = weeklyTarget != null && wData.totals?.workouts != null ? wData.totals.workouts >= weeklyTarget : null
        setGoals({
          dailyCalorieLimit: dailyLimit,
          weeklyWorkoutTarget: weeklyTarget,
          metDaily,
          metWeekly,
        })
      } catch {
        window.location.hash = 'login'
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    window.location.hash = 'home'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FDF4]">
        <Navbar />
        <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
          <div className="inline-block w-10 h-10 rounded-full border-4 border-[#00A86B] border-t-transparent animate-spin"></div>
          <p className="mt-4 text-[#666666]">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FDF4] via-[#E8FFF6] to-[#F0FDF4] fitness-pattern">
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">Dashboard</h1>
          <button
            onClick={logout}
            className="px-6 py-2 rounded-full bg-white text-[#1A1A1A] border-2 border-[#E0E0E0] font-semibold hover:bg-[#F5F5F5]"
          >
            Logout
          </button>
        </div>
        <p className="mt-2 text-[#666666]">Welcome, {user.name || user.email}</p>
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#00A86B] to-[#04C17F] text-white px-6 py-4 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaDumbbell className="text-white text-xl" />
              <span className="font-semibold">Keep pushing. Every workout counts.</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="px-3 py-1 rounded-full bg-white/10">Today: {today.workoutsCount ?? '—'} workouts</span>
              <span className="px-3 py-1 rounded-full bg-white/10">Calories: {today.caloriesTotal ?? '—'}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center gap-2">
              <FaDumbbell className="text-[#00A86B] text-xl" />
              <h2 className="text-xl font-bold text-[#1A1A1A]">Today</h2>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#666666] flex items-center gap-2"><FaDumbbell className="text-[#00A86B]" /> Workouts</span>
                <span className="font-semibold text-[#1A1A1A]">{today.workoutsCount ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666] flex items-center gap-2"><FaFire className="text-[#E91E63]" /> Calories</span>
                <span className="font-semibold text-[#1A1A1A]">{today.caloriesTotal ?? '—'}</span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <a href="#workouts" className="px-4 py-2 rounded-full bg-[#00A86B] text-white font-semibold hover:bg-[#019a60] transition-transform hover:-translate-y-0.5 hover:shadow-md">Go to Workouts</a>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center gap-2">
              <FaCalendarWeek className="text-[#00A86B] text-xl" />
              <h2 className="text-xl font-bold text-[#1A1A1A]">Week</h2>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Workouts</span>
                <span className="font-semibold text-[#1A1A1A]">{week.workouts ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Minutes</span>
                <span className="font-semibold text-[#1A1A1A]">{week.minutes ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666] flex items-center gap-2"><FaFire className="text-[#E91E63]" /> Calories</span>
                <span className="font-semibold text-[#1A1A1A]">{week.calories ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Avg/day</span>
                <span className="font-semibold text-[#1A1A1A]">{week.avgCaloriesPerDay ?? '—'}</span>
              </div>
            </div>
            <div className="mt-6 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekDays}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="workouts" fill="#00A86B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <a href="#meals" className="px-4 py-2 rounded-full bg-[#00A86B] text-white font-semibold hover:bg-[#019a60] transition-transform hover:-translate-y-0.5 hover:shadow-md">Go to Meals</a>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center gap-2">
              <FaFlagCheckered className="text-[#00A86B] text-xl" />
              <h2 className="text-xl font-bold text-[#1A1A1A]">Goals</h2>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Daily calorie limit</span>
                <span className="font-semibold text-[#1A1A1A]">{goals.dailyCalorieLimit ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Weekly workout target</span>
                <span className="font-semibold text-[#1A1A1A]">{goals.weeklyWorkoutTarget ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Daily met</span>
                <span className={`font-semibold ${goals.metDaily === true ? 'text-[#00A86B]' : goals.metDaily === false ? 'text-[#E91E63]' : 'text-[#1A1A1A]'}`}>
                  {goals.metDaily === null ? '—' : goals.metDaily ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Weekly met</span>
                <span className={`font-semibold ${goals.metWeekly === true ? 'text-[#00A86B]' : goals.metWeekly === false ? 'text-[#E91E63]' : 'text-[#1A1A1A]'}`}>
                  {goals.metWeekly === null ? '—' : goals.metWeekly ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <div className="mt-6 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weekDays}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="calories" stroke="#E91E63" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <a href="#goals" className="px-4 py-2 rounded-full bg-[#00A86B] text-white font-semibold hover:bg-[#019a60] transition-transform hover:-translate-y-0.5 hover:shadow-md">Go to Goals</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
