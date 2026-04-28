import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * AnalyticsTracker — fire GA4 page_view on every SPA route change.
 *
 * Why we need this: the gtag config call in index.html is set with
 * `send_page_view: false`, because GA4's automatic pageview only fires
 * on full page loads. In a React Router SPA, navigating from /home to
 * /school-of-finance never reloads the document — gtag would never
 * see it. We listen to location changes and dispatch the event
 * ourselves, with the title pulled after Helmet has had a tick to
 * update it (otherwise we report the previous page's title).
 */
const AnalyticsTracker = () => {
    const location = useLocation()

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

        // Wait one tick for Helmet to flush the new <title> before
        // sending the event — otherwise the report attributes the new
        // pageview to the previous page's title.
        const id = window.requestAnimationFrame(() => {
            window.gtag('event', 'page_view', {
                page_path: location.pathname + location.search,
                page_location: window.location.href,
                page_title: document.title,
            })
        })
        return () => window.cancelAnimationFrame(id)
    }, [location.pathname, location.search])

    return null
}

export default AnalyticsTracker
