import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Header from './components/Header'
import Footer from './components/Footer'
import ParticleField from './components/ParticleField'
import Floating3DShapes from './components/Floating3DShapes'
import GalaxyBackground from './components/GalaxyBackground'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import SchoolOfFinance from './pages/SchoolOfFinance'

import CustomScrollbar from './components/CustomScrollbar'

function App() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    )
  }

  return (
    <div className="layout" style={{ background: 'var(--bg-primary)', minHeight: '100vh', position: 'relative' }}>
      <CustomScrollbar />
      <GalaxyBackground />
      <ParticleField />
      <Floating3DShapes />
      <Header />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/school-of-finance" element={<SchoolOfFinance />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
