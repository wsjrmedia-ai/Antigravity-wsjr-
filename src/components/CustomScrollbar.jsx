import { useEffect, useState, useCallback, useRef } from 'react'

const CustomScrollbar = () => {
    const [scrollProgress, setScrollProgress] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [thumbHeight, setThumbHeight] = useState(40)
    const [isDragging, setIsDragging] = useState(false)
    
    const trackRef = useRef(null)
    const isDraggingRef = useRef(false)
    const dragStartY = useRef(0)
    const dragStartScrollY = useRef(0)
    const hideTimeoutRef = useRef(null)

    const handleScroll = useCallback(() => {
        setIsVisible(true)

        const winScroll = document.documentElement.scrollTop || document.body.scrollTop
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
        const scrolled = (winScroll / height) * 100

        setScrollProgress(Math.min(Math.max(scrolled, 0), 100))

        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)

        if (!isDraggingRef.current) {
            hideTimeoutRef.current = setTimeout(() => {
                setIsVisible(false)
            }, 1500)
        }
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true })

        const updateThumbHeight = () => {
            const containerHeight = (window.innerHeight * 0.6)
            const scrollHeight = document.documentElement.scrollHeight
            const viewHeight = document.documentElement.clientHeight
            const ratio = viewHeight / scrollHeight
            // Shorter thumb: max 15% of track, min 30px
            const newHeight = Math.min(Math.max(containerHeight * ratio, 30), containerHeight * 0.15)
            setThumbHeight(newHeight)
        }

        updateThumbHeight()
        window.addEventListener('resize', updateThumbHeight)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', updateThumbHeight)
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
        }
    }, [handleScroll])

    // Handle Dragging
    const handlePointerDown = (e) => {
        e.stopPropagation()
        isDraggingRef.current = true
        setIsDragging(true)
        dragStartY.current = e.clientY
        dragStartScrollY.current = document.documentElement.scrollTop || document.body.scrollTop
        
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
        
        document.body.style.userSelect = 'none' // prevent text selection while dragging
    }

    useEffect(() => {
        const handlePointerMove = (e) => {
            if (!isDraggingRef.current || !trackRef.current) return
            
            const trackRect = trackRef.current.getBoundingClientRect()
            const trackAvailableHeight = trackRect.height - thumbHeight
            const scrollableHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
            
            const deltaY = e.clientY - dragStartY.current
            const progressDelta = deltaY / trackAvailableHeight
            const scrollDelta = progressDelta * scrollableHeight
            
            window.scrollTo({
                top: dragStartScrollY.current + scrollDelta,
                behavior: 'instant' // prevent smooth scroll fighting with lenis
            })
        }

        const handlePointerUp = () => {
            if (isDraggingRef.current) {
                isDraggingRef.current = false
                setIsDragging(false)
                document.body.style.userSelect = ''
                handleScroll() // Trigger hide timeout
            }
        }

        window.addEventListener('pointermove', handlePointerMove)
        window.addEventListener('pointerup', handlePointerUp)

        return () => {
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerup', handlePointerUp)
        }
    }, [thumbHeight, handleScroll])

    const handleTrackClick = (e) => {
        if (isDraggingRef.current || e.target.classList.contains('custom-scrollbar-thumb')) return
        
        const trackRect = trackRef.current.getBoundingClientRect()
        const clickY = e.clientY - trackRect.top
        
        // clickY represents the center of where we want the thumb to be
        const targetProgress = Math.max(0, Math.min(1, (clickY - thumbHeight / 2) / (trackRect.height - thumbHeight)))
        const scrollableHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
        
        window.scrollTo({
            top: targetProgress * scrollableHeight,
            behavior: 'smooth'
        })
    }

    return (
        <div 
            ref={trackRef}
            className={`custom-scrollbar-container ${isVisible || isDragging ? 'visible' : ''}`}
            onPointerDown={handleTrackClick}
            style={{ touchAction: 'none' }} // avoid mobile scrolling interference
        >
            <div
                className="custom-scrollbar-thumb"
                onPointerDown={handlePointerDown}
                style={{
                    height: `${thumbHeight}px`,
                    transform: `translateY(${(scrollProgress / 100) * ((window.innerHeight * 0.6) - thumbHeight)}px)`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.2s, background 0.2s',
                    width: isDragging ? '6px' : '100%',
                    marginLeft: isDragging ? '-1.5px' : '0',
                    background: isDragging ? 'var(--accent-gold-light)' : 'var(--accent-gold)'
                }}
            />
        </div>
    )
}

export default CustomScrollbar
