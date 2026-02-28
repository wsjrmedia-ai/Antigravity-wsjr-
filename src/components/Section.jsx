import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Section = ({ children, className = '', id = '', style = {} }) => {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Fade in up animation for all direct children
            /*
            gsap.from(sectionRef.current.children, {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%", // Triggers when top of section hits 70% of viewport
                    toggleActions: "play none none reverse"
                }
            })
            */
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            id={id}
            ref={sectionRef}
            className={className}
            style={{
                minHeight: '100vh',
                padding: '0 2rem var(--section-spacing) 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                ...style // Spread passed styles
            }}
        >
            {children}
        </section>
    )
}

export default Section
