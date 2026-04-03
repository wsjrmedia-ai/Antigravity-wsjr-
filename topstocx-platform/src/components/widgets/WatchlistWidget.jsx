import React, { useEffect, useRef, memo } from 'react';

const WatchlistWidget = () => {
    const container = useRef();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
    {
      "width": "100%",
      "height": "100%",
      "symbolsGroups": [
        {
          "name": "Stocks",
          "originalName": "Indices",
          "symbols": [
            { "name": "NASDAQ:AAPL" },
            { "name": "NASDAQ:TSLA" },
            { "name": "NASDAQ:NVDA" },
            { "name": "NASDAQ:MSFT" },
            { "name": "NASDAQ:AMZN" }
          ]
        },
        {
          "name": "Crypto",
          "originalName": "Futures",
          "symbols": [
            { "name": "BINANCE:BTCUSDT" },
            { "name": "BINANCE:ETHUSDT" },
            { "name": "BINANCE:SOLUSDT" },
            { "name": "BINANCE:BNBUSDT" }
          ]
        },
        {
          "name": "Forex",
          "originalName": "Forex",
          "symbols": [
            { "name": "FX:EURUSD" },
            { "name": "FX:GBPUSD" },
            { "name": "FX:USDJPY" }
          ]
        }
      ],
      "showSymbolLogo": true,
      "colorTheme": "dark",
      "isTransparent": true,
      "locale": "en"
    }`;
        container.current.appendChild(script);

        return () => {
            if (container.current) {
                container.current.innerHTML = "";
            }
        };
    }, []);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
};

export default memo(WatchlistWidget);
