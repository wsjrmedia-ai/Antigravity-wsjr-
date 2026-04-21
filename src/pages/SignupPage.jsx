import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import GalaxyBackground from '../components/GalaxyBackground'

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const SignupPage = () => {
    const containerRef = useRef(null)
    const headerRef = useRef(null)
    const formSectionsRef = useRef([])
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        course: '',
        dob: '',
        password: '',
        confirmPassword: ''
    })
    const [currentStep, setCurrentStep] = useState(1)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signUp } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header animation
            gsap.from(headerRef.current, {
                y: -30,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            })

            // Stagger form sections
            gsap.from(formSectionsRef.current, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.3,
                clearProps: 'all'
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match')
        }
        
        setError('')
        setLoading(true)

        try {
            const { data, error } = await signUp(formData.email, formData.password, {
                data: {
                    full_name: formData.fullName,
                    mobile: formData.mobile,
                    course: formData.course,
                    dob: formData.dob
                }
            })
            if (error) throw error

            navigate('/login') // Or show a success message to check email
        } catch (err) {
            setError(err.message || 'Failed to create an account')
        } finally {
            setLoading(false)
        }
    }

    const inputStyle = {
        width: '100%',
        padding: '1.1rem 1.3rem',
        background: 'rgba(0,0,0,0.4)',
        border: '2px solid rgba(255,255,255,0.1)',
        borderRadius: '14px',
        color: 'white',
        fontSize: '1rem',
        outline: 'none',
        transition: 'all 0.3s ease',
        fontFamily: 'Inter, sans-serif'
    }

    const labelStyle = {
        display: 'block',
        color: '#d4af37',
        fontSize: '0.85rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
        letterSpacing: '0.5px',
        textTransform: 'uppercase'
    }

    const sectionStyle = {
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
    }

    const handleFocus = (e) => {
        gsap.to(e.target, {
            borderColor: '#d4af37',
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
        })
    }

    const handleBlur = (e) => {
        gsap.to(e.target, {
            borderColor: 'rgba(255,255,255,0.1)',
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        })
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'Inter, sans-serif'
        }}>
            <GalaxyBackground />

            {/* Back to Home Link */}
            <Link to="/" style={{
                position: 'absolute',
                top: '2rem',
                left: '2rem',
                color: 'white',
                textDecoration: 'none',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: 0.8,
                transition: 'opacity 0.3s',
                fontSize: '0.95rem'
            }}>
                ← Back to Home
            </Link>

            {/* Signup Card */}
            <div ref={containerRef} className="signup-card" style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '650px',
                padding: '3rem',
                background: 'rgba(26, 26, 26, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '28px',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)'
            }}>
                {/* Header */}
                <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        color: '#d4af37',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '2.5rem',
                        marginBottom: '0.5rem',
                        fontWeight: '800',
                        letterSpacing: '-0.5px'
                    }}>Join the Elite</h1>
                    <p style={{
                        color: '#a0a0a0',
                        fontSize: '1.05rem',
                        lineHeight: '1.6'
                    }}>Begin your journey to financial mastery</p>

                    {/* Progress Indicator */}
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'center',
                        marginTop: '1.5rem'
                    }}>
                        {[1, 2, 3].map((step) => (
                            <div key={step} style={{
                                width: step <= currentStep ? '40px' : '12px',
                                height: '4px',
                                background: step <= currentStep ? '#d4af37' : 'rgba(255,255,255,0.2)',
                                borderRadius: '2px',
                                transition: 'all 0.4s ease'
                            }} />
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{ padding: '1rem', background: 'rgba(255, 77, 109, 0.1)', border: '1px solid #ff4d6d', borderRadius: '12px', color: '#ff4d6d', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            {error}
                        </div>
                    )}
                    {/* Personal Information Section */}
                    <div ref={el => formSectionsRef.current[0] = el} style={sectionStyle}>
                        <h3 style={{
                            color: '#fff',
                            fontSize: '1.1rem',
                            marginBottom: '1.5rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{ color: '#d4af37' }}>01</span> Personal Information
                        </h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Date of Birth</label>
                            <input
                                type="date"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                required
                            />
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div ref={el => formSectionsRef.current[1] = el} style={sectionStyle}>
                        <h3 style={{
                            color: '#fff',
                            fontSize: '1.1rem',
                            marginBottom: '1.5rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{ color: '#d4af37' }}>02</span> Contact Details
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={inputStyle}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Mobile Number</label>
                                <input
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    style={inputStyle}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Course & Security Section */}
                    <div ref={el => formSectionsRef.current[2] = el} style={sectionStyle}>
                        <h3 style={{
                            color: '#fff',
                            fontSize: '1.1rem',
                            marginBottom: '1.5rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{ color: '#d4af37' }}>03</span> Course & Security
                        </h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Select Your Course</label>
                            <select
                                value={formData.course}
                                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                style={{
                                    ...inputStyle,
                                    appearance: 'none',
                                    cursor: 'pointer',
                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23d4af37\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 1rem center'
                                }}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                required
                            >
                                <option value="" disabled>Choose your path...</option>
                                <option value="sof">School of Finance</option>
                                <option value="sobi">Business Intelligence</option>
                                <option value="soai">AI & Automation</option>
                                <option value="sodi">Design Intelligence</option>
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Password</label>
                                <input
                                    type="password"
                                    placeholder="Create password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={inputStyle}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    style={inputStyle}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="glaze-button"
                        style={{
                            width: '100%',
                            padding: '1.3rem',
                            color: '#000',
                            border: 'none',
                            fontWeight: '800',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            marginTop: '1rem',
                            transition: 'all 0.3s',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                        onMouseEnter={(e) => gsap.to(e.target, { scale: 1.02, duration: 0.3 })}
                        onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
                    >
                        {loading ? 'Processing...' : 'Complete Enrollment'}
                    </button>
                </form>

                <div style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    color: '#888',
                    fontSize: '0.95rem'
                }}>
                    Already have an account? <Link to="/login" style={{
                        color: '#d4af37',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        transition: 'opacity 0.3s'
                    }}>Login here</Link>
                </div>
            </div>
            <style>{`
                @media (max-width: 700px) {
                    .signup-card { padding: 2rem 1.3rem !important; border-radius: 20px !important; }
                    .signup-card h1 { font-size: clamp(1.8rem, 7vw, 2.3rem) !important; }
                    .signup-card h3 { font-size: 1rem !important; }
                    .signup-card [style*="grid-template-columns: 1fr 1fr"],
                    .signup-card [style*="grid-template-columns:1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    )
}

export default SignupPage
