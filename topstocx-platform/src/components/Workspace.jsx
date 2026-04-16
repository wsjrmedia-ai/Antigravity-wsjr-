import React, { useState } from 'react';
import { X } from 'lucide-react';
import TopBar from './layout/TopBar';
import AdvancedChart from './chart/AdvancedChart';
import BottomPanel from './panels/BottomPanel';
import WatchlistWidget from './widgets/WatchlistWidget';

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
            <TopBar onToggleWatchlist={() => setWatchlistOpen(v => !v)} watchlistOpen={watchlistOpen} />

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
                            style={{ cursor: 'pointer', padding: 4, alignItems: 'center', justifyContent: 'center' }}>
                            <X size={18} color="var(--text-muted)" />
                        </div>
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <WatchlistWidget />
                    </div>
                </div>
            </div>

            {/* Mobile backdrop when watchlist open */}
            {watchlistOpen && (
                <div className="ws-mobile-toggle" onClick={() => setWatchlistOpen(false)} style={{
                    position: 'fixed', inset: 0, zIndex: 199,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    alignItems: 'stretch', justifyContent: 'stretch'
                }} />
            )}
        </div>
    );
};

export default Workspace;
