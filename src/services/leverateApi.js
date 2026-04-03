// Leverate / Sirix ManagementService API
// All requests proxy through /api/leverate/* → Express backend → restapi-real.sirixtrader.com
// Bearer token is held server-side only (never exposed to the browser)

const BASE = '/api/leverate/api/ManagementService';

// Hours of history to fetch per timeframe period
const HOURS_BACK = {
  1: 4,       // 1m  → last 4 hours
  5: 12,      // 5m  → last 12 hours
  15: 24,     // 15m → last 24 hours
  60: 72,     // 1h  → last 3 days
  240: 168,   // 4h  → last 7 days
  1440: 720,  // 1D  → last 30 days
};

async function leveratePost(endpoint, body = {}) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err.error || `HTTP ${res.status}`), { status: res.status });
  }
  // Proxy may return null body for 204 No Content responses
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ─── Connection ───────────────────────────────────────────────

export async function ping() {
  await leveratePost('Ping');
  return true;
}

export async function getPlatformTime() {
  const data = await leveratePost('GetPlatformTime');
  return data?.PlatformTime ?? null;
}

// ─── Chart Data ───────────────────────────────────────────────

/**
 * Fetch OHLC candlestick bars.
 * @param {string} symbol      e.g. 'EURUSD'
 * @param {number} periodMinutes  1 | 5 | 15 | 60 | 240 | 1440
 * @param {number} [hoursBack] override default lookback window
 * @returns {Array<{High,Low,Open,Close,Volume,StartTime}>}
 */
export async function getChartBars(symbol, periodMinutes = 15, hoursBack) {
  const hours = hoursBack ?? HOURS_BACK[periodMinutes] ?? 24;
  const end = new Date();
  const start = new Date(end.getTime() - hours * 3_600_000);
  const data = await leveratePost('GetChartBars', {
    symbol,
    start: start.toISOString(),
    end: end.toISOString(),
    period: periodMinutes,
  });
  return data?.ChartBars ?? [];
}

// ─── Account ─────────────────────────────────────────────────

export async function getAccountBalance(userID) {
  const data = await leveratePost('GetAccountBalance', { userID });
  return data?.AccountBalance ?? null;
}

export async function getUser(userID) {
  const data = await leveratePost('GetUser', { userID });
  return data?.User ?? null;
}

export async function getUserVolume(userID) {
  const data = await leveratePost('GetUserVolume', { userID });
  return data?.UserVolume ?? null;
}

// ─── Positions ────────────────────────────────────────────────

export async function getOpenPositions(userID) {
  const data = await leveratePost('GetOpenPositionsForUser', { userID });
  return data?.OpenPositions ?? [];
}

export async function getClosedPositions(userID, hoursBack = 24) {
  const end = new Date();
  const start = new Date(end.getTime() - hoursBack * 3_600_000);
  const data = await leveratePost('GetClosedPositionsForUser', {
    userID,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  });
  return data?.ClosedPositions ?? [];
}

// ─── Instruments ──────────────────────────────────────────────

export async function getAllInstruments() {
  const data = await leveratePost('GetAllInstruments');
  return data?.Instruments ?? [];
}

export async function getInstrumentsForUser(userID) {
  const data = await leveratePost('GetInstrumentsForUser', { userID });
  return data?.Instruments ?? [];
}

export async function getInstrument(instrumentName) {
  const data = await leveratePost('GetInstrument', { instrumentName });
  return data?.Instrument ?? null;
}

// ─── Funds ────────────────────────────────────────────────────

export async function depositBalance(userID, amount, comment = '', subType = 0) {
  const data = await leveratePost('DepositBalanceWithResult', { userID, amount, comment, subType });
  return data?.OrderID ?? null;
}

export async function withdrawBalance(userID, amount, comment = '', subType = 0) {
  const data = await leveratePost('WithdrawBalanceWithResult', { userID, amount, comment, subType });
  return data?.OrderID ?? null;
}

// ─── Auth ─────────────────────────────────────────────────────

export async function verifyUser(userID, password) {
  const data = await leveratePost('VerifyUser', { userID, password });
  return data?.UserVerificationResult ?? null;
}
