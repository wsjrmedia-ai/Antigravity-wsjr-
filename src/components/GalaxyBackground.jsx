import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const GalaxyBackground = () => {
    const containerRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current) return

        // Scene setup
        const scene = new THREE.Scene()

        // Fog for depth fading
        scene.fog = new THREE.FogExp2('#000000', 0.02)

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
        camera.position.x = 0
        camera.position.y = 2
        camera.position.z = 12

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2))
        containerRef.current.appendChild(renderer.domElement)

        // Adaptive particle count for performance on narrow/touch devices
        const isMobile = window.innerWidth < 768 || (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches)

        // Parameters for Galaxy (Milky Way style)
        const parameters = {
            count: isMobile ? 35000 : 120000,
            size: 0.012,
            radius: 25,
            branches: 2,
            spin: 1.5,
            randomness: 0.6,
            randomnessPower: 3.5,
            insideColor: '#ffbb77', // Bright warm golden core
            outsideColor: '#301c80'  // Deep cosmic purple/magenta edges
        }

        let geometry = null
        let material = null
        let points = null

        const generateGalaxy = () => {
            if (points !== null) {
                geometry.dispose()
                material.dispose()
                scene.remove(points)
            }

            geometry = new THREE.BufferGeometry()
            const positions = new Float32Array(parameters.count * 3)
            const colors = new Float32Array(parameters.count * 3)

            const colorInside = new THREE.Color(parameters.insideColor)
            const colorOutside = new THREE.Color(parameters.outsideColor)

            for (let i = 0; i < parameters.count; i++) {
                const i3 = i * 3

                // Position based on math spiral
                const radius = Math.random() * parameters.radius
                const spinAngle = radius * parameters.spin
                const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

                const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
                const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
                const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius

                positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
                positions[i3 + 1] = randomY
                positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

                // Color interpolation
                const mixedColor = colorInside.clone()
                mixedColor.lerp(colorOutside, radius / parameters.radius)

                colors[i3] = mixedColor.r
                colors[i3 + 1] = mixedColor.g
                colors[i3 + 2] = mixedColor.b
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

            // Create a nice glowing circular texture for the particles
            const canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            const context = canvas.getContext('2d');
            const gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, 16, 16);
            const texture = new THREE.CanvasTexture(canvas);

            material = new THREE.PointsMaterial({
                size: parameters.size,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true,
                transparent: true,
                map: texture,
                opacity: 0.9
            })

            points = new THREE.Points(geometry, material)

            // Add a pronounced tilt to view edge-on (spreading left to right)
            points.rotation.x = 1.3;
            points.rotation.z = 0.2;

            scene.add(points)
        }

        generateGalaxy()

        // Animation Loop
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

            // Rotate the entire galaxy slowly over time
            if (points) {
                points.rotation.y = elapsedTime * 0.05;
            }

            // Subtle parallax effect tracking the mouse
            camera.position.x += (mouseX * 8 - camera.position.x) * 0.02
            camera.position.y += (-mouseY * 4 + 2 - camera.position.y) * 0.02
            camera.lookAt(scene.position)

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
            if (geometry) geometry.dispose()
            if (material) material.dispose()
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
                zIndex: 0,
                pointerEvents: 'none',
                opacity: 0.85
            }}
        />
    )
}

export default GalaxyBackground
