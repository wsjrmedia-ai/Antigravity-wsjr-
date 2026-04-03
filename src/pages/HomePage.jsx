import { useEffect, useRef } from 'react'
import EmblemAnimation from '../components/animations/EmblemAnimation'

// Components
import HeroSection from '../components/HeroSection'
import InstitutionalOverview from '../components/InstitutionalOverview'
import SchoolsHeader from '../components/SchoolsHeader'
import SchoolsSection from '../components/SchoolsSection'
import KeyMetrics from '../components/KeyMetrics'
import PhilosophySection from '../components/PhilosophySection'
import InstitutionalSignals from '../components/InstitutionalSignals'
import LearnBeyond from '../components/LearnBeyond'
import TravelLearn from '../components/TravelLearn'
const HomePage = () => {
    useEffect(() => {
        // SEO Initialization
        document.title = "Wall Street Jr. Academy | Where Finance Meets Real-World Mastery"
        let metaDesc = document.querySelector('meta[name="description"]')
        if (!metaDesc) {
            metaDesc = document.createElement('meta')
            metaDesc.name = "description"
            document.head.appendChild(metaDesc)
        }
        metaDesc.content = "UAE's premier multidisciplinary academy for finance, technology, design and management. Most finance courses teach you theory at Wall Street Jr. Academy we teach real world mastery."
    }, [])

    const scrollTrackerRef = useRef(null);

    return (
        <div style={{ background: 'var(--bg-primary)' }}>
            
            {/* Context wrapper grouping the sections where the Emblem should exist */}
            <div ref={scrollTrackerRef} style={{ position: 'relative' }}>
                <EmblemAnimation targetRef={scrollTrackerRef} />
                <HeroSection />
                <InstitutionalOverview />
                <SchoolsHeader />
            </div>

            {/* Everything below has zIndex: 10 so it naturally scrolls over the floating emblem if it drops too low */}
            <div style={{ position: 'relative', zIndex: 10 }}>
                <SchoolsSection />
                <KeyMetrics />
                <PhilosophySection />
                <InstitutionalSignals />
                <LearnBeyond />
                <TravelLearn />
            </div>
        </div>
    )
}

export default HomePage
