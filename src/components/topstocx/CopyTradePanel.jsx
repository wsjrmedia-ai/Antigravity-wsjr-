import { useState, useRef } from 'react'
import { TRADERS } from '../../data/traders'
import { useCopyTrading } from '../../hooks/useCopyTrading'

function TierPill({ tier, color }) {
    return (
        <span style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: 20,
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            background: `${color}18`,
            border: `1px solid ${color}55`,
            color,
        }}>
            {tier}
        </span>
    )
}

function Stat({ label, value, color }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', gap: 2,
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 8, padding: '7px 10px',
            border: '1px solid rgba(255,255,255,0.05)',
        }}>
            <span style={{ fontSize: '0.6rem', color: '#555', letterSpacing: 1, textTransform: 'uppercase' }}>
                {label}
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: color || '#fff' }}>
                {value}
            </span>
        </div>
    )
}

function TraderCard({ trader, isFollowing, onToggle }) {
    const cardRef = useRef(null)
    const [pressed, setPressed] = useState(false)

    const handleFollow = () => {
        setPressed(true)
        onToggle(trader.id)
        setTimeout(() => setPressed(false), 350)
    }

    const handleMouseMove = (e) => {
        const card = cardRef.current
        if (!card) return
        const rect = card.getBoundingClientRect()
        const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
        const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
        card.style.transform = `perspective(800px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateY(-6px) scale(1.02)`
        card.style.boxShadow = `0 16px 48px ${trader.accentColor}22, 0 0 0 1px ${trader.accentColor}33`
    }

    const handleMouseLeave = () => {
        const card = cardRef.current
        if (!card) return
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0) scale(1)'
        card.style.boxShadow = 'none'
    }

    const positive = trader.returnThisMonth >= 0
    const returnColor = positive ? '#00f5a0' : '#ff4d6d'

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16,
                padding: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                transition: 'transform 0.15s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.15s ease',
                backdropFilter: 'blur(10px)',
                willChange: 'transform',
            }}
        >
            {/* Avatar + name + tier */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${trader.accentColor}cc, ${trader.accentColor}44)`,
                    border: `2px solid ${trader.accentColor}66`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: 800, color: '#fff',
                    boxShadow: `0 0 16px ${trader.accentColor}33`,
                }}>
                    {trader.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{trader.name}</span>
                        <span style={{ fontSize: '0.9rem' }}>{trader.badge}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#555', marginTop: 1 }}>{trader.tag}</div>
                </div>
                <TierPill tier={trader.tier} color={trader.accentColor} />
            </div>

            {/* Specialty */}
            <div style={{ fontSize: '0.7rem', color: trader.accentColor, fontWeight: 600, letterSpacing: 0.5 }}>
                {trader.specialty}
            </div>

            {/* Bio */}
            <p style={{ fontSize: '0.75rem', color: '#868993', lineHeight: 1.5, margin: 0 }}>
                {trader.bio}
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                <Stat label="This Month" value={`${positive ? '+' : ''}${trader.returnThisMonth}%`} color={returnColor} />
                <Stat label="Win Rate" value={`${trader.winRate}%`} color={trader.winRate >= 70 ? '#00f5a0' : '#f59e0b'} />
                <Stat label="Followers" value={trader.totalFollowers.toLocaleString()} color="#a0a0a0" />
            </div>

            {/* Win-rate bar */}
            <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    width: `${trader.winRate}%`,
                    background: `linear-gradient(90deg, ${trader.accentColor}, ${trader.accentColor}88)`,
                    borderRadius: 2,
                    transition: 'width 0.8s cubic-bezier(0.215,0.61,0.355,1)',
                }} />
            </div>

            {/* Follow button */}
            <button
                onClick={handleFollow}
                style={{
                    padding: '0.6rem 1rem',
                    borderRadius: 10,
                    border: isFollowing ? `1px solid ${trader.accentColor}55` : `1px solid ${trader.accentColor}88`,
                    background: isFollowing
                        ? `${trader.accentColor}18`
                        : `linear-gradient(135deg, ${trader.accentColor}cc, ${trader.accentColor}88)`,
                    color: isFollowing ? trader.accentColor : '#0a0a0a',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    letterSpacing: 0.5,
                    transition: 'all 0.25s cubic-bezier(0.175,0.885,0.32,1.275)',
                    transform: pressed ? 'scale(0.95)' : 'scale(1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                }}
                onMouseEnter={e => {
                    if (!isFollowing) {
                        e.currentTarget.style.transform = 'scale(1.04)'
                        e.currentTarget.style.boxShadow = `0 6px 20px ${trader.accentColor}44`
                    }
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                }}
            >
                {isFollowing ? <><span>✓</span> Copying</> : <><span style={{ fontSize: '0.85rem' }}>＋</span> Copy Trade</>}
            </button>
        </div>
    )
}

const CopyTradePanel = () => {
    const { isFollowing, toggle, count } = useCopyTrading()
    const [filter, setFilter] = useState('all')

    const filtered = filter === 'all'
        ? TRADERS
        : filter === 'following'
            ? TRADERS.filter(t => isFollowing(t.id))
            : TRADERS.filter(t => t.tier === filter)

    return (
        <div className="ctp-root" style={{
            flex: 1,
            overflowY: 'auto',
            background: '#0a0a0a',
            padding: '1.5rem',
        }}>
            <style>{`
                @media (max-width: 768px) { .ctp-root { padding: 1rem 0.85rem !important; } }
                @media (max-width: 480px) { .ctp-root { padding: 0.75rem !important; } }
            `}</style>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ color: '#d4af37', fontWeight: 700, fontSize: '1.3rem', margin: '0 0 0.3rem' }}>
                    Copy Trading
                </h2>
                <p style={{ color: '#868993', fontSize: '0.82rem', margin: 0 }}>
                    Follow elite traders and mirror their positions automatically
                </p>
            </div>

            {/* Copying banner */}
            {count > 0 && (
                <div style={{
                    marginBottom: '1.2rem',
                    padding: '0.6rem 1.2rem',
                    background: 'rgba(212,175,55,0.08)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    borderRadius: 10,
                    fontSize: '0.82rem',
                    color: '#d4af37',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#d4af37', display: 'inline-block', boxShadow: '0 0 6px #d4af37' }} />
                    You are copying {count} trader{count !== 1 ? 's' : ''}
                </div>
            )}

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {[
                    { key: 'all', label: 'All Traders' },
                    { key: 'elite', label: 'Elite' },
                    { key: 'pro', label: 'Pro' },
                    { key: 'following', label: `Following (${count})` },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        style={{
                            padding: '0.45rem 1.1rem',
                            borderRadius: 30,
                            border: filter === tab.key ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.08)',
                            background: filter === tab.key ? 'rgba(212,175,55,0.12)' : 'transparent',
                            color: filter === tab.key ? '#d4af37' : '#666',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            letterSpacing: 0.5,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Trader grid */}
            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#555', padding: '3rem', fontSize: '0.9rem' }}>
                    {filter === 'following' ? "You're not following any traders yet." : 'No traders found.'}
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '1rem',
                }}>
                    {filtered.map(trader => (
                        <TraderCard
                            key={trader.id}
                            trader={trader}
                            isFollowing={isFollowing(trader.id)}
                            onToggle={toggle}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default CopyTradePanel
