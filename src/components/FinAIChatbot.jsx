import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────────────────────
   ATLAS — WSJR Academy Chatbot  ·  Full Knowledge Base
   Brand: Maroon #50000B · Gold #F7AC41 · Libre Baskerville / Switzer
   ───────────────────────────────────────────────────────────── */

const GOLD       = "#F7AC41";
const GOLD_DARK  = "#BC7E26";
const GOLD_LIGHT = "#FFBD5F";
const MAROON     = "#50000B";
const MAROON_LT  = "#6A0715";
const FONT_HERO  = "'Libre Baskerville', serif";
const FONT_BODY  = "'Switzer', sans-serif";

/* ── Knowledge Base ─────────────────────────────────────────── */

const KB = {
  greeting: `Welcome to **Wall Street Jr. Academy**. I'm ATLAS, your academic advisor.\n\nYou can ask me about our Schools, Syllabus, Campus Locations, Fees, Enrollment, Leadership, or any program details.`,

  overview: `**Wall Street Jr. Academy** is an institutional-grade financial education firm headquartered in **Dubai, UAE** — with campuses across India and the United States.\n\nWe offer four specialist schools:\n\n• **School of Finance (SOF)** — Markets, trading & portfolio management\n• **School of AI & Automation (SOT)** — AI agents, automation & workflow design\n• **School of Design & Media (SOD)** — Brand, media & content systems\n• **School of Business & Management (SOM)** — Strategy, operations & performance\n\nAll programs run on a single academic framework: **Education before execution. Discipline before returns. Structure before scale.**`,

  schools: {
    all: `We offer **four specialist schools**, each with its own curriculum, lab, and career pathways:\n\n**1. School of Finance (SOF)**\nMastering Markets, Valuation & Capital Allocation. For aspiring traders, investment associates, and risk analysts.\n\n**2. School of AI & Automation (SOT)**\nBuilding the Future with AI, Agents & Workflow Automation. For AI specialists, workflow designers, and automation consultants.\n\n**3. School of Design & Media (SOD)**\nCrafting Experiences, Brands & Content That Shape Behaviour. For content designers, UX/UI professionals, and brand communicators.\n\n**4. School of Business & Management (SOM)**\nLeading Businesses Through Strategy, Systems & Execution. For business analysts, strategy associates, and performance managers.\n\nWould you like details on a specific school?`,

    sof: `**School of Finance (SOF)**\n*Mastering Markets, Valuation & Capital Allocation*\n\nThe SOF trains you to think like an institutional investor — managing capital and risk across short-term and long-term horizons.\n\n**Core Areas:**\n• Foundations of Financial Literacy\n• Market Structure & Instruments (equities, indices, commodities, currencies, derivatives)\n• Risk Management & Portfolio Hedging\n• Technical & Fundamental Analysis\n• Investment & Portfolio Building\n• Trading Psychology & Decision Systems\n\n**Signature Lab:** Weekly Institutional Strategies Lab — live market behaviour, multi-timeframe confluence, institutional-style desk workflows.\n\n**Career Pathways:** Trader, Investment Associate, Market Research Analyst, Risk Analyst, Finance Educator.\n\n**Ideal for:** Aspiring traders, investment associates, risk and market research analysts.`,

    sot: `**School of AI & Automation (SOT)**\n*Building the Future with AI, Agents & Workflow Automation*\n\nGoes beyond surface-level tools — trains you to build intelligent agents, automate workflows, and integrate AI across any profession.\n\n**Core Areas:**\n• Foundations of Artificial Intelligence\n• Prompting & AI Communication\n• AI for Research, Writing & Decision Support\n• AI for Data & Analytics\n• Workflow Automation Design\n• Agent Building Fundamentals\n• AI Integration Across Professions\n\n**Signature Lab:** Agent Builder Studio — every student builds 2–3 working AI agents (Research Agent, Operations Agent, Sales/Outreach Agent) with guardrails and audit logs.\n\n**Career Pathways:** AI & Automation Specialist, Agent & Workflow Designer, Research Analyst, Business Automation Consultant.\n\n**Ideal for:** AI & automation specialists, workflow designers, productivity analysts.`,

    sod: `**School of Design & Media (SOD)**\n*Crafting Experiences, Brands & Content That Shape Behaviour*\n\nCombines design thinking, digital media, AI-assisted content pipelines and modern storytelling into one professional program.\n\n**Core Areas:**\n• Foundations of Visual Communication\n• Digital Media Production (short-form, long-form, reels, podcasts)\n• UX / UI Fundamentals\n• Brand & Narrative Design\n• Content Systems & Operations\n• AI Integration for Creative Production\n\n**Signature Lab:** Digital Media Factory — students build their own content pipeline from brief to publish, operating with real approval chains and performance tracking.\n\n**Career Pathways:** Content Systems Designer, Brand Coordinator, Digital Media Lead, UX/UI Designer, AI-Enabled Creative Specialist.\n\n**Ideal for:** Content designers, UX/UI professionals, brand communicators.`,

    som: `**School of Business & Management (SOM)**\n*Leading Businesses Through Strategy, Systems & Execution*\n\nBlends foundational business thinking with modern operations, analytics and AI-supported decision making.\n\n**Core Areas:**\n• Foundations of Business Systems\n• Business Performance & KPI Design\n• Strategy Development & Execution\n• Operational Efficiency & Process Design\n• Market Research & Business Analysis\n• Technology & AI Integration for Operations\n\n**Signature Lab:** Business Operating System Capstone — students design a complete Business OS: KPI scorecards, SOP libraries, and a 90-day execution plan.\n\n**Career Pathways:** Business Operations Analyst, Strategy Associate, Performance/KPI Manager, Process Improvement Lead, Business Intelligence Coordinator.\n\n**Ideal for:** Business operations analysts, strategy associates, performance managers.`,
  },

  syllabus: `**School of Finance — 14-Module Curriculum**\n*4 Progressive Levels · Built for Real-World Application*\n\n**LEVEL 1 — Finance & Market Foundations**\n1. Financial Markets & Instruments — Global market structure, asset classes, equities, bonds, derivatives, currencies.\n2. Investment & Portfolio Management — Asset allocation, risk-return trade-offs, diversification, fund manager frameworks.\n3. Corporate Finance & Valuation — DCF analysis, comparable company analysis, capital structure, enterprise value.\n4. Risk Management Frameworks — Identifying, quantifying, and structuring around financial risk.\n\n**LEVEL 2 — Trading, Data & Systems**\n5. Financial Markets & Trading — Market microstructure, order types, execution mechanics, price discovery.\n6. Quantitative Thinking for Finance — Probability, distributions, regression, statistical reasoning for finance.\n\n**LEVEL 3 — AI for Finance & Investments**\n7. Introduction to AI in Finance — What AI can/cannot do, machine learning fundamentals, AI in financial decision-making.\n8. AI for Market Analysis & Trading — Sentiment analysis, price prediction models, algorithmic strategy evaluation.\n9. AI for Portfolio Management & Wealth — Robo-advisory platforms, risk-adjusted return optimisation, rebalancing with AI.\n10. AI for Fundamental & News Analysis — Processing earnings reports, macro data, real-time news for investment signals.\n11. AI Automation for Finance Professionals — Automating data aggregation, reporting, compliance monitoring workflows.\n\n**LEVEL 4 — Business, Ethics & Real-World Application**\n12. AI in Asset Management & Advisory Firms — How institutions integrate AI into investment processes and client relations.\n13. Wealth, Lifestyle & Legacy Planning — Estate planning, tax efficiency, generational wealth transfer, philanthropy.\n14. Capstone Project — Comprehensive financial project integrating market analysis, AI application, and strategic decision-making.\n\nWould you like details on a specific level?`,

  syllabusLevels: {
    1: `**Level 1 — Finance & Market Foundations**\n*Understanding How Finance Actually Works*\n\n**Module 1: Financial Markets & Instruments**\nA comprehensive introduction to global financial market structure, asset class behaviour, and instruments — equities, bonds, derivatives, currencies — within the broader economic system. You will learn to read markets, not just describe them.\n\n**Module 2: Investment & Portfolio Management**\nPrinciples behind building and managing a portfolio: asset allocation, risk-return trade-offs, diversification, and frameworks used by professional fund managers.\n\n**Module 3: Corporate Finance & Valuation**\nHow businesses raise capital, allocate it, and are valued: discounted cash flow analysis, comparable company analysis, capital structure, and enterprise value drivers.\n\n**Module 4: Risk Management Frameworks**\nCore frameworks for identifying, quantifying, and managing financial risk — drawing on methods used by leading institutions.`,

    2: `**Level 2 — Trading, Data & Systems**\n*Moving from Understanding to Application*\n\n**Module 5: Financial Markets & Trading**\nReal-time market operations: market microstructure, order types, execution mechanics, and the behavioral dynamics that shape price discovery.\n\n**Module 6: Quantitative Thinking for Finance**\nQuantitative tools and statistical reasoning used in modern finance: probability, distributions, regression, and data interpretation. Precision of thought — no advanced mathematics required.`,

    3: `**Level 3 — AI for Finance & Investments**\n*The Next Frontier of Financial Intelligence*\n\n**Module 7: Introduction to AI in Finance**\nWhat AI can and cannot do, how ML models are trained and evaluated, and where AI is already reshaping financial decision-making.\n\n**Module 8: AI for Market Analysis & Trading**\nSentiment analysis, price prediction models, algorithmic strategy evaluation, and limitations every AI-assisted trader must understand.\n\n**Module 9: AI for Portfolio Management & Wealth**\nHow AI transforms portfolio construction, rebalancing, and performance attribution — robo-advisory, risk-adjusted optimisation.\n\n**Module 10: AI for Fundamental & News Analysis**\nHow AI processes earnings reports, macroeconomic data, and real-time news to surface investment signals.\n\n**Module 11: AI Automation for Finance Professionals**\nAutomating financial workflows: data aggregation, report generation, client communication, compliance monitoring.`,

    4: `**Level 4 — Business, Ethics & Real-World Application**\n*From Individual Skill to Institutional Readiness*\n\n**Module 12: AI in Asset Management & Advisory Firms**\nHow asset managers integrate AI into investment processes, client relationships, and operational infrastructure.\n\n**Module 13: Wealth, Lifestyle & Legacy Planning**\nEstate planning, tax efficiency, generational wealth transfer, philanthropy, and long-term lifestyle decisions.\n\n**Module 14: Capstone Project**\nA comprehensive financial project — market analysis + AI application + strategic decision-making — that demonstrates professional-level judgment.`,
  },

  locations: `**Wall Street Jr. Academy — Campus Locations**\n\n🇦🇪 **UAE — Global Headquarters (Dubai)**\nAcademic governance hub for the entire Academy. Where institutional strategy, faculty leadership, and curriculum development are centred — in one of the world's most dynamic financial centres.\n\n🇺🇸 **Chicago**\nHome to Wall Street Jr. Investments Ltd. — our US investment operations hub.\n\n🇮🇳 **Cochin — Principal India Campus**\nThe primary academic centre in India, offering structured faculty-led instruction with strong ties to the broader institutional framework.\n\n🇮🇳 **Bangalore — Technology-Aligned Campus**\nForward-thinking, systems-oriented campus aligned with the technology landscape reshaping modern finance. Emphasis on automation and tech-capital intersections.\n\n🇮🇳 **Mumbai — Financial Capital Campus**\nPositioned in India's financial and commercial capital — direct exposure to real market environments, enterprise dynamics, and institutional learning.\n\n🇮🇳 **Delhi — Policy & Institutional Campus**\nEmphasis on finance from a systems and governance perspective — how capital flows within and around institutional structures.`,

  fees: `Enrollment fees vary by **campus location** and **format** (Online or In-Campus). We don't publish a fixed fee as each student receives a **personalised quote** during a discovery call based on their chosen school, location, and format.\n\nTo get your quote, you can:\n• **Enroll at wsjrschool.com/signup** — our admissions team will reach out\n• Ask us to have someone contact you directly\n\nFor reference: the WSJr. Investments advisory service (a separate vertical) has a $249 sign-up fee with a $50k+ portfolio minimum — but Academy tuition is a separate, personalised arrangement.`,

  enrollment: `**How to Enroll at Wall Street Jr. Academy**\n\n1. Visit **wsjrschool.com/signup** or click **Enroll Now** at the top of the page\n2. Submit your details — our admissions team reviews applications on a rolling basis\n3. You'll receive a discovery call to discuss your goals, school choice, and format (Online / In-Campus)\n4. Receive your personalised enrollment guide and fees\n\nApplications are reviewed continuously — there is no fixed intake deadline. Our admissions team typically responds within 1–2 business days.`,

  duration: `The core program runs **6 months**, structured across four progressive levels covering 14 modules.\n\nFor students who want deeper professional development, there is an optional **3-month Professional Add-on** after the core program.\n\n**Total with add-on: 9 months**\n\nThe program is available in two formats:\n• **Online** — global access, live mentorship sessions, full curriculum depth\n• **In-Campus** — available at UAE, Cochin, Bangalore, Mumbai, and Delhi`,

  leader: `**Founder & CEO: Vishnu Das**\n\n*Harvard-educated capital architect with institutional experience at JP Morgan and Bank of America.*\n\nVishnu founded the Academy not to build another course platform, but to create a genuine institution — one with the academic seriousness of a great university and the practical relevance of a top-tier financial firm.\n\nHis approach to education mirrors his approach to capital: **long-term, disciplined, and grounded in first principles**.\n\nUnder his leadership, Wall Street Jr. has grown from a single program into a multi-school academy operating across six global locations.\n\n**Faculty Philosophy:** Our mentors are practitioners first — professionals who have held real institutional roles, managed real capital, and navigated real market conditions.`,

  philosophy: `**The WSJr. Academic Philosophy**\n\nWe have built our entire academic approach around four non-negotiable principles:\n\n1. **Education before execution** — Understand a concept before applying it. We do not rush to action.\n\n2. **Understanding before outcomes** — We develop people who understand *why* the process exists, not just how to follow it.\n\n3. **Discipline before returns** — Chasing results is one of the most common causes of financial failure. We teach the habits that prevent it.\n\n4. **Structure before scale** — Whether in personal finance or institutional investment, scale without structure is fragile.\n\nOur assessments prioritise **judgment over memorization** and **application over recall** — because those are the qualities financial careers actually demand.`,

  online: `**Online Learning at Wall Street Jr. Academy**\n\nOur online platform is the global backbone of the School of Finance — accessible to students worldwide without compromising depth or structure.\n\nOnline students receive:\n• Full access to all 14 modules across 4 levels\n• Core financial foundations and conceptual frameworks\n• Market structure and asset-class understanding\n• Risk, capital allocation, and decision-making models\n• **Live mentorship sessions** and faculty-led discussions\n\nOnline delivery maintains the same curriculum consistency, academic standards, and evaluation rigour as in-campus programs. Geography is never a barrier to quality education.`,

  travelLearn: `**Travel and Learn — Our Core Giving Philosophy**\n\nWe reward students who demonstrate discipline, original thinking, and meaningful contribution — not just with recognition, but with **real experiences**.\n\nThe Travel and Learn program takes exceptional students beyond borders — to financial capitals, innovation hubs, and global leadership events where real decisions are made.\n\n• **Global Rewards** — Performance-linked opportunities to attend international programs and conferences\n• **Elite Mentorship** — Direct access to high-calibre professionals who invest their time in students who earn it\n• **Impact Projects** — Real-world initiatives creating measurable change in communities and organisations`,

  network: `**The WSJr. Global Network**\n\nWhen you join Wall Street Jr. Academy, you join a growing community of students, alumni, and mentors across:\n\n🌍 Dubai · Chicago · Cochin · Bangalore · Mumbai · Delhi\n\n**Live Q&A Sessions** — Every month, students get direct access to industry leaders, fund managers, and senior professionals through live interactive sessions hosted in Dubai and streamed globally.\n\n**Interdisciplinary Collaboration** — Work alongside peers from Finance, Technology, Design, and Management programs on complex, real-world challenges.\n\n**Alumni Network** — Graduates carry forward relationships built during the program into their professional careers.`,

  mission: `**Our Mission**\n\n*"To prepare individuals for judgment and leadership across finance, technology, design, and management — by delivering education that is institutionally rigorous, practically relevant, and genuinely committed to long-term value creation for every student."*\n\n**Our Values:**\n• **Institutional Discipline** — Banking-grade rigour. Standards are non-negotiable.\n• **Education Before Execution** — We will not rush students toward action before they have the understanding to act wisely.\n• **Long-Term Thinking** — We optimise for careers and lives, not short-term metrics.\n• **Ethical Responsibility** — Finance without ethics is fragile. We develop professionals who understand both.\n• **Genuine Mentorship** — Access to experienced, honest guidance is one of the most valuable things an institution can offer.`,

  distinction: `**Why WSJr. Academy Is Different**\n\n1. **We are not a certificate factory.** The point is whether you can think clearly, allocate wisely, and lead confidently — not the paper you hold.\n\n2. **We are not a trading community or speculation platform.** Our curriculum is built around understanding — how markets work, how capital moves, how to make decisions that hold up over time.\n\n3. **We are genuinely global.** Campuses in UAE, Cochin, Bangalore, Mumbai and Delhi — plus an online platform reaching students worldwide.\n\n4. **Our mentors have actually done the work.** Real institutional roles, real capital managed, real market conditions navigated.`,

  fallback: `I can help you with information about:\n\n• **Our Schools** — Finance, AI & Automation, Design & Media, Business & Management\n• **The Syllabus** — 14 modules across 4 levels\n• **Campus Locations** — UAE, Chicago, Cochin, Bangalore, Mumbai, Delhi\n• **Course Duration** — 6-month core + optional 3-month add-on\n• **Fees & Enrollment** — Personalised quote on application\n• **Leadership** — About our Founder and faculty\n• **Programs** — Travel & Learn, Live Q&A, Global Network\n\nWhat would you like to know?`,
};

