import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import PricingModal from './components/layout/PricingModal';
import SmoothScrollProvider from './providers/SmoothScrollProvider';

function App() {
  return (
    <PlanProvider>
      <MarketDataProvider>
        <LeverateProvider>
          <BrowserRouter>
            <SmoothScrollProvider>
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
        </LeverateProvider>
      </MarketDataProvider>
    </PlanProvider>
  );
}

export default App;
