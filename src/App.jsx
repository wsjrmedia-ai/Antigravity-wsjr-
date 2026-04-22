import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Footer from './components/Footer'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import SchoolOfFinance from './pages/SchoolOfFinance'
import SyllabusPage from './pages/SyllabusPage'
import WhoWeArePage from './pages/WhoWeArePage'
import TopStocxPage from './pages/TopStocxPage'
import EnrollPage from './pages/EnrollPage'

import CustomScrollbar from './components/CustomScrollbar'
import FinAIChatbot from './components/FinAIChatbot'

function App() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'
  const isTopStocx = location.pathname.startsWith('/topstocx')

  useEffect(() => {
    if (isTopStocx) return // TopStocx has its own layout, skip Lenis

    const lenis = new Lenis({
      lerp: 0.06, // Physics-based linear interpolation for buttery smoothness
      duration: 1.5, // Fallback for browsers that don't support lerp well
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9, // Slightly heavier wheel feel
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    // Expose globally so overlays (mobile menu, chatbot) can pause scroll while open
    window.__lenis = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      if (window.__lenis === lenis) delete window.__lenis
    }
  }, [isTopStocx])

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    )
  }

  if (isTopStocx) {
    return (
      <Routes>
        <Route path="/topstocx/*" element={<TopStocxPage />} />
      </Routes>
    )
  }

  return (
    <div className="layout" style={{ background: 'var(--bg-primary)', minHeight: '100vh', position: 'relative' }}>
      <CustomScrollbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/school-of-finance" element={<SchoolOfFinance />} />
          <Route path="/school-of-finance/syllabus" element={<SyllabusPage />} />
          <Route path="/who-we-are" element={<WhoWeArePage />} />
          <Route path="/enroll" element={<EnrollPage />} />
        </Routes>
      </main>
      <FinAIChatbot />
      <Footer />
    </div>
  )
}

export default App
