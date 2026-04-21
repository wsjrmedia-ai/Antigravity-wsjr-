import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const FEATURES = [
    {
        icon: '⚡',
        title: 'Advanced Supercharts',
        desc: 'Institutional-grade charting with 100+ indicators and advanced drawing tools for deep technical analysis.',
        color: '#005AFF',
        accentColor: 'rgba(0, 90, 255, 0.12)',
        tag: 'PRO',
    },
    {
        icon: '📰',
        title: 'Real-time Financial Data',
        desc: 'Direct market data feeds from global exchanges with millisecond precision and comprehensive history.',
        color: '#089981',
        accentColor: 'rgba(8, 153, 129, 0.12)',
        tag: 'LIVE',
    },
    {
        icon: '🎓',
        title: 'Education',
        desc: 'Comprehensive trading masterclasses, tutorials, and strategy guides to elevate your skills from beginner to expert.',
        color: '#39B54A',
        accentColor: 'rgba(57, 181, 74, 0.12)',
        tag: 'NEW',
    },
    {
        icon: '🔍',
        title: 'Multi-Asset Screeners',
        desc: 'Powerful filters to identify the best setups across Stocks, Crypto, Forex, and Indices instantly.',
        color: '#f23645',
        accentColor: 'rgba(242, 54, 69, 0.12)',
        tag: 'SMART',
    },
    {
        icon: '👥',
        title: 'Copy Trading',
        desc: 'Automatically mirror the portfolios and live trade execution of the world\'s most profitable verified analysts.',
        color: '#005AFF',
        accentColor: 'rgba(0, 90, 255, 0.12)',
        tag: 'SOCIAL',
    },
    {
        icon: '🌍',
        title: 'Economic Heat Map',
        desc: 'Visualize global market movements, sector performances, and emerging economic trends dynamically at a glance.',
        color: '#089981',
        accentColor: 'rgba(8, 153, 129, 0.12)',
        tag: 'GLOBAL',
    },
];

const FeatureCard3D = ({ feature, index }) => {
    const cardRef = React.useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { damping: 25, stiffness: 180 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { damping: 25, stiffness: 180 });
    const gloss = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), { damping: 30 });
    const [hovered, setHovered] = useState(false);

    const handleMouseMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        setHovered(false);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setHovered(true)}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                perspective: '800px',
                position: 'relative'
            }}
        >
            {/* The intense neon glow behind the card */}
            <motion.div
                animate={{ opacity: hovered ? 0.7 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'var(--primary-gradient)',
                    filter: 'blur(22px)',
                    zIndex: -1,
                    borderRadius: '20px'
                }}
            />

            {/* Gradient solid border wrapper */}
            <motion.div
                animate={{
                    background: hovered ? 'var(--primary-gradient)' : '#2a2e39',
                    boxShadow: hovered
                        ? `0 30px 80px rgba(0,0,0,0.5), 0 0 40px 10px rgba(0, 90, 255, 0.2)`
                        : `0 10px 30px rgba(0,0,0,0.2)`
                }}
                transition={{ duration: 0.3 }}
                style={{
                    padding: '2px', // 2px gradient border
                    borderRadius: '22px',
                    transformStyle: 'preserve-3d',
                    height: '100%',
                }}
            >
                {/* Actual card inner body */}
                <div
                    style={{
                        position: 'relative',
                        backgroundColor: '#0d1018',
                        padding: '2.5rem',
                        borderRadius: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.2rem',
                        cursor: 'default',
                        overflow: 'hidden',
                        transformStyle: 'preserve-3d',
                        height: '100%',
                    }}
                >
                    {/* Sheen sweep effect using brand blue/green */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: `radial-gradient(circle at ${useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])}% ${useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])}%, rgba(0, 90, 255, 0.1), transparent 60%)`,
                            pointerEvents: 'none',
                            borderRadius: 'inherit',
                        }}
                    />

                    {/* Top accent bar matching gradient */}
                    <motion.div
                        animate={{ opacity: hovered ? 1 : 0, scaleX: hovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'absolute',
                            top: 0, left: '15%', right: '15%', height: '3px',
                            background: 'var(--primary-gradient)',
                            borderRadius: '4px',
                            transformOrigin: 'center',
                        }}
                    />

                    {/* Background pattern dots */}
                    <div style={{
                        position: 'absolute',
                        top: 0, right: 0, left: 0, height: '50%',
                        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                        backgroundSize: '18px 18px',
                        opacity: 0.4,
                        borderRadius: 'inherit',
                        pointerEvents: 'none',
                    }} />

                    {/* Icon with 3D lift */}
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '16px',
                        background: hovered ? 'var(--primary-gradient)' : feature.accentColor,
                        border: hovered ? 'none' : `1px solid ${feature.color}40`,
                        color: hovered ? '#fff' : 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem',
                        position: 'relative',
                        zIndex: 2,
                        transform: 'translateZ(20px)',
                        transition: 'all 0.3s'
                    }}>
                        {feature.icon}
                    </div>

                    {/* Tag badge */}
                    <div style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        background: hovered ? 'var(--primary-gradient)' : feature.accentColor,
                        border: hovered ? 'none' : `1px solid ${feature.color}40`,
                        color: hovered ? '#fff' : feature.color,
                        fontSize: '10px',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        zIndex: 2,
                        transition: 'all 0.3s'
                    }}>
                        {feature.tag}
                    </div>

                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h3 style={{
                            fontSize: '1.35rem',
                            fontWeight: 800,
                            letterSpacing: '-0.4px',
                            marginBottom: '0.7rem',
                            color: '#fff',
                        }}>
                            {feature.title}
                        </h3>
                        <p style={{
                            color: '#868993',
                            lineHeight: 1.7,
                            fontSize: '0.97rem',
                            fontWeight: 400,
                        }}>
                            {feature.desc}
                        </p>
                    </div>

                    {/* Arrow indicator */}
                    <motion.div
                        animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            fontSize: '14px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            position: 'relative',
                            zIndex: 2,
                        }}
                    >
                        <span style={{ 
                            background: 'var(--primary-gradient)', 
                            WebkitBackgroundClip: 'text', 
                            WebkitTextFillColor: 'transparent' 
                        }}>
                            Explore feature
                        </span> 
                        <span style={{ color: '#39B54A' }}>→</span>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const FeatureCards3D = () => {
    return (
        <div className="feature-cards-grid" style={{
            gap: '2rem',
            perspective: '1200px',
        }}>
            {FEATURES.map((feature, index) => (
                <FeatureCard3D key={index} feature={feature} index={index} />
            ))}
        </div>
    );
};

export default FeatureCards3D;
