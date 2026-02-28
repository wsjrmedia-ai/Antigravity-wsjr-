import React, { useState } from 'react';

const LearnEarnToggle = ({ onModeChange }) => {
    const [isEarn, setIsEarn] = useState(false);

    const handleToggle = () => {
        const newIsEarn = !isEarn;
        setIsEarn(newIsEarn);
        if (onModeChange) {
            onModeChange(newIsEarn ? 'earn' : 'learn');
        }

        if (newIsEarn) {
            setTimeout(() => {
                window.location.href = 'https://earn.wallstreetjr.com';
            }, 600);
        }
    };

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '40px',
            border: '2px solid #d4af37',
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)',
            marginBottom: '2rem',
            backdropFilter: 'blur(12px)',
            position: 'relative',
            cursor: 'pointer',
            width: '190px',
            height: '48px',
            userSelect: 'none',
            zIndex: 9999,
            // Only transition properties that GSAP isn't animating
            transition: 'background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease'
        }} onClick={handleToggle}>
            {/* Sliding Indicator */}
            <div style={{
                position: 'absolute',
                top: '4px',
                left: isEarn ? '98px' : '4px',
                width: '88px',
                height: '36px',
                background: 'linear-gradient(135deg, #d4af37 0%, #f1d592 50%, #d4af37 100%)',
                borderRadius: '35px',
                transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.5)',
                zIndex: 1
            }} />

            {/* Learn Label */}
            <div style={{
                flex: 1,
                textAlign: 'center',
                fontSize: '0.95rem',
                fontWeight: '900',
                zIndex: 2,
                color: isEarn ? '#ffffff' : '#000',
                transition: 'color 0.4s ease',
                textTransform: 'uppercase',
                letterSpacing: '1.2px'
            }}>
                Learn
            </div>

            {/* Earn Label */}
            <div style={{
                flex: 1,
                textAlign: 'center',
                fontSize: '0.95rem',
                fontWeight: '900',
                zIndex: 2,
                color: isEarn ? '#000' : '#ffffff',
                transition: 'color 0.4s ease',
                textTransform: 'uppercase',
                letterSpacing: '1.2px'
            }}>
                Earn
            </div>
        </div>
    );
};

export default LearnEarnToggle;
