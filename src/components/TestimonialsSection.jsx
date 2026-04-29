import { motion } from 'framer-motion'

// Placeholder content — replace `quote`, `name`, `cohort` with real
// student feedback as it becomes available. Keep 3 cards for the
// 3-column desktop layout; the schema below stays in sync.
const TESTIMONIALS = [
  {
    quote: "The 6-month School of Finance reshaped how I think about markets. By month three I was running real research with my mentor — not theoretical case studies.",
    name: "Aarav S.",
    cohort: "School of Finance · Cochin",
    role: "Now: Junior Analyst, Mumbai"
  },
  {
    quote: "What sets WSJR apart is the network. The cohort, the mentors, and the partner firms across Dubai and Chicago opened doors I didn't know existed.",
    name: "Layla K.",
    cohort: "School of Business Intelligence · Dubai",
    role: "Now: Strategy Associate, UAE"
  },
  {
    quote: "I came in from engineering with zero finance background. The applied curriculum and live trading desk made everything click — fast.",
    name: "Vikram R.",
    cohort: "School of Finance · Bangalore",
    role: "Now: Quantitative Researcher"
  }
]

const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Wall Street Jr. Academy',
  url: 'https://wsjrschool.com/',
  review: TESTIMONIALS.map(t => ({
    '@type': 'Review',
    reviewBody: t.quote,
    author: { '@type': 'Person', name: t.name },
    itemReviewed: {
      '@type': 'EducationalOrganization',
      name: 'Wall Street Jr. Academy'
    },
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }
  }))
}

const TestimonialsSection = () => {
  return (
    <section style={{
      padding: '120px 5%',
      background: 'var(--bg-primary)',
      position: 'relative'
    }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '70px', textAlign: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--accent-gold)',
            fontWeight: 600
          }}>
            From our graduates
          </span>
          <h2 style={{
            fontFamily: 'var(--font-hero)',
            fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
            color: '#FFF',
            margin: '14px 0 0',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            lineHeight: 1.1
          }}>
            Where mastery meets momentum.
          </h2>
        </div>

        <div className="testimonials-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '28px'
        }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
              style={{
                padding: '36px 30px',
                borderRadius: '18px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <svg width="36" height="28" viewBox="0 0 36 28" fill="none" aria-hidden="true">
                <path d="M0 28V18C0 11.5 2 6.5 6 3C10 -0.5 15 -1.5 21 0L19 6C16 5 13 5.5 11 8C9 10.5 8 14 8 18H14V28H0ZM22 28V18C22 11.5 24 6.5 28 3C32 -0.5 37 -1.5 43 0L41 6C38 5 35 5.5 33 8C31 10.5 30 14 30 18H36V28H22Z" fill="rgba(247, 172, 65, 0.5)"/>
              </svg>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.85)',
                margin: 0,
                flex: 1
              }}>
                "{t.quote}"
              </p>

              <div style={{
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#FFF'
                }}>{t.name}</span>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-gold)'
                }}>{t.cohort}</span>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.55)'
                }}>{t.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .testimonials-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

export default TestimonialsSection
