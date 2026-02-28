import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'
import { branches } from '../data/branches'

const Globe3D = () => {
    const canvasRef = useRef()
    const containerRef = useRef() // Ref for the container to get width
    const pointerInteracting = useRef(null)
    const pointerInteractionPos = useRef(null)
    const r = useRef(0)
    const labelsRef = useRef([]) // Refs for label elements

    useEffect(() => {
        let phi = 0
        let width = 0
        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth)
        window.addEventListener('resize', onResize)
        onResize()

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.0, 0.137, 0.4],
            markerColor: [0.83, 0.686, 0.216],
            glowColor: [0.0, 0.137, 0.6],
            markers: branches,
            onRender: (state) => {
                // Update globe rotation
                state.phi = r.current + phi
                phi += 0.005
                state.width = width * 2
                state.height = width * 2

                // Update labels
                const currentPhi = state.phi
                const globeRadius = width / 2
                const cx = width / 2
                const cy = width / 2

                branches.forEach((branch, i) => {
                    const label = labelsRef.current[i]
                    if (!label) return

                    const theta = branch.location[0] * Math.PI / 180
                    const phi = branch.location[1] * Math.PI / 180

                    // Derived from Cobe source code matrix math:
                    // x' = x cos(R) - z sin(R)
                    // x' = cos(L) cos(R) - sin(L) sin(R) = cos(L + R)
                    // This implies Longitude 0 starts at the RIGHT edge (x=1) in standard rendering?
                    // Let's test this alignment.

                    const x = Math.cos(theta) * Math.cos(phi + currentPhi)
                    const y = Math.sin(theta)
                    const z = Math.cos(theta) * Math.sin(phi + currentPhi) * -1.0 // z=sin(L+R) -> moving back

                    // Project to 2D
                    // Adjust y sign if needed based on coordinate system (cobe usually has y up?)
                    // Let's assume standard visual: +y is up (North), so screen y is inverted
                    const screenX = cx + x * globeRadius
                    const screenY = cy - y * globeRadius

                    // Update position
                    // Using translate(-50%, -100%) to position above the point
                    // Adding a small Y offset (-10px) to clear the marker
                    label.style.transform = `translate(${screenX}px, ${screenY}px) translate(-50%, -120%)`

                    // Visibility check based on z (depth)
                    if (z > 0) {
                        label.style.opacity = '1'
                        label.style.pointerEvents = 'auto'
                    } else {
                        label.style.opacity = '0'
                        label.style.pointerEvents = 'none'
                    }
                })
            }
        })

        return () => {
            globe.destroy()
            window.removeEventListener('resize', onResize)
        }
    }, [])

    return (
        <div className="globe-container" ref={containerRef} style={{
            width: '100%',
            maxWidth: '600px',
            aspectRatio: '1',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
            cursor: 'grab'
        }}
            onPointerDown={(e) => {
                pointerInteracting.current = e.clientX - (pointerInteractionPos.current || 0)
                canvasRef.current.style.cursor = 'grabbing'
            }}
            onPointerUp={() => {
                pointerInteracting.current = null
                canvasRef.current.style.cursor = 'grab'
            }}
            onPointerOut={() => {
                pointerInteracting.current = null
                canvasRef.current.style.cursor = 'grab'
            }}
            onMouseMove={(e) => {
                if (pointerInteracting.current !== null) {
                    const delta = e.clientX - pointerInteracting.current
                    pointerInteractionPos.current = delta
                    r.current = delta / 100
                }
            }}
            onTouchMove={(e) => {
                if (pointerInteracting.current !== null && e.touches[0]) {
                    const delta = e.touches[0].clientX - pointerInteracting.current
                    pointerInteractionPos.current = delta
                    r.current = delta / 100
                }
            }}
        >
            <canvas
                ref={el => {
                    canvasRef.current = el
                    if (el) {
                        el.style.opacity = '0'
                        setTimeout(() => el.style.opacity = '1', 100)
                    }
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    contain: 'layout paint size',
                    opacity: 0,
                    transition: 'opacity 1s ease',
                    touchAction: 'none'
                }}
            />

            {/* Labels overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                overflow: 'hidden'
            }}>
                {branches.map((branch, i) => (
                    <div
                        key={branch.name + i}
                        ref={el => labelsRef.current[i] = el}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            // Initial transform will be overridden by JS
                            color: '#D4AF37', // Gold color
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                            padding: '4px 8px',
                            // Removed background for cleaner look, or keep transparent black
                            // background: 'rgba(0,0,0,0.4)', 
                            // borderRadius: '4px',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                            willChange: 'transform, opacity',
                            zIndex: 10,
                        }}
                    >
                        {branch.name}
                    </div>
                ))}
            </div>


        </div>
    )
}

export default Globe3D
