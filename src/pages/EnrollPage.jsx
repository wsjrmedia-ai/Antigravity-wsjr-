import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

const EnrollPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+971',
    phone: '',
    country: '',
    dob: '',
    course: ''
  });

  const COUNTRIES = [
    "United Arab Emirates", "India", "United States", "United Kingdom", "Canada", "Australia", 
    "Singapore", "Saudi Arabia", "Qatar", "Oman", "Kuwait", "Bahrain", "Malaysia", "New Zealand",
    "South Africa", "Germany", "France", "Italy", "Spain", "Netherlands", "Switzerland", "Japan", 
    "South Korea", "China", "Hong Kong", "Other"
  ];

  const COUNTRY_CODES = [
    { code: "+971", label: "UAE (+971)" },
    { code: "+91", label: "IND (+91)" },
    { code: "+1", label: "USA/CAN (+1)" },
    { code: "+44", label: "UK (+44)" },
    { code: "+61", label: "AUS (+61)" },
    { code: "+65", label: "SGP (+65)" },
    { code: "+966", label: "KSA (+966)" },
    { code: "+974", label: "QAT (+974)" },
    { code: "+968", label: "OMN (+968)" },
    { code: "+965", label: "KWT (+965)" },
    { code: "+973", label: "BHR (+973)" }
  ];

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: `${formData.countryCode} ${formData.phone}`,
          country: formData.country,
          dob: formData.dob || null,
          course: formData.course
        }]);

      if (error) throw error;

      // GA4 conversion event — `generate_lead` is a standard GA4 event
      // name and is auto-recommended as a conversion. We attach the
      // course + country so we can later split conversion volume by
      // program and target geo.
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          course: formData.course || '(none)',
          country: formData.country || '(unknown)',
        });
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an issue submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 0',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#FFF',
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  };

  const focusStyle = `
    .form-input:focus { border-bottom-color: var(--accent-gold) !important; }
    .form-select option { background: var(--bg-primary); color: #FFF; }
  `;

  return (
    <div className="enroll-root" style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden',
      padding: '120px 5% 60px'
    }}>
      <SEO
        title="Apply & Enroll"
        description="Apply for the next cohort at Wall Street Jr. Academy. Programs in Finance, AI, Business Intelligence, and Design — Dubai-based, built for Indian and UAE students."
        path="/enroll"
      />
      <style>{focusStyle}</style>

      {/* Subtle Background Glow to match institutional aesthetic */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '80vw',
        height: '80vh',
        background: 'radial-gradient(circle, rgba(204, 151, 43, 0.08) 0%, transparent 60%)',
        transform: 'translate(-50%, -50%)',
        filter: 'blur(80px)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '80px',
        alignItems: 'center'
      }} className="enroll-grid">

        {/* Left Side: Motivational Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingRight: '20px' }}>
          <h1 style={{
            fontFamily: 'var(--font-hero)',
            fontSize: 'clamp(3rem, 5vw, 72px)',
            fontWeight: 500,
            lineHeight: 1.1,
            color: '#FFF',
            margin: 0,
            letterSpacing: '-0.03em'
          }}>
            Secure Your Place <br /> in the Next Generation of Finance.
          </h1>
          
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(16px, 1.2vw, 18px)',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.6,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <p>At Wall Street Jr. Academy, we select candidates based on ambition, discipline, and the pursuit of mastery. Our programs are designed exclusively for individuals ready to think like institutional investors and build significant impact.</p>
            <p>Complete this application to be considered for our upcoming cohorts across our specialized schools.</p>
          </div>
        </div>

        {/* Right Side: Application Form inside Glass Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
          className="glass-panel"
          style={{
            padding: '50px 40px',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="enroll-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}
              >
                <div style={{ marginBottom: '10px' }}>
                  <h3 style={{ fontFamily: 'var(--font-hero)', fontSize: '28px', color: '#FFF', margin: '0 0 10px' }}>Application Access</h3>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>Please provide accurate details for admissions processing.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <input type="text" name="firstName" placeholder="First Name" required className="form-input" style={inputStyle} onChange={handleChange} />
                  <input type="text" name="lastName" placeholder="Last Name" required className="form-input" style={inputStyle} onChange={handleChange} />
                </div>

                <input type="email" name="email" placeholder="Email Address" required className="form-input" style={inputStyle} onChange={handleChange} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select name="countryCode" required className="form-input form-select" style={{...inputStyle, width: '45%', appearance: 'none' }} onChange={handleChange} value={formData.countryCode}>
                      {COUNTRY_CODES.map((c, i) => (
                        <option key={i} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                    <input type="tel" name="phone" placeholder="Phone Number" required className="form-input" style={{...inputStyle, width: '55%'}} onChange={handleChange} value={formData.phone} />
                  </div>
                  <select name="country" required className="form-input form-select" style={{...inputStyle, color: formData.country ? '#FFF' : 'rgba(255,255,255,0.5)', appearance: 'none' }} onChange={handleChange} value={formData.country || ''}>
                    <option value="" disabled>Country of Residence</option>
                    {COUNTRIES.map((country, i) => (
                      <option key={i} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '-18px', left: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>Date of Birth</span>
                    <input type="date" name="dob" required className="form-input" style={{...inputStyle, color: formData.dob ? '#FFF' : 'rgba(255,255,255,0.5)'}} onChange={handleChange} />
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '-18px', left: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>Desired Course</span>
                    <select name="course" required className="form-input form-select" style={{...inputStyle, color: formData.course ? '#FFF' : 'rgba(255,255,255,0.5)', appearance: 'none' }} onChange={handleChange}>
                      <option value="" disabled selected>Select an Option</option>
                      <option value="finance">School of Finance</option>
                      <option value="technology">School of Technology</option>
                      <option value="design">School of Design</option>
                      <option value="management">School of Management</option>
                    </select>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#83081A' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  style={{
                    marginTop: '20px',
                    padding: '16px 32px',
                    borderRadius: '100px',
                    backgroundColor: 'var(--btn-maroon)',
                    color: '#FFF',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '16px',
                    letterSpacing: '0.5px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 10px 20px -5px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'PROCESSING...' : 'SUBMIT APPLICATION'}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '40px 20px',
                  minHeight: '400px'
                }}
              >
                <div style={{
                  width: '80px', height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(247, 172, 65, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '25px',
                  border: '1px solid rgba(247, 172, 65, 0.3)'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                
                <h3 style={{ fontFamily: 'var(--font-hero)', fontSize: '32px', color: 'var(--accent-gold)', margin: '0 0 15px' }}>
                  Application Received
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.8)', fontSize: '16px', lineHeight: 1.6, margin: 0 }}>
                  Thank you for applying to WallStreet Jr. Academy. Our admissions team will review your profile and contact you regarding the next steps in the selection process.
                </p>
                <div style={{ marginTop: '30px', marginBottom: '30px', width: '40px', height: '2px', background: 'var(--accent-gold)', opacity: 0.5 }}></div>
                <Link to="/" style={{
                  display: 'inline-block',
                  padding: '12px 30px',
                  borderRadius: '100px',
                  border: '1px solid rgba(247, 172, 65, 0.5)',
                  color: 'var(--accent-gold)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(247, 172, 65, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                }}
                >
                  RETURN TO HOME
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .enroll-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 700px) {
          .enroll-root { padding: 90px 5% 50px !important; }
          .enroll-grid { gap: 30px !important; }
          .enroll-grid h1 { font-size: clamp(2rem, 8vw, 2.8rem) !important; }
          .enroll-grid p { font-size: 0.98rem !important; }
          .enroll-grid [style*="grid-template-columns: 1fr 1fr"],
          .enroll-grid [style*="grid-template-columns:1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .enroll-grid .glass-panel { padding: 30px 20px !important; }
        }
        @media (max-width: 480px) {
          .enroll-root { padding: 80px 4% 40px !important; }
          .enroll-grid .glass-panel { padding: 24px 16px !important; }
          .enroll-grid h3 { font-size: 22px !important; }
          .enroll-grid h1 { font-size: clamp(1.8rem, 9vw, 2.3rem) !important; }
          .form-input { font-size: 15px !important; }
        }
      `}</style>
    </div>
  );
};

export default EnrollPage;
