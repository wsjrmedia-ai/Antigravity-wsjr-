import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Components
import HeroSection from '../components/HeroSection'
import InstitutionalOverview from '../components/InstitutionalOverview'
import TrustedBy from '../components/TrustedBy'
import SchoolPreview from '../components/SchoolPreview'
import KeyMetrics from '../components/KeyMetrics'
import Foundation from '../components/Foundation'
import Locations from '../components/Locations'
import Signals from '../components/Signals'
import Community from '../components/Community'

gsap.registerPlugin(ScrollTrigger)

const HomePage = () => {
    const mainRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray('.stack-section')

            sections.forEach((section, i) => {
                if (i === sections.length - 1) return

                const inner = section.querySelector('.stack-inner') || section

                gsap.to(inner, {
                    scale: 0.9,
                    opacity: 0,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                        pin: true,
                        pinSpacing: false,
                        anticipatePin: 1
                    }
                })
            })
        }, mainRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={mainRef} style={{ background: 'var(--bg-primary)' }}>
            <div className="stack-section" style={{ zIndex: 10 }}>
                <div className="stack-inner"><HeroSection /></div>
            </div>
            <div className="stack-section" style={{ zIndex: 9 }}>
                <div className="stack-inner"><InstitutionalOverview /></div>
            </div>
            <div className="stack-section" style={{ zIndex: 8 }}>
                <div className="stack-inner"><TrustedBy /></div>
            </div>
            <div className="stack-section" style={{ zIndex: 7 }}>
                <div className="stack-inner"><SchoolPreview /></div>
            </div>
            <div className="stack-section" style={{ zIndex: 6 }}>
                <div className="stack-inner"><KeyMetrics /></div>
            </div>
            <div className="stack-section" style={{ zIndex: 5 }}>
                <div className="stack-inner"><Foundation /></div>
            </div>
            <div className="stack-section" style={{ zIndex: 4 }}>
                <div className="stack-inner"><Locations /></div>
            </div>
            <div className="stack-section" style={{ zIndex: 3 }}>
                <div className="stack-inner"><Signals /></div>
            </div>
            <div className="stack-section last-section" style={{ zIndex: 2 }}>
                <div className="stack-inner"><Community /></div>
            </div>
        </div>
    )
}

export default HomePage
