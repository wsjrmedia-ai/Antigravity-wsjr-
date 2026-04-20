import { createContext, useContext, useState } from 'react';

const PlanContext = createContext();

export const PLANS = {
    free: {
        id: 'free',
        label: 'Free',
        price: '$0',
        period: 'forever',
        color: '#4a7a9a',
        glow: '#4a7a9a33',
        badge: null,
        features: [
            'Technical analysis chatbot',
            'Live chart view in chat',
            'Basic support/resistance levels',
            'Community access',
            '5 AI queries/day',
        ],
        missing: [
            'Geo-political & macro context',
            'Ranked trade setups (🥇🥈🥉)',
            'Sentiment & news catalyst scan',
            'Elliott Wave + Fibonacci analysis',
            'Multi-timeframe institutional TA',
        ],
    },
    pro: {
        id: 'pro',
        label: 'Pro',
        price: '$29',
        period: '/month',
        color: '#005AFF',
        glow: '#005AFF44',
        badge: 'MOST POPULAR',
        features: [
            'Everything in Free',
            '🏦 JP Morgan-grade institutional analysis',
            'Geo-political & macro context',
            'Market sentiment scan (VIX, COT)',
            'News & catalyst rating (Bull/Bear/Neutral)',
            'Full multi-timeframe TA (Weekly → 15M)',
            'Elliott Wave + Fibonacci levels',
            '🥇🥈🥉 Ranked trade setups with R:R',
            'Key catalysts to watch',
            'Unlimited AI queries',
        ],
        missing: [],
    },
    ultimate: {
        id: 'ultimate',
        label: 'Ultimate',
        price: '$79',
        period: '/month',
        color: '#d4af37',
        glow: '#d4af3744',
        badge: 'INSTITUTIONAL',
        features: [
            'Everything in Pro',
            '🌐 Real-time data integration',
            'Portfolio risk analysis',
            'Custom watchlist alerts',
            'Dedicated market strategist session',
            'Early access to new features',
            'Priority support',
            'API access',
        ],
        missing: [],
    },
};

export function PlanProvider({ children }) {
    const [userPlan, setUserPlan] = useState('free');
    const [showPricing, setShowPricing] = useState(false);

    const isPro = userPlan === 'pro' || userPlan === 'ultimate';

    return (
        <PlanContext.Provider value={{ userPlan, setUserPlan, isPro, showPricing, setShowPricing }}>
            {children}
        </PlanContext.Provider>
    );
}

export function usePlan() {
    return useContext(PlanContext);
}