/* ── Keyword Matcher ─────────────────────────────────────────── */
function getReply(text) {
  const t = text.toLowerCase();

  // Schools — specific
  if (/school of finance|sof\b|finance school/.test(t))                       return KB.schools.sof;
  if (/school of ai|sot\b|ai school|automation school|technology school/.test(t)) return KB.schools.sot;
  if (/school of design|sod\b|design school|media school/.test(t))            return KB.schools.sod;
  if (/school of (business|management)|som\b|management school|business school/.test(t)) return KB.schools.som;

  // Schools — general
  if (/\bschool(s)?\b|programme|programs?|courses?|what do you offer|what can i study/.test(t)) return KB.schools.all;

  // Syllabus — specific levels
  if (/level 1|module 1|module 2|module 3|module 4|foundation(s)?/.test(t))   return KB.syllabusLevels[1];
  if (/level 2|module 5|module 6|trading.*data|quantitat/.test(t))            return KB.syllabusLevels[2];
  if (/level 3|module 7|module 8|module 9|module 10|module 11|ai.*financ|financ.*ai/.test(t)) return KB.syllabusLevels[3];
  if (/level 4|module 12|module 13|module 14|capstone|legacy|wealth.*plan/.test(t)) return KB.syllabusLevels[4];

  // Syllabus — general
  if (/syllabus|curriculum|modules?|what.*learn|what.*study|course.*content|14 module/.test(t)) return KB.syllabus;

  // Locations / campuses
  if (/locat|campus|campu|where|city|cities|uae|dubai|cochin|bangalore|mumbai|delhi|chicago|india/.test(t)) return KB.locations;

  // Fees / cost
  if (/fee(s)?|cost|price|pay|tuition|how much|afford/.test(t))               return KB.fees;

  // Enrollment / apply
  if (/enroll|enrol|apply|register|join|admission|sign.?up|start|how.*begin/.test(t)) return KB.enrollment;

  // Duration / time
  if (/duration|how long|months?|timeline|schedule|when|6 month|9 month/.test(t)) return KB.duration;

  // Leadership / founder
  if (/found|vishnu|ceo|leader|team|faculty|mentor|who.*run|professor|teacher/.test(t)) return KB.leader;

  // Philosophy / values / mission
  if (/philosoph|mission|value(s)?|principle|approach|method|different|unique/.test(t)) return KB.philosophy;

  // Why different
  if (/why.*wsjr|why.*choose|why.*pick|different|stand.?out|compare|vs |versus/.test(t)) return KB.distinction;

  // Online learning
  if (/online|virtual|digital|remote|distance/.test(t))                       return KB.online;

  // Travel & Learn
  if (/travel|abroad|international|reward|trip/.test(t))                      return KB.travelLearn;

  // Network / community / events
  if (/network|community|alumni|event|live.*q|session|collaboration/.test(t)) return KB.network;

  // Overview / about
  if (/about|overview|what is|who.*are|institution|academy|wall street/.test(t)) return KB.overview;

  return KB.fallback;
}

