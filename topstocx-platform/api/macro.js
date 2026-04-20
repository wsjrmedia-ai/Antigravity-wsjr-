// Fallback datasets for when World Bank API is too slow or down
const FALLBACKS = {
  INFLATION: {
    'United States of America': 3.1, 'Canada': 2.9, 'Mexico': 4.4,
    'United Kingdom': 4.0, 'Germany': 2.5, 'France': 2.9, 'Italy': 0.8,
    'China': 0.4, 'Japan': 2.2, 'India': 5.1, 'Australia': 4.1,
    'Brazil': 4.5, 'Russia': 7.4, 'South Africa': 5.3, 'Turkey': 64.9,
    'Argentina': 254.2
  },
  GDP_GROWTH: {
    'United States of America': 2.5, 'Canada': 1.1, 'Mexico': 1.5,
    'United Kingdom': 0.3, 'Germany': -0.3, 'France': 1.1, 'Italy': 0.7,
    'China': 5.2, 'Japan': 1.9, 'India': 7.6, 'Australia': 2.0,
    'Brazil': 2.9, 'Russia': 3.6, 'South Africa': 0.6, 'Turkey': 3.2,
    'Argentina': -1.6
  },
  INTEREST_RATES: {
    'United States of America': 5.33, 'Canada': 5.0, 'Mexico': 11.25,
    'United Kingdom': 5.25, 'Germany': 4.5, 'France': 4.5, 'Italy': 4.5,
    'China': 3.45, 'Japan': 0.1, 'India': 6.5, 'Australia': 4.35,
    'Brazil': 10.75, 'Russia': 16.0, 'South Africa': 8.25, 'Turkey': 42.5,
    'Argentina': 100.0
  },
  STOCKS: {
    // Stocks fluctuate daily; realistic mocks based on recent trends
    'United States of America': 0.34, 'Canada': -0.12, 'Mexico': 0.85,
    'United Kingdom': 0.42, 'Germany': -0.55, 'France': -0.21, 'Italy': 1.2,
    'China': -2.1, 'Japan': 1.85, 'India': 0.72, 'Australia': 0.1,
    'Brazil': -1.4, 'Russia': -2.4, 'South Africa': 0.55, 'Turkey': 2.8,
    'Argentina': -3.5
  }
};

const WORLD_BANK_URLS = {
  INFLATION: 'https://api.worldbank.org/v2/country/all/indicator/FP.CPI.TOTL.ZG?format=json&date=2022:2023&per_page=500',
  GDP: 'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.KD.ZG?format=json&date=2022:2023&per_page=500'
};

async function fetchWorldBankData(url, targetObject) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
    const data = await res.json();
    if (data && data[1] && Array.isArray(data[1])) {
      data[1].forEach(item => {
        if (item.value !== null) {
          const country = item.country.value === 'United States' ? 'United States of America' : item.country.value;
          // Only overwrite if we don't have a more recent (2023) value already parsed, since WB returns both years
          if (!targetObject[country] || item.date === '2023') {
            targetObject[country] = parseFloat(item.value.toFixed(2));
          }
        }
      });
      return true;
    }
  } catch (err) {
    console.warn(`World Bank fetch failed: ${err.message}`);
  }
  return false;
}

export default async function handler(req, res) {
  // Use Vercel Edge/CDN Caching: Cache for 24 hours (86400s). This prevents rate limits.
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const liveInflation = { ...FALLBACKS.INFLATION };
  const liveGdp = { ...FALLBACKS.GDP_GROWTH };

  // Fetch concurrently
  await Promise.allSettled([
    fetchWorldBankData(WORLD_BANK_URLS.INFLATION, liveInflation),
    fetchWorldBankData(WORLD_BANK_URLS.GDP, liveGdp)
  ]);

  // STOCKS and INTEREST_RATES usually require premium API keys (Bloomberg, TradingView, etc).
  // Falling back to smart mock data or static sets for these to maintain 100% free functionality.
  const liveInterests = { ...FALLBACKS.INTEREST_RATES };
  const liveStocks = { ...FALLBACKS.STOCKS };

  return res.status(200).json({
    INFLATION: liveInflation,
    GDP_GROWTH: liveGdp,
    INTEREST_RATES: liveInterests,
    STOCKS: liveStocks
  });
}
