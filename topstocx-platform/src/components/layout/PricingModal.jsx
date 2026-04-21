import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlan, PLANS } from '../../context/PlanContext';

const CHECK = '✓';
const CROSS = '✗';

export default function PricingModal() {
    const { showPricing, setShowPricing, userPlan, setUserPlan } = usePlan();

    // Close on Escape
    useEffect(() => {
        const handler = (e) => e.key === 'Escape' && setShowPricing(false);
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [setShowPricing]);

    const handleSelect = (planId) => {
        setUserPlan(planId);
        setShowPricing(false);
    };

    return (
        <AnimatePresence>
            {showPricing && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPricing(false)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 99998,
                            background: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(6px)',
                        }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 24 }}
                        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 99999,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '1rem',
                            pointerEvents: 'none',
                        }}
                    >
                        <div style={{
                            pointerEvents: 'auto',
                            background: 'linear-gradient(160deg, #0c1420 0%, #080f18 100%)',
                            border: '1px solid #1e3050',
                            borderRadius: 24,
                            padding: '2.5rem 2rem',
                            width: '100%',
                            maxWidth: 900,
                            boxShadow: '0 0 80px #005AFF18, 0 40px 80px rgba(0,0,0,0.9)',
                            fontFamily: "'Inter', sans-serif",
                            position: 'relative',
                        }}>
                            {/* Close */}
                            <button
                                onClick={() => setShowPricing(false)}
                                style={{
                                    position: 'absolute', top: 18, right: 18,
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid #1e3050',
                                    color: '#7a9ab8', borderRadius: '50%', width: 32, height: 32,
                                    cursor: 'pointer', fontSize: 16, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,77,109,0.15)'; e.currentTarget.style.color = '#ff4d6d'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#7a9ab8'; }}
                            >✕</button>

                            {/* Header */}
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{ fontSize: 11, letterSpacing: 3, color: '#005AFF', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>
                                    Topstocx Intelligence
                                </div>
                                <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: '#e8f0fe', margin: 0, fontFamily: 'Syne, sans-serif' }}>
                                    Choose Your Plan
                                </h2>
                                <p style={{ color: '#4a7a9a', fontSize: 13, marginTop: 8 }}>
                                    Pro & Ultimate unlock <strong style={{ color: '#39B54A' }}>JP Morgan-grade institutional AI analysis</strong>
                                </p>
                            </div>

                            {/* Cards */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                                gap: '1.25rem',
                            }}>
                                {Object.values(PLANS).map((plan) => {
                                    const isActive = userPlan === plan.id;
                                    const isPro = plan.id !== 'free';
                                    return (
                                        <div
                                            key={plan.id}
                                            onClick={() => handleSelect(plan.id)}
                                            style={{
                                                background: isActive
                                                    ? `linear-gradient(145deg, ${plan.color}22, ${plan.color}08)`
                                                    : 'rgba(255,255,255,0.02)',
                                                border: `1.5px solid ${isActive ? plan.color : '#1e3050'}`,
                                                borderRadius: 18,
                                                padding: '1.75rem 1.5rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s',
                                                position: 'relative',
                                                boxShadow: isActive ? `0 0 32px ${plan.glow}` : 'none',
                                            }}
                                            onMouseEnter={e => {
                                                if (!isActive) {
                                                    e.currentTarget.style.border = `1.5px solid ${plan.color}66`;
                                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                                }
                                            }}
                                            onMouseLeave={e => {
                                                if (!isActive) {
                                                    e.currentTarget.style.border = '1.5px solid #1e3050';
                                                    e.currentTarget.style.transform = 'none';
                                                }
                                            }}
                                        >
                                            {/* Badge */}
                                            {plan.badge && (
                                                <div style={{
                                                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                                                    background: plan.id === 'ultimate'
                                                        ? 'linear-gradient(90deg, #005AFF, #39B54A)'
                                                        : 'linear-gradient(90deg, #005AFF, #77A6FF)',
                                                    color: '#fff',
                                                    fontSize: 9, fontWeight: 800, letterSpacing: 2,
                                                    padding: '3px 12px', borderRadius: 20,
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    {plan.badge}
                                                </div>
                                            )}

                                            {/* Active check */}
                                            {isActive && (
                                                <div style={{
                                                    position: 'absolute', top: 14, right: 14,
                                                    background: plan.color, borderRadius: '50%',
                                                    width: 22, height: 22, display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 12, color: '#fff', fontWeight: 800,
                                                }}>✓</div>
                                            )}

                                            {/* Plan name */}
                                            <div style={{ fontSize: 11, letterSpacing: 3, color: plan.color, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
                                                {plan.label}
                                            </div>

                                            {/* Price */}
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                                                <span style={{ fontSize: 32, fontWeight: 900, color: '#e8f0fe', fontFamily: 'Syne, sans-serif' }}>{plan.price}</span>
                                                <span style={{ fontSize: 13, color: '#4a7a9a' }}>{plan.period}</span>
                                            </div>

                                            {/* Divider */}
                                            <div style={{ height: 1, background: `linear-gradient(90deg, ${plan.color}44, transparent)`, margin: '1rem 0' }} />

                                            {/* Features */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                                {plan.features.map((f, i) => (
                                                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: '#c8daea', lineHeight: 1.4 }}>
                                                        <span style={{ color: plan.color, flexShrink: 0, marginTop: 1 }}>{CHECK}</span>
                                                        {f}
                                                    </div>
                                                ))}
                                                {plan.missing.map((f, i) => (
                                                    <div key={`x${i}`} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: '#2a4a6a', lineHeight: 1.4 }}>
                                                        <span style={{ color: '#1e3050', flexShrink: 0, marginTop: 1 }}>{CROSS}</span>
                                                        {f}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* CTA */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleSelect(plan.id); }}
                                                style={{
                                                    marginTop: '1.5rem', width: '100%',
                                                    padding: '0.7rem',
                                                    background: isActive
                                                        ? plan.color
                                                        : plan.id === 'ultimate'
                                                            ? 'linear-gradient(90deg, #005AFF, #39B54A)'
                                                            : plan.id === 'pro'
                                                                ? 'linear-gradient(90deg, #005AFF, #77A6FF)'
                                                                : 'rgba(255,255,255,0.06)',
                                                    color: '#fff',
                                                    border: isActive ? 'none' : `1px solid ${plan.color}66`,
                                                    borderRadius: 10,
                                                    fontSize: 13, fontWeight: 800, cursor: 'pointer',
                                                    fontFamily: "'Inter', sans-serif",
                                                    letterSpacing: 1,
                                                    transition: 'all 0.2s',
                                                    boxShadow: isActive ? `0 4px 20px ${plan.glow}` : 'none',
                                                }}
                                            >
                                                {isActive ? '✓ Current Plan' : plan.id === 'free' ? 'Use Free' : `Activate ${plan.label}`}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Footer note */}
                            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 11, color: '#2a4a6a' }}>
                                Pro & Ultimate plans activate institutional-grade AI immediately · Cancel anytime
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
