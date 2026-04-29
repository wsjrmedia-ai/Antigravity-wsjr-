import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'Who is the WSJR Academy programme designed for?',
    a: "Our programmes are built for ambitious students, early-career professionals, and career-switchers who want institutional-grade expertise in finance, technology, design or management. We select on ambition, discipline, and the pursuit of mastery — not on prior credentials."
  },
  {
    q: 'How long is the programme and what is the format?',
    a: 'The flagship School of Finance is a 6-month intensive Financial Markets Education programme. We run a hybrid format — live mentor-led sessions, applied workshops, and access to our trading and analytics platforms — with periodic in-person intensives in Dubai.'
  },
  {
    q: 'What are the admission requirements?',
    a: 'No formal degree is required. We evaluate candidates on demonstrated curiosity, commitment, and capacity to handle a rigorous curriculum. Selection happens through application review and a brief admissions conversation.'
  },
  {
    q: 'What is the fee structure and are payment plans available?',
    a: 'Fees vary by school and cohort. We offer flexible payment plans and a limited number of merit-based scholarships per cohort. Apply or message us on WhatsApp for current pricing and your eligibility.'
  },
  {
    q: 'Do you provide career support or placement?',
    a: 'Yes. Graduates plug into our global network across Dubai, Chicago, and India — including referrals to partner firms (Wall Street Jr. Investments, Topstocx, and others) and ongoing mentorship after the programme ends.'
  },
  {
    q: 'Where is WSJR Academy based?',
    a: 'Global headquarters in Dubai, with presence across Chicago, Cochin, Bangalore, Mumbai, and Delhi. The Academy operates online with periodic in-person intensives at our hubs.'
  }
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a }
  }))
}

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section style={{
      padding: '120px 5%',
      background: 'var(--bg-primary)',
      position: 'relative'
    }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--accent-gold)',
            fontWeight: 600
          }}>
            Frequently Asked
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
            Questions, answered.
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((item, i) => {
            const isOpen = openIdx === i
            return (
              <div
                key={i}
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.02)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    padding: '24px 28px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#FFF',
                    fontFamily: 'var(--font-body)',
                    fontSize: '17px',
                    fontWeight: 500
                  }}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span style={{
                    flexShrink: 0,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid rgba(247, 172, 65, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)',
                    transition: 'transform 0.3s ease',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                  }}>
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        padding: '0 28px 28px',
                        color: 'rgba(255,255,255,0.75)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '15px',
                        lineHeight: 1.7
                      }}>
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
