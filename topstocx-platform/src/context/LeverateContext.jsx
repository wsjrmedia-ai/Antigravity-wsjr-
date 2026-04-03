import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { leverateApi } from '../services/leverateApi';

const LeverateContext = createContext();

export const LeverateProvider = ({ children }) => {
    const [userID, setUserID] = useState('12345'); // Default demo userID
    const [balance, setBalance] = useState({ balance: 0, equity: 0, freeMargin: 0 });
    const [positions, setPositions] = useState([]);
    const [marketSummary, setMarketSummary] = useState({ indices: [], forex: [], crypto: [] });
    const [connected, setConnected] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
    const [selectedPeriod, setSelectedPeriod] = useState(15);

    const refreshData = useCallback(async () => {
        if (!userID) return;

        try {
            const [balData, posData, allInst] = await Promise.all([
                leverateApi.getAccountBalance(userID),
                leverateApi.getOpenPositions(userID),
                leverateApi.getAllInstruments()
            ]);

            // If we get balance or instruments, we are "connected"
            if (balData || (allInst && allInst.length > 0)) {
                setConnected(true);
            }

            if (balData) {
                setBalance({
                    balance: balData.Balance || 0,
                    equity: balData.Equity || 0,
                    freeMargin: balData.FreeMargin || 0
                });
            }

            if (posData) {
                setPositions(posData);
            }

            if (allInst && allInst.length > 0) {
                // Categorize instruments for various blocks
                setMarketSummary({
                    indices: allInst.filter(i => i.SecurityGroupName === 'Indices' || i.AssetClass === 'Indices').slice(0, 8),
                    forex: allInst.filter(i => i.SecurityGroupName === 'Forex' || i.AssetClass === 'Forex').slice(0, 8),
                    crypto: allInst.filter(i => i.SecurityGroupName === 'Crypto' || i.AssetClass === 'Crypto').slice(0, 8),
                    all: allInst
                });
            }
        } catch (err) {
            console.error('[LeverateContext] Refresh failed:', err);
            setConnected(false);
        }
    }, [userID]);

    useEffect(() => {
        // We now always attempt to refresh to allow fallback/demo data to show
        // but we respect the config if it's explicitly false
        const config = import.meta.env.VITE_LEVERATE_CONFIGURED;
        if (config === 'false') {
            console.info('[Leverate] Explicitly disabled in .env');
            return;
        }

        // Initial Fetch
        refreshData();

        // Polling loop (every 10 seconds for less noise)
        const interval = setInterval(refreshData, 10000);

        return () => clearInterval(interval);
    }, [refreshData]);

    return (
        <LeverateContext.Provider value={{
            userID, setUserID,
            balance, positions, marketSummary,
            connected,
            selectedSymbol, setSelectedSymbol,
            selectedPeriod, setSelectedPeriod,
            refreshData
        }}>
            {children}
        </LeverateContext.Provider>
    );
};

export const useLeverate = () => {
    const context = useContext(LeverateContext);
    if (!context) {
        throw new Error('useLeverate must be used within a LeverateProvider');
    }
    return context;
};
