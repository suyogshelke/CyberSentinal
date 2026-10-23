/**
 * SecurityCore — 3D rotating cybersecurity core
 * Uses Three.js via React Three Fiber
 */
import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Torus, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

type SecurityStatus = 'normal' | 'warning' | 'critical' | 'secure'

interface SecurityCoreProps {
  status?: SecurityStatus
  size?: number
  interactive?: boolean
}

// Color mapping per status
const STATUS_COLORS: Record<SecurityStatus, { core: string; ring: string; particles: string }> = {
  normal:   { core: '#00d4ff', ring: '#3b82f6', particles: '#00d4ff' },
  warning:  { core: '#f59e0b', ring: '#f97316', particles: '#f59e0b' },
  critical: { core: '#ff3040', ring: '#ef4444', particles: '#ff3040' },
  secure:   { core: '#10b981', ring: '#34d399', particles: '#10b981' },
}

function CoreSphere({ status }: { status: SecurityStatus }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const colors = STATUS_COLORS[status]

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial
        color={colors.core}
        emissive={colors.core}
        emissiveIntensity={0.4}
        wireframe={false}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

function OrbitRing({ radius, speed, axis, status }: {
  radius: number; speed: number; axis: 'x' | 'y' | 'z'; status: SecurityStatus
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const colors = STATUS_COLORS[status]

  useFrame((state) => {
    if (meshRef.current) {
      if (axis === 'y') meshRef.current.rotation.y = state.clock.elapsedTime * speed
      if (axis === 'x') meshRef.current.rotation.x = state.clock.elapsedTime * speed
      if (axis === 'z') meshRef.current.rotation.z = state.clock.elapsedTime * speed
    }
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[radius, 0.015, 16, 100]} />
      <meshStandardMaterial
        color={colors.ring}
        emissive={colors.ring}
        emissiveIntensity={0.6}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

function Particles({ status }: { status: SecurityStatus }) {
  const pointsRef = useRef<THREE.Points>(null)
  const colors = STATUS_COLORS[status]

  const positions = useMemo(() => {
    const count = 200
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.5 + Math.random() * 1.5
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        color={colors.particles}
        size={0.02}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </Points>
  )
}

function CoreScene({ status }: { status: SecurityStatus }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color={STATUS_COLORS[status].core} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color={STATUS_COLORS[status].ring} />

      <CoreSphere status={status} />
      <OrbitRing radius={1.0} speed={0.5} axis="y" status={status} />
      <OrbitRing radius={1.3} speed={-0.3} axis="x" status={status} />
      <OrbitRing radius={1.6} speed={0.2} axis="z" status={status} />
      <Particles status={status} />
    </>
  )
}

export default function SecurityCore({
  status = 'normal',
  size = 300,
  interactive = false,
}: SecurityCoreProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative"
      aria-label="3D Security Core visualization"
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <CoreScene status={status} />
      </Canvas>
      {/* Status label */}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="text-xs font-mono tracking-widest uppercase"
          style={{ color: STATUS_COLORS[status].core, textShadow: `0 0 10px ${STATUS_COLORS[status].core}` }}>
          ● {status === 'normal' ? 'ACTIVE' : status.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
