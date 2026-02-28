import { useEffect, useState, useCallback } from 'react'

const CustomScrollbar = () => {
    const [scrollProgress, setScrollProgress] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [thumbHeight, setThumbHeight] = useState(40) // Default thumb height in px

    const handleScroll = useCallback(() => {
        // Show scrollbar
        setIsVisible(true)

        // Calculate progress
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
        const scrolled = (winScroll / height) * 100

        // Safety check for progress
        setScrollProgress(Math.min(Math.max(scrolled, 0), 100))

        // Set timeout to hide
        const timer = window.scrollTimer
        if (timer) clearTimeout(timer)

        window.scrollTimer = setTimeout(() => {
            setIsVisible(false)
        }, 1500)
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true })

        // Periodic check for window size or content changes
        const updateThumbHeight = () => {
            const containerHeight = (window.innerHeight * 0.6)
            const scrollHeight = document.documentElement.scrollHeight
            const viewHeight = document.documentElement.clientHeight
            const ratio = viewHeight / scrollHeight
            // Shorter thumb: max 15% of track, min 40px
            const newHeight = Math.min(Math.max(containerHeight * ratio, 40), containerHeight * 0.15)
            setThumbHeight(newHeight)
        }

        updateThumbHeight()
        window.addEventListener('resize', updateThumbHeight)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', updateThumbHeight)
            if (window.scrollTimer) clearTimeout(window.scrollTimer)
        }
    }, [handleScroll])

    // Track height is 60vh based on CSS
    const trackHeight = 60 // vh

    return (
        <div className={`custom-scrollbar-container ${isVisible ? 'visible' : ''}`}>
            <div
                className="custom-scrollbar-thumb"
                style={{
                    height: `${thumbHeight}px`,
                    transform: `translateY(${(scrollProgress / 100) * ((window.innerHeight * 0.6) - thumbHeight)}px)`
                }}
            />
        </div>
    )
}

export default CustomScrollbar
