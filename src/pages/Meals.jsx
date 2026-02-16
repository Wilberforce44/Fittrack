import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { FaUtensils, FaPen, FaTrash } from 'react-icons/fa6'

export default function Meals() {
  const [items, setItems] = useState([])
  const [calories, setCalories] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')
  const [editId, setEditId] = useState(null)
  const [editCalories, setEditCalories] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [filterMin, setFilterMin] = useState('')
  const [filterMax, setFilterMax] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [showPresets, setShowPresets] = useState(false)

  const fetchList = async (targetPage = page) => {
    const token = localStorage.getItem('token')
    const params = new URLSearchParams()
    params.set('page', String(targetPage))
    params.set('limit', '10')
    if (filterCategory) params.set('category', filterCategory)
    if (filterFrom) params.set('dateFrom', filterFrom)
    if (filterTo) params.set('dateTo', filterTo)
    if (filterMin) params.set('caloriesMin', filterMin)
    if (filterMax) params.set('caloriesMax', filterMax)
    const res = await fetch(`https://fittrack-6smg.onrender.com/meals?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      window.location.hash = 'login'
      return
    }
    const data = await res.json()
    setItems(data.meals || [])
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
      const res = await fetch('https://fittrack-6smg.onrender.com/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ calories: Number(calories), category }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to add meal')
      } else {
        setItems([data.meal, ...items])
        setCalories('')
        setCategory('')
      }
    } catch {
      setError('Network error')
    }
  }

  const startEdit = (m) => {
    setEditId(m._id)
    setEditCalories(String(m.calories))
    setEditCategory(m.category || '')
  }

  const saveEdit = async () => {
    setError('')
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`https://fittrack-6smg.onrender.com/meals/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ calories: Number(editCalories), category: editCategory }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save meal')
      } else {
        setItems(items.map((it) => (it._id === editId ? data.meal : it)))
        setEditId(null)
        setEditCalories('')
        setEditCategory('')
      }
    } catch {
      setError('Network error')
    }
  }

  const remove = async (id) => {
    setError('')
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`https://fittrack-6smg.onrender.com/meals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to delete meal')
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
          <FaUtensils className="text-[#00A86B] text-2xl" />
          <h1 className="text-3xl font-extrabold text-[#1A1A1A]">Meals</h1>
        </div>
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A]"
              placeholder="Calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A]"
              placeholder="Category (e.g., Breakfast)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <button
              onClick={add}
              className="rounded-full bg-gradient-to-r from-[#00A86B] to-[#04C17F] text-white font-semibold px-6 py-3 hover:opacity-90"
            >
              Add Meal
            </button>
          </div>
          {error && <p className="mt-3 text-[#E91E63]">{error}</p>}
        </div>
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Filters</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A]"
              placeholder="Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
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
            <input
              className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A]"
              placeholder="Min calories"
              type="number"
              value={filterMin}
              onChange={(e) => setFilterMin(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-[#1A1A1A]"
              placeholder="Max calories"
              type="number"
              value={filterMax}
              onChange={(e) => setFilterMax(e.target.value)}
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
                  setFilterCategory('')
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
              onClick={() => setShowPresets((s) => !s)}
              className="px-4 py-2 rounded-full bg-white border border-[#E0E0E0] text-[#1A1A1A] font-semibold"
            >
              Presets
            </button>
            {showPresets && (
              <div className="mt-4 p-4 border border-[#E0E0E0] rounded-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setFilterCategory('Breakfast')
                      fetchList(1)
                    }}
                    className="px-3 py-1 rounded-full bg-[#FFF7E6] border border-[#FFD699] text-sm"
                  >
                    Breakfast
                  </button>
                  <button
                    onClick={() => {
                      setFilterCategory('Lunch')
                      fetchList(1)
                    }}
                    className="px-3 py-1 rounded-full bg-[#E6F5FF] border border-[#99D6FF] text-sm"
                  >
                    Lunch
                  </button>
                  <button
                    onClick={() => {
                      setFilterCategory('Dinner')
                      fetchList(1)
                    }}
                    className="px-3 py-1 rounded-full bg-[#FBE6EE] border border-[#F5B7CD] text-sm"
                  >
                    Dinner
                  </button>
                  <button
                    onClick={() => {
                      setFilterCategory('Snack')
                      fetchList(1)
                    }}
                    className="px-3 py-1 rounded-full bg-[#EAFCEB] border border-[#B8F5BD] text-sm"
                  >
                    Snack
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Recent</h2>
          <ul className="mt-4 space-y-3">
            {items.map((m) => (
              <li key={m._id} className="flex items-center justify-between gap-4">
                {editId === m._id ? (
                  <>
                    <input
                      className="rounded-lg border border-[#E0E0E0] px-3 py-2"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                    />
                    <input
                      className="rounded-lg border border-[#E0E0E0] px-3 py-2 w-24"
                      type="number"
                      value={editCalories}
                      onChange={(e) => setEditCalories(e.target.value)}
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
                    <span className="text-[#1A1A1A]">{m.category || 'Meal'}</span>
                    <span className="text-[#666666]">{m.calories} cal</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(m)}
                        className="p-2 rounded-full bg-[#F0FDF4] border border-[#E0E0E0]"
                        aria-label="Edit"
                      >
                        <FaPen className="text-[#1A1A1A]" />
                      </button>
                      <button
                        onClick={() => remove(m._id)}
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
            {!items.length && <li className="text-[#666666]">No meals yet</li>}
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
