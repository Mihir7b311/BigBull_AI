'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import * as THREE from 'three'

const tokens = [
  { symbol: 'BTC', color: '#F7931A' },
  { symbol: 'ETH', color: '#627EEA' },
  { symbol: 'STRK', color: '#00FF00' },
  { symbol: 'USDC', color: '#2775CA' },
]

export default function FloatingTokens() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {tokens.map((token, i) => (
        <Float
          key={token.symbol}
          speed={1.5}
          rotationIntensity={1}
          floatIntensity={2}
          position={[
            Math.cos(i * Math.PI * 0.5) * 2,
            Math.sin(i * 0.5) * 0.5,
            Math.sin(i * Math.PI * 0.5) * 2
          ]}
        >
          <Text
            fontSize={0.4}
            color={token.color}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.ttf"
          >
            {token.symbol}
          </Text>
          <mesh position={[0, 0, -0.05]}>
            <circleGeometry args={[0.3, 32]} />
            <meshStandardMaterial
              color={token.color}
              opacity={0.2}
              transparent
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
} 