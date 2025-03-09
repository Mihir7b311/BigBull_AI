'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Text } from '@react-three/drei'
import * as THREE from 'three'

interface Point3D {
  x: number
  y: number
  z: number
}

export default function TradingChart3D() {
  const chartRef = useRef<THREE.Group>(null)
  
  // Generate sample data points
  const points: Point3D[] = Array.from({ length: 50 }, (_, i) => ({
    x: i * 0.1,
    y: Math.sin(i * 0.2) * 0.5 + Math.random() * 0.3,
    z: Math.cos(i * 0.2) * 0.2
  }))

  // Convert points to Vector3 array for the Line component
  const linePoints = points.map(p => new THREE.Vector3(p.x, p.y, p.z))

  useFrame((state) => {
    if (chartRef.current) {
      chartRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <group ref={chartRef}>
      {/* Price line */}
      <Line
        points={linePoints}
        color="cyan"
        lineWidth={2}
        segments
        dashed={false}
      />

      {/* Grid lines */}
      {Array.from({ length: 10 }, (_, i) => (
        <Line
          key={`grid-x-${i}`}
          points={[
            new THREE.Vector3(-2, -1 + i * 0.2, 0),
            new THREE.Vector3(2, -1 + i * 0.2, 0)
          ]}
          color="#1a365d"
          lineWidth={1}
          segments
          dashed
        />
      ))}

      {/* Labels */}
      <Text
        position={[-2.2, 0, 0]}
        fontSize={0.15}
        color="#4299e1"
        anchorX="right"
        anchorY="middle"
      >
        Price
      </Text>

      <Text
        position={[0, -1.2, 0]}
        fontSize={0.15}
        color="#4299e1"
        anchorX="center"
        anchorY="top"
      >
        Time
      </Text>

      {/* Animated particles */}
      {points.map((point, i) => (
        <mesh key={i} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial
            color="#4299e1"
            emissive="#4299e1"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
} 