import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const FloatingElements = () => {
    const containerRef = useRef(null)

    const AI_ROBOT_SVG = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="15" width="20" height="15" rx="2" stroke="#D4AF37" stroke-width="2"/>
            <circle cx="15" cy="20" r="2" fill="#D4AF37"/>
            <circle cx="25" cy="20" r="2" fill="#D4AF37"/>
            <path d="M15 25H25" stroke="#D4AF37" stroke-width="2"/>
            <path d="M20 15V10M17 10H23" stroke="#D4AF37" stroke-width="2"/>
            <path d="M10 20H7M30 20H33" stroke="#D4AF37" stroke-width="2"/>
            <circle cx="20" cy="22" r="8" stroke="#D4AF37" stroke-opacity="0.2" stroke-width="1"/>
        </svg>
    `

    const CHART_SVG = `
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 35L15 25L25 30L40 10L55 15" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="13" y="25" width="4" height="10" fill="#4CAF50" opacity="0.3"/>
            <rect x="23" y="30" width="4" height="5" fill="#4CAF50" opacity="0.3"/>
            <rect x="38" y="10" width="4" height="25" fill="#4CAF50" opacity="0.3"/>
            <circle cx="55" cy="15" r="3" fill="#4CAF50"/>
            <path d="M5 35H55" stroke="white" stroke-opacity="0.2" stroke-width="1"/>
        </svg>
    `

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const elements = []
        const count = 12

        for (let i = 0; i < count; i++) {
            const div = document.createElement('div')
            div.innerHTML = i % 2 === 0 ? AI_ROBOT_SVG : CHART_SVG
            div.style.position = 'absolute'
            div.style.left = `${Math.random() * 100}%`
            div.style.top = `${Math.random() * 100}%`
            div.style.opacity = '0'
            div.style.filter = 'blur(1px)'
            div.style.pointerEvents = 'none'
            div.style.transform = `scale(${0.5 + Math.random()})`
            container.appendChild(div)
            elements.push(div)

            // Animation
            gsap.set(div, {
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                rotation: Math.random() * 360,
                attr: { 'data-speed': 0.02 + Math.random() * 0.05 } // Parallax speed
            })

            gsap.to(div, {
                opacity: 0.4 + Math.random() * 0.4,
                duration: 2,
                delay: Math.random() * 2
            })

            // Float around
            gsap.to(div, {
                x: `+=${(Math.random() - 0.5) * 400}`,
                y: `+=${(Math.random() - 0.5) * 400}`,
                rotation: `+=${(Math.random() - 0.5) * 90}`,
                duration: 20 + Math.random() * 20,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            })
        }

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e
            const xPos = (clientX / window.innerWidth - 0.5) * 2
            const yPos = (clientY / window.innerHeight - 0.5) * 2

            elements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed'))
                gsap.to(el, {
                    x: `+=${xPos * speed * 50}`, // Move slightly based on mouse
                    y: `+=${yPos * speed * 50}`,
                    duration: 1,
                    ease: "power2.out",
                    overwrite: 'auto' // Allow overwriting the float animation temporarily
                })
            })
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            elements.forEach(el => el.remove())
        }
    }, [])

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                zIndex: 1,
                pointerEvents: 'none'
            }}
        />
    )
}

export default FloatingElements
