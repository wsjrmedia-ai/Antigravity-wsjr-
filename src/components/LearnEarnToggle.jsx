import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, TrendingUp } from 'lucide-react';

const TOPSTOCX_URL = 'https://topstocx.com';

const LearnEarnToggle = () => {
    // Starts as 'learn' since we are on the Academy
    const [isLearn, setIsLearn] = useState(true);

    const handleToggle = (platform) => {
        if (platform === 'earn') {
            setIsLearn(false);
            setTimeout(() => {
                window.location.href = TOPSTOCX_URL;
                // Reset after route in case of browser back button cache
                setTimeout(() => {
                    setIsLearn(true);
                }, 500);
            }, 400);
        }
    };

    // Platform colors
    const activeColor = isLearn ? '#d4af37' : '#2962ff'; // Gold for Academy, Blue for Platform
    const glowColor = isLearn ? 'rgba(212, 175, 55, 0.4)' : 'rgba(41, 98, 255, 0.4)';

    return (
        <div style={{
            position: 'relative',
            zIndex: 999,
            padding: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(16px)',
            borderRadius: '100px',
            border: `2.5px solid ${activeColor}`,
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
                    x: isLearn ? '0px' : '126px',
                    background: isLearn 
                        ? 'linear-gradient(135deg, #F7AC41 0%, #FFBD5F 50%, #BC7E26 100%)' 
                        : 'linear-gradient(135deg, #2962ff 0%, #60a5fa 50%, #2962ff 100%)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    width: '126px',
                    height: '39px',
                    borderRadius: '100px',
                    zIndex: 0,
                    boxShadow: isLearn ? '0 3px 15px rgba(212, 175, 55, 0.5)' : '0 4px 15px rgba(41, 98, 255, 0.5)'
                }}
            />

            <button
                style={{
                    flex: 1,
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: isLearn ? '#000' : '#fff',
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
                <GraduationCap size={18} />
                LEARN
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); handleToggle('earn'); }}
                style={{
                    flex: 1,
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: !isLearn ? '#000' : '#fff',
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
                <TrendingUp size={18} />
                EARN
            </button>
        </div>
    );
};

export default LearnEarnToggle;
