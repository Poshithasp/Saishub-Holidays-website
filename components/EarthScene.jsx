'use client'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Stars, OrbitControls } from '@react-three/drei'

function Earth({ mouse }) {
  const meshRef = useRef()
  const cloudsRef = useRef()
  const groupRef = useRef()

  const [dayMap, cloudMap, bumpMap] = useLoader(THREE.TextureLoader, [
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_clouds_1024.png',
    'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
  ])

  useFrame((state, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.08
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.12
    if (groupRef.current && mouse.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.current.y * 0.25, 0.04)
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -mouse.current.x * 0.15, 0.04)
    }
  })

  return (
    <group ref={groupRef} rotation={[0.15, 0, 0]}>
      <mesh ref={meshRef} rotation={[0, 3.6, 0]}>
        <sphereGeometry args={[2.2, 96, 96]} />
        <meshStandardMaterial map={dayMap} normalMap={bumpMap} roughness={0.75} metalness={0.02} emissive={new THREE.Color('#1a3358')} emissiveIntensity={0.12}/>
      </mesh>
      <mesh ref={cloudsRef} scale={1.015} rotation={[0, 3.6, 0]}>
        <sphereGeometry args={[2.2, 96, 96]} />
        <meshStandardMaterial map={cloudMap} transparent opacity={0.6} depthWrite={false}/>
      </mesh>
      {/* Atmosphere glow */}
      <mesh scale={1.09}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          uniforms={{}}
          vertexShader={`varying vec3 vNormal; void main(){ vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);} `}
          fragmentShader={`varying vec3 vNormal; void main(){ float intensity = pow(0.72 - dot(vNormal, vec3(0.0,0.0,1.0)), 2.0); gl_FragColor = vec4(0.55,0.78,1.0,1.0) * intensity; }`}
        />
      </mesh>
    </group>
  )
}

function Airplane() {
  const orbitRef = useRef()
  const planeRef = useRef()
  useFrame((state, delta) => {
    if (orbitRef.current) orbitRef.current.rotation.y += delta * 0.35
    if (planeRef.current) {
      planeRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.2) * 0.08
    }
  })
  return (
    <group ref={orbitRef} rotation={[0.55, 0.2, 0.1]}>
      <group position={[3.1, 0, 0]} ref={planeRef} scale={1.9}>
        {/* Body */}
        <mesh rotation={[0, 0, Math.PI/2]}>
          <capsuleGeometry args={[0.08, 0.6, 12, 20]}/>
          <meshStandardMaterial color="#ffffff" metalness={0.55} roughness={0.25}/>
        </mesh>
        {/* Wings */}
        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[0.65, 0.03, 0.55]}/>
          <meshStandardMaterial color="#f4f8ff" metalness={0.4} roughness={0.3}/>
        </mesh>
        {/* Wing tips (brand green) */}
        <mesh position={[0, -0.02, 0.28]}>
          <boxGeometry args={[0.62, 0.032, 0.03]}/>
          <meshStandardMaterial color="#1f6a3c" metalness={0.4} roughness={0.3} emissive="#0a3016" emissiveIntensity={0.5}/>
        </mesh>
        <mesh position={[0, -0.02, -0.28]}>
          <boxGeometry args={[0.62, 0.032, 0.03]}/>
          <meshStandardMaterial color="#1f6a3c" metalness={0.4} roughness={0.3} emissive="#0a3016" emissiveIntensity={0.5}/>
        </mesh>
        {/* Tail vertical */}
        <mesh position={[-0.3, 0.14, 0]}>
          <boxGeometry args={[0.16, 0.22, 0.03]}/>
          <meshStandardMaterial color="#1f6a3c" metalness={0.4} roughness={0.3} emissive="#0a3016" emissiveIntensity={0.5}/>
        </mesh>
        {/* Tail horizontal */}
        <mesh position={[-0.3, 0.02, 0]}>
          <boxGeometry args={[0.15, 0.02, 0.24]}/>
          <meshStandardMaterial color="#f4f8ff" metalness={0.4} roughness={0.3}/>
        </mesh>
        {/* Green brand stripe */}
        <mesh position={[0.02, 0, 0]} rotation={[0, 0, Math.PI/2]}>
          <capsuleGeometry args={[0.024, 0.55, 8, 16]}/>
          <meshStandardMaterial color="#1f6a3c" emissive="#124d29" emissiveIntensity={0.6}/>
        </mesh>
        {/* Engines */}
        <mesh position={[0.05, -0.06, 0.18]} rotation={[0, 0, Math.PI/2]}>
          <capsuleGeometry args={[0.03, 0.15, 8, 12]}/>
          <meshStandardMaterial color="#c9d3e3" metalness={0.6} roughness={0.3}/>
        </mesh>
        <mesh position={[0.05, -0.06, -0.18]} rotation={[0, 0, Math.PI/2]}>
          <capsuleGeometry args={[0.03, 0.15, 8, 12]}/>
          <meshStandardMaterial color="#c9d3e3" metalness={0.6} roughness={0.3}/>
        </mesh>
        {/* Nose glow */}
        <mesh position={[0.32, 0, 0]}>
          <sphereGeometry args={[0.06, 12, 12]}/>
          <meshStandardMaterial color="#ffffff" emissive="#c8a24a" emissiveIntensity={1.2}/>
        </mesh>
        {/* Contrail */}
        <mesh position={[-0.7, 0, 0]}>
          <coneGeometry args={[0.07, 2.2, 14, 1, true]}/>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.4}/>
        </mesh>
      </group>
    </group>
  )
}

function OrbitRings() {
  const rings = useMemo(() => [2.8, 3.1, 3.35], [])
  return (
    <group rotation={[0.4, 0.2, 0]}>
      {rings.map((r, i) => (
        <mesh key={i} rotation={[Math.PI/2, 0, i*0.5]}>
          <ringGeometry args={[r, r+0.005, 128]}/>
          <meshBasicMaterial color={i%2===0 ? '#ffffff' : '#c8a24a'} transparent opacity={0.35} side={THREE.DoubleSide}/>
        </mesh>
      ))}
    </group>
  )
}

export default function EarthScene({ mouseRef }) {
  return (
    <Canvas dpr={[1, 1.8]} camera={{ position: [0, 0.5, 7], fov: 45 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={1.2}/>
      <hemisphereLight args={["#ffffff", "#446688", 0.7]} />
      <directionalLight position={[4, 2, 6]} intensity={2.6} color="#fff4d6"/>
      <directionalLight position={[-3, 2, 4]} intensity={0.9} color="#c9e0ff"/>
      <pointLight position={[0, 0, 8]} intensity={0.8} color="#ffffff"/>
      <Suspense fallback={null}>
        <Earth mouse={mouseRef}/>
        <OrbitRings/>
        <Airplane/>
        <Stars radius={80} depth={40} count={1200} factor={2} saturation={0} fade speed={0.5}/>
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false}/>
    </Canvas>
  )
}
