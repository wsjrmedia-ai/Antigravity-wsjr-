import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const GalaxyBackground = () => {
    const containerRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current) return

        // Scene setup
        const scene = new THREE.Scene()

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = 30

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        containerRef.current.appendChild(renderer.domElement)

        // Particles
        const particlesGeometry = new THREE.BufferGeometry()
        const count = 3000
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100

            // Gold and White colors
            const isGold = Math.random() > 0.8
            colors[i * 3] = isGold ? 0.83 : 1
            colors[i * 3 + 1] = isGold ? 0.68 : 1
            colors[i * 3 + 2] = isGold ? 0.21 : 1
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        // Material
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.15,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        })

        const particles = new THREE.Points(particlesGeometry, particlesMaterial)
        scene.add(particles)

        // Animation
        const clock = new THREE.Clock()
        let mouseX = 0
        let mouseY = 0

        const handleMouseMove = (event) => {
            mouseX = event.clientX / window.innerWidth - 0.5
            mouseY = event.clientY / window.innerHeight - 0.5
        }
        window.addEventListener('mousemove', handleMouseMove)

        const animate = () => {
            const elapsedTime = clock.getElapsedTime()

            // Rotate entire system
            particles.rotation.y = elapsedTime * 0.05
            particles.rotation.x = mouseY * 0.5
            particles.rotation.y += mouseX * 0.5

            // Gentle wave motion
            particles.position.y = Math.sin(elapsedTime * 0.5) * 2

            renderer.render(scene, camera)
            requestAnimationFrame(animate)
        }
        animate()

        // Resize handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', handleResize)
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement)
            }
            particlesGeometry.dispose()
            particlesMaterial.dispose()
            renderer.dispose()
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
                zIndex: 0, // Behind content
                pointerEvents: 'none',
                opacity: 0.6 // Subtle blend
            }}
        />
    )
}

export default GalaxyBackground
