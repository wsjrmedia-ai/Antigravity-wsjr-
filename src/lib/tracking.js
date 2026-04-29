// Attribution helpers — capture UTMs + referrer on first landing,
// persist for the session, and surface them at form-submit time so
// the lead row in Supabase carries its source. Pairs with the GA4
// `generate_lead` event in EnrollPage.

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
const STORAGE_KEY = 'wsjr_attribution_v1'

function safeStorage() {
  try { return window.sessionStorage } catch { return null }
}

// Read UTMs from the current URL on first landing and persist to
// sessionStorage. On subsequent navigations, returns the originally
// captured values so attribution is sticky across the funnel.
export function captureAttribution() {
  if (typeof window === 'undefined') return {}
  const store = safeStorage()
  const existing = store ? store.getItem(STORAGE_KEY) : null
  if (existing) {
    try { return JSON.parse(existing) } catch { /* fall through */ }
  }

  const params = new URLSearchParams(window.location.search)
  const data = {}
  UTM_KEYS.forEach(k => {
    const v = params.get(k)
    if (v) data[k] = v.slice(0, 200)
  })
  data.referrer = document.referrer || null
  data.landing_page = window.location.pathname + window.location.search

  if (store) store.setItem(STORAGE_KEY, JSON.stringify(data))
  return data
}

export function getAttribution() {
  if (typeof window === 'undefined') return {}
  const store = safeStorage()
  const raw = store ? store.getItem(STORAGE_KEY) : null
  if (!raw) return captureAttribution()
  try { return JSON.parse(raw) } catch { return {} }
}
