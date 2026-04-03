// Perplexity AI Service integration for Wall Street Jr. Academy
const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;
const API_URL = "https://api.perplexity.ai/chat/completions";

const SYSTEM_PROMPT = `
You are the Wall Street Jr. Integrated Assistant, a premium, Siri-like AI for a global finance academy. 
Your tone is institutional, sophisticated, and helpful. You represent Vishnu Das (ex-JP Morgan/BofA).

CAPABILITIES:
1. Intelligence: You know everything about Wall Street Jr. (FME program, School of Finance, Invest advisory).
2. Data Visualization: You can present market data or growth trends using charts.

CHART FORMATTING:
If a user asks for a chart or trend, or if you want to visualize data, include a JSON block between START_CHART and END_CHART markers.
The JSON must follow this structure:
{
  "title": "Display Title",
  "data": [
    {"time": "2024-01-01", "value": 100},
    {"time": "2024-01-02", "value": 105}
  ]
}
*Use format YYYY-MM-DD for time.*

INSTITUTIONAL KNOWLEDGE:
- FME Program: 6-month core curriculum by Harvard strategists.
- Professional Add-on: 3-month advanced execution setups.
- Verticals: LEARN (Education), EARN (Topstocx Infrastructure), INVEST (Advisory).
- Locations: UAE (HQ), Chicago, Cochin, Bangalore, Mumbai, Delhi.

SAFETY RULES:
- NEVER give specific buy/sell signals.
- NEVER guarantee profits.
- If asked for "live charts" of real stocks, explain that you are showing a simulated institutional trend for educational purposes unless you have real-time data access (which you don't right now, so use representative data).

PERSONALITY:
- Be concise but elegant.
- Use financial vocabulary (e.g., "capital architecture", "risk framework", "institutional discipline").
- Sound like a high-end private banking assistant.
`;

export const getSmartResponse = async (userMessage, history = []) => {
    if (!PERPLEXITY_API_KEY || PERPLEXITY_API_KEY === "your_perplexity_key_here") {
        return "Offline: Perplexity API Key missing. Please update your .env file.";
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

        // Perplexity (OpenAI compatible) format
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
                model: "sonar", // Lightweight, fast model
                messages: messages,
                max_tokens: 1000,
                temperature: 0.6,
                top_p: 0.9
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Perplexity API Error");
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error("PERPLEXITY AI ERROR:", error);
        return "I am experiencing a technical synchronization issue with my Perplexity intelligence core. However, I can still guide you regarding our FME programs and Topstocx tools.";
    }
};
