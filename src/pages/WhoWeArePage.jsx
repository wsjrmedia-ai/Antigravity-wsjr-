import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * WhoWeArePage
 *
 * Restructured to match the Wall Street Jr. Academy design system used on
 * the landing page and the school program pages: Libre Baskerville hero type,
 * gold accent eyebrows, numbered sections, dark maroon surfaces, glass cards,
 * and framer-motion reveal. Fully responsive at 480 / 768 / 992px.
 */
const WhoWeArePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Who We Are | Wall Street Jr. Academy';
    const meta = document.querySelector('meta[name="description"]');
    const content =
      'Wall Street Jr. Academy is a UAE-headquartered global institution preparing finance, technology, design, and management professionals for real-world leadership.';
    if (meta) meta.setAttribute('content', content);
    else {
      const m = document.createElement('meta');
      m.name = 'description';
      m.content = content;
      document.head.appendChild(m);
    }
  }, []);

  const gold = 'var(--accent-gold)';

  return (
    <div
      className="wwa-root"
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: '#FFF',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Ambient gold glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          width: '90vw',
          height: '80vh',
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(ellipse at center, rgba(247,172,65,0.12) 0%, rgba(247,172,65,0.04) 35%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* HERO */}
      <section
        className="wwa-hero"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '160px 5% 80px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '100px',
                border: `1px solid ${gold}`,
                color: gold,
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                letterSpacing: '2px',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Who We Are
            </span>
            <span
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: '12px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Wall Street Jr. Academy
            </span>
          </div>

          <h1
            className="wwa-title"
            style={{
              fontFamily: 'var(--font-hero)',
              fontSize: 'clamp(2.4rem, 5.5vw, 5.2rem)',
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              margin: 0,
              color: '#FFF',
            }}
          >
            A Different Kind of Institution
          </h1>

          <h2
            className="wwa-tagline"
            style={{
              fontFamily: 'var(--font-hero)',
              fontSize: 'clamp(1.2rem, 2.1vw, 1.8rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.3,
              margin: 0,
              color: gold,
              opacity: 0.95,
              maxWidth: '900px',
            }}
          >
            Built in UAE. Grounded in institutional discipline. Designed for the world.
          </h2>

          <div
            className="wwa-intro"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxWidth: '900px',
              fontSize: 'clamp(1rem, 1.15vw, 1.15rem)',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            <p style={{ margin: 0 }}>
              There are thousands of finance courses available today. Most of them teach you{' '}
              <em>what</em> to do. Very few teach you <em>how to think</em>.
            </p>
            <p style={{ margin: 0 }}>
              Wall Street Jr. Academy was founded on the conviction that real financial
              education — the kind that produces professionals capable of leading institutions,
              managing capital, and making sound decisions under pressure — requires more than
              content delivery. It requires a disciplined framework, experienced mentorship, and
              an environment serious enough to match the ambitions of the people inside it.
            </p>
          </div>

          <div
            style={{
              marginTop: '6px',
              padding: '22px 26px',
              borderLeft: `2px solid ${gold}`,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '0 14px 14px 0',
              maxWidth: '900px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: gold,
                marginBottom: '8px',
              }}
            >
              Our Thesis
            </div>
            <div
              style={{
                fontFamily: 'var(--font-hero)',
                fontSize: 'clamp(1.05rem, 1.4vw, 1.3rem)',
                color: '#FFF',
                lineHeight: 1.5,
              }}
            >
              That is what we have built here. And we are just getting started.
            </div>
          </div>

          <div
            className="wwa-cta-row"
            style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '10px' }}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/enroll')}
              style={{
                padding: '14px 32px',
                borderRadius: '100px',
                background: gold,
                color: '#2B1500',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '1.2px',
                cursor: 'pointer',
                boxShadow: '0 10px 24px -10px rgba(247,172,65,0.5)',
              }}
            >
              APPLY TO THE ACADEMY
            </motion.button>
            <Link
              to="/school-of-finance"
              style={{
                padding: '14px 32px',
                borderRadius: '100px',
                background: 'transparent',
                color: '#FFF',
                border: '1px solid rgba(255,255,255,0.25)',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '14px',
                letterSpacing: '1.2px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              EXPLORE PROGRAMS →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 01 · ORIGIN */}
      <section
        className="wwa-section"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '40px 5% 80px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <SectionHeader
          eyebrow="01 · Origin"
          title="How the Academy Came to Be"
          sub="A straightforward observation about the gap between financial education and industry reality."
          gold={gold}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="wwa-origin-grid"
          style={{
            marginTop: '44px',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '28px',
            alignItems: 'start',
          }}
        >
          <div
            className="wwa-origin-prose"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              fontSize: 'clamp(1rem, 1.1vw, 1.1rem)',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.82)',
            }}
          >
            <p style={{ margin: 0 }}>
              Wall Street Jr. Academy began with a straightforward observation: the gap between
              what financial education typically offers and what the industry actually demands is
              enormous — and it is growing.
            </p>
            <p style={{ margin: 0 }}>
              Most programs are built around academic accreditation, not real-world performance.
              They optimise for passing exams, not for developing the judgment to navigate a
              complex market, lead a team through a difficult period, or make a capital
              allocation decision with imperfect information.
            </p>
            <p style={{ margin: 0 }}>
              The Academy was founded to close that gap. Drawing on direct experience at some of
              the world's leading financial institutions, our founders designed a curriculum and
              delivery model that treats students as future professionals from day one — not as
              students to be tested, but as thinkers to be developed.
            </p>
          </div>

          <div
            className="wwa-origin-callout"
            style={{
              padding: '32px 28px',
              borderRadius: '20px',
              background:
                'linear-gradient(160deg, rgba(247,172,65,0.10) 0%, rgba(247,172,65,0.02) 60%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(247,172,65,0.22)',
              position: 'sticky',
              top: '100px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: gold,
                marginBottom: '12px',
              }}
            >
              Headquartered in the UAE
            </div>
            <p
              style={{
                fontFamily: 'var(--font-hero)',
                fontSize: 'clamp(1.05rem, 1.4vw, 1.3rem)',
                color: '#FFF',
                lineHeight: 1.55,
                margin: 0,
                fontWeight: 500,
              }}
            >
              We opened our global HQ in the UAE because it represents what we believe finance
              education should be: internationally oriented, commercially serious, and built for
              the future rather than the past.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 02 · LEADERSHIP */}
      <section
        className="wwa-section"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '40px 5% 80px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <SectionHeader
          eyebrow="02 · Leadership"
          title="Led by People Who Have Done the Work"
          sub="Practitioners first. Academics second."
          gold={gold}
        />

        <div
          className="wwa-leadership-grid"
          style={{
            marginTop: '44px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '22px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{
              padding: '40px 36px',
              borderRadius: '20px',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: gold,
                marginBottom: '10px',
              }}
            >
              Founder
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-hero)',
                fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)',
                color: '#FFF',
                fontWeight: 500,
                margin: '0 0 8px',
                letterSpacing: '-0.01em',
              }}
            >
              Vishnu Das
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-hero)',
                fontSize: '1rem',
                fontStyle: 'italic',
                color: gold,
                margin: '0 0 18px',
                opacity: 0.95,
              }}
            >
              Harvard-educated capital architect. Institutional experience at JP Morgan and Bank
              of America.
            </p>
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.78)',
                margin: '0 0 14px',
              }}
            >
              Vishnu's approach to education is the same as his approach to capital: long-term,
              disciplined, and grounded in first principles. He founded the Academy not to build
              another course platform, but to create a genuine institution — one with the
              academic seriousness of a great university and the practical relevance of a
              top-tier financial firm.
            </p>
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.78)',
                margin: 0,
              }}
            >
              Under his leadership, Wall Street Jr. has grown from a single program into a
              multi-school academy operating across six locations globally.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              padding: '40px 36px',
              borderRadius: '20px',
              background:
                'linear-gradient(160deg, rgba(247,172,65,0.12) 0%, rgba(247,172,65,0.03) 55%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(247,172,65,0.22)',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: gold,
                marginBottom: '10px',
              }}
            >
              Faculty Philosophy
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-hero)',
                fontSize: 'clamp(1.4rem, 2vw, 1.9rem)',
                color: '#FFF',
                fontWeight: 500,
                margin: '0 0 18px',
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
              }}
            >
              Our mentors bring direct, real-world experience into every classroom.
            </h3>
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.82)',
                margin: '0 0 14px',
              }}
            >
              We do not hire academics who have never practised finance. Our faculty and mentors
              are practitioners first — professionals who have operated within the institutions
              and markets our students are preparing to enter.
            </p>
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.82)',
                margin: 0,
              }}
            >
              The examples are real, the case studies are drawn from actual decisions, and the
              guidance is grounded in what actually matters in a professional setting.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 03 · MISSION & VALUES */}
      <section
        className="wwa-section"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '40px 5% 80px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <SectionHeader
          eyebrow="03 · Principles"
          title="What We Stand For"
          sub="A mission and a set of values we refuse to compromise on."
          gold={gold}
        />

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="wwa-mission-card"
          style={{
            marginTop: '44px',
            padding: '52px 48px',
            borderRadius: '22px',
            border: '1px solid rgba(247,172,65,0.25)',
            background:
              'linear-gradient(135deg, rgba(247,172,65,0.10) 0%, rgba(247,172,65,0.02) 60%, rgba(255,255,255,0.02) 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: gold,
              marginBottom: '14px',
            }}
          >
            Our Mission
          </div>
          <p
            style={{
              fontFamily: 'var(--font-hero)',
              fontSize: 'clamp(1.2rem, 2.2vw, 2rem)',
              color: '#FFF',
              fontStyle: 'italic',
              lineHeight: 1.4,
              margin: 0,
              maxWidth: '1000px',
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            "To prepare individuals for judgment and leadership across finance, technology,
            design, and management — by delivering education that is institutionally rigorous,
            practically relevant, and genuinely committed to long-term value creation for every
            student."
          </p>
        </motion.div>

        {/* Values grid */}
        <div
          className="wwa-values-grid"
          style={{
            marginTop: '40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {VALUES.map((val, idx) => (
            <motion.div
              key={val.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="wwa-value-card"
              style={{
                padding: '28px 26px',
                borderRadius: '16px',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-hero)',
                  fontSize: '14px',
                  color: gold,
                  fontStyle: 'italic',
                  opacity: 0.6,
                  marginBottom: '10px',
                }}
              >
                {String(idx + 1).padStart(2, '0')}
              </div>
              <h4
                style={{
                  fontFamily: 'var(--font-hero)',
                  fontSize: 'clamp(1.1rem, 1.35vw, 1.3rem)',
                  fontWeight: 500,
                  color: '#FFF',
                  margin: '0 0 10px',
                  lineHeight: 1.3,
                }}
              >
                {val.title}
              </h4>
              <p
                style={{
                  fontSize: '14.5px',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.7)',
                  margin: 0,
                }}
              >
                {val.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 04 · WHAT MAKES US DIFFERENT */}
      <section
        className="wwa-section"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '40px 5% 80px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <SectionHeader
          eyebrow="04 · Distinction"
          title="Why WSJr Is Not Like Other Programs"
          sub="We have thought carefully about this question, because it is the right question for a prospective student to ask."
          gold={gold}
        />

        <div
          className="wwa-diff-list"
          style={{
            marginTop: '44px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {DIFFERENTIATORS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              style={{
                padding: '28px 30px',
                borderRadius: '18px',
                background: 'rgba(247,172,65,0.04)',
                border: '1px solid rgba(247,172,65,0.18)',
                borderLeft: `4px solid ${gold}`,
                display: 'flex',
                gap: '22px',
                alignItems: 'flex-start',
              }}
              className="wwa-diff-card"
            >
              <span
                style={{
                  fontFamily: 'var(--font-hero)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                  color: gold,
                  fontStyle: 'italic',
                  fontWeight: 500,
                  lineHeight: 1,
                  minWidth: '58px',
                  opacity: 0.8,
                }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-hero)',
                    fontSize: 'clamp(1.2rem, 1.6vw, 1.6rem)',
                    color: '#FFF',
                    fontWeight: 500,
                    margin: '0 0 10px',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.8)',
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 05 · SOCIAL RESPONSIBILITY */}
      <section
        className="wwa-section"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '40px 5% 80px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <SectionHeader
          eyebrow="05 · Responsibility"
          title="Finance as a Force for Good"
          sub="Wealth is not just about individuals — it is about families, communities, and the long-term stability of the societies that shape all of us."
          gold={gold}
        />

        <div
          className="wwa-resp-grid"
          style={{
            marginTop: '44px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {RESPONSIBILITIES.map((r, idx) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              style={{
                padding: '32px 28px',
                borderRadius: '18px',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  color: gold,
                  marginBottom: '12px',
                }}
              >
                {r.tag}
              </div>
              <h4
                style={{
                  fontFamily: 'var(--font-hero)',
                  fontSize: 'clamp(1.2rem, 1.5vw, 1.5rem)',
                  color: '#FFF',
                  margin: '0 0 10px',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                }}
              >
                {r.title}
              </h4>
              <p
                style={{
                  fontSize: '14.5px',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.75)',
                  margin: 0,
                }}
              >
                {r.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 06 · GLOBAL PRESENCE */}
      <section
        className="wwa-section"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '40px 5% 120px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <SectionHeader
          eyebrow="06 · Presence"
          title="UAE and Beyond"
          sub="A unified academic framework across every campus — same curriculum, same standards."
          gold={gold}
        />

        <div
          className="wwa-loc-grid"
          style={{
            marginTop: '44px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px',
          }}
        >
          {LOCATIONS.map((loc, idx) => (
            <motion.div
              key={loc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="wwa-loc-card"
              style={{
                padding: '24px 22px',
                borderRadius: '14px',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: gold,
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '2.2px',
                    textTransform: 'uppercase',
                    color: gold,
                  }}
                >
                  {loc.flag}
                </span>
              </div>
              <h4
                style={{
                  fontFamily: 'var(--font-hero)',
                  fontSize: 'clamp(1.1rem, 1.3vw, 1.3rem)',
                  color: '#FFF',
                  fontWeight: 500,
                  margin: '0 0 6px',
                  letterSpacing: '-0.01em',
                }}
              >
                {loc.title}
              </h4>
              <p
                style={{
                  fontSize: '13.5px',
                  lineHeight: 1.55,
                  color: 'rgba(255,255,255,0.65)',
                  margin: 0,
                }}
              >
                {loc.role}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="wwa-final-cta"
          style={{
            marginTop: '80px',
            padding: '48px 40px',
            borderRadius: '20px',
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '30px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '1 1 360px', minWidth: 0 }}>
            <h4
              style={{
                fontFamily: 'var(--font-hero)',
                fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
                color: '#FFF',
                margin: '0 0 8px',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              Join a genuinely global network.
            </h4>
            <p
              style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.7)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Applications are reviewed on a rolling basis for upcoming cohorts.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/enroll')}
            style={{
              padding: '16px 36px',
              borderRadius: '100px',
              background: gold,
              color: '#2B1500',
              border: 'none',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '1.3px',
              cursor: 'pointer',
              boxShadow: '0 12px 30px -10px rgba(247,172,65,0.5)',
            }}
          >
            APPLY NOW →
          </motion.button>
        </motion.div>
      </section>

      {/* Responsive overrides */}
      <style>{`
        .wwa-value-card:hover,
        .wwa-loc-card:hover,
        .wwa-diff-card:hover {
          border-color: rgba(247,172,65,0.35);
          background: linear-gradient(180deg, rgba(247,172,65,0.06) 0%, rgba(255,255,255,0.02) 100%);
          transform: translateY(-2px);
        }

        @media (max-width: 992px) {
          .wwa-hero { padding: 130px 5% 60px !important; }
          .wwa-section { padding-left: 5% !important; padding-right: 5% !important; }
          .wwa-origin-grid { grid-template-columns: 1fr !important; gap: 22px !important; }
          .wwa-origin-callout { position: static !important; }
          .wwa-leadership-grid { grid-template-columns: 1fr !important; }
          .wwa-mission-card { padding: 44px 36px !important; }
        }

        @media (max-width: 768px) {
          .wwa-hero { padding: 110px 5% 50px !important; gap: 22px !important; }
          .wwa-title { font-size: clamp(2rem, 8vw, 3rem) !important; }
          .wwa-tagline { font-size: clamp(1.05rem, 4vw, 1.35rem) !important; }
          .wwa-intro p { font-size: 0.98rem !important; }
          .wwa-cta-row button, .wwa-cta-row a { flex: 1 1 auto; }
          .wwa-mission-card { padding: 36px 24px !important; }
          .wwa-mission-card p { font-size: clamp(1.05rem, 4.2vw, 1.3rem) !important; }
          .wwa-diff-card { padding: 22px 22px !important; gap: 14px !important; }
          .wwa-values-grid { grid-template-columns: 1fr !important; }
          .wwa-resp-grid { grid-template-columns: 1fr !important; }
          .wwa-final-cta { padding: 32px 22px !important; flex-direction: column !important; align-items: flex-start !important; }
          .wwa-final-cta button { width: 100% !important; }
        }

        @media (max-width: 480px) {
          .wwa-hero { padding: 100px 5% 40px !important; }
          .wwa-title { font-size: clamp(1.7rem, 9vw, 2.3rem) !important; letter-spacing: -0.01em !important; }
          .wwa-tagline { font-size: 1rem !important; }
          .wwa-intro p { font-size: 0.95rem !important; line-height: 1.65 !important; }
          .wwa-cta-row { flex-direction: column !important; }
          .wwa-cta-row button, .wwa-cta-row a { width: 100% !important; text-align: center !important; }
          .wwa-mission-card { padding: 28px 20px !important; }
          .wwa-diff-card { padding: 20px 18px !important; }
          .wwa-value-card { padding: 22px 20px !important; }
        }
      `}</style>
    </div>
  );
};

/* ————— Section header (matches SchoolProgramPage) ————— */
const SectionHeader = ({ eyebrow, title, sub, gold }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6 }}
    style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '820px' }}
  >
    <span
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '2.8px',
        textTransform: 'uppercase',
        color: gold,
      }}
    >
      {eyebrow}
    </span>
    <h2
      style={{
        fontFamily: 'var(--font-hero)',
        fontSize: 'clamp(1.8rem, 3.6vw, 3rem)',
        fontWeight: 500,
        color: '#FFF',
        margin: 0,
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
      }}
    >
      {title}
    </h2>
    {sub && (
      <p
        style={{
          fontSize: '15px',
          color: 'rgba(255,255,255,0.6)',
          margin: '4px 0 0',
          lineHeight: 1.5,
        }}
      >
        {sub}
      </p>
    )}
  </motion.div>
);

