import { useEffect, useRef } from 'react'

const tickerItems = [
    { symbol: "WSJ.ACADEMY", value: "1,245.00", change: "+2.5%", isUp: true },
    { symbol: "SOF", value: "892.40", change: "+1.2%", isUp: true },
    { symbol: "SOBI", value: "450.10", change: "+3.8%", isUp: true },
    { symbol: "SOAI", value: "1,020.50", change: "+5.4%", isUp: true },
    { symbol: "SODI", value: "310.20", change: "+0.9%", isUp: true },
    { symbol: "BTC", value: "65,000.00", change: "-0.5%", isUp: false },
    { symbol: "ETH", value: "3,500.00", change: "+1.1%", isUp: true },
    { symbol: "GOLD", value: "2,030.00", change: "+0.1%", isUp: true },
]

const StockTicker = () => {
    // Duplicate items to create seamless loop
    const displayItems = [...tickerItems, ...tickerItems, ...tickerItems]

    return (
        <div style={{
            background: 'var(--color-primary-dark)',
            color: 'white',
            padding: '0.8rem 0',
            overflow: 'hidden',
            borderBottom: '1px solid rgba(212,175,55,0.2)',
            position: 'relative',
            zIndex: 10
        }}>
            <div style={{
                display: 'flex',
                whiteSpace: 'nowrap',
                animation: 'ticker 30s linear infinite',
                width: 'max-content'
            }}>
                {displayItems.map((item, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '3rem',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 500
                    }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item.symbol}</span>
                        <span>{item.value}</span>
                        <span style={{
                            color: item.isUp ? '#4ade80' : '#f87171',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {item.isUp ? '▲' : '▼'} {item.change}
                        </span>
                    </div>
                ))}
            </div>
            <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
        </div>
    )
}

export default StockTicker
