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

    return (
        <div style={{
            position: 'relative',
            zIndex: 999,
            margin: '0 auto 2.5rem auto',
            width: '260px',
            cursor: 'pointer',
        }}>
            {/* The Neon Blur Glow */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'var(--primary-gradient)',
                filter: 'blur(15px)',
                opacity: 0.6,
                borderRadius: '100px',
                zIndex: -1,
                boxShadow: '0 0 25px 5px rgba(0, 90, 255, 0.4), 0 0 35px 10px rgba(57, 181, 74, 0.3)'
            }}></div>

            {/* Gradient Border Wrap */}
            <div style={{
                position: 'relative',
                background: 'var(--primary-gradient)',
                borderRadius: '100px',
                padding: '2px', // The brand gradient border thickness
                width: '100%',
                height: '52px',
            }}>
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#0d1018',
                    borderRadius: '98px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px', // Space between inner wall and slider
                }}>
                    {/* Background Slider */}
                    <motion.div
                        initial={false}
                        animate={{ 
                            x: isLearn ? 0 : 124, 
                            background: 'var(--primary-gradient)'
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{
                            position: 'absolute',
                            left: '4px',
                            width: '124px',
                            height: '40px',
                            borderRadius: '100px',
                            zIndex: 0,
                            boxShadow: '0 4px 15px rgba(0, 90, 255, 0.3)'
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
            </div>
        </div>
    );
};

export default LearnEarnToggle;
