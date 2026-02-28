import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

const CoursePage = () => {
    const { id } = useParams()

    const handleEnroll = () => {
        // Simulate Stripe Trigger
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })
        alert("This would open Stripe Checkout!")
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '4rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                    Course Module: {id}
                </h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '2rem' }}>
                    Master the content in this comprehensive module designed for future financial leaders.
                </p>

                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginBottom: '1rem' }}>Curriculum Highlights</h2>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginBottom: '2rem', lineHeight: '1.8' }}>
                        <li>Advanced Market Analysis</li>
                        <li>AI in Finance</li>
                        <li>Risk Management Strategies</li>
                        <li>Global Economics</li>
                    </ul>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.9rem', color: '#666' }}>Tuition</span>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>$2,499</span>
                        </div>
                        <button
                            onClick={handleEnroll}
                            style={{
                                padding: '1rem 3rem',
                                backgroundColor: 'var(--color-accent-gold)',
                                color: 'black',
                                fontWeight: 'bold',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                transition: 'transform 0.1s'
                            }}
                            onMouseDown={e => e.target.style.transform = 'scale(0.95)'}
                            onMouseUp={e => e.target.style.transform = 'scale(1)'}
                        >
                            Enroll Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoursePage
