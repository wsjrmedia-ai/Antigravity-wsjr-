import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { schools } from '../data/schools';
import SEO from '../components/SEO';

/**
 * SchoolProgramPage
 *
 * A single reusable page template that renders any of the four Wall Street Jr.
 * schools. Content is pulled from `src/data/schools.js` and keyed either by the
 * `schoolId` prop (when the page is mounted at a static route like
 * `/school-of-finance`) or by the `:slug` URL param.
 *
 * Design tokens intentionally mirror the landing page: `--font-hero`
 * (Libre Baskerville), `--font-body`, `--accent-gold` (#F7AC41) and the
 * maroon / dark palette. Fully responsive across 480 / 768 / 992 / 1200px.
 */
const SchoolProgramPage = ({ schoolId }) => {
  const params = useParams();
  const navigate = useNavigate();

  const school = useMemo(() => {
    if (schoolId && schools[schoolId]) return schools[schoolId];
    // fallback: dynamic route /schools/:slug
    const slug = params.slug;
    const found = Object.values(schools).find((s) => s.slug === slug);
    return found || null;
  }, [schoolId, params.slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [school?.id]);

  if (!school) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: '#FFF', padding: '160px 5% 80px', fontFamily: 'var(--font-body)' }}>
        <SEO
          title="School not found"
          description="The school program you’re looking for doesn’t exist at Wall Street Jr. Academy."
          path="/programmes"
          noindex
        />
        <h1 style={{ fontFamily: 'var(--font-hero)' }}>School not found</h1>
        <Link to="/" style={{ color: 'var(--accent-gold)' }}>← Back to home</Link>
      </div>
    );
  }

  const gold = 'var(--accent-gold)';
  const seoDescription = (school.intro || school.focus || '').slice(0, 200);
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: school.name,
    description: seoDescription,
    url: `https://wsjrschool.com${school.path}`,
    provider: { '@id': 'https://wsjrschool.com/#organization' },
    inLanguage: 'en',
    educationalLevel: 'Professional',
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
  };

  return (
    <div
      className="spp-root"
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: '#FFF',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
      }}
    >
      <SEO
        title={school.name.replace('Wall Street Jr. ', '')}
        description={seoDescription}
        path={school.path}
        schema={courseSchema}
      />
      {/* Ambient gold glow — same language as Enroll / landing */}
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
            'radial-gradient(ellipse at center, rgba(247, 172, 65, 0.12) 0%, rgba(247, 172, 65, 0.04) 35%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* HERO */}
      <section
        className="spp-hero"
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
              {school.acronym} · Program
            </span>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Wall Street Jr. Academy
            </span>
          </div>

          <h1
            className="spp-title"
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
            {school.name}
          </h1>

          <h2
            className="spp-tagline"
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
            {school.tagline}
          </h2>

          <p
            className="spp-intro"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.15vw, 1.15rem)',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.85)',
              margin: 0,
              maxWidth: '900px',
            }}
          >
            {school.intro}
          </p>

          <div
            className="spp-focus"
            style={{
              marginTop: '10px',
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
              Program Focus
            </div>
            <div
              style={{
                fontFamily: 'var(--font-hero)',
                fontSize: 'clamp(1.05rem, 1.4vw, 1.3rem)',
                color: '#FFF',
                lineHeight: 1.5,
              }}
            >
              {school.focus}
            </div>
          </div>

          <div className="spp-cta-row" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '14px' }}>
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
              APPLY TO THIS PROGRAM
            </motion.button>
            <Link
              to="/school-of-finance/syllabus"
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
              VIEW SYLLABUS →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* CORE AREAS */}
      <section
        className="spp-section spp-core"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '40px 5% 80px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <SectionHeader
          eyebrow="01 · Curriculum"
          title="Core Areas of Study"
          sub="The foundational pillars that shape every student in this program."
          gold={gold}
        />

        <div
          className="spp-core-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '18px',
            marginTop: '40px',
          }}
        >
          {school.coreAreas.map((area, idx) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.215, 0.61, 0.355, 1] }}
              className="spp-core-card"
              style={{
                padding: '28px 26px',
                borderRadius: '16px',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                position: 'relative',
                overflow: 'hidden',
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
              <h3
                style={{
                  fontFamily: 'var(--font-hero)',
                  fontSize: 'clamp(1.1rem, 1.4vw, 1.35rem)',
                  fontWeight: 500,
                  color: '#FFF',
                  margin: '0 0 10px',
                  lineHeight: 1.3,
                }}
              >
                {area.title}
              </h3>
              <p
                style={{
                  fontSize: '14.5px',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.7)',
                  margin: 0,
                }}
              >
                {area.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PATHWAYS */}
      <section
        className="spp-section spp-pathways"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '40px 5% 80px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <SectionHeader
          eyebrow="02 · Outcomes"
          title="Professional Pathways"
          sub="Roles and careers our graduates are prepared to step into."
          gold={gold}
        />

        <div
          className="spp-pathways-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '14px',
            marginTop: '40px',
          }}
        >
          {school.pathways.map((pathway, idx) => (
            <motion.div
              key={pathway}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              style={{
                padding: '20px 22px',
                borderRadius: '12px',
                border: '1px solid rgba(247,172,65,0.2)',
                background: 'rgba(247,172,65,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <span
                style={{
                  width: '30px',
                  height: '30px',
                  minWidth: '30px',
                  borderRadius: '50%',
                  background: 'rgba(247,172,65,0.15)',
                  border: `1px solid ${gold}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: gold,
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  color: '#FFF',
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {pathway}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SIGNATURE LAB */}
      <section
        className="spp-section spp-lab"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '40px 5% 120px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <SectionHeader
          eyebrow="03 · Signature"
          title="The Signature Lab"
          sub="A flagship, hands-on experience unique to this school."
          gold={gold}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
          className="spp-lab-card"
          style={{
            marginTop: '40px',
            padding: '56px 48px',
            borderRadius: '24px',
            background:
              'linear-gradient(135deg, rgba(247,172,65,0.14) 0%, rgba(247,172,65,0.03) 50%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(247,172,65,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* decorative acronym watermark */}
          <div
            aria-hidden
            className="spp-lab-watermark"
            style={{
              position: 'absolute',
              right: '-20px',
              bottom: '-80px',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(10rem, 22vw, 22rem)',
              color: 'rgba(247,172,65,0.07)',
              fontWeight: 700,
              letterSpacing: '-10px',
              lineHeight: 1,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {school.acronym}
          </div>

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px' }}>
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
              Signature Lab
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-hero)',
                fontSize: 'clamp(1.8rem, 3.4vw, 3rem)',
                color: '#FFF',
                fontWeight: 500,
                lineHeight: 1.1,
                margin: '0 0 22px',
                letterSpacing: '-0.01em',
              }}
            >
              {school.signatureLab.name}
            </h3>
            <p
              style={{
                fontSize: 'clamp(1rem, 1.15vw, 1.15rem)',
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.85)',
                margin: 0,
              }}
            >
              {school.signatureLab.desc}
            </p>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="spp-final-cta"
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
              Ready to join {school.acronym}?
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
        .spp-core-card:hover {
          border-color: rgba(247,172,65,0.35);
          background: linear-gradient(180deg, rgba(247,172,65,0.06) 0%, rgba(255,255,255,0.02) 100%);
          transform: translateY(-2px);
        }

        @media (max-width: 992px) {
          .spp-hero { padding: 130px 5% 60px !important; }
          .spp-section { padding-left: 5% !important; padding-right: 5% !important; }
          .spp-lab-card { padding: 44px 36px !important; }
        }

        @media (max-width: 768px) {
          .spp-hero { padding: 110px 5% 50px !important; gap: 22px !important; }
          .spp-title { font-size: clamp(2rem, 8vw, 3rem) !important; }
          .spp-tagline { font-size: clamp(1.05rem, 4vw, 1.35rem) !important; }
          .spp-intro { font-size: 0.98rem !important; }
          .spp-focus { padding: 18px 20px !important; }
          .spp-core-grid { grid-template-columns: 1fr !important; }
          .spp-pathways-grid { grid-template-columns: 1fr !important; }
          .spp-lab-card { padding: 36px 24px !important; }
          .spp-lab-card h3 { font-size: clamp(1.5rem, 6vw, 2rem) !important; }
          .spp-final-cta { padding: 32px 22px !important; flex-direction: column !important; align-items: flex-start !important; }
          .spp-final-cta button { width: 100% !important; }
        }

        @media (max-width: 480px) {
          .spp-hero { padding: 100px 5% 40px !important; }
          .spp-title { font-size: clamp(1.7rem, 9vw, 2.3rem) !important; letter-spacing: -0.01em !important; }
          .spp-tagline { font-size: 1rem !important; }
          .spp-intro { font-size: 0.95rem !important; line-height: 1.65 !important; }
          .spp-cta-row { flex-direction: column !important; }
          .spp-cta-row button, .spp-cta-row a { width: 100% !important; text-align: center !important; }
          .spp-core-card { padding: 22px 20px !important; }
          .spp-lab-card { padding: 28px 20px !important; }
        }
      `}</style>
    </div>
  );
};

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

export default SchoolProgramPage;
