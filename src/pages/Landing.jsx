import React, { useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import { FaDumbbell, FaUtensils, FaChartLine } from 'react-icons/fa6'

export default function Landing() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.shimmer-container'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in-view')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      <Navbar />
      <header id="home" className="scroll-mt-24 max-w-[1200px] mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#1A1A1A]">
          Track Your Fitness.{' '}
          <span className="text-[#00A86B]">Achieve Your Goals.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-[#666666]">
          Log workouts, track calories, set goals, and see your progress with a clean, accessible, responsive experience.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#signup"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#00A86B] text-white text-base font-semibold transition-colors hover:bg-[#019a60]"
          >
            Get Started
          </a>
          <a
            href="#login"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-[#1A1A1A] border-2 border-[#E0E0E0] text-base font-semibold transition-colors hover:bg-[#F5F5F5]"
          >
            Login
          </a>
        </div>
      </header>

      <section id="features" className="scroll-mt-24 max-w-[1200px] mx-auto px-6 pb-20">
        <div className="shimmer-container relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/90 to-white/70 border border-[#E0E0E0] shadow-xl p-6 md:p-10">
          <div className="shimmer-bar"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="mx-auto mb-6 w-16 h-16 rounded-xl bg-gradient-to-r from-[#00A86B] to-[#04C17F] flex items-center justify-center">
              <FaDumbbell className="text-white text-2xl" aria-hidden="true" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1A1A1A]">Workout Logging</h3>
            <p className="mt-2 text-[16px] text-[#666666]">
              Record exercises, sets, reps, and duration in seconds.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="mx-auto mb-6 w-16 h-16 rounded-xl bg-gradient-to-r from-[#00A86B] to-[#04C17F] flex items-center justify-center">
              <FaUtensils className="text-white text-2xl" aria-hidden="true" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1A1A1A]">Calorie Tracking</h3>
            <p className="mt-2 text-[16px] text-[#666666]">
              Log meals with calories and optional categories for quick summaries.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="mx-auto mb-6 w-16 h-16 rounded-xl bg-gradient-to-r from-[#00A86B] to-[#04C17F] flex items-center justify-center">
              <FaChartLine className="text-white text-2xl" aria-hidden="true" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1A1A1A]">Progress Overview</h3>
            <p className="mt-2 text-[16px] text-[#666666]">
              See weekly totals and trends with clear, responsive visuals.
            </p>
          </div>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 max-w-[1200px] mx-auto px-6 pb-20">
        <div className="shimmer-container relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/90 to-white/70 border border-[#E0E0E0] p-8 md:p-10 shadow-xl">
          <div className="shimmer-bar"></div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] text-center">
            About FitTrack
          </h2>
          <p className="mt-4 text-[#666666] text-lg md:text-xl text-center max-w-3xl mx-auto">
            FitTrack is a modern, accessible fitness tracker designed to keep things simple. Log workouts, track calories, and stay motivated with clear goals and progress—no clutter, just the essentials.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-[#E0E0E0] bg-white">
              <h3 className="text-xl font-bold text-[#1A1A1A]">Clean & Simple</h3>
              <p className="mt-2 text-[#666666]">A focused experience without complicated menus or distractions.</p>
            </div>
            <div className="p-6 rounded-xl border border-[#E0E0E0] bg-white">
              <h3 className="text-xl font-bold text-[#1A1A1A]">Responsive</h3>
              <p className="mt-2 text-[#666666]">Optimized for mobile and desktop with smooth interactions.</p>
            </div>
            <div className="p-6 rounded-xl border border-[#E0E0E0] bg-white">
              <h3 className="text-xl font-bold text-[#1A1A1A]">Accessible</h3>
              <p className="mt-2 text-[#666666]">High-contrast text, keyboard navigation, and clear focus states.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 max-w-[1200px] mx-auto px-6 pb-24">
        <div className="shimmer-container relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/90 to-white/70 border border-[#E0E0E0] p-8 md:p-10 shadow-xl">
          <div className="shimmer-bar"></div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] text-center">
            Contact
          </h2>
        <p className="mt-4 text-[#666666] text-lg text-center max-w-2xl mx-auto">
            Questions or feedback? Send us a message and we’ll get back to you.
          </p>
          <form className="mt-8 max-w-xl mx-auto">
            <label className="block mb-4">
              <span className="block text-[#1A1A1A] font-medium mb-2">Name</span>
              <input
                type="text"
                className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
                placeholder="Your name"
              />
            </label>
            <label className="block mb-4">
              <span className="block text-[#1A1A1A] font-medium mb-2">Email</span>
              <input
                type="email"
                className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
                placeholder="you@example.com"
              />
            </label>
            <label className="block mb-6">
              <span className="block text-[#1A1A1A] font-medium mb-2">Message</span>
              <textarea
                rows="4"
                className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
                placeholder="Tell us how we can help"
              ></textarea>
            </label>
            <a
              href="mailto:wilberforceworukwo@gmail.com?subject=FitTrack%20Contact"
              className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#00A86B] text-white font-semibold transition-colors hover:bg-[#019a60]"
            >
              Send Message
            </a>
          </form>
        </div>
      </section>

      <footer className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00A86B] flex items-center justify-center">
                <span className="text-white text-sm font-bold">FT</span>
              </div>
              <span className="text-xl font-bold text-[#1A1A1A]">FitTrack</span>
            </div>
            <div className="flex items-center gap-6 text-[#666666]">
              <a href="#home" className="hover:text-[#00A86B]">Home</a>
              <a href="#features" className="hover:text-[#00A86B]">Features</a>
              <a href="#about" className="hover:text-[#00A86B]">About</a>
              <a href="#contact" className="hover:text-[#00A86B]">Contact</a>
            </div>
          </div>
          <div className="mt-6 text-center text-[#999999] text-sm">
            © {new Date().getFullYear()} FitTrack. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
