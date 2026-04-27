import React, { useState } from 'react';
import { X } from 'lucide-react';
import TopBar from './layout/TopBar';
import AdvancedChart from './chart/AdvancedChart';
import BottomPanel from './panels/BottomPanel';
import WatchlistWidget from './widgets/WatchlistWidget';
import MarketBriefCard from './widgets/MarketBriefCard';
import AICommandPalette from './ai/AICommandPalette';
import LiveTickerTape from './market/LiveTickerTape';

const Workspace = () => {
    const [watchlistOpen, setWatchlistOpen] = useState(false);
    const [bottomExpanded, setBottomExpanded] = useState(false);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            overflow: 'hidden'
        }} className="animate-fade-in">
            <style>{`
                /* Mobile watchlist: hidden off-screen, slides in when open */
                .ws-watchlist {
                    transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
                }
                @media (max-width: 768px) {
                    .ws-watchlist {
                        position: fixed !important;
                        top: 0 !important;
                        right: 0 !important;
                        bottom: 0 !important;
                        width: min(340px, 90vw) !important;
                        z-index: 200 !important;
                        transform: translateX(100%);
                    }
                    .ws-watchlist.mobile-open {
                        transform: translateX(0);
                    }
                    .ws-mobile-toggle {
                        display: flex !important;
                    }
                    .ws-bottom-panel {
                        max-height: 220px;
                    }
                    .ws-bottom-panel.expanded {
                        max-height: 55vh;
                    }
                }
                @media (min-width: 769px) {
                    /* On desktop, watchlist toggle button in TopBar is hidden */
                    .topbar-ws-toggle { display: none !important; }
                }
            `}</style>
            <TopBar onToggleWatchlist={() => setWatchlistOpen(v => !v)} watchlistOpen={watchlistOpen} />
            <LiveTickerTape />

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Main Action Area (Chart + Positions) */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <AdvancedChart />
                    </div>
                    <BottomPanel
                        className={'ws-bottom-panel' + (bottomExpanded ? ' expanded' : '')}
                        onToggleExpand={() => setBottomExpanded(v => !v)}
                        expanded={bottomExpanded}
                    />
                </div>

                {/* Right Analytics Sidebar (Watchlist) */}
                <div className={'ws-watchlist' + (watchlistOpen ? ' mobile-open' : '')} style={{
                    width: '380px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderLeft: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 16px',
                        borderBottom: '1px solid var(--border-color)',
                        fontWeight: 700,
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        backgroundColor: 'rgba(255,255,255,0.02)'
                    }}>
                        Watchlist
                        <div className="ws-mobile-toggle" onClick={() => setWatchlistOpen(false)}
                            style={{ cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={18} color="var(--text-muted)" />
                        </div>
                    </div>
                    {/* AI brief sits above the watchlist — first thing a user
                        sees on page load. Self-fetching, web-grounded. */}
                    <MarketBriefCard />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <WatchlistWidget />
                    </div>
                </div>
            </div>

            {/* Mobile backdrop when watchlist open */}
            {watchlistOpen && (
                <div onClick={() => setWatchlistOpen(false)} style={{
                    position: 'fixed', inset: 0, zIndex: 199,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex'
                }} />
            )}

            {/* Global AI command palette — ⌘K anywhere, or the floating
                "Ask AI" FAB. Scoped to /chart so we don't collide with
                the homepage's FinAIChatbot. */}
            <AICommandPalette />
        </div>
    );
};

export default Workspace;