/* ————— Data ————— */
const VALUES = [
  {
    title: 'Institutional Discipline',
    desc: 'We apply banking-grade rigor to everything we build. Standards are not negotiable.',
  },
  {
    title: 'Education Before Execution',
    desc: 'We will not rush students toward action before they have the understanding to act wisely.',
  },
  {
    title: 'Long-Term Thinking',
    desc: 'We optimise for careers and lives — not for short-term metrics or superficial outcomes.',
  },
  {
    title: 'Ethical Responsibility',
    desc: 'Finance without ethics is fragile. We develop professionals who understand both.',
  },
  {
    title: 'Genuine Mentorship',
    desc: 'Access to experienced, honest guidance is one of the most valuable things an institution can offer. We provide it.',
  },
];

const DIFFERENTIATORS = [
  {
    title: 'We are not a certificate factory.',
    desc: 'Credentials matter, but they are not the point. The point is whether you can think clearly, allocate wisely, and lead confidently when the situation demands it. Our programs are designed to build those capabilities, not to issue paper.',
  },
  {
    title: 'We are not a trading community or a speculation platform.',
    desc: 'We are deeply serious about the distinction between investment and speculation. Our curriculum is built around understanding — how markets work, why capital moves the way it does, and how to make decisions that hold up over time. Chasing returns is not part of our curriculum.',
  },
  {
    title: 'We are genuinely global, not just internationally marketed.',
    desc: 'With campuses in the UAE, Cochin, Bangalore, Mumbai and Delhi — plus an online platform that reaches students worldwide — the WSJr community is genuinely cross-border. That diversity of perspective is a feature, not a footnote.',
  },
  {
    title: 'Our mentors have actually done the work.',
    desc: 'The professionals who guide our students have held real institutional roles, managed real capital and navigated real market conditions. When they teach, they share the mental models and hard-won judgment that shaped their own careers.',
  },
];

