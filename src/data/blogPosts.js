// Blog posts for /blog and /blog/:slug.
//
// Each post is structured content rather than raw markdown so we can render
// without adding a markdown parser dependency. To add a new post, append an
// entry to BLOG_POSTS and run a build — the index, post page, and sitemap
// pick it up automatically.
//
// Schema:
//   slug       string   url-safe identifier, must be unique
//   title      string   H1, also used for the <title> tag
//   excerpt    string   1-2 sentence summary, used on the index card and as
//                       the meta description
//   date       string   ISO 8601 (YYYY-MM-DD)
//   author     string   display name
//   readTime   number   estimated minutes
//   tags       string[] short categories
//   sections   Section[] structured body
//
// Section types:
//   { type: 'heading',   level: 2|3,            text }
//   { type: 'paragraph', text }
//   { type: 'list',      items: string[],       ordered?: boolean }
//   { type: 'quote',     text,                  cite? }

export const BLOG_POSTS = [
    {
        slug: 'real-financial-markets-education-2026',
        title: 'What Real Financial Markets Education Looks Like in 2026',
        excerpt:
            'Theory-heavy programs are losing relevance. Modern finance education has to be built around the way real institutions actually allocate capital, manage risk, and make decisions under pressure.',
        date: '2026-04-22',
        author: 'Wall Street Jr. Editorial',
        readTime: 6,
        tags: ['Finance', 'Education', 'Markets'],
        sections: [
            {
                type: 'paragraph',
                text:
                    'For decades, finance was taught the same way: dense textbooks, abstract models, and exam questions that bore little resemblance to a trading desk or an investment committee. In 2026, that gap matters more than ever. Markets move on news, sentiment, liquidity, and policy in ways no static curriculum can capture — but the principles institutions use to navigate them are very much teachable.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'The shift from theory to operating frameworks',
            },
            {
                type: 'paragraph',
                text:
                    'A serious modern program has to do three things at once: ground students in foundational financial literacy, expose them to the real architecture of markets, and train them in the decision-making frameworks practitioners actually use. That means moving away from pure memorisation toward case-driven, scenario-based learning where students argue for a thesis, defend it, and review the outcome.',
            },
            {
                type: 'list',
                items: [
                    'Multi-timeframe execution rather than single-chart analysis',
                    'Risk-first thinking — sizing positions before picking them',
                    'Macro interpretation that connects rates, currencies, and equities',
                    'Live journaling and post-trade review as a habit, not a project',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Why institutional thinking belongs in the classroom',
            },
            {
                type: 'paragraph',
                text:
                    'Banks and funds train new analysts on a particular kind of mental discipline: how to size risk, how to think in distributions, how to argue for and against a position with equal rigor. Educational programs that copy this approach — instead of skirting around it — produce graduates who can step into a desk role and add value within months, not years.',
            },
            {
                type: 'quote',
                text:
                    'The most capable professionals of tomorrow will not be narrow specialists. They will be disciplined thinkers who understand how capital, technology, and human behaviour interact.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'What to look for in a finance program',
            },
            {
                type: 'list',
                ordered: true,
                items: [
                    'A faculty with operating experience, not only academic credentials',
                    'A signature lab or capstone tied to live markets',
                    'A curriculum that explicitly teaches risk before return',
                    'Clear professional pathways at the end of the program',
                ],
            },
            {
                type: 'paragraph',
                text:
                    'Education that takes finance seriously also takes its students seriously. The bar should be high — and the outcomes should be measurable.',
            },
        ],
    },

    {
        slug: 'ai-and-automation-in-finance-practical-guide',
        title: 'AI and Automation in Finance: A Practical Guide for Students',
        excerpt:
            'AI is already reshaping how analysts research, how operators build workflows, and how professionals make decisions. Here is what students entering finance and business in 2026 actually need to know.',
        date: '2026-04-15',
        author: 'Wall Street Jr. Editorial',
        readTime: 5,
        tags: ['AI', 'Automation', 'Careers'],
        sections: [
            {
                type: 'paragraph',
                text:
                    'AI is not a future trend in finance — it is the operating layer of the present. Research desks lean on language models for first-pass analysis. Operations teams replace status meetings with agent-generated summaries. Strategy leads use AI to pressure-test plans before they reach the room. For students, this raises a simple question: what do you actually need to learn?',
            },
            {
                type: 'heading',
                level: 2,
                text: 'The three layers of AI fluency',
            },
            {
                type: 'list',
                ordered: true,
                items: [
                    'Use — being able to drive AI tools well: prompting with constraints, verifying outputs, and refusing to copy-paste anything you cannot defend.',
                    'Build — designing simple agents and automations: triggers, tool-use, escalation, and audit logs that make a system trustworthy.',
                    'Integrate — placing AI inside a real workflow: which step it owns, what it cannot decide, and how a human stays in the loop.',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Where AI is already changing finance',
            },
            {
                type: 'paragraph',
                text:
                    'Equity research analysts use AI to compress 100-page filings into structured arguments. Trading teams run sentiment screens before market open. Operations teams replace ticket-by-ticket review with agent-driven triage. None of this replaces judgment — but it does replace the part of the job that used to be slow, manual, and forgettable.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'What to avoid',
            },
            {
                type: 'list',
                items: [
                    'Treating AI output as truth without verification',
                    'Building agents without escalation or a kill switch',
                    'Replacing real practice — like reading filings or watching markets — with summarisation',
                ],
            },
            {
                type: 'paragraph',
                text:
                    'A graduate who can build, deploy, and govern simple AI systems is a graduate who plugs into nearly any modern team. That is the skill profile worth training for.',
            },
        ],
    },

    {
        slug: 'multidisciplinary-education-beyond-a-single-subject',
        title: 'Multidisciplinary Education: Why Modern Careers Need More Than One Subject',
        excerpt:
            'The professionals leading the next decade are not specialists in one corner — they are operators who can read a balance sheet, ship an interface, and brief a model. Here is why.',
        date: '2026-04-08',
        author: 'Wall Street Jr. Editorial',
        readTime: 4,
        tags: ['Education', 'Careers', 'Strategy'],
        sections: [
            {
                type: 'paragraph',
                text:
                    'Walk into any modern operating team and you will find a strange truth: the people moving the work forward are rarely specialists in just one subject. The product lead understands unit economics. The operations head can prompt an agent. The analyst can sketch a dashboard from scratch. The borders between finance, technology, design, and management have softened — and the careers that benefit are the ones built across them.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'The hidden cost of narrow specialisation',
            },
            {
                type: 'paragraph',
                text:
                    'A finance graduate with no design instinct cannot communicate a thesis. A designer with no business literacy ships pretty work that misses the point. A developer with no operating context builds clever systems for problems that no longer exist. Each gap is a tax on impact.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'What a multidisciplinary education actually looks like',
            },
            {
                type: 'list',
                items: [
                    'A finance student who learns to design clear dashboards',
                    'An AI student who learns to read a P&L',
                    'A design student who learns to measure performance',
                    'A management student who learns to build automations',
                ],
            },
            {
                type: 'paragraph',
                text:
                    'None of this dilutes depth in a chosen field. It expands the surface area where that depth can be applied.',
            },
            {
                type: 'quote',
                text:
                    'Four schools. One integrated institution. Preparing you to think, interpret, and act with clarity in real-world environments.',
            },
        ],
    },
];

export const BLOG_TAGS = Array.from(
    new Set(BLOG_POSTS.flatMap((post) => post.tags))
).sort();

export const findPostBySlug = (slug) =>
    BLOG_POSTS.find((p) => p.slug === slug) || null;

export default BLOG_POSTS;
