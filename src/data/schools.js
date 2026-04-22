// Structured content for each of the four WSJr schools.
// Used by `src/pages/SchoolProgramPage.jsx` and cross-referenced by
// `src/components/SchoolsSection.jsx` to route the "EXPLORE PROGRAM →" CTA.

export const schools = {
  sof: {
    id: 'sof',
    slug: 'school-of-finance',
    path: '/school-of-finance',
    acronym: 'SOF',
    name: 'Wall Street Jr. School of Finance',
    tagline: 'Mastering Markets, Valuation & Capital Allocation',
    color: '#50000B',
    accent: '#F7AC41',
    image: '/images/figma/school-finance.jpg',
    intro:
      'The Wall Street Jr. School of Finance is built for students who want to understand how financial markets actually operate — how capital moves, how prices form, how risk is priced, and how professionals build portfolios with clarity and discipline. The program trains students to think like institutional investors while giving them the ability to trade and manage capital across short-term and long-term horizons. It combines market structure, strategy, risk management, and portfolio building into one complete program.',
    focus:
      'Financial Markets, Trading (Short-term & Long-term), and Institutional Thinking for Portfolio and Wealth Building.',
    coreAreas: [
      {
        title: 'Foundations of Financial Literacy',
        desc: 'Money mechanics, financial systems, personal wealth principles, and the language of finance.',
      },
      {
        title: 'Market Structure & Instruments',
        desc: 'Equities, indices, commodities, currencies, derivatives, and the architecture of modern markets.',
      },
      {
        title: 'Risk Management',
        desc: 'Position sizing, exposure control, drawdown discipline, portfolio hedging and institutional risk frameworks.',
      },
      {
        title: 'Technical Analysis',
        desc: 'Price structure, order flow concepts, execution models and multi-timeframe analysis.',
      },
      {
        title: 'Fundamental & Macro Analysis',
        desc: 'Interpreting economies, interest rates, earnings and global macro for directional conviction.',
      },
      {
        title: 'Investment & Portfolio Building',
        desc: 'Long-term wealth strategy, asset allocation, rebalancing and performance measurement.',
      },
      {
        title: 'Trading Psychology & Decision Systems',
        desc: 'Emotional control, conviction, process discipline and the behaviour behind consistent performance.',
      },
      {
        title: 'Professional Tracking & Performance',
        desc: 'Building a track record, reporting, journaling and the systems professionals use to improve.',
      },
    ],
    pathways: [
      'Trader (short-term, swing, long-term)',
      'Investment & Portfolio Associate',
      'Market Research Analyst',
      'Risk & Performance Analyst',
      'Finance Educator / Strategist',
    ],
    signatureLab: {
      name: 'Weekly Institutional Strategies Lab',
      desc:
        'A dedicated weekly lab where students are exposed to live market behaviour, decision frameworks, and the way banks and institutions approach risk, liquidity and session behaviour. Focus areas include multi-timeframe confluence, scenario planning, structured execution, post-trade review and institutional-style desk workflows.',
    },
  },

  sot: {
    id: 'sot',
    slug: 'school-of-technology',
    path: '/school-of-technology',
    acronym: 'SOT',
    name: 'Wall Street Jr. School of AI & Automation',
    tagline: 'Building the Future with AI, Agents & Workflow Automation',
    color: '#003E62',
    accent: '#F7AC41',
    image: '/images/figma/bg-qatar-museum.jpg',
    intro:
      'The Wall Street Jr. School of AI & Automation is designed for students who want to understand and use AI in real, practical ways. It goes beyond surface-level tools and trains students to simplify work, build intelligent agents, automate operations and integrate AI into every major profession — from finance and business to marketing, research and operations. The program prepares students to become high-performing professionals in a world where AI is the new workforce multiplier.',
    focus:
      'Using AI and Automation to simplify work, design intelligent agents and modernise operations across industries.',
    coreAreas: [
      {
        title: 'Foundations of Artificial Intelligence',
        desc: 'How modern AI works, where it fits, and how to reason about its capabilities and limits.',
      },
      {
        title: 'Prompting & AI Communication',
        desc: 'Structured prompting, system design, context engineering and evaluation.',
      },
      {
        title: 'AI for Research, Writing & Decision Support',
        desc: 'Using AI to accelerate reports, briefs, analysis and executive decision-making.',
      },
      {
        title: 'AI for Data & Analytics',
        desc: 'Data cleaning, interpretation, dashboards and AI-assisted analysis for operators.',
      },
      {
        title: 'Workflow Automation',
        desc: 'Designing pipelines across tools that remove manual work and create leverage.',
      },
      {
        title: 'Agent Building Fundamentals',
        desc: 'Task decomposition, tool-use, memory, guardrails and reliable autonomous agents.',
      },
      {
        title: 'AI Integration Across Professions',
        desc: 'Applied patterns for HR, marketing, finance, operations and client-facing teams.',
      },
    ],
    pathways: [
      'AI & Automation Specialist',
      'Agent & Workflow Designer',
      'Research & Productivity Analyst',
      'Business Automation Consultant',
      'AI Systems Operator',
    ],
    signatureLab: {
      name: 'Agent Builder Studio',
      desc:
        'A focused lab where every student builds 2–3 working AI agents — typically a Research Agent, an Operations Agent and a Sales/Outreach Agent — complete with guardrails, escalation paths and audit logs. Students leave with a portfolio of real, deployable automations and the architectural instincts to design new ones.',
    },
  },

  sod: {
    id: 'sod',
    slug: 'school-of-design',
    path: '/school-of-design',
    acronym: 'SOD',
    name: 'Wall Street Jr. School of Design Intelligence & Media',
    tagline: 'Crafting Experiences, Brands & Content That Shape Behaviour',
    color: '#040001',
    accent: '#F7AC41',
    image: '/images/figma/school-design.jpg',
    intro:
      'The Wall Street Jr. School of Design Intelligence & Media is built for students who want to shape how the world sees, experiences and interacts with brands. It combines design thinking, digital media, AI-assisted content pipelines and modern storytelling into a single professional program. Students learn how to build content systems, design products and communicate ideas at a high level — with a strong emphasis on clarity, aesthetics and intentional execution.',
    focus:
      'Design systems, digital media and AI-assisted content pipelines for high-performance brands.',
    coreAreas: [
      {
        title: 'Foundations of Visual Communication',
        desc: 'Composition, hierarchy, colour, type and the principles that make design work.',
      },
      {
        title: 'Digital Media Production',
        desc: 'Short-form, long-form, podcasts, reels and the grammar of attention across platforms.',
      },
      {
        title: 'UX / UI Fundamentals',
        desc: 'Interface design, flows, usability and product thinking for real users.',
      },
      {
        title: 'Brand & Narrative Design',
        desc: 'Positioning, tone, story and the identity systems that carry a brand forward.',
      },
      {
        title: 'Content Systems & Operations',
        desc: 'Turning content from a task into a machine — calendars, approvals and performance loops.',
      },
      {
        title: 'AI Integration for Creative Production',
        desc: 'Using AI across ideation, design, writing, video and motion without losing craft.',
      },
    ],
    pathways: [
      'Content Systems Designer',
      'Brand & Communication Coordinator',
      'Digital Media Operations Lead',
      'UX / UI Designer',
      'AI-Enabled Creative Workflow Specialist',
    ],
    signatureLab: {
      name: 'Digital Media Factory',
      desc:
        'A production-grade lab where students build their own content pipeline: brief → script → design → publish → report. Students operate with real workflows, approval chains and performance tracking — the way a modern in-house media team actually runs.',
    },
  },

  som: {
    id: 'som',
    slug: 'school-of-management',
    path: '/school-of-management',
    acronym: 'SOM',
    name: 'Wall Street Jr. School of Business Intelligence & Management',
    tagline: 'Leading Businesses Through Strategy, Systems & Execution',
    color: '#50000B',
    accent: '#F7AC41',
    image: '/images/figma/school-management.jpg',
    intro:
      'The Wall Street Jr. School of Business Intelligence & Management is designed for students who want to understand how businesses actually operate — how decisions are made, how performance is measured, and how strategy is turned into execution. The program blends foundational business thinking with modern operations, analytics and AI-supported decision making. Students learn how to think like operators, build systems, solve problems and lead teams in a high-performance environment.',
    focus:
      'How businesses operate, measure performance and turn strategy into execution.',
    coreAreas: [
      {
        title: 'Foundations of Business Systems',
        desc: 'How a business is structured, how value is created, and how every function fits together.',
      },
      {
        title: 'Business Performance & KPI Design',
        desc: 'Designing scorecards, dashboards and the metrics that actually drive the business.',
      },
      {
        title: 'Strategy Development & Execution',
        desc: 'From company goals to quarterly plans, OKRs and accountable delivery.',
      },
      {
        title: 'Operational Efficiency & Process Design',
        desc: 'SOPs, bottleneck analysis and building repeatable, scalable operations.',
      },
      {
        title: 'Market Research & Business Analysis',
        desc: 'Customer, competitor and category analysis to drive decisions with evidence.',
      },
      {
        title: 'Technology & AI Integration for Operations',
        desc: 'Where to plug AI, automation and modern tools into the operating model.',
      },
    ],
    pathways: [
      'Business Operations Analyst',
      'Strategy & Execution Associate',
      'Performance / KPI Manager',
      'Process Improvement Lead',
      'Business Intelligence Coordinator',
    ],
    signatureLab: {
      name: 'Business Operating System Capstone',
      desc:
        'A capstone lab where students design a complete Business Operating System: KPI scorecards, review cadences, SOP libraries and a 90-day execution plan for a real or simulated organisation. Students leave with a playbook they can carry into any operating role.',
    },
  },
};

export const schoolsList = Object.values(schools);

export default schools;
