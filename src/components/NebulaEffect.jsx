import React from 'react';

const NebulaEffect = ({ side = 'left', color1 = 'rgba(138, 43, 226, 0.2)', color2 = 'rgba(0, 191, 255, 0.15)', color3 = 'rgba(212, 175, 55, 0.1)' }) => {
    const isLeft = side === 'left';

    return (
        <div style={{
            position: 'absolute',
            top: '0',
            [isLeft ? 'left' : 'right']: '-20%',
            width: '60%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
            overflow: 'hidden',
            opacity: 0.8
        }}>
            {/* Core Nebula Cloud */}
            <div style={{
                position: 'absolute',
                top: '10%',
                [isLeft ? 'left' : 'right']: '0',
                width: '100%',
                height: '80%',
                background: `radial-gradient(circle at ${isLeft ? '20%' : '80%'} 50%, ${color1} 0%, transparent 70%)`,
                filter: 'blur(80px)',
                mixBlendMode: 'screen'
            }} />

            {/* Secondary Cloud */}
            <div style={{
                position: 'absolute',
                top: '30%',
                [isLeft ? 'left' : 'right']: '10%',
                width: '90%',
                height: '60%',
                background: `radial-gradient(circle at ${isLeft ? '30%' : '70%'} 40%, ${color2} 0%, transparent 60%)`,
                filter: 'blur(60px)',
                mixBlendMode: 'screen'
            }} />

            {/* Highlight/Gold accents */}
            <div style={{
                position: 'absolute',
                top: '20%',
                [isLeft ? 'left' : 'right']: '15%',
                width: '70%',
                height: '50%',
                background: `radial-gradient(circle at ${isLeft ? '40%' : '60%'} 60%, ${color3} 0%, transparent 50%)`,
                filter: 'blur(40px)',
                mixBlendMode: 'screen'
            }} />

            {/* Micro stars/shimmer */}
            <div className="nebula-stars" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '100px 100px',
                opacity: 0.1
            }} />

            <style>{`
                .nebula-stars {
                    animation: shimmer 10s infinite linear alternate;
                }
                @keyframes shimmer {
                    from { transform: translateY(0) scale(1); opacity: 0.1; }
                    to { transform: translateY(-20px) scale(1.1); opacity: 0.2; }
                }
            `}</style>
        </div>
    );
};

export default NebulaEffect;
