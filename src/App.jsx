import { useEffect, useState } from 'react'
import './index.css'
import Landing from './pages/Landing.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Workouts from './pages/Workouts.jsx'
import Meals from './pages/Meals.jsx'
import Goals from './pages/Goals.jsx'

export default function App() {
  const [route, setRoute] = useState(window.location.hash.replace('#', '') || 'home')

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'signup') setRoute('signup')
      else if (hash === 'login') setRoute('login')
      else if (hash === 'dashboard') setRoute('dashboard')
      else if (hash === 'workouts') setRoute('workouts')
      else if (hash === 'meals') setRoute('meals')
      else if (hash === 'goals') setRoute('goals')
      else setRoute('home')
    }
    window.addEventListener('hashchange', onHashChange)
    onHashChange()
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (route === 'signup') return <Signup />
  if (route === 'login') return <Login />
  if (route === 'dashboard') return <Dashboard />
  if (route === 'workouts') return <Workouts />
  if (route === 'meals') return <Meals />
  if (route === 'goals') return <Goals />
  return <Landing />
}
