import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Upload, Briefcase, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [kycFileName, setKycFileName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock authentication process
        setTimeout(() => {
            navigate('/chart');
        }, 800);
    };

    const toggleMode = () => setIsLogin(!isLogin);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: 'linear-gradient(135deg, #050b14 0%, #0a1526 100%)',
            fontFamily: "'Inter', sans-serif",
            color: '#e8f0fe',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Effects */}
            <div style={{
                position: 'absolute', top: -200, right: -200, width: 800, height: 800,
                background: 'radial-gradient(circle, rgba(0, 90, 255,0.08) 0%, rgba(0,0,0,0) 70%)',
                borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', bottom: -200, left: -200, width: 600, height: 600,
                background: 'radial-gradient(circle, rgba(0,210,255,0.05) 0%, rgba(0,0,0,0) 70%)',
                borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none'
            }} />

            {/* Back Button */}
            <Link to="/" style={{
                position: 'absolute', top: 32, left: 40,
                display: 'flex', alignItems: 'center', gap: 8,
                color: '#868993', textDecoration: 'none',
                fontSize: 14, fontWeight: 600, transition: 'color 0.2s',
                zIndex: 10
            }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#868993'}>
                <ChevronLeft size={16} /> Back to Home
            </Link>

            {/* Left/Top Info Side (hidden on small screens) */}
            <div className="auth-hero" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '4rem',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(5, 11, 20, 0.4)',
                backdropFilter: 'blur(20px)',
                zIndex: 1
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: 'linear-gradient(135deg, #005AFF, #00d2ff)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(0, 90, 255,0.4)'
                    }}>
                        <Briefcase size={24} color="#fff" />
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Syne', sans-serif", letterSpacing: 1 }}>
                        TOP<span style={{ color: '#005AFF' }}>STOCX</span>
                    </div>
                </div>

                <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', fontFamily: "'Syne', sans-serif" }}>
                    Trade with <br />
                    <span style={{ color: '#00d2ff' }}>Institutional Edge</span>
                </h1>
                <p style={{ color: '#868993', fontSize: 18, lineHeight: 1.6, maxWidth: 480, marginBottom: '3rem' }}>
                    Join the premier platform for professional traders. Access advanced charting, AI-driven insights, and institutional-grade analytics.
                </p>

                <div style={{ display: 'flex', gap: 24 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 24, fontWeight: 800, color: '#e8f0fe' }}>$50B+</span>
                        <span style={{ color: '#4a7a9a', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Volume Tracked</span>
                    </div>
                    <div style={{ width: 1, background: '#1e3050' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 24, fontWeight: 800, color: '#e8f0fe' }}>0ms</span>
                        <span style={{ color: '#4a7a9a', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Latency AI</span>
                    </div>
                </div>
            </div>

            {/* Right/Bottom Form Side */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                zIndex: 1
            }}>
                <motion.div
                    layout
                    className="auth-form-card"
                    style={{
                        width: '100%',
                        maxWidth: 440,
                        background: 'rgba(12, 20, 32, 0.6)',
                        border: '1px solid #1e3050',
                        borderRadius: 24,
                        padding: '3rem 2.5rem',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                        position: 'relative'
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? "login" : "register"}
                            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, fontFamily: "'Syne', sans-serif" }}>
                                {isLogin ? 'Welcome back' : 'Create account'}
                            </h2>
                            <p style={{ color: '#868993', fontSize: 14, marginBottom: '2.5rem' }}>
                                {isLogin
                                    ? 'Enter your details to access your dashboard.'
                                    : 'Complete all details including KYC to get verified.'}
                            </p>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {/* Basic Fields */}
                                {/* Registration Name & Mobile */}
                                {!isLogin && (
                                    <div className="auth-row-stack" style={{ display: 'flex', gap: '1.25rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                                            <label style={{ fontSize: 12, fontWeight: 600, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: 1 }}>Full Name</label>
                                            <input type="text" required placeholder="John Doe" className="auth-input" style={inputStyle} />
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                                            <label style={{ fontSize: 12, fontWeight: 600, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: 1 }}>Mobile Number</label>
                                            <input type="tel" required placeholder="+1 234 567 8900" className="auth-input" style={inputStyle} />
                                        </div>
                                    </div>
                                )}

                                {/* Email & Password (Login & Signup) */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: 1 }}>Email Address</label>
                                    <input type="email" required placeholder="name@company.com" className="auth-input" style={inputStyle} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: 1 }}>Password</label>
                                    <input type="password" required placeholder="••••••••" className="auth-input" style={inputStyle} />
                                </div>

                                {/* Registration Remaining Fields */}
                                {!isLogin && (
                                    <>
                                        <div className="auth-row-stack" style={{ display: 'flex', gap: '1.25rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                                                <label style={{ fontSize: 12, fontWeight: 600, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: 1 }}>Gender</label>
                                                <select required className="auth-select" style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                                                    <option value="" disabled selected>Select</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                                                <label style={{ fontSize: 12, fontWeight: 600, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: 1 }}>Date of Birth</label>
                                                <input type="date" required className="auth-input date-input" style={{ ...inputStyle, cursor: 'text' }} />
                                            </div>
                                        </div>

                                        {/* KYC Upload Box */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                                            <label style={{ fontSize: 12, fontWeight: 600, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: 1 }}>
                                                KYC Document Verification
                                            </label>
                                            <label style={{
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                gap: 12, padding: '2rem 1rem',
                                                background: 'rgba(255,255,255,0.02)',
                                                border: '1.5px dashed #2a3f5f',
                                                borderRadius: 12,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                                onMouseEnter={(e) => { e.currentTarget.style.border = '1.5px dashed #005AFF'; e.currentTarget.style.background = 'rgba(0, 90, 255,0.05)' }}
                                                onMouseLeave={(e) => { e.currentTarget.style.border = '1.5px dashed #2a3f5f'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                                            >
                                                <input
                                                    type="file"
                                                    required
                                                    style={{ display: 'none' }}
                                                    accept="image/*,application/pdf"
                                                    onChange={(e) => setKycFileName(e.target.files[0]?.name || '')}
                                                />
                                                <div style={{
                                                    width: 40, height: 40, borderRadius: '50%', background: '#1e3050',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#868993'
                                                }}>
                                                    <Upload size={20} />
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ color: '#e8f0fe', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                                                        {kycFileName ? kycFileName : 'Upload ID or Passport'}
                                                    </div>
                                                    <div style={{ color: '#868993', fontSize: 12 }}>
                                                        PNG, JPG, or PDF (Max 5MB)
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </>
                                )}

                                {/* Forgot Password for Login */}
                                {isLogin && (
                                    <div style={{ textAlign: 'right' }}>
                                        <a href="#" style={{ color: '#005AFF', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
                                            Forgot password?
                                        </a>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button type="submit" style={{
                                    marginTop: 12,
                                    width: '100%',
                                    padding: '14px',
                                    background: 'linear-gradient(90deg, #005AFF, #00d2ff)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 8,
                                    fontSize: 15,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    fontFamily: "'Inter', sans-serif",
                                    boxShadow: '0 8px 24px rgba(0, 90, 255,0.3)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 90, 255,0.4)' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 90, 255,0.3)' }}
                                >
                                    {isLogin ? 'Sign In Securely' : 'Complete Verification'}
                                    <ArrowRight size={18} />
                                </button>
                            </form>

                            {/* Toggle Mode */}
                            <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: 14, color: '#868993' }}>
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <span
                                    onClick={toggleMode}
                                    style={{ color: '#00d2ff', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
                                >
                                    {isLogin ? 'Create one now' : 'Sign in instead'}
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>

            <style>{`
                .auth-input, .auth-select {
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .auth-input:focus, .auth-select:focus {
                    outline: none;
                    border-color: #005AFF !important;
                    box-shadow: 0 0 0 3px rgba(0, 90, 255,0.15) !important;
                }
                .auth-input::placeholder {
                    color: #4a5a7a;
                }
                
                /* Make date input look clean on dark mode */
                .date-input::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    opacity: 0.5;
                    cursor: pointer;
                }
                .date-input::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                }
                
                /* Hide sidebar on small screens */
                @media (max-width: 900px) {
                    .auth-hero { display: none !important; }
                }
                @media (max-width: 480px) {
                    .auth-form-card { max-width: 100% !important; padding: 2rem 1.5rem !important; border-radius: 16px !important; }
                    .auth-input, .auth-select { padding: 14px 16px !important; font-size: 16px !important; }
                    .auth-row-stack { flex-direction: column !important; }
                }
            `}</style>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid #2a3f5f',
    borderRadius: 8,
    padding: '12px 16px',
    color: '#e8f0fe',
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    colorScheme: 'dark' // Forces native dropdowns & date pickers into dark mode
};
