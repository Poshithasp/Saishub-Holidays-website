'use client'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Stars, OrbitControls, Trail } from '@react-three/drei'

// Sun direction in WORLD space — kept fixed so Earth rotates through day/night
const SUN_DIR = new THREE.Vector3(1.0, 0.35, 0.9).normalize()

/* ---------------- Realistic Earth (day/night blend, ocean specular, atmosphere) ---------------- */
function Earth({ mouse }) {
  const earthRef = useRef()
  const cloudsRef = useRef()
  const cloudsRef2 = useRef()
  const groupRef = useRef()

  const [dayMap, nightMap, cloudMap, normalMap, specMap] = useLoader(THREE.TextureLoader, [
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_lights_2048.png',
    'https://threejs.org/examples/textures/planets/earth_clouds_1024.png',
    'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg',
  ])

  // Improve texture rendering
  useMemo(() => {
    ;[dayMap, nightMap, cloudMap, normalMap, specMap].forEach(t => {
      if (!t) return
      t.anisotropy = 8
      t.colorSpace = THREE.SRGBColorSpace
    })
    // normal and spec should be linear
    if (normalMap) normalMap.colorSpace = THREE.NoColorSpace
    if (specMap) specMap.colorSpace = THREE.NoColorSpace
  }, [dayMap, nightMap, cloudMap, normalMap, specMap])

  // Custom shader material for realistic day/night blend + specular oceans + atmosphere rim
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayMap },
        nightTexture: { value: nightMap },
        normalMap: { value: normalMap },
        specularMap: { value: specMap },
        sunDirection: { value: SUN_DIR.clone() },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vViewDir;
        void main() {
          vUv = uv;
          // World-space normal: stays with Earth as it rotates
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vViewDir = normalize(cameraPosition - wp.xyz);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform sampler2D specularMap;
        uniform vec3 sunDirection;
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vViewDir;

        void main() {
          vec3 N = normalize(vWorldNormal);
          vec3 L = normalize(sunDirection);
          float NdotL = dot(N, L);

          // Smooth day/night blend across the terminator
          float dayAmt = smoothstep(-0.18, 0.22, NdotL);
          vec3 dayCol = texture2D(dayTexture, vUv).rgb;
          vec3 nightCol = texture2D(nightTexture, vUv).rgb;

          // Boost city lights on the dark side
          vec3 night = nightCol * (1.6 + 0.6 * (1.0 - dayAmt));

          // Base color
          vec3 color = mix(night, dayCol, dayAmt);

          // Ocean specular (Blinn-Phong style)
          float oceanMask = 1.0 - texture2D(specularMap, vUv).r; // spec map: land=bright, water=dark → invert
          vec3 H = normalize(L + vViewDir);
          float spec = pow(max(dot(N, H), 0.0), 48.0) * oceanMask * clamp(dayAmt, 0.0, 1.0);
          color += vec3(1.0, 0.95, 0.85) * spec * 1.4;

          // Slight atmospheric tint at the edges (day side)
          float rim = 1.0 - max(dot(N, vViewDir), 0.0);
          color += vec3(0.35, 0.55, 0.9) * pow(rim, 3.0) * dayAmt * 0.35;

          // Warm sunset glow near the terminator
          float sunset = smoothstep(0.0, 0.12, abs(NdotL)) * (1.0 - smoothstep(0.15, 0.35, abs(NdotL)));
          color += vec3(1.0, 0.5, 0.2) * sunset * 0.25;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })
  }, [dayMap, nightMap, normalMap, specMap])

  useFrame((state, delta) => {
    // Earth rotates on Y
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.055
    // Clouds rotate slightly faster and offset
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.075
    if (cloudsRef2.current) {
      cloudsRef2.current.rotation.y += delta * 0.09
      cloudsRef2.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.02
    }
    // Slight tilt from mouse for parallax
    if (groupRef.current && mouse.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.12 + mouse.current.y * 0.18, 0.04)
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -mouse.current.x * 0.12, 0.04)
    }
  })

  return (
    <group ref={groupRef} rotation={[0.12, 0, 0]}>
      {/* Earth surface with custom day/night shader */}
      <mesh ref={earthRef} rotation={[0, 3.6, 0]}>
        <sphereGeometry args={[2.2, 128, 128]} />
        <primitive attach="material" object={earthMaterial} />
      </mesh>

      {/* Cloud layer 1 — main clouds */}
      <mesh ref={cloudsRef} scale={1.018} rotation={[0, 2.9, 0]}>
        <sphereGeometry args={[2.2, 96, 96]} />
        <meshPhongMaterial
          map={cloudMap}
          alphaMap={cloudMap}
          transparent
          opacity={0.9}
          depthWrite={false}
          shininess={4}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Cloud layer 2 — subtle high-altitude wisps */}
      <mesh ref={cloudsRef2} scale={1.035} rotation={[0.1, 1.2, 0]}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshPhongMaterial
          map={cloudMap}
          alphaMap={cloudMap}
          transparent
          opacity={0.35}
          depthWrite={false}
          shininess={2}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Inner atmosphere — soft blue glow */}
      <mesh scale={1.055}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          uniforms={{ c: { value: 0.65 }, p: { value: 3.0 } }}
          vertexShader={`
            varying vec3 vN; varying vec3 vP;
            void main() {
              vN = normalize(normalMatrix * normal);
              vP = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vN; uniform float c; uniform float p;
            void main() {
              float intensity = pow(c - dot(vN, vec3(0.0, 0.0, 1.0)), p);
              gl_FragColor = vec4(0.42, 0.72, 1.0, 1.0) * intensity * 0.9;
            }
          `}
        />
      </mesh>

      {/* Outer atmosphere — wider halo */}
      <mesh scale={1.12}>
        <sphereGeometry args={[2.2, 48, 48]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          uniforms={{ c: { value: 0.55 }, p: { value: 4.5 } }}
          vertexShader={`
            varying vec3 vN;
            void main() {
              vN = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vN; uniform float c; uniform float p;
            void main() {
              float intensity = pow(c - dot(vN, vec3(0.0, 0.0, 1.0)), p);
              gl_FragColor = vec4(0.35, 0.6, 1.0, 1.0) * intensity * 0.5;
            }
          `}
        />
      </mesh>
    </group>
  )
}

