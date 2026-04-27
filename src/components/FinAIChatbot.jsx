import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────
   ACADEMY ADVISOR CHATBOT — LEADS & SYLLABUS
   ───────────────────────────────────────────────────────────── */

const ACADEMY_GOLD = "#d4af37";

const SYLLABUS = [
  { level: 1, name: "Foundations", modules: "Markets, Instruments, Portfolio Management, Corporate Finance, Risk." },
  { level: 2, name: "Systems", modules: "Trading Microstructure, Quantitative Thinking, Financial Data." },
  { level: 3, name: "AI Frontier", modules: "AI in Trading, Portfolio AI, News Analysis, Automation." },
  { level: 4, name: "Real-World", modules: "Asset Management, Legacy Planning, Capstone Project." },
];

export default function AcademyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep]     = useState("greeting"); // greeting -> collect_info -> chat
  const [msgs, setMsgs]     = useState([]);
  const [input, setInput]   = useState("");
  const [lead, setLead]     = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen && msgs.length === 0) {
      setMsgs([
        { id: 1, role: "assistant", text: "Welcome to **Wall Street Jr. Academy**. I'm your academic advisor. How can I help you today?" }
      ]);
    }
  }, [isOpen]);

  // Lock page scroll (native + Lenis) while the chat popover is open so
  // scrolling the messages doesn't drag the landing page behind it.
  useEffect(() => {
    if (!isOpen) return;
    const body = document.body;
    const html = document.documentElement;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const prev = {
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
    };
    window.__lenis?.stop?.();
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    return () => {
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      body.style.overflow = prev.bodyOverflow;
      html.style.overflow = prev.htmlOverflow;
      window.scrollTo(0, scrollY);
      window.__lenis?.start?.();
    };
  }, [isOpen]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const addMessage = (role, text) => {
    setMsgs(prev => [...prev, { id: Date.now(), role, text }]);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    addMessage("user", text);

    // Lead Collection Logic
    if (step === "greeting") {
      setLoading(true);
      setTimeout(() => {
        addMessage("assistant", "Nice to meet you! To provide the most relevant information about our curriculum, could you please share your **full name**?");
        setStep("ask_name");
        setLoading(false);
      }, 600);
      return;
    }

    if (step === "ask_name") {
      setLead(prev => ({ ...prev, name: text }));
      setLoading(true);
      setTimeout(() => {
        addMessage("assistant", `Thanks, ${text}! Please drop your **phone number** (with country code) so we can send you the full syllabus details.`);
        setStep("ask_phone");
        setLoading(false);
      }, 600);
      return;
    }

    if (step === "ask_phone") {
      setLead(prev => ({ ...prev, phone: text }));
      setLoading(true);
      setTimeout(() => {
        addMessage("assistant", "Perfect! Lastly, what's your **email address**?");
        setStep("ask_email");
        setLoading(false);
      }, 600);
      return;
    }

    if (step === "ask_email") {
      setLead(prev => ({ ...prev, email: text }));
      setLoading(true);
      
      // Simulate sending to backend
      console.log("LEAD COLLECTED:", { ...lead, email: text });
      
      setTimeout(() => {
        addMessage("assistant", "Excellent. Your details have been registered! Our admissions team will contact you shortly with the enrollment guide.\n\nYou can now ask me about our **Syllabus**, **Level modules**, or **Campus locations**.");
        setStep("chat");
        setLoading(false);
      }, 800);
      return;
    }

    // Syllabus / Q&A Logic
    if (step === "chat") {
      setLoading(true);
      setTimeout(() => {
        let reply = "I'm here to help with Academy info. Ask about 'Syllabus', 'Modules' or 'Levels'.";
        
        const low = text.toLowerCase();
        if (low.includes("syllabus") || low.includes("learn") || low.includes("module")) {
          reply = "The Academy offers a 4-Tier curriculum:\n\n" + 
            SYLLABUS.map(s => `**Level ${s.level} (${s.name}):** ${s.modules}`).join("\n\n") + 
            "\n\nWould you like more details on a specific level?";
        } else if (low.includes("campus") || low.includes("where")) {
          reply = "We have campuses in: **UAE (HQ)**, **Cochin**, **Bangalore**, **Mumbai**, and **Delhi**.";
        } else if (low.includes("cost") || low.includes("price") || low.includes("fee")) {
          reply = "Enrollment fees vary by region and format (Online vs. Campus). Our team will provide a customized quote during your discovery call!";
        }

        addMessage("assistant", reply);
        setLoading(false);
      }, 600);
    }
  };

  return (
    <>
      <style>{`
        .academy-chat-pop { animation: ac-pop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes ac-pop { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: none; } }
        .ac-msg-in { animation: ac-in 0.3s ease forwards; }
        @keyframes ac-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      `}</style>

      {/* FAB */}
      <button
        className="finai-fab"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: 30, right: 30, zIndex: 9999,
          width: 65, height: 65, borderRadius: '50%',
          background: 'rgba(20, 20, 25, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '2px solid #d4af37',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(212, 175, 55, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          overflow: 'hidden',
          animation: 'ac-robot-bounce 4s ease-in-out infinite',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <style>{`
          @keyframes ac-robot-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          /* Tablet: shrink the launcher so it stops covering body copy */
          @media (max-width: 768px) {
            .finai-fab { width: 52px !important; height: 52px !important; bottom: 18px !important; right: 18px !important; border-width: 1.5px !important; }
            .finai-wrap { right: 12px !important; left: 12px !important; width: auto !important; max-width: none !important; bottom: 80px !important; height: 70vh !important; }
          }
          /* Phone: even smaller, hugged into the corner */
          @media (max-width: 480px) {
            .finai-fab { width: 46px !important; height: 46px !important; bottom: 14px !important; right: 14px !important; box-shadow: 0 4px 16px rgba(212, 175, 55, 0.3) !important; }
          }
        `}</style>
        {isOpen ? (
          <div style={{ color: '#d4af37', fontSize: 24, fontWeight: 'bold' }}>✕</div>
        ) : (
          <img 
            src="/robot_icon.png" 
            alt="Robot Icon"
            style={{ 
              width: '100%', height: '100%', objectFit: 'contain',
              filter: 'drop-shadow(0 0 12px #d4af37aa) contrast(1.1) brightness(1.1)' 
            }} 
          />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="academy-chat-pop finai-wrap" style={{
          position: 'fixed', bottom: 110, right: 30, zIndex: 9998,
          width: 380, height: '65vh', maxHeight: 580,
          maxWidth: 'calc(100vw - 40px)',
          background: 'rgba(10, 10, 15, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: 24,
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          fontFamily: "'Inter', sans-serif",
        }}>
          {/* Header */}
          <div style={{ padding: '20px 24px', background: 'rgba(212, 175, 55, 0.1)', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d4af37', overflow: 'hidden', boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)' }}>
              <img src="/robot_icon.png" alt="Robot Icon" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>Academy Advisor</div>
              <div style={{ color: '#d4af37', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase' }}>Available • Lead Desk</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {msgs.map((m) => (
              <div key={m.id} className="ac-msg-in" style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
              }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {m.role === 'assistant' && (
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d4af37', overflow: 'hidden', flexShrink: 0, alignSelf: 'flex-end' }}>
                      <img src="/robot_icon.png" alt="Robot Icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                  )}
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                    background: m.role === 'user' ? '#d4af37' : 'rgba(255, 255, 255, 0.05)',
                    color: m.role === 'user' ? '#000' : '#fff',
                    fontSize: 13,
                    lineHeight: 1.6,
                    border: m.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    {m.text.split('\n').map((line, i) => (
                      <div key={i} style={{ marginBottom: line ? 4 : 8 }}>
                        {line.includes('**') ? 
                          line.split('**').map((part, j) => j % 2 === 1 ? <strong key={j} style={{ color: m.role === 'user' ? '#000' : '#d4af37' }}>{part}</strong> : part)
                          : line
                        }
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
               <div style={{ alignSelf: 'flex-start', color: '#666', fontSize: 11, padding: '4px 10px' }}>Advisor is typing...</div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Actions */}
          {step === "chat" && (
            <div style={{ display: 'flex', gap: 6, padding: '0 20px 10px', overflowX: 'auto' }}>
              {["Syllabus Info", "Campus Locations", "Course Fees"].map(btn => (
                <button key={btn} onClick={() => { setInput(btn); handleSend(); }} style={{
                  flexShrink: 0, padding: '6px 14px', borderRadius: 20,
                  background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.2)',
                  color: '#d4af37', fontSize: 11, cursor: 'pointer', fontWeight: 600
                }}>{btn}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '15px 20px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', gap: 10 }}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about our courses..."
              style={{
                flex: 1, background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 12, padding: '12px 16px', color: '#fff',
                fontSize: 13, outline: 'none',
              }}
            />
            <button onClick={handleSend} style={{
              width: 45, height: 45, borderRadius: 12, border: 'none',
              background: '#d4af37', color: '#000', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', fontSize: 18
            }}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
