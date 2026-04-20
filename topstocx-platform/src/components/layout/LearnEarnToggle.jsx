import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, TrendingUp } from 'lucide-react';

const ACADEMY_URL = 'https://wsjrschool.com';

const LearnEarnToggle = () => {
    const [isLearn, setIsLearn] = useState(false);

    const handleToggle = (platform) => {
        if (platform === 'learn') {
            setIsLearn(true);
            setTimeout(() => {
                window.open(ACADEMY_URL, '_blank', 'noopener,noreferrer');
                setIsLearn(false);
            }, 400);
        }
    };

    // Platform colors
    const activeColor = isLearn ? '#39B54A' : '#005AFF'; // Green for Academy, Blue for Platform
    const glowColor = isLearn ? 'rgba(57, 181, 74, 0.4)' : 'rgba(0, 90, 255, 0.4)';

    return (
        <div style={{
            position: 'relative',
            zIndex: 999,
            padding: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(16px)',
            borderRadius: '100px',
            border: `2px solid ${activeColor}`,
            boxShadow: `0 0 35px ${glowColor}`,
            display: 'flex',
            alignItems: 'center',
            width: '260px',
            height: '52px',
            transition: 'all 0.4s',
            margin: '0 auto 2.5rem auto',
            cursor: 'pointer'
        }}>
            {/* Background Slider */}
            <motion.div
                initial={false}
                animate={{ 
                    x: isLearn ? '0px' : '124px',
                    background: isLearn 
                        ? 'var(--brand-gradient-green)' 
                        : 'var(--brand-gradient-blue)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    width: '124px',
                    height: '40px',
                    borderRadius: '100px',
                    zIndex: 0,
                    boxShadow: isLearn ? '0 3px 15px rgba(57, 181, 74, 0.5)' : '0 4px 15px rgba(0, 90, 255, 0.5)'
                }}
            />

            <button
                onClick={(e) => { e.stopPropagation(); handleToggle('learn'); }}
                style={{
                    flex: 1,
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: isLearn ? '#000' : '#fff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'color 0.3s',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}
            >
                <GraduationCap size={18} />
                LEARN
            </button>

            <button
                style={{
                    flex: 1,
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: !isLearn ? '#000' : '#fff',
                    cursor: 'default',
                    fontSize: '14px',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'color 0.3s',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}
            >
                <TrendingUp size={18} />
                EARN
            </button>
        </div>
    );
};

export default LearnEarnToggle;
