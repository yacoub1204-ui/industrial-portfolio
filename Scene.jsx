// Scene.jsx – Scène 3D principale (issu de scene.js)
// Branché sur le store Zustand et utilise OrbitalCore comme soleil central

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CameraControls, Instances, Instance, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { gsap } from 'gsap'
import * as THREE from 'three'

import usePortfolioStore from '../store'
import { generatePlanets } from '../data'
import OrbitalCore from './OrbitalCore'

// ─── Hook orbites ─────────────────────────────────────────────────────────────
function useOrbitPositions(projects) {
  const timeRef = useRef(0)
  const positionsRef = useRef({})
  const matricesRef = useRef({})

  useFrame((_, delta) => {
    timeRef.current += delta * 0.5

    projects.forEach(project => {
      const angle = timeRef.current * project.speed
      const baseX = Math.cos(angle) * project.orbitRadius
      const baseZ = Math.sin(angle) * project.orbitRadius
      const inclinationMatrix = new THREE.Matrix4().makeRotationX(project.inclination)
      const basePos = new THREE.Vector3(baseX, 0, baseZ)
      const finalPos = basePos.applyMatrix4(inclinationMatrix)

      const matrix = new THREE.Matrix4().compose(
        finalPos,
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, angle, 0)),
        new THREE.Vector3(project.size, project.size, project.size)
      )

      positionsRef.current[project.id] = finalPos
      matricesRef.current[project.id] = matrix
    })
  })

  return { positions: positionsRef, matrices: matricesRef }
}

// ─── Gestionnaire caméra ──────────────────────────────────────────────────────
function CameraManager() {
  const cameraControls = useRef()
  const { camera } = useThree()
  const initialPosition = useRef(new THREE.Vector3(25, 15, 25))
  const initialTarget   = useRef(new THREE.Vector3(0, 0, 0))
  const isAnimating     = useRef(false)

  // Lire le store
  const focusPoint    = usePortfolioStore(s => s.focusPoint)
  const clearFocus    = usePortfolioStore(s => s.clearFocus)

  // Position initiale
  useEffect(() => {
    if (cameraControls.current) {
      cameraControls.current.setLookAt(
        initialPosition.current.x, initialPosition.current.y, initialPosition.current.z,
        initialTarget.current.x, initialTarget.current.y, initialTarget.current.z,
        true
      )
    }
  }, [])

  // Zoom vers planète cliquée
  useEffect(() => {
    if (!cameraControls.current || !focusPoint || isAnimating.current) return

    isAnimating.current = true
    const direction = focusPoint.clone().normalize()
    const targetPos = focusPoint.clone().add(direction.multiplyScalar(8))
    targetPos.y += 3

    const startPos = camera.position.clone()
    const startTarget = cameraControls.current.target.clone()

    gsap.to({}, {
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: function () {
        const p = this.progress()
        camera.position.lerpVectors(startPos, targetPos, p)
        cameraControls.current.target.lerpVectors(startTarget, focusPoint, p)
        cameraControls.current.update()
      },
      onComplete: () => { isAnimating.current = false },
    })
  }, [focusPoint, camera])

  // Retour vue d'ensemble quand clearFocus déclenché
  useEffect(() => {
    if (focusPoint === null && !isAnimating.current) {
      isAnimating.current = true
      const startPos = camera.position.clone()
      const startTarget = cameraControls.current?.target.clone() || new THREE.Vector3()

      gsap.to({}, {
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: function () {
          const p = this.progress()
          camera.position.lerpVectors(startPos, initialPosition.current, p)
          if (cameraControls.current) {
            cameraControls.current.target.lerpVectors(startTarget, initialTarget.current, p)
            cameraControls.current.update()
          }
        },
        onComplete: () => { isAnimating.current = false },
      })
    }
  }, [focusPoint, camera])

  return (
    <CameraControls
      ref={cameraControls}
      smoothTime={0.5}
      maxPolarAngle={Math.PI / 2}
      minDistance={5}
      maxDistance={70}
      dollySpeed={0.5}
      truckSpeed={0.5}
    />
  )
}

// ─── Planètes instanciées ─────────────────────────────────────────────────────
function Planets({ projects }) {
  const { positions, matrices } = useOrbitPositions(projects)
  const instancesRef = useRef()

  const hoveredId        = usePortfolioStore(s => s.hoveredId)
  const setHoveredId     = usePortfolioStore(s => s.setHoveredId)
  const setSelectedProject = usePortfolioStore(s => s.setSelectedProject)
  const setFocusPoint    = usePortfolioStore(s => s.setFocusPoint)

  useFrame(() => {
    if (!instancesRef.current) return
    projects.forEach((project, index) => {
      const matrix = matrices.current[project.id]
      if (matrix) instancesRef.current.setMatrixAt(index, matrix)
    })
    instancesRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <Instances ref={instancesRef} limit={projects.length}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial roughness={0.3} metalness={0.2} />

      {projects.map(project => (
        <Instance
          key={project.id}
          ref={(el) => {
            if (el) el.color.set(hoveredId === project.id ? '#ffffff' : project.color)
          }}
          onClick={(e) => {
            e.stopPropagation()
            const pos = positions.current[project.id]
            if (pos) {
              setFocusPoint(pos.clone())
              setSelectedProject(project)
            }
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredId(project.id)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHoveredId(null)
            document.body.style.cursor = 'default'
          }}
        />
      ))}
    </Instances>
  )
}

// ─── Post-processing ──────────────────────────────────────────────────────────
function PostEffects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom intensity={0.6} luminanceThreshold={0.5} luminanceSmoothing={0.4} radius={0.5} mipmapBlur />
      <Vignette eskil={false} offset={0.2} darkness={0.65} />
    </EffectComposer>
  )
}

// ─── Particules de fond ───────────────────────────────────────────────────────
function ParticleField() {
  const pointsRef = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(500 * 3)
    for (let i = 0; i < 500; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 60
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30
      arr[i * 3 + 2] = (Math.random() - 0.5) * 60
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.01
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#4488AA" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

// ─── Scène 3D complète ────────────────────────────────────────────────────────
export default function Scene() {
  const projects = useMemo(() => generatePlanets(), [])

  return (
    <Canvas
      camera={{ position: [25, 15, 25], fov: 45 }}
      performance={{ min: 0.5 }}
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
        alpha: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor('#000000', 1)
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.2
      }}
    >
      {/* Éclairage */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[8, 12, 6]} intensity={2} color="#D8EEF5" castShadow />
      <pointLight position={[-15, -5, -15]} intensity={0.5} color="#4466ee" />

      {/* Étoiles de fond */}
      <Stars radius={150} depth={50} count={7000} factor={5} saturation={0.5} fade speed={0.5} />

      {/* Particules supplémentaires */}
      <ParticleField />

      {/* Anneau décoratif */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8, 8.3, 128]} />
        <meshBasicMaterial color="#4466ee" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      {/* ★ Noyau central : l'OrbitalCore de project.js remplace le simple soleil */}
      <OrbitalCore />

      {/* Planètes (50) issues de scene.js */}
      <Planets projects={projects} />

      {/* Gestionnaire de caméra branché sur le store */}
      <CameraManager />

      {/* Post-processing du project.js */}
      <PostEffects />
    </Canvas>
  )
}