/* ---------------- Detailed Airliner with contrail ---------------- */
function Airplane() {
  const orbitRef = useRef()
  const planeRef = useRef()
  const trailAnchor = useRef()

  useFrame((state, delta) => {
    if (orbitRef.current) orbitRef.current.rotation.y += delta * 0.32
    if (planeRef.current) {
      planeRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.1) * 0.06
    }
  })

  return (
    <group ref={orbitRef} rotation={[0.55, 0.15, 0.08]}>
      <group position={[3.2, 0, 0]} ref={planeRef} scale={2.0}>
        {/* Fuselage */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.08, 0.7, 16, 24]} />
          <meshStandardMaterial color="#f5f8ff" metalness={0.75} roughness={0.18} envMapIntensity={1.5} />
        </mesh>
        {/* Nose cone */}
        <mesh position={[0.4, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.08, 0.14, 20]} />
          <meshStandardMaterial color="#f5f8ff" metalness={0.75} roughness={0.18} />
        </mesh>
        {/* Wings — swept back */}
        <mesh position={[0, -0.02, 0]} rotation={[0, 0, 0.02]}>
          <boxGeometry args={[0.28, 0.03, 0.9]} />
          <meshStandardMaterial color="#f0f5ff" metalness={0.65} roughness={0.22} />
        </mesh>
        {/* Wing tips — green brand */}
        <mesh position={[0, -0.02, 0.46]}>
          <boxGeometry args={[0.24, 0.035, 0.05]} />
          <meshStandardMaterial color="#1f6a3c" metalness={0.5} roughness={0.25} emissive="#0d3d1f" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, -0.02, -0.46]}>
          <boxGeometry args={[0.24, 0.035, 0.05]} />
          <meshStandardMaterial color="#1f6a3c" metalness={0.5} roughness={0.25} emissive="#0d3d1f" emissiveIntensity={0.6} />
        </mesh>
        {/* Vertical stabilizer (tail fin) */}
        <mesh position={[-0.32, 0.16, 0]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.18, 0.28, 0.03]} />
          <meshStandardMaterial color="#1f6a3c" metalness={0.5} roughness={0.25} emissive="#0d3d1f" emissiveIntensity={0.5} />
        </mesh>
        {/* Horizontal stabilizer */}
        <mesh position={[-0.32, 0.04, 0]}>
          <boxGeometry args={[0.14, 0.02, 0.32]} />
          <meshStandardMaterial color="#f0f5ff" metalness={0.55} roughness={0.22} />
        </mesh>
        {/* Belly stripe (brand accent) */}
        <mesh position={[0.02, -0.055, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.018, 0.6, 8, 16]} />
          <meshStandardMaterial color="#c8a24a" emissive="#8f6a1e" emissiveIntensity={0.7} metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Twin engines under wings */}
        <mesh position={[0.02, -0.09, 0.28]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.035, 0.18, 10, 14]} />
          <meshStandardMaterial color="#b8c2d0" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0.02, -0.09, -0.28]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.035, 0.18, 10, 14]} />
          <meshStandardMaterial color="#b8c2d0" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Navigation lights */}
        <mesh position={[0, -0.03, 0.5]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#ff2c2c" />
        </mesh>
        <mesh position={[0, -0.03, -0.5]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#2cff5a" />
        </mesh>
        {/* Cockpit glass */}
        <mesh position={[0.28, 0.03, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#243244" metalness={0.9} roughness={0.05} emissive="#66a3ff" emissiveIntensity={0.15} />
        </mesh>
        {/* Contrail anchor for trail effect */}
        <mesh position={[-0.7, 0, 0]} ref={trailAnchor}>
          <sphereGeometry args={[0.01, 6, 6]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        <mesh position={[-0.75, 0, 0]}>
          <coneGeometry args={[0.09, 2.6, 18, 1, true]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.45} />
        </mesh>
        <mesh position={[-1.6, 0, 0]}>
          <coneGeometry args={[0.06, 3.4, 16, 1, true]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
        </mesh>
      </group>
    </group>
  )
}

/* ---------------- Distant Sun with glow ---------------- */
function Sun() {
  const sunPos = SUN_DIR.clone().multiplyScalar(28)
  return (
    <group position={sunPos}>
      {/* Sun disc */}
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial color="#fff5c8" />
      </mesh>
      {/* Corona */}
      <mesh>
        <sphereGeometry args={[3.5, 32, 32]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={{}}
          vertexShader={`varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `}
          fragmentShader={`varying vec3 vN; void main(){ float i=pow(0.6-dot(vN,vec3(0.0,0.0,1.0)),3.5); gl_FragColor=vec4(1.0,0.85,0.5,1.0)*i*0.9; }`}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Outer bloom */}
      <mesh>
        <sphereGeometry args={[7, 32, 32]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={{}}
          vertexShader={`varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `}
          fragmentShader={`varying vec3 vN; void main(){ float i=pow(0.5-dot(vN,vec3(0.0,0.0,1.0)),5.0); gl_FragColor=vec4(1.0,0.75,0.4,1.0)*i*0.5; }`}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Point light emitted from sun position */}
      <pointLight color="#fff2c9" intensity={2.2} distance={80} decay={0.4} />
    </group>
  )
}

/* ---------------- Camera scroll-zoom ---------------- */
function CameraRig({ scrollRef }) {
  const { camera } = useThree()
  useFrame(() => {
    // scrollRef is number from 0..1
    const s = Math.min(1, Math.max(0, scrollRef.current || 0))
    const targetZ = 7.0 - s * 2.6 // zoom from 7 to ~4.4
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06)
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* ---------------- Small floating cloud puffs in 3D space ---------------- */
function CloudPuff({ position, scale = 1 }) {
  const ref = useRef()
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05
      ref.current.position.x += delta * 0.06
      if (ref.current.position.x > 8) ref.current.position.x = -8
    }
  })
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.35} roughness={1} />
      </mesh>
      <mesh position={[0.35, 0.05, 0.05]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} roughness={1} />
      </mesh>
      <mesh position={[-0.32, -0.02, -0.05]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} roughness={1} />
      </mesh>
      <mesh position={[0.1, 0.18, 0.02]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.28} roughness={1} />
      </mesh>
    </group>
  )
}

export default function EarthScene({ mouseRef, scrollRef }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 7], fov: 42 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
    >
      {/* Ambient fill so night side isn't pure black — subtle blue moonlight */}
      <ambientLight intensity={0.28} color="#7fa5d6" />
      {/* Simulated sun direction light (matches SUN_DIR) */}
      <directionalLight position={SUN_DIR.toArray()} intensity={2.6} color="#fff2cc" />
      {/* Fill light from opposite (planet reflection / sky bounce) */}
      <hemisphereLight args={["#e6f0ff", "#0a1220", 0.35]} />

      <Suspense fallback={null}>
        <Sun />
        <Earth mouse={mouseRef} />
        <Airplane />
        {/* Foreground cloud puffs */}
        <CloudPuff position={[-4, 1.5, 2]} scale={1.2} />
        <CloudPuff position={[4.5, -1.2, 1.5]} scale={1.0} />
        <CloudPuff position={[-3.5, -1.8, 2.5]} scale={0.9} />
        <CloudPuff position={[3, 2.2, 2]} scale={1.3} />
        {/* Star field */}
        <Stars radius={100} depth={60} count={2500} factor={3.5} saturation={0} fade speed={0.4} />
      </Suspense>

      {scrollRef && <CameraRig scrollRef={scrollRef} />}
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  )
}
