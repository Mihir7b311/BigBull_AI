'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import TradingChart3D from './TradingChart3D'
import FloatingTokens from './FloatingTokens'

export default function Scene3D() {
  return (
    <Canvas style={{ height: '100vh' }}>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2.5}
      />
      
      <Environment preset="city" />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <group position={[0, 0, 0]}>
        <TradingChart3D />
      </group>
      
      <group position={[0, 2, 0]}>
        <FloatingTokens />
      </group>
    </Canvas>
  )
} 