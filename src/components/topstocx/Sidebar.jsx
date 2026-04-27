const TOOLS = [
    {
        id: 'cursor',
        label: 'Cursor',
        svg: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 3l14 9-7 1-4 7z"/>
            </svg>
        ),
    },
    {
        id: 'trendline',
        label: 'Trend Line',
        svg: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="20" x2="20" y2="4"/>
                <circle cx="4" cy="20" r="2" fill="currentColor" stroke="none"/>
                <circle cx="20" cy="4" r="2" fill="currentColor" stroke="none"/>
            </svg>
        ),
    },
    {
        id: 'fibonacci',
        label: 'Fibonacci',
        svg: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6"  x2="21" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <line x1="3" y1="14" x2="21" y2="14"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="4"  x2="3"  y2="20" strokeWidth="1.5" strokeOpacity="0.5"/>
                <line x1="21" y1="4" x2="21" y2="20" strokeWidth="1.5" strokeOpacity="0.5"/>
            </svg>
        ),
    },
    {
        id: 'text',
        label: 'Text Annotation',
        svg: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
            </svg>
        ),
    },
    {
        id: 'shapes',
        label: 'Rectangle',
        svg: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="6" width="18" height="12" rx="2"/>
            </svg>
        ),
    },
    {
        id: 'measure',
        label: 'Measure',
        svg: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="12" x2="20" y2="12"/>
                <line x1="4" y1="8"  x2="4"  y2="16"/>
                <line x1="20" y1="8" x2="20" y2="16"/>
            </svg>
        ),
    },
    {
        id: 'eraser',
        label: 'Erase All Drawings',
        svg: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 20H7L3 16l11-11 6 6-4.5 4.5"/><line x1="2" y1="22" x2="22" y2="22"/>
            </svg>
        ),
    },
];

const Sidebar = ({ activeTool = 'cursor', onToolChange }) => {
    return (
        <div style={{
            width: '52px',
            background: '#131722',
            borderRight: '1px solid #2a2e39',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '8px',
            gap: '4px',
            flexShrink: 0,
        }}>
            {/* Separator between drawing tools and eraser */}
            {TOOLS.map((tool, i) => (
                <>
                    {i === TOOLS.length - 1 && (
                        <div key="sep" style={{ width: '32px', height: '1px', background: '#2a2e39', margin: '4px 0' }} />
                    )}
                    <div
                        key={tool.id}
                        title={tool.label}
                        onClick={() => onToolChange?.(tool.id)}
                        style={{
                            width: '36px', height: '36px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: activeTool === tool.id ? '#d4af37' : '#868993',
                            background: activeTool === tool.id ? 'rgba(212,175,55,0.12)' : 'transparent',
                            border: activeTool === tool.id ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                            if (activeTool !== tool.id) {
                                e.currentTarget.style.background = '#2a2e39';
                                e.currentTarget.style.color = '#d1d4dc';
                            }
                        }}
                        onMouseLeave={e => {
                            if (activeTool !== tool.id) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#868993';
                            }
                        }}
                    >
                        {tool.svg}
                    </div>
                </>
            ))}
        </div>
    );
};

export default Sidebar;
