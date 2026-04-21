import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import GalaxyBackground from '../components/GalaxyBackground'

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LoginPage = () => {
    const formRef = useRef(null)
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        gsap.from(formRef.current, {
            y: 30,
            duration: 1,
            ease: 'power3.out',
            delay: 0.2
        })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { data, error } = await signIn(formData.email, formData.password)
            if (error) throw error
            
            navigate('/dashboard') // Or wherever you route authenticated users
        } catch (err) {
            setError(err.message || 'Failed to sign in')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: 'var(--bg-primary)',
            overflow: 'hidden'
        }}>
            {/* Background */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <GalaxyBackground />
            </div>

            {/* Back to Home */}
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
                transition: 'opacity 0.3s'
            }}>
                ← Back to Home
            </Link>

            {/* Login Card */}
            <div ref={formRef} className="login-card" style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '450px',
                margin: '0 1rem',
                padding: '3rem',
                background: 'rgba(26, 26, 26, 0.9)', // Increased opacity
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{
                        color: '#d4af37',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '2.5rem',
                        marginBottom: '0.5rem'
                    }}>Welcome Back</h1>
                    <p style={{ color: '#a0a0a0' }}>Access your personalized dashboard</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {error && (
                        <div style={{ padding: '1rem', background: 'rgba(255, 77, 109, 0.1)', border: '1px solid #ff4d6d', borderRadius: '12px', color: '#ff4d6d', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '1.2rem',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '1.2rem',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: '1.2rem',
                            background: '#d4af37',
                            color: '#000',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            marginTop: '1rem',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => gsap.to(e.target, { scale: 1.02 })}
                        onMouseLeave={(e) => gsap.to(e.target, { scale: 1 })}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', color: '#888', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/signup" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }}>Sign up here</Link>
                </div>
            </div>
            <style>{`
                @media (max-width: 600px) {
                    .login-card { padding: 2rem 1.4rem !important; border-radius: 18px !important; }
                    .login-card h1 { font-size: clamp(1.7rem, 7vw, 2.2rem) !important; }
                }
            `}</style>
        </div>
    )
}

export default LoginPage
