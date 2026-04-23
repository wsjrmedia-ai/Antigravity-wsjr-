import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, TrendingUp, ArrowLeftRight } from 'lucide-react';

const ACADEMY_URL = 'https://wsjrschool.com';

const LearnEarnToggle = () => {
    const [isLearn, setIsLearn] = useState(false);

    const handleToggle = (platform) => {
        if (platform === 'learn' && !isLearn) {
            setIsLearn(true);
            setTimeout(() => {
                window.location.href = ACADEMY_URL;
            }, 400);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                margin: '-3rem auto 1.75rem auto', // pulled further up per feedback
            }}
        >
            {/* Helper hint — disambiguates that this is a switch */}
            <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.55)',
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                }}
            >
                <ArrowLeftRight size={11} style={{ opacity: 0.85 }} />
                <span>Tap to switch platform</span>
            </motion.div>

            <div
                style={{
                    position: 'relative',
                    zIndex: 999,
                    width: '260px',
                    cursor: 'pointer',
                }}
            >
                {/* The Neon Blur Glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'var(--primary-gradient)',
                        filter: 'blur(15px)',
                        opacity: 0.6,
                        borderRadius: '100px',
                        zIndex: -1,
                        boxShadow:
                            '0 0 25px 5px rgba(0, 90, 255, 0.4), 0 0 35px 10px rgba(57, 181, 74, 0.3)',
                    }}
                ></div>

                {/* Gradient Border Wrap */}
                <div
                    style={{
                        position: 'relative',
                        background: 'var(--primary-gradient)',
                        borderRadius: '100px',
                        padding: '2px',
                        width: '100%',
                        height: '52px',
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#0d1018',
                            borderRadius: '98px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px',
                        }}
                    >
                        {/* Background Slider (the thumb) */}
                        <motion.div
                            initial={false}
                            animate={{
                                x: isLearn ? 0 : 124,
                                background: 'var(--primary-gradient)',
                            }}
                            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                            style={{
                                position: 'absolute',
                                left: '4px',
                                width: '124px',
                                height: '40px',
                                borderRadius: '100px',
                                zIndex: 0,
                                boxShadow: '0 4px 15px rgba(0, 90, 255, 0.3)',
                            }}
                        />

                        {/* LEARN side */}
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggle('learn');
                            }}
                            aria-pressed={isLearn}
                            aria-label="Switch to Learn platform"
                            animate={
                                !isLearn
                                    ? {
                                          // subtle pulse on the inactive side to signal it's clickable
                                          scale: [1, 1.04, 1],
                                          opacity: [0.85, 1, 0.85],
                                      }
                                    : { scale: 1, opacity: 1 }
                            }
                            transition={{
                                duration: 2.2,
                                repeat: !isLearn ? Infinity : 0,
                                ease: 'easeInOut',
                            }}
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
                                letterSpacing: '1px',
                            }}
                        >
                            <GraduationCap size={18} />
                            LEARN
                        </motion.button>

                        {/* EARN side */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                // Already on EARN — no-op, but keep cursor:pointer so it reads as a toggle
                            }}
                            aria-pressed={!isLearn}
                            aria-label="Earn platform (current)"
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
                                letterSpacing: '1px',
                            }}
                        >
                            <TrendingUp size={18} />
                            EARN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnEarnToggle;