const RESPONSIBILITIES = [
  {
    tag: 'Access',
    title: 'Bringing world-class instruction to more students.',
    desc: 'We are actively expanding our campus network and online infrastructure to reach students across India and beyond who deserve the same quality of instruction as those in global financial centres.',
  },
  {
    tag: 'Sustainability',
    title: 'Preparing professionals for 21st-century capital.',
    desc: 'Our programs include an explicit focus on sustainable finance, responsible capital allocation and the long-horizon challenges that tomorrow\'s financial professionals will be expected to navigate.',
  },
  {
    tag: 'Community',
    title: 'A network that supports and challenges you.',
    desc: 'Through our Travel-and-Learn program, mentorship initiatives and global events, we invest in building a community of professionals who support and challenge each other throughout their careers.',
  },
];

const LOCATIONS = [
  { flag: '🇦🇪 UAE', title: 'Global Headquarters', role: 'Academic governance & international operations.' },
  { flag: '🇺🇸 Chicago', title: 'Wall Street Jr. Investments Ltd.', role: 'US investment operations.' },
  { flag: '🇮🇳 Cochin', title: 'Principal India Campus', role: 'Flagship India learning centre.' },
  { flag: '🇮🇳 Bangalore', title: 'Technology Campus', role: 'Technology-aligned learning hub.' },
  { flag: '🇮🇳 Mumbai', title: 'Financial Capital Campus', role: 'Market-adjacent training operations.' },
  { flag: '🇮🇳 Delhi', title: 'Policy Campus', role: 'Policy & institutional engagement.' },
];

export default WhoWeArePage;
