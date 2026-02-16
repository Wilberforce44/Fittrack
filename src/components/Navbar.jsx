import React, { useEffect, useState } from 'react'

export default function Navbar() {
  const [userLabel, setUserLabel] = useState('')
  const [summary, setSummary] = useState({ workouts: null, calories: null })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    ;(async () => {
      try {
        const res = await fetch('http://localhost:4000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        const label = data?.user?.email || data?.user?.name || ''
        setUserLabel(label)
        const sRes = await fetch('http://localhost:4000/stats/today', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (sRes.ok) {
          const sData = await sRes.json()
          setSummary({ workouts: sData.workoutsCount ?? null, calories: sData.caloriesTotal ?? null })
        }
      } catch {
        setSummary((s) => s)
      }
    })()
  }, [])
  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-white via-[#F0FDF4] to-white backdrop-blur h-[72px] shadow-sm">
      <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#00A86B] flex items-center justify-center">
            <span className="text-white text-lg font-bold">FT</span>
          </div>
          <span className="text-2xl font-bold text-[#1A1A1A]">FitTrack</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[#1A1A1A]">
          {!userLabel && (
            <>
              <a href="#home" className="hover:text-[#00A86B] transition-colors">Home</a>
              <a href="#features" className="hover:text-[#00A86B] transition-colors">Features</a>
              <a href="#about" className="hover:text-[#00A86B] transition-colors">About</a>
              <a href="#contact" className="hover:text-[#00A86B] transition-colors">Contact</a>
            </>
          )}
          {userLabel && (
            <>
              <span className="ml-0 inline-flex items-center bg-[#F0FDF4] text-[#1A1A1A] border border-[#E0E0E0] px-3 py-1 rounded-full text-sm">
                Logged in as <span className="ml-1 font-semibold text-[#00A86B]">{userLabel}</span>
              </span>
              <div className="ml-4 hidden lg:flex items-center gap-3">
                <a href="#workouts" className="px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#E0E0E0] text-sm">Workouts</a>
                <a href="#meals" className="px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#E0E0E0] text-sm">Meals</a>
                <a href="#goals" className="px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#E0E0E0] text-sm">Goals</a>
                {summary.workouts != null && (
                  <span className="px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#E0E0E0] text-sm">
                    W {summary.workouts}
                  </span>
                )}
                {summary.calories != null && (
                  <span className="px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#E0E0E0] text-sm">
                    Cal {summary.calories}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
        <button className="md:hidden p-2 rounded-lg border border-[#E0E0E0]" aria-label="Open navigation menu">
          <span className="sr-only">Menu</span>
          <div className="w-5 h-0.5 bg-[#1A1A1A] mb-1.5"></div>
          <div className="w-5 h-0.5 bg-[#1A1A1A] mb-1.5"></div>
          <div className="w-5 h-0.5 bg-[#1A1A1A]"></div>
        </button>
      </div>
    </nav>
  )
}
