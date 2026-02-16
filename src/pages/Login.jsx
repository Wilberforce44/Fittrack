import React, { useState } from 'react'
import Navbar from '../components/Navbar.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
      } else {
        localStorage.setItem('token', data.token)
        window.location.hash = 'dashboard'
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] text-center">Log In</h1>
          <p className="mt-2 text-center text-[#666666]">Welcome back to FitTrack.</p>
          <form className="mt-8">
            <label className="block mb-4">
              <span className="block text-[#1A1A1A] font-medium mb-2">Email</span>
              <input
                type="email"
                className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block mb-6">
              <span className="block text-[#1A1A1A] font-medium mb-2">Password</span>
              <input
                type="password"
                className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#00A86B] text-white font-semibold transition-colors hover:bg-[#019a60] disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          {error && <p className="mt-4 text-center text-[#E91E63]">{error}</p>}
          <p className="mt-4 text-center text-[#666666]">
            New here? <a href="#signup" className="text-[#00A86B] font-semibold">Create an account</a>
          </p>
        </div>
      </main>
    </div>
  )
}
