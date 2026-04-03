import React from 'react';
import TopBar from './layout/TopBar';
import AdvancedChart from './chart/AdvancedChart';
import BottomPanel from './panels/BottomPanel';
import WatchlistWidget from './widgets/WatchlistWidget';

const Workspace = () => {
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
            <TopBar />

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
                    <BottomPanel />
                </div>

                {/* Right Analytics Sidebar (Watchlist) */}
                <div style={{
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
                        padding: '0 16px',
                        borderBottom: '1px solid var(--border-color)',
                        fontWeight: 700,
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        backgroundColor: 'rgba(255,255,255,0.02)'
                    }}>
                        Watchlist
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <WatchlistWidget />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workspace;
