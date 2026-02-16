import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { FaFlagCheckered } from 'react-icons/fa6'

export default function Goals() {
  const [daily, setDaily] = useState('')
  const [weekly, setWeekly] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.hash = 'login'
      return
    }
    ;(async () => {
      const res = await fetch('http://localhost:4000/goals', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setDaily(data.goal?.dailyCalorieLimit ?? '')
        setWeekly(data.goal?.weeklyWorkoutTarget ?? '')
      } else {
        window.location.hash = 'login'
      }
    })()
  }, [])

  const save = async () => {
    setError('')
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:4000/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ dailyCalorieLimit: daily ? Number(daily) : null, weeklyWorkoutTarget: weekly ? Number(weekly) : null }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save goals')
      } else {
        setDaily(data.goal?.dailyCalorieLimit ?? '')
        setWeekly(data.goal?.weeklyWorkoutTarget ?? '')
      }
    } catch {
      setError('Network error')
    }
  }

  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex items-center gap-3">
          <FaFlagCheckered className="text-[#00A86B] text-2xl" />
          <h1 className="text-3xl font-extrabold text-[#1A1A1A]">Goals</h1>
        </div>
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A]"
              placeholder="Daily calorie limit"
              type="number"
              value={daily}
              onChange={(e) => setDaily(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A]"
              placeholder="Weekly workout target"
              type="number"
              value={weekly}
              onChange={(e) => setWeekly(e.target.value)}
            />
            <button
              onClick={save}
              className="rounded-full bg-[#00A86B] text-white font-semibold px-6 py-3 hover:bg-[#019a60]"
            >
              Save Goals
            </button>
          </div>
          {error && <p className="mt-3 text-[#E91E63]">{error}</p>}
        </div>
      </main>
    </div>
  )
}
