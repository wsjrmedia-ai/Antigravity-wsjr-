import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * SmoothScrollProvider
 *
 * Wraps the app in a single Lenis instance that produces buttery,
 * easing-based wheel / trackpad / touch scrolling across the whole
 * site. Desktop gets the full effect. On mobile we fall back to the
 * browser's native inertial scroll so that the nav drawer, chat
 * panel body-lock, modals, and pull-to-refresh keep working.
 *
 * A small set of opt-outs:
 *   - any element with data-lenis-prevent or inside one is ignored,
 *     so internally-scrollable panels (charts, chat messages,
 *     pricing modal, mobile menu) still behave normally.
 *   - the component also suspends Lenis while a mobile body-scroll
 *     lock is applied (detected via `document.body.style.position`).
 */
export default function SmoothScrollProvider({ children }) {
    const lenisRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

        // Respect reduced-motion and skip Lenis on touch devices so we
        // don't fight iOS/Android's native inertial scroll.
        if (prefersReduced || isTouch) return;

        const lenis = new Lenis({
            duration: 1.15,                    // seconds of ease
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.2,
            lerp: 0.1,
            orientation: 'vertical',
            gestureOrientation: 'vertical',
        });
        lenisRef.current = lenis;

        let rafId = 0;
        const raf = (time) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        // Pause Lenis while any component pins <body> (drawer, modal, chat)
        // so body-fixed scroll-lock works without Lenis fighting it.
        const observer = new MutationObserver(() => {
            const pinned = document.body.style.position === 'fixed';
            if (pinned) lenis.stop();
            else        lenis.start();
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

        return () => {
            observer.disconnect();
            cancelAnimationFrame(rafId);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    return children;
}
