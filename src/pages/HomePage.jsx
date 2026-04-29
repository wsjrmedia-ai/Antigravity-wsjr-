import { useRef } from 'react'
import EmblemAnimation from '../components/animations/EmblemAnimation'
import SEO from '../components/SEO'

// Components
import HeroSection from '../components/HeroSection'
import InstitutionalOverview from '../components/InstitutionalOverview'
import SchoolsHeader from '../components/SchoolsHeader'
import SchoolsSection from '../components/SchoolsSection'
import KeyMetrics from '../components/KeyMetrics'
import PhilosophySection from '../components/PhilosophySection'
import Leaderboard from '../components/Leaderboard'
import LearnBeyond from '../components/LearnBeyond'
import TravelLearn from '../components/TravelLearn'

const HOME_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wall Street Jr. Academy',
    url: 'https://wsjrschool.com/',
    potentialAction: {
        '@type': 'SearchAction',
        target: 'https://wsjrschool.com/programmes?q={search_term_string}',
        'query-input': 'required name=search_term_string',
    },
};

const HomePage = () => {
    const scrollTrackerRef = useRef(null);

    return (
        <div style={{ background: 'var(--bg-primary)' }}>
            <SEO
                description="Dubai-based global academy for Indian and UAE students. Practical, mentor-led courses in finance, AI, business intelligence, and design — built for real-world careers."
                path="/"
                schema={HOME_SCHEMA}
            />

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
                <Leaderboard />
                <LearnBeyond />
                <TravelLearn />
            </div>
        </div>
    )
}

export default HomePage
