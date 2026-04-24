import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TradingPage from './pages/TradingPage';
import AuthPage from './pages/AuthPage';
import TradeIdeasPage from './pages/TradeIdeasPage';
import CopyTradePage from './pages/CopyTradePage';
import MarketsPage from './pages/MarketsPage';
import FinAIChatbot from './components/chat/FinAIChatbot';
import { PlanProvider } from './context/PlanContext';
import { MarketDataProvider } from './context/MarketDataContext';
import { LeverateProvider } from './context/LeverateContext';
import { AIContextProvider } from './context/AIContext';
import PricingModal from './components/layout/PricingModal';
import SmoothScrollProvider from './providers/SmoothScrollProvider';

/**
 * ScrollUnlocker — defensive safety net.
 *
 * The FinAIChatbot locks body scroll on mobile when it's open by
 * setting `position: fixed` + `overflow: hidden` on <body>. If
 * anything interrupts its cleanup (HMR, hard navigation, error
 * boundary), the page can get stuck in a non-scrollable state.
 *
 * This component resets body scroll styles on every route change so
 * the user can always scroll the new page regardless of what the
 * previous route left behind.
 */
function ScrollUnlocker() {
  const { pathname } = useLocation();
  useEffect(() => {
    const { body, documentElement: html } = document;
    // Only reset if something actually stuck the body fixed.
    if (body.style.position === 'fixed' || body.style.overflow === 'hidden') {
      body.style.overflow = '';
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      html.style.overscrollBehavior = '';
    }
  }, [pathname]);
  return null;
}

function App() {
  return (
    <PlanProvider>
      <MarketDataProvider>
        <LeverateProvider>
          <AIContextProvider>
            <BrowserRouter>
              <SmoothScrollProvider>
                <ScrollUnlocker />
                <Routes>
                  <Route path="/"            element={<HomePage />} />
                  <Route path="/chart"       element={<TradingPage />} />
                  <Route path="/login"       element={<AuthPage />} />
                  <Route path="/trade-ideas" element={<TradeIdeasPage />} />
                  <Route path="/copy-trade"  element={<CopyTradePage />} />
                  <Route path="/markets"     element={<MarketsPage />} />
                  <Route path="/community"   element={<TradeIdeasPage />} />
                </Routes>
                <FinAIChatbot />
                <PricingModal />
              </SmoothScrollProvider>
            </BrowserRouter>
          </AIContextProvider>
        </LeverateProvider>
      </MarketDataProvider>
    </PlanProvider>
  );
}

export default App;
