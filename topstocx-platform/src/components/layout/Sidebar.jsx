import React from 'react';
import {
    MousePointer2,
    TrendingUp,
    Type,
    Square,
    Ruler,
    Search,
    Hexagon,
    Settings2
} from 'lucide-react';

const Sidebar = () => {
    const tools = [
        { icon: <MousePointer2 size={20} />, label: 'Cursor', active: true },
        { icon: <TrendingUp size={20} />, label: 'Trend Line' },
        { icon: <Hexagon size={20} />, label: 'Fibonacci' },
        { icon: <Square size={20} />, label: 'Shapes' },
        { icon: <Type size={20} />, label: 'Text' },
        { icon: <Ruler size={20} />, label: 'Measure' },
        { icon: <Search size={20} />, label: 'Zoom' },
    ];

    return (
        <div style={{
            width: '56px',
            backgroundColor: 'var(--bg-secondary)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '12px 0',
            gap: '8px',
            zIndex: 5
        }}>
            {tools.map((tool, index) => (
                <div key={index}
                    title={tool.label}
                    style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: tool.active ? 'var(--brand-blue)' : 'var(--text-muted)',
                        backgroundColor: tool.active ? 'rgba(0, 90, 255, 0.1)' : 'transparent',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                        if (!tool.active) {
                            e.currentTarget.style.backgroundColor = 'var(--bg-accent)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!tool.active) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--text-muted)';
                        }
                    }}
                >
                    {tool.icon}
                </div>
            ))}
            <div style={{ flex: 1 }} />
            <div style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
            }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <Settings2 size={20} />
            </div>
        </div>
    );
};

export default Sidebar;
