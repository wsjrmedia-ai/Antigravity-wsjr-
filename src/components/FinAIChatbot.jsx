import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────────────────────
   ATLAS — WSJR Academy Chatbot
   Brand: Maroon #50000B · Gold #F7AC41 · Libre Baskerville / Switzer
   ───────────────────────────────────────────────────────────── */

const GOLD        = "#F7AC41";
const GOLD_DARK   = "#BC7E26";
const GOLD_LIGHT  = "#FFBD5F";
const MAROON      = "#50000B";
const MAROON_LT   = "#6A0715";
const FONT_HERO   = "'Libre Baskerville', serif";
const FONT_BODY   = "'Switzer', sans-serif";

const SYLLABUS = [
  { level: 1, name: "Foundations",  modules: "Markets, Instruments, Portfolio Management, Corporate Finance, Risk." },
  { level: 2, name: "Systems",      modules: "Trading Microstructure, Quantitative Thinking, Financial Data." },
  { level: 3, name: "AI Frontier",  modules: "AI in Trading, Portfolio AI, News Analysis, Automation." },
  { level: 4, name: "Real-World",   modules: "Asset Management, Legacy Planning, Capstone Project." },
];

const QUICK_CHIPS = ["Syllabus Info", "Our Schools", "Locations", "Course Fees"];

