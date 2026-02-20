// OrbitalCore.jsx – Noyau central issu de project.js
// Remplace le simple soleil de scene.js par un système orbital animé

import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

// ─── Satellites tech autour du noyau ─────────────────────────────────────────
const CORE_SATELLITES = [
  { id: 1, label: 'REACT', radius: 2.2, speed: 0.6, size: 0.22, angle: 0,              color: '#61DAFB' },
  { id: 2, label: 'THREE', radius: 3.0, speed: 0.38, size: 0.26, angle: Math.PI / 3,   color: '#88CCFF' },
  { id: 3, label: 'GSAP',  radius: 1.6, speed: 0.9,  size: 0.18, angle: Math.PI,       color: '#88CE02' },
  { id: 4, label: 'R3F',   radius: 3.6, speed: 0.22, size: 0.28, angle: (4*Math.PI)/3, color: '#FFD700' },
]

// ─── Un seul satellite tech ───────────────────────────────────────────────────
function CoreSatellite({ data, time }) {
  const meshRef = useRef()
  const angle = data.angle + time * data.speed
  const x = Math.cos(angle) * data.radius
  const z = Math.sin(angle) * data.radius
  const y = Math.sin(angle * 1.7) * 0.2

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.7
    }
  })

  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <icosahedronGeometry args={[data.size, 1]} />
      <meshPhysicalMaterial
        color={data.color}
        metalness={0.9}
        roughness={0.15}
        emissive={data.color}
        emissiveIntensity={0.5}
        clearcoat={0.8}
      />
    </mesh>
  )
}

// ─── Noyau central principal ──────────────────────────────────────────────────
export default function OrbitalCore() {
  const coreRef  = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const [hovered, setHovered] = useState(false)
  const [time, setTime] = useState(0)

  useFrame((_, delta) => {
    setTime(t => t + delta)
    if (coreRef.current)  coreRef.current.rotation.y  += delta * 0.3
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.7
      ring1Ref.current.rotation.z += delta * 0.4
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.9
      ring2Ref.current.rotation.x -= delta * 0.25
    }
  })

  return (
    <group>
      {/* Coque de verre externe */}
      <mesh scale={2.4}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <MeshTransmissionMaterial
          color="#88BBFF"
          transmission={0.95}
          thickness={0.3}
          roughness={0.05}
          chromaticAberration={0.08}
          ior={1.5}
          backside
          emissive="#4488FF"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Noyau dodécaèdre */}
      <mesh
        ref={coreRef}
        onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'default' }}
      >
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshPhysicalMaterial
          color="#1A6EFF"
          metalness={0.95}
          roughness={0.05}
          clearcoat={1}
          emissive="#0040FF"
          emissiveIntensity={hovered ? 2.5 : 1.2}
        />
      </mesh>

      {/* Anneaux rotatifs */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.4, 0.03, 8, 64]} />
        <meshPhysicalMaterial color="#61DAFB" emissive="#61DAFB" emissiveIntensity={1.2} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.8, 0.02, 8, 64]} />
        <meshPhysicalMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.8} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Satellites tech */}
      {CORE_SATELLITES.map(sat => (
        <CoreSatellite key={sat.id} data={sat} time={time} />
      ))}

      {/* Lumière du noyau */}
      <pointLight color="#4488FF" intensity={hovered ? 5 : 2.5} distance={25} decay={2} />
    </group>
  )
}
