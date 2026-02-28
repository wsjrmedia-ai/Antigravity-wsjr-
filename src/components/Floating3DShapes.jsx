import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const Floating3DShapes = () => {
    const containerRef = useRef(null)
    const shapesRef = useRef([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Floating animation (always running)
            shapesRef.current.forEach((shape, i) => {
                gsap.to(shape, {
                    y: '+=20',
                    rotation: '+=10',
                    duration: 2 + i,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut"
                })
            })

            // Scroll-driven rotation and parallax
            gsap.to(shapesRef.current, {
                rotationY: 360,
                rotationX: 180,
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1
                }
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    const shapes = [
        { type: 'cube', top: '20%', left: '10%', size: 60, color: 'rgba(212, 175, 55, 0.2)' },
        { type: 'pyramid', top: '40%', right: '15%', size: 80, color: 'rgba(0, 35, 102, 0.2)' },
        { type: 'cube', top: '70%', left: '20%', size: 50, color: 'rgba(255, 255, 255, 0.1)' },
        { type: 'pyramid', top: '85%', right: '10%', size: 70, color: 'rgba(212, 175, 55, 0.15)' }
    ]

    return (
        <div ref={containerRef} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
            perspective: '1000px'
        }}>
            {shapes.map((shape, i) => (
                <div
                    key={i}
                    ref={el => shapesRef.current[i] = el}
                    style={{
                        position: 'absolute',
                        top: shape.top,
                        left: shape.left,
                        right: shape.right,
                        width: shape.size,
                        height: shape.size,
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* CSS 3D Cube Construction */}
                    {shape.type === 'cube' && (
                        <>
                            <div style={{ ...faceStyle, transform: `rotateY(0deg) translateZ(${shape.size / 2}px)`, border: `1px solid ${shape.color}` }} />
                            <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${shape.size / 2}px)`, border: `1px solid ${shape.color}` }} />
                            <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${shape.size / 2}px)`, border: `1px solid ${shape.color}` }} />
                            <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${shape.size / 2}px)`, border: `1px solid ${shape.color}` }} />
                            <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${shape.size / 2}px)`, border: `1px solid ${shape.color}` }} />
                            <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${shape.size / 2}px)`, border: `1px solid ${shape.color}` }} />
                        </>
                    )}

                    {/* Simple Pyramid/Triangle Construction */}
                    {shape.type === 'pyramid' && (
                        <div style={{
                            width: 0,
                            height: 0,
                            borderLeft: `${shape.size / 2}px solid transparent`,
                            borderRight: `${shape.size / 2}px solid transparent`,
                            borderBottom: `${shape.size}px solid ${shape.color}`,
                            transform: 'rotateX(20deg)'
                        }} />
                    )}
                </div>
            ))}
        </div>
    )
}

const faceStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'visible',
    background: 'transparent'
}

export default Floating3DShapes