/* ── Quick Chip Sets ─────────────────────────────────────────── */
const CHIPS_PRIMARY   = ["Our Schools", "Syllabus", "Locations", "Course Fees"];
const CHIPS_SECONDARY = ["Enrollment", "Duration", "Leadership", "Online Learning"];

export default function AcademyChatbot() {
  const [isOpen,  setIsOpen]  = useState(false);
  const [step,    setStep]    = useState("greeting");
  const [msgs,    setMsgs]    = useState([]);
  const [input,   setInput]   = useState("");
  const [lead,    setLead]    = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [chipSet, setChipSet] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen && msgs.length === 0) {
      setMsgs([{ id: 1, role: "assistant", text: KB.greeting }]);
    }
  }, [isOpen]);

  /* Lock scroll */
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

  const addMsg = (role, text) => setMsgs(prev => [...prev, { id: Date.now() + Math.random(), role, text }]);

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
        addMsg("assistant", `Thanks, ${text}! Please share your **phone number** (with country code) so we can send you the full program details.`);
        setStep("ask_phone");
        setLoading(false);
      }, 600);
      return;
    }

    if (step === "ask_phone") {
      setLead(prev => ({ ...prev, phone: text }));
      setLoading(true);
      setTimeout(() => {
        addMsg("assistant", "Perfect! What is your **email address**?");
        setStep("ask_email");
        setLoading(false);
      }, 600);
      return;
    }

    if (step === "ask_email") {
      const finalLead = { ...lead, email: text };
      setLead(finalLead);
      setLoading(true);
      console.log("ATLAS LEAD:", finalLead);
      setTimeout(() => {
        addMsg("assistant", `Your details have been registered, ${finalLead.name}. Our admissions team will reach out with your personalised enrollment guide.\n\nYou can now ask me anything about our programs, syllabus, campuses, fees, or leadership.`);
        setStep("chat");
        setLoading(false);
      }, 800);
      return;
    }

    if (step === "chat") {
      setLoading(true);
      setTimeout(() => {
        addMsg("assistant", getReply(text));
        setLoading(false);
      }, 700);
    }
  };

  const chips = chipSet === 0 ? CHIPS_PRIMARY : CHIPS_SECONDARY;

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @keyframes atlas-pop {
          from { opacity: 0; transform: scale(0.88) translateY(24px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes atlas-msg-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes atlas-fab-pulse {
          0%,100% { box-shadow: 0 8px 28px rgba(80,0,11,0.7), 0 0 0 0   rgba(247,172,65,0.4); }
          60%     { box-shadow: 0 8px 28px rgba(80,0,11,0.7), 0 0 0 12px rgba(247,172,65,0); }
        }
        @keyframes atlas-dot {
          0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
          40%          { transform: scale(1);   opacity: 1; }
        }

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

        .atlas-wrap {
          position: fixed; bottom: 108px; right: 30px; z-index: 9998;
          width: 400px; height: 68vh; max-height: 620px;
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

        .atlas-msg { animation: atlas-msg-in 0.28s ease forwards; }

        .atlas-msgs::-webkit-scrollbar { width: 3px; }
        .atlas-msgs::-webkit-scrollbar-track { background: transparent; }
        .atlas-msgs::-webkit-scrollbar-thumb { background: rgba(247,172,65,0.2); border-radius: 10px; }

        .atlas-chip {
          flex-shrink: 0; padding: 6px 13px; border-radius: 20px;
          background: rgba(247,172,65,0.07);
          border: 1px solid rgba(247,172,65,0.25);
          color: ${GOLD}; font-size: 11px; font-weight: 600;
          font-family: ${FONT_BODY}; letter-spacing: 0.3px;
          cursor: pointer; white-space: nowrap;
          transition: background 0.2s, border-color 0.2s;
        }
        .atlas-chip:hover { background: rgba(247,172,65,0.15); border-color: rgba(247,172,65,0.5); }
        .atlas-chip-more {
          flex-shrink: 0; padding: 6px 10px; border-radius: 20px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.4); font-size: 11px; font-weight: 600;
          font-family: ${FONT_BODY};
          cursor: pointer; white-space: nowrap;
          transition: color 0.2s, border-color 0.2s;
        }
        .atlas-chip-more:hover { color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.25); }

        .atlas-input {
          flex: 1; background: transparent; border: none;
          border-bottom: 1.5px solid rgba(247,172,65,0.2);
          color: #fff; font-size: 13px; font-family: ${FONT_BODY};
          outline: none; padding: 6px 2px; transition: border-color 0.25s;
        }
        .atlas-input:focus { border-bottom-color: ${GOLD}; }
        .atlas-input::placeholder { color: rgba(255,255,255,0.3); }

        @media (max-width: 768px) {
          .atlas-fab  { width: 52px !important; height: 52px !important; bottom: 18px !important; right: 18px !important; }
          .atlas-wrap { right: 12px !important; left: 12px !important; width: auto !important; bottom: 82px !important; height: 72vh !important; }
        }
        @media (max-width: 480px) {
          .atlas-fab { width: 46px !important; height: 46px !important; bottom: 14px !important; right: 14px !important; }
        }
      `}</style>

      {/* ── FAB ──────────────────────────────────────────────── */}
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

      {/* ── Chat Window ───────────────────────────────────────── */}
      {isOpen && (
        <div className="atlas-wrap">

          {/* Accent bar */}
          <div style={{
            height: 3, flexShrink: 0,
            background: `linear-gradient(90deg, ${MAROON}, ${GOLD}, ${GOLD_LIGHT}, ${GOLD_DARK}, ${MAROON})`
          }} />

          {/* Header */}
          <div style={{
            padding: "16px 20px",
            background: "rgba(80,0,11,0.22)",
            borderBottom: "1px solid rgba(247,172,65,0.15)",
            display: "flex", alignItems: "center", gap: 12, flexShrink: 0
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: MAROON, border: `1.5px solid ${GOLD}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, boxShadow: `0 0 14px rgba(247,172,65,0.25)`
            }}>
              <img
                src="/images/figma/monogram-academy.png"
                alt="ATLAS"
                style={{ width: "68%", height: "68%", objectFit: "contain", filter: "brightness(0) invert(1)" }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: FONT_HERO, fontStyle: "italic",
                fontSize: 15, fontWeight: 600, color: GOLD,
                letterSpacing: "-0.3px", lineHeight: 1.2
              }}>ATLAS</div>
              <div style={{
                fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600,
                color: "rgba(255,255,255,0.5)", letterSpacing: "1.4px",
                textTransform: "uppercase", marginTop: 2,
                display: "flex", alignItems: "center", gap: 5
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#4ade80", boxShadow: "0 0 6px #4ade80", flexShrink: 0
                }} />
                Academy Advisor
              </div>
            </div>
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="atlas-msgs" style={{
            flex: 1, overflowY: "auto",
            padding: "18px 16px",
            display: "flex", flexDirection: "column", gap: 11
          }}>
            {msgs.map(m => (
              <div key={m.id} className="atlas-msg" style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "88%",
                display: "flex", gap: 7, alignItems: "flex-end"
              }}>
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
                <div style={{
                  padding: "10px 14px",
                  borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                  background: m.role === "user"
                    ? `linear-gradient(135deg, ${MAROON_LT}, ${MAROON})`
                    : "rgba(255,255,255,0.04)",
                  color: "#fff",
                  fontSize: 12.5,
                  fontFamily: FONT_BODY,
                  lineHeight: 1.65,
                  border: m.role === "user"
                    ? "1px solid rgba(247,172,65,0.2)"
                    : "1px solid rgba(255,255,255,0.07)",
                  borderLeft: m.role === "assistant" ? `2px solid rgba(247,172,65,0.45)` : undefined,
                }}>
                  {m.text.split("\n").map((line, i) => (
                    <div key={i} style={{ marginBottom: line ? 2 : 6 }}>
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

            {loading && (
              <div style={{ alignSelf: "flex-start", display: "flex", gap: 5, padding: "10px 14px" }}>
                {[0, 0.18, 0.36].map((delay, i) => (
                  <span key={i} style={{
                    width: 7, height: 7, borderRadius: "50%", background: GOLD,
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
              display: "flex", gap: 6, padding: "0 16px 8px",
              overflowX: "auto", flexShrink: 0, alignItems: "center"
            }}>
              {chips.map(chip => (
                <button key={chip} className="atlas-chip" onClick={() => handleSend(chip)}>
                  {chip}
                </button>
              ))}
              <button
                className="atlas-chip-more"
                onClick={() => setChipSet(s => s === 0 ? 1 : 0)}
                title="More topics"
              >
                {chipSet === 0 ? "More ›" : "‹ Back"}
              </button>
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: "12px 16px 16px",
            background: "rgba(80,0,11,0.12)",
            borderTop: "1px solid rgba(247,172,65,0.1)",
            display: "flex", alignItems: "center", gap: 12, flexShrink: 0
          }}>
            <input
              className="atlas-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Ask about our programs…"
            />
            <button
              onClick={() => handleSend()}
              style={{
                width: 38, height: 38, borderRadius: "50%", border: "none",
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                cursor: "pointer", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 14px rgba(247,172,65,0.35)`,
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = `0 6px 20px rgba(247,172,65,0.5)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = `0 4px 14px rgba(247,172,65,0.35)`; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div style={{
            padding: "6px 16px 10px",
            background: "rgba(80,0,11,0.12)",
            textAlign: "center",
            fontFamily: FONT_BODY, fontSize: 9, fontWeight: 600,
            color: "rgba(247,172,65,0.35)", letterSpacing: "1.8px",
            textTransform: "uppercase", flexShrink: 0
          }}>
            Wall Street Jr. Academy
          </div>

        </div>
      )}
    </>
  );
}
