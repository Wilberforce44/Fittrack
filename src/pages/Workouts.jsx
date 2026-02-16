import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { FaDumbbell, FaPen, FaTrash } from 'react-icons/fa6'

export default function Workouts() {
  const [items, setItems] = useState([])
  const [type, setType] = useState('')
  const [minutes, setMinutes] = useState('')
  const [error, setError] = useState('')
  const [editId, setEditId] = useState(null)
  const [editType, setEditType] = useState('')
  const [editMinutes, setEditMinutes] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filterMin, setFilterMin] = useState('')
  const [filterMax, setFilterMax] = useState('')

  const fetchList = async (targetPage = page) => {
    const token = localStorage.getItem('token')
    const params = new URLSearchParams()
    params.set('page', String(targetPage))
    params.set('limit', '10')
    if (filterType) params.set('type', filterType)
    if (filterFrom) params.set('dateFrom', filterFrom)
    if (filterTo) params.set('dateTo', filterTo)
    if (filterMin) params.set('minutesMin', filterMin)
    if (filterMax) params.set('minutesMax', filterMax)
    const res = await fetch(`http://localhost:4000/workouts?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      window.location.hash = 'login'
      return
    }
    const data = await res.json()
    setItems(data.workouts || [])
    setPage(data.page || targetPage)
    setHasMore(data.total ? data.page * (data.limit || 10) < data.total : false)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.hash = 'login'
      return
    }
    setTimeout(() => fetchList(1), 0)
  }, [])

  const add = async () => {
    setError('')
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:4000/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type, minutes: Number(minutes) }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to add workout')
      } else {
        setItems([data.workout, ...items])
        setType('')
        setMinutes('')
      }
    } catch {
      setError('Network error')
    }
  }

  const startEdit = (w) => {
    setEditId(w._id)
    setEditType(w.type)
    setEditMinutes(String(w.minutes))
  }

  const saveEdit = async () => {
    setError('')
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:4000/workouts/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: editType, minutes: Number(editMinutes) }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save workout')
      } else {
        setItems(items.map((it) => (it._id === editId ? data.workout : it)))
        setEditId(null)
        setEditType('')
        setEditMinutes('')
      }
    } catch {
      setError('Network error')
    }
  }

  const remove = async (id) => {
    setError('')
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:4000/workouts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to delete workout')
      } else {
        setItems(items.filter((it) => it._id !== id))
      }
    } catch {
      setError('Network error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FDF4] via-[#E8FFF6] to-[#F0FDF4]">
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex items-center gap-3">
          <FaDumbbell className="text-[#00A86B] text-2xl" />
          <h1 className="text-3xl font-extrabold text-[#1A1A1A]">Workouts</h1>
        </div>
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A]"
              placeholder="Type (e.g., Push, Cardio)"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A]"
              placeholder="Minutes"
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
            <button
              onClick={add}
              className="rounded-full bg-gradient-to-r from-[#00A86B] to-[#04C17F] text-white font-semibold px-6 py-3 hover:opacity-90"
            >
              Add Workout
            </button>
          </div>
          {error && <p className="mt-3 text-[#E91E63]">{error}</p>}
        </div>
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Filters</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A]"
              placeholder="Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A]"
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A]"
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchList(1)}
                className="rounded-full bg-gradient-to-r from-[#00A86B] to-[#04C17F] text-white font-semibold px-6 py-3 hover:opacity-90"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  setFilterType('')
                  setFilterFrom('')
                  setFilterTo('')
                  setFilterMin('')
                  setFilterMax('')
                  fetchList(1)
                }}
                className="rounded-full bg-[#E0E0E0] text-[#1A1A1A] font-semibold px-6 py-3"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="px-4 py-2 rounded-full bg-white border border-[#E0E0E0] text-[#1A1A1A] font-semibold"
            >
              More Filters
            </button>
            {showFilters && (
              <div className="mt-4 p-4 border border-[#E0E0E0] rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A]"
                    placeholder="Min minutes"
                    type="number"
                    value={filterMin}
                    onChange={(e) => setFilterMin(e.target.value)}
                  />
                  <input
                    className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A]"
                    placeholder="Max minutes"
                    type="number"
                    value={filterMax}
                    onChange={(e) => setFilterMax(e.target.value)}
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#666666]">Quick ranges:</span>
                    <button
                      onClick={() => {
                        setFilterMin('')
                        setFilterMax('20')
                        fetchList(1)
                      }}
                      className="px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#E0E0E0] text-sm"
                    >
                      ≤ 20 min
                    </button>
                    <button
                      onClick={() => {
                        setFilterMin('20')
                        setFilterMax('40')
                        fetchList(1)
                      }}
                      className="px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#E0E0E0] text-sm"
                    >
                      20–40 min
                    </button>
                    <button
                      onClick={() => {
                        setFilterMin('40')
                        setFilterMax('')
                        fetchList(1)
                      }}
                      className="px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#E0E0E0] text-sm"
                    >
                      ≥ 40 min
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Recent</h2>
          <ul className="mt-4 space-y-3">
            {items.map((w) => (
              <li key={w._id} className="flex items-center justify-between gap-4">
                {editId === w._id ? (
                  <>
                    <input
                      className="rounded-lg border border-[#E0E0E0] px-3 py-2"
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                    />
                    <input
                      className="rounded-lg border border-[#E0E0E0] px-3 py-2 w-24"
                      type="number"
                      value={editMinutes}
                      onChange={(e) => setEditMinutes(e.target.value)}
                    />
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 rounded-full bg-[#00A86B] text-white font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-4 py-2 rounded-full bg-[#E0E0E0] text-[#1A1A1A] font-semibold"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-[#1A1A1A]">{w.type}</span>
                    <span className="text-[#666666]">{w.minutes} min</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(w)}
                        className="p-2 rounded-full bg-[#F0FDF4] border border-[#E0E0E0]"
                        aria-label="Edit"
                      >
                        <FaPen className="text-[#1A1A1A]" />
                      </button>
                      <button
                        onClick={() => remove(w._id)}
                        className="p-2 rounded-full bg-[#FDECEC] border border-[#E0E0E0]"
                        aria-label="Delete"
                      >
                        <FaTrash className="text-[#E91E63]" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
            {!items.length && <li className="text-[#666666]">No workouts yet</li>}
          </ul>
          <div className="mt-6 flex items-center justify-between">
            <button
              disabled={page <= 1}
              onClick={() => fetchList(page - 1)}
              className="px-4 py-2 rounded-full bg-[#E0E0E0] text-[#1A1A1A] font-semibold disabled:opacity-60"
            >
              Prev
            </button>
            <span className="text-[#666666]">Page {page}</span>
            <button
              disabled={!hasMore}
              onClick={() => fetchList(page + 1)}
              className="px-4 py-2 rounded-full bg-[#00A86B] text-white font-semibold disabled:opacity-60"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
