import { useRef } from 'react';

const GlowCard = ({ children, style = {}, className = "", onMouseEnter, onMouseLeave }) => {
    const cardRef = useRef(null);

    const baseStyle = {
        padding: '2rem',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        ...style
    };

    const handleMouseEnter = (e) => {
        e.currentTarget.style.borderColor = 'var(--accent-gold)';
        e.currentTarget.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.15)';
        e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
        if (onMouseEnter) onMouseEnter(e);
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.borderColor = style.border || 'rgba(255,255,255,0.05)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'none';
        if (onMouseLeave) onMouseLeave(e);
    };

    return (
        <div
            className={`glow-card ${className}`}
            ref={cardRef}
            style={baseStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
};

export default GlowCard;