export default function AcademyChatbot() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [step,     setStep]     = useState("greeting");
  const [msgs,     setMsgs]     = useState([]);
  const [input,    setInput]    = useState("");
  const [lead,     setLead]     = useState({ name: "", phone: "", email: "" });
  const [loading,  setLoading]  = useState(false);
  const bottomRef = useRef(null);

  /* Seed welcome message on first open */
  useEffect(() => {
    if (isOpen && msgs.length === 0) {
      setMsgs([{
        id: 1, role: "assistant",
        text: "Welcome to **Wall Street Jr. Academy**. I'm ATLAS, your academic advisor. How can I help you today?"
      }]);
    }
  }, [isOpen]);

  /* Lock page scroll while chat is open */
  useEffect(() => {
    if (!isOpen) return;
    const body  = document.body;
    const html  = document.documentElement;
    const scrollY = window.scrollY || 0;
    const prev  = {
      bodyPosition: body.style.position, bodyTop: body.style.top,
      bodyWidth: body.style.width,       bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
    };
    window.__lenis?.stop?.();
    body.style.position = "fixed";
    body.style.top      = `-${scrollY}px`;
    body.style.width    = "100%";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    return () => {
      body.style.position = prev.bodyPosition;
      body.style.top      = prev.bodyTop;
      body.style.width    = prev.bodyWidth;
      body.style.overflow = prev.bodyOverflow;
      html.style.overflow = prev.htmlOverflow;
      window.scrollTo(0, scrollY);
      window.__lenis?.start?.();
    };
  }, [isOpen]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const addMsg = (role, text) => setMsgs(prev => [...prev, { id: Date.now(), role, text }]);

  const handleSend = (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text) return;
    setInput("");
    addMsg("user", text);

    if (step === "greeting") {
      setLoading(true);
      setTimeout(() => {
        addMsg("assistant", "Nice to meet you! To help you best, could you please share your **full name**?");
        setStep("ask_name");
        setLoading(false);
      }, 600);
      return;
    }

    if (step === "ask_name") {
      setLead(prev => ({ ...prev, name: text }));
      setLoading(true);
      setTimeout(() => {
        addMsg("assistant", `Thanks, ${text}! Please share your **phone number** (with country code) so we can send you the full syllabus.`);
        setStep("ask_phone");
        setLoading(false);
      }, 600);
      return;
    }

    if (step === "ask_phone") {
      setLead(prev => ({ ...prev, phone: text }));
      setLoading(true);
      setTimeout(() => {
        addMsg("assistant", "Perfect! What's your **email address**?");
        setStep("ask_email");
        setLoading(false);
      }, 600);
      return;
    }

    if (step === "ask_email") {
      const finalLead = { ...lead, email: text };
      setLead(finalLead);
      setLoading(true);
      console.log("LEAD:", finalLead);
      setTimeout(() => {
        addMsg("assistant", "Your details have been registered. Our admissions team will reach you shortly with the enrollment guide.\n\nYou can now ask me about our **Syllabus**, **Schools**, **Locations**, or **Course Fees**.");
        setStep("chat");
        setLoading(false);
      }, 800);
      return;
    }

    if (step === "chat") {
      setLoading(true);
      setTimeout(() => {
        const low = text.toLowerCase();
        let reply = "I'm here to help with Academy information. Feel free to ask about our syllabus, schools, locations, or fees.";

        if (low.includes("syllabus") || low.includes("learn") || low.includes("module") || low.includes("curriculum")) {
          reply = "The Academy offers a **4-Tier curriculum**:\n\n" +
            SYLLABUS.map(s => `**Level ${s.level} — ${s.name}:** ${s.modules}`).join("\n\n") +
            "\n\nWould you like more detail on a specific level?";
        } else if (low.includes("school") || low.includes("programme") || low.includes("program")) {
          reply = "We offer four specialist schools:\n\n**School of Finance** — Capital markets, investment analysis, and portfolio strategy.\n\n**School of Technology** — FinTech, algorithmic systems, and trading infrastructure.\n\n**School of Design** — Financial communication, UX for fintech, and brand strategy.\n\n**School of Management** — Business leadership, operations, and entrepreneurship.";
        } else if (low.includes("location") || low.includes("campus") || low.includes("where") || low.includes("city")) {
          reply = "We have campuses in:\n\n🇦🇪 **UAE (HQ)** — Dubai\n🇺🇸 **Chicago**\n🇮🇳 **Cochin**\n🇮🇳 **Bangalore**\n🇮🇳 **Mumbai**\n🇮🇳 **Delhi**";
        } else if (low.includes("fee") || low.includes("cost") || low.includes("price") || low.includes("pay")) {
          reply = "Enrollment fees vary by campus location and format (Online or In-Campus). Our team will provide a personalised quote during your discovery call — reach out at **wsjrschool.com** or register your interest and we'll contact you!";
        } else if (low.includes("duration") || low.includes("how long") || low.includes("months")) {
          reply = "The core programme runs over **6 months**, structured across four progressive levels. Each level builds on the last, culminating in a real-world capstone project.";
        } else if (low.includes("enroll") || low.includes("apply") || low.includes("register") || low.includes("join")) {
          reply = "To enroll, visit **wsjrschool.com/signup** or click the **Enroll Now** button at the top of the page. Our admissions team will guide you through the process.";
        }

        addMsg("assistant", reply);
        setLoading(false);
      }, 700);
    }
  };

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        /* ── Keyframes ── */
        @keyframes atlas-pop {
          from { opacity: 0; transform: scale(0.88) translateY(24px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes atlas-msg-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes atlas-fab-pulse {
          0%,100% { box-shadow: 0 8px 28px rgba(80,0,11,0.7), 0 0 0 0   rgba(247,172,65,0.4); }
          60%     { box-shadow: 0 8px 28px rgba(80,0,11,0.7), 0 0 0 12px rgba(247,172,65,0);   }
        }
        @keyframes atlas-dot {
          0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
          40%          { transform: scale(1);   opacity: 1; }
        }

        /* ── FAB ── */
        .atlas-fab {
          position: fixed; bottom: 30px; right: 30px; z-index: 9999;
          width: 62px; height: 62px; border-radius: 50%;
          background: ${MAROON};
          border: 2px solid ${GOLD};
          cursor: pointer; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          animation: atlas-fab-pulse 3s ease-in-out infinite;
          transition: transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275), border-color 0.3s;
        }
        .atlas-fab:hover { transform: scale(1.1); border-color: ${GOLD_LIGHT}; }

        /* ── Chat window ── */
        .atlas-wrap {
          position: fixed; bottom: 108px; right: 30px; z-index: 9998;
          width: 390px; height: 66vh; max-height: 600px;
          max-width: calc(100vw - 40px);
          background: rgba(6,2,4,0.97);
          border: 1px solid rgba(247,172,65,0.22);
          border-radius: 24px;
          display: flex; flex-direction: column;
          box-shadow: 0 24px 64px rgba(0,0,0,0.85), 0 0 40px rgba(80,0,11,0.25);
          overflow: hidden;
          animation: atlas-pop 0.35s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
          font-family: ${FONT_BODY};
        }

        /* ── Messages ── */
        .atlas-msg { animation: atlas-msg-in 0.28s ease forwards; }

        /* ── Scrollbar ── */
        .atlas-msgs::-webkit-scrollbar { width: 3px; }
        .atlas-msgs::-webkit-scrollbar-track { background: transparent; }
        .atlas-msgs::-webkit-scrollbar-thumb { background: rgba(247,172,65,0.2); border-radius: 10px; }

        /* ── Quick chips ── */
        .atlas-chip {
          flex-shrink: 0; padding: 6px 14px; border-radius: 20px;
          background: rgba(247,172,65,0.07);
          border: 1px solid rgba(247,172,65,0.25);
          color: ${GOLD}; font-size: 11px; font-weight: 600;
          font-family: ${FONT_BODY}; letter-spacing: 0.4px;
          cursor: pointer; transition: background 0.2s, border-color 0.2s;
          white-space: nowrap;
        }
        .atlas-chip:hover {
          background: rgba(247,172,65,0.15);
          border-color: rgba(247,172,65,0.5);
        }

        /* ── Input ── */
        .atlas-input {
          flex: 1; background: transparent; border: none;
          border-bottom: 1.5px solid rgba(247,172,65,0.2);
          color: #fff; font-size: 13px; font-family: ${FONT_BODY};
          outline: none; padding: 6px 2px; transition: border-color 0.25s;
        }
        .atlas-input:focus { border-bottom-color: ${GOLD}; }
        .atlas-input::placeholder { color: rgba(255,255,255,0.3); }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .atlas-fab  { width: 52px !important; height: 52px !important; bottom: 18px !important; right: 18px !important; }
          .atlas-wrap { right: 12px !important; left: 12px !important; width: auto !important; bottom: 82px !important; height: 72vh !important; }
        }
        @media (max-width: 480px) {
          .atlas-fab  { width: 46px !important; height: 46px !important; bottom: 14px !important; right: 14px !important; }
        }
      `}</style>

      {/* ── FAB ──────────────────────────────────────────── */}
      <button className="atlas-fab" onClick={() => setIsOpen(o => !o)} aria-label="Open Academy Advisor">
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <img
            src="/images/figma/monogram-academy.png"
            alt="ATLAS"
            style={{ width: "72%", height: "72%", objectFit: "contain", filter: "brightness(0) invert(1)" }}
          />
        )}
      </button>

      {/* ── Chat Window ───────────────────────────────────── */}
      {isOpen && (
        <div className="atlas-wrap">

          {/* Gold gradient accent bar */}
          <div style={{
            height: 3, flexShrink: 0,
            background: `linear-gradient(90deg, ${MAROON}, ${GOLD}, ${GOLD_LIGHT}, ${GOLD_DARK}, ${MAROON})`
          }} />

          {/* Header */}
          <div style={{
            padding: "18px 22px",
            background: "rgba(80,0,11,0.22)",
            borderBottom: "1px solid rgba(247,172,65,0.15)",
            display: "flex", alignItems: "center", gap: 14, flexShrink: 0
          }}>
            {/* Avatar */}
            <div style={{
              width: 46, height: 46, borderRadius: "50%",
              background: MAROON, border: `1.5px solid ${GOLD}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: `0 0 14px rgba(247,172,65,0.25)`
            }}>
              <img
                src="/images/figma/monogram-academy.png"
                alt="ATLAS"
                style={{ width: "68%", height: "68%", objectFit: "contain", filter: "brightness(0) invert(1)" }}
              />
            </div>

            {/* Identity */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: FONT_HERO,
                fontStyle: "italic",
                fontSize: 16,
                fontWeight: 600,
                color: GOLD,
                letterSpacing: "-0.3px",
                lineHeight: 1.2
              }}>ATLAS</div>
              <div style={{
                fontFamily: FONT_BODY,
                fontSize: 10,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "1.4px",
                textTransform: "uppercase",
                marginTop: 2,
                display: "flex", alignItems: "center", gap: 5
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#4ade80",
                  boxShadow: "0 0 6px #4ade80",
                  flexShrink: 0
                }} />
                Academy Advisor
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.35)", padding: 4,
                transition: "color 0.2s", flexShrink: 0
              }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="atlas-msgs" style={{
            flex: 1, overflowY: "auto",
            padding: "20px 18px",
            display: "flex", flexDirection: "column", gap: 12
          }}>
            {msgs.map(m => (
              <div key={m.id} className="atlas-msg" style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "86%",
                display: "flex", gap: 8, alignItems: "flex-end"
              }}>
                {/* Assistant avatar dot */}
                {m.role === "assistant" && (
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: MAROON, border: `1px solid ${GOLD}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <img
                      src="/images/figma/monogram-academy.png"
                      alt=""
                      style={{ width: "72%", height: "72%", objectFit: "contain", filter: "brightness(0) invert(1)" }}
                    />
                  </div>
                )}

                {/* Bubble */}
                <div style={{
                  padding: "11px 15px",
                  borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                  background: m.role === "user"
                    ? `linear-gradient(135deg, ${MAROON_LT}, ${MAROON})`
                    : "rgba(255,255,255,0.04)",
                  color: "#fff",
                  fontSize: 13,
                  fontFamily: FONT_BODY,
                  lineHeight: 1.6,
                  border: m.role === "user"
                    ? "1px solid rgba(247,172,65,0.2)"
                    : "1px solid rgba(255,255,255,0.07)",
                  borderLeft: m.role === "assistant" ? `2px solid rgba(247,172,65,0.45)` : undefined,
                }}>
                  {m.text.split("\n").map((line, i) => (
                    <div key={i} style={{ marginBottom: line ? 3 : 6 }}>
                      {line.includes("**")
                        ? line.split("**").map((part, j) =>
                            j % 2 === 1
                              ? <strong key={j} style={{ color: m.role === "user" ? GOLD_LIGHT : GOLD }}>{part}</strong>
                              : part
                          )
                        : line
                      }
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ alignSelf: "flex-start", display: "flex", gap: 5, padding: "10px 14px" }}>
                {[0, 0.18, 0.36].map((delay, i) => (
                  <span key={i} style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: GOLD,
                    display: "inline-block",
                    animation: `atlas-dot 1.2s ${delay}s ease-in-out infinite`
                  }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick chips */}
          {step === "chat" && (
            <div style={{
              display: "flex", gap: 6, padding: "0 18px 10px",
              overflowX: "auto", flexShrink: 0
            }}>
              {QUICK_CHIPS.map(chip => (
                <button key={chip} className="atlas-chip" onClick={() => handleSend(chip)}>
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <div style={{
            padding: "14px 18px 18px",
            background: "rgba(80,0,11,0.12)",
            borderTop: "1px solid rgba(247,172,65,0.1)",
            display: "flex", alignItems: "center", gap: 12, flexShrink: 0
          }}>
            <input
              className="atlas-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Ask about our courses…"
            />
            <button
              onClick={() => handleSend()}
              style={{
                width: 40, height: 40, borderRadius: "50%", border: "none",
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                cursor: "pointer", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 14px rgba(247,172,65,0.35)`,
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = `0 6px 20px rgba(247,172,65,0.5)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = `0 4px 14px rgba(247,172,65,0.35)`; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

          {/* Footer brand */}
          <div style={{
            padding: "8px 18px 12px",
            background: "rgba(80,0,11,0.12)",
            textAlign: "center",
            fontFamily: FONT_BODY,
            fontSize: 9,
            fontWeight: 600,
            color: "rgba(247,172,65,0.35)",
            letterSpacing: "1.8px",
            textTransform: "uppercase",
            flexShrink: 0
          }}>
            Wall Street Jr. Academy
          </div>

        </div>
      )}
    </>
  );
}
