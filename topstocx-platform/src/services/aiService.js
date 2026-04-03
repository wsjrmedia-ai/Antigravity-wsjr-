// Perplexity AI Service integration for Topstocx Platform
const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;
const API_URL = "https://api.perplexity.ai/chat/completions";

const SYSTEM_PROMPT = `
You are the Topstocx Platform Intelligence Assistant, the EARN vertical of the Wall Street Jr. Integrated Ecosystem. 
You are a premium, Siri-like AI designed to guide users through our advanced market infrastructure.

CHART FORMATTING:
If a user asks for a chart or trend, include a JSON block between START_CHART and END_CHART markers.
The JSON must follow this structure:
{
  "title": "Display Title",
  "data": [
    {"time": "2024-01-01", "value": 100},
    {"time": "2024-01-02", "value": 105}
  ]
}
*Use format YYYY-MM-DD for time.*

PLATFORM CONTEXT:
- FEATURES: Supercharts (100+ indicators), Real-time Data, Global Trading Hub, Multi-Asset Screeners.
- USERS: Serving over 100 million traders and 60 million active community members.
- ARCHITECT: Led by Vishnu Das (ex-JP Morgan/BofA).
- ECOSYSTEM: Guide users seeking education to the School of Finance (http://localhost:5173).
- ADVISORY: Users with >$50k capital should be directed to our INVEST vertical.

SAFETY RULES:
- NEVER give specific buy/sell signals.
- NEVER guarantee profits.
- If asked for "live charts" of real stocks, use representative institutional trend data to demonstrate the capability.

TONE:
- Technical, institutional, and highly professional.
- Use Siri-like, helpful, and concise language.
`;

export const getSmartResponse = async (userMessage, history = []) => {
    if (!PERPLEXITY_API_KEY || PERPLEXITY_API_KEY === "your_perplexity_key_here") {
        return "I am currently in 'Offline Mode'. Please configure the Perplexity API key in your .env file to enable platform intelligence.";
    }

    try {
        const validMsgs = (history || []).filter(msg => msg.text && typeof msg.text === 'string');

        // Extract raw messages and force them to alternate starting from user
        let messageLog = [];
        validMsgs.forEach(msg => {
            messageLog.push({
                role: msg.type === 'user' ? "user" : "assistant",
                content: msg.text
            });
        });
        messageLog.push({ role: "user", content: userMessage });

        let builtMessages = [];
        messageLog.forEach(m => {
            if (builtMessages.length === 0) {
                if (m.role === "user") builtMessages.push(m);
                // skip if first message is assistant
            } else {
                if (builtMessages[builtMessages.length - 1].role === m.role) {
                    builtMessages[builtMessages.length - 1].content += "\n" + m.content;
                } else {
                    builtMessages.push(m);
                }
            }
        });

        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...builtMessages
        ];

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "sonar",
                messages: messages,
                max_tokens: 800,
                temperature: 0.6
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Perplexity API Error");
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error("AI Service Error:", error);
        return "I am recalibrating my Perplexity market intelligence systems. Regarding our infrastructure: we provide professional charting and applied market tools.";
    }
};
