import { useState, useEffect } from 'react'
import GlowCard from './GlowCard'

// Mock Data representing API response
const mockLeaderboard = [
    { rank: 1, name: "AR", course: "School of Finance", progress: 98, badge: "🏆" },
    { rank: 2, name: "JK", course: "AI & Automation", progress: 95, badge: "⚡" },
    { rank: 3, name: "MS", course: "Business Intel", progress: 92, badge: "⭐" },
    { rank: 4, name: "DL", course: "Design Intel", progress: 89, badge: "🎨" },
    { rank: 5, name: "PR", course: "School of Finance", progress: 88, badge: "📈" },
]

const Leaderboard = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            setData(mockLeaderboard)
        }, 1000)
    }, [])

    return (
        <GlowCard style={{
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '2rem',
        }}>
            <h3 style={{
                textAlign: 'center',
                marginBottom: '2rem',
                color: '#d4af37',
                textTransform: 'uppercase',
                letterSpacing: '2px'
            }}>Top Performers</h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr',
                padding: '1rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                color: '#666666',
                fontSize: '0.9rem'
            }}>
                <span>RANK</span>
                <span>STUDENT</span>
                <span>COURSE</span>
                <span>%</span>
                <span>BADGE</span>
            </div>

            {data.map((item, index) => (
                <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr',
                    padding: '1.5rem 1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    alignItems: 'center',
                    transition: 'background 0.2s',
                    cursor: 'default',
                    color: '#ffffff'
                }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <span style={{ fontWeight: 'bold', color: item.rank === 1 ? '#d4af37' : '#ffffff' }}>#{item.rank}</span>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{item.course}</span>
                    <div style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.1)',
                        height: '6px',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        maxWidth: '50px'
                    }}>
                        <div style={{ width: `${item.progress}%`, height: '100%', background: '#002366' }}></div>
                    </div>
                    <span>{item.badge}</span>
                </div>
            ))}
        </GlowCard>
    )
}

export default Leaderboard
