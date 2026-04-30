import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'

// Lazy-load every non-home route. The home page is the dominant entry
// point (ad traffic, organic search, direct loads); shipping the rest
// only when the user navigates keeps initial JS small. React.lazy +
// Suspense pairs cleanly with Vite's rollup chunk splitter so each
// page becomes its own chunk.
const LoginPage          = lazy(() => import('./pages/LoginPage'))
const SignupPage         = lazy(() => import('./pages/SignupPage'))
const SchoolProgramPage  = lazy(() => import('./pages/SchoolProgramPage'))
const SyllabusPage       = lazy(() => import('./pages/SyllabusPage'))
const WhoWeArePage       = lazy(() => import('./pages/WhoWeArePage'))
const TopStocxPage       = lazy(() => import('./pages/TopStocxPage'))
const EnrollPage         = lazy(() => import('./pages/EnrollPage'))
const ThankYouPage       = lazy(() => import('./pages/ThankYouPage'))
const ProgrammesPage     = lazy(() => import('./pages/ProgrammesPage'))
const BlogIndexPage      = lazy(() => import('./pages/BlogIndexPage'))
const BlogPostPage       = lazy(() => import('./pages/BlogPostPage'))

import CustomScrollbar from './components/CustomScrollbar'
import FinAIChatbot from './components/FinAIChatbot'
import AnalyticsTracker from './components/AnalyticsTracker'
import SiteHeader from './components/SiteHeader'
import { captureAttribution } from './lib/tracking'

// Minimal fallback for lazy routes — matches the brand background so
// the swap is invisible on slow networks. No spinner; the chunks load
// fast enough on warm caches that a spinner just adds visual noise.
const RouteFallback = () => (
  <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} />
)

function App() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'
  const isTopStocx = location.pathname.startsWith('/topstocx')
  const isHome = location.pathname === '/'

  useEffect(() => { captureAttribution() }, [])

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
      <>
        <AnalyticsTracker />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </Suspense>
      </>
    )
  }

  if (isTopStocx) {
    return (
      <>
        <AnalyticsTracker />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/topstocx/*" element={<TopStocxPage />} />
          </Routes>
        </Suspense>
      </>
    )
  }

  return (
    <div className="layout" style={{ background: 'var(--bg-primary)', minHeight: '100vh', position: 'relative' }}>
      <AnalyticsTracker />
      <CustomScrollbar />
      {!isHome && <SiteHeader />}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/school-of-finance" element={<SchoolProgramPage schoolId="sof" />} />
            <Route path="/school-of-technology" element={<SchoolProgramPage schoolId="sot" />} />
            <Route path="/school-of-design" element={<SchoolProgramPage schoolId="sod" />} />
            <Route path="/school-of-management" element={<SchoolProgramPage schoolId="som" />} />
            <Route path="/school-of-finance/syllabus" element={<SyllabusPage />} />
            <Route path="/who-we-are" element={<WhoWeArePage />} />
            <Route path="/enroll" element={<EnrollPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/programmes" element={<ProgrammesPage />} />
            <Route path="/programs" element={<ProgrammesPage />} />
            <Route path="/blog" element={<BlogIndexPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        </Suspense>
      </main>
      <FinAIChatbot />
      <Footer />
    </div>
  )
}

export default App
