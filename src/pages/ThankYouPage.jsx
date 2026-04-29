import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'

const ThankYouPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const lead = location.state?.lead

  useEffect(() => {
    if (!lead) {
      navigate('/enroll', { replace: true })
      return
    }

    // Re-fire conversions here so they execute on the dedicated thank-you
    // URL — this is what most ads platforms key off when you set up
    // "destination URL contains /thank-you" conversion rules.
    if (typeof window !== 'undefined') {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          course: lead.course || '(none)',
          country: lead.country || '(unknown)',
          source: lead.utm_source || '(direct)',
          medium: lead.utm_medium || '(none)',
          campaign: lead.utm_campaign || '(none)',
        })
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: lead.course || 'enrollment',
          content_category: lead.country || 'unknown',
        })
      }
    }
  }, [lead, navigate])

  if (!lead) return null

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 5% 80px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <SEO
        title="Application Received"
        description="Your application has been received. Our admissions team will reach out shortly."
        path="/thank-you"
        noindex
      />

      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: '80vw', height: '80vh',
        background: 'radial-gradient(circle, rgba(204, 151, 43, 0.10) 0%, transparent 60%)',
        transform: 'translate(-50%, -50%)',
        filter: 'blur(80px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
        className="glass-panel"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '720px',
          width: '100%',
          padding: '60px 50px',
          borderRadius: '20px',
          textAlign: 'center'
        }}
      >
        <div style={{
          width: '90px', height: '90px',
          borderRadius: '50%',
          background: 'rgba(247, 172, 65, 0.1)',
          border: '1px solid rgba(247, 172, 65, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 30px'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-hero)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: 'var(--accent-gold)',
          margin: '0 0 18px',
          fontWeight: 500,
          letterSpacing: '-0.02em'
        }}>
          Application Received
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          color: 'rgba(255,255,255,0.85)',
          fontSize: '17px',
          lineHeight: 1.7,
          margin: '0 0 8px'
        }}>
          Thank you{lead.firstName ? `, ${lead.firstName}` : ''}. Our admissions team will review your profile and reach out within <strong>24 hours</strong> on the email and phone you provided.
        </p>

        <p style={{
          fontFamily: 'var(--font-body)',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '14px',
          margin: '0 0 36px'
        }}>
          A confirmation has been sent to <strong>{lead.email}</strong>.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://wa.me/971525121393?text=Hi%20WSJR%20Academy%2C%20I%20just%20submitted%20my%20application%20and%20wanted%20to%20chat."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '14px 28px',
              borderRadius: '100px',
              background: '#25D366',
              color: '#FFF',
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <svg viewBox="0 0 32 32" width="18" height="18" fill="#FFF" aria-hidden="true">
              <path d="M16.001 3.2C8.928 3.2 3.2 8.928 3.2 16c0 2.247.586 4.42 1.7 6.353L3.2 28.8l6.6-1.71A12.78 12.78 0 0 0 16 28.8c7.072 0 12.8-5.728 12.8-12.8S23.072 3.2 16.001 3.2z"/>
            </svg>
            Chat on WhatsApp
          </a>
          <Link
            to="/"
            style={{
              padding: '14px 28px',
              borderRadius: '100px',
              border: '1px solid rgba(247, 172, 65, 0.5)',
              color: 'var(--accent-gold)',
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            RETURN TO HOME
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default ThankYouPage
