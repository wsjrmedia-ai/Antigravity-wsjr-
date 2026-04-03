import React from 'react';

const Sidebar = () => {
    const tools = [
        { icon: '↗', label: 'Cursor' },
        { icon: '／', label: 'Trend Line' },
        { icon: '◬', label: 'Fibonacci' },
        { icon: 'T', label: 'Text' },
        { icon: '▭', label: 'Shapes' },
        { icon: '📏', label: 'Measure' },
        { icon: '🔍', label: 'Zoom' },
    ];

    return (
        <div style={{
            width: '52px',
            background: '#131722',
            borderRight: '1px solid #2a2e39',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '8px',
            gap: '12px'
        }}>
            {tools.map((tool, index) => (
                <div key={index}
                    title={tool.label}
                    style={{
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#d1d4dc',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontSize: '18px',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#2a2e39'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                    {tool.icon}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
