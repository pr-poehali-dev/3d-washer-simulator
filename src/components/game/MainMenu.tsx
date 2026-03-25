import { useGameStore } from '@/store/gameStore';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import Icon from '@/components/ui/icon';

function MenuMachine() {
  const bodyRef = useRef<THREE.Mesh>(null);
  const drumRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (drumRef.current) {
      drumRef.current.rotation.z += 0.008;
    }
    if (bodyRef.current) {
      bodyRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        {/* Корпус */}
        <mesh ref={bodyRef} position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 2.2, 2]} />
          <meshStandardMaterial
            color="#e8e8e8"
            metalness={0.3}
            roughness={0.2}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Дверца — круглая */}
        <mesh position={[0, 0, 1.02]} rotation={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.08, 64]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>

        {/* Стекло дверцы */}
        <mesh position={[0, 0, 1.07]}>
          <circleGeometry args={[0.55, 64]} />
          <meshStandardMaterial
            color="#88ccff"
            metalness={0.1}
            roughness={0.0}
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Барабан внутри */}
        <mesh ref={drumRef} position={[0, 0, 1.09]}>
          <torusGeometry args={[0.35, 0.08, 16, 64]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Панель управления сверху */}
        <mesh position={[0, 1.22, 0]} castShadow>
          <boxGeometry args={[2, 0.22, 2]} />
          <meshStandardMaterial color="#d0d0d0" metalness={0.2} roughness={0.3} />
        </mesh>

        {/* Ручки/крутилки */}
        <mesh position={[-0.55, 1.22, 0.7]}>
          <cylinderGeometry args={[0.12, 0.12, 0.15, 32]} />
          <meshStandardMaterial color="#333" metalness={0.8} roughness={0.1} />
        </mesh>
        <mesh position={[0.55, 1.22, 0.7]}>
          <cylinderGeometry args={[0.12, 0.12, 0.15, 32]} />
          <meshStandardMaterial color="#333" metalness={0.8} roughness={0.1} />
        </mesh>

        {/* Подсветка дисплея */}
        <mesh position={[0, 1.22, 0.7]}>
          <boxGeometry args={[0.5, 0.1, 0.05]} />
          <meshStandardMaterial color="#00c8ff" emissive="#00c8ff" emissiveIntensity={2} />
        </mesh>

        {/* Ножки */}
        {[-0.7, 0.7].map((x, i) =>
          [-0.6, 0.6].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, -1.2, z]}>
              <cylinderGeometry args={[0.08, 0.1, 0.2, 16]} />
              <meshStandardMaterial color="#555" metalness={0.9} roughness={0.1} />
            </mesh>
          ))
        )}
      </group>
    </Float>
  );
}

function SceneBackground() {
  return (
    <>
      {/* Пол */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0a0e14" metalness={0.8} roughness={0.5} />
      </mesh>
      {/* Отражение на полу */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.49, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial
          color="#00c8ff"
          transparent
          opacity={0.03}
          metalness={1}
          roughness={0}
        />
      </mesh>
    </>
  );
}

const menuItems = [
  { id: 'workshop', label: 'МАСТЕРСКАЯ', desc: 'Создай свою машину', icon: 'Wrench' },
  { id: 'sandbox', label: 'ПЕСОЧНИЦА', desc: 'Полное управление', icon: 'Gamepad2' },
  { id: 'garage', label: 'ГАРАЖ', desc: 'Коллекция машин', icon: 'Archive' },
  { id: 'customizer', label: 'КАСТОМИЗАЦИЯ', desc: 'Дизайн и детали', icon: 'Palette' },
  { id: 'settings', label: 'НАСТРОЙКИ', desc: 'Параметры игры', icon: 'Settings' },
] as const;

export default function MainMenu() {
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <div className="w-full h-screen flex overflow-hidden" style={{ background: 'var(--game-bg)' }}>
      {/* Сканлайн эффект */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,200,255,0.03) 2px, rgba(0,200,255,0.03) 4px)',
        }}
      />

      {/* 3D сцена слева */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [3, 1.5, 5], fov: 45 }}
          shadows
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={1.5}
              castShadow
            />
            <pointLight position={[-3, 2, 2]} intensity={0.8} color="#00c8ff" />
            <pointLight position={[3, -1, -2]} intensity={0.4} color="#0044ff" />
            <Environment preset="night" />
            <SceneBackground />
            <MenuMachine />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              autoRotate
              autoRotateSpeed={0.5}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 6}
            />
          </Suspense>
        </Canvas>

        {/* Оверлей на 3D */}
        <div className="absolute bottom-8 left-8">
          <div className="font-orbitron text-xs text-blue-400 opacity-60 tracking-widest">
            WASHING SIMULATOR 3D
          </div>
          <div className="font-rajdhani text-sm opacity-40 mt-1">
            v1.0.0 — ULTRA REALISTIC
          </div>
        </div>
      </div>

      {/* Меню справа */}
      <div className="w-[420px] flex flex-col justify-center px-10 relative"
        style={{ background: 'linear-gradient(to right, transparent, var(--game-panel))' }}>

        {/* Декоративная вертикальная линия */}
        <div className="absolute left-0 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--game-blue), transparent)' }} />

        {/* Заголовок */}
        <div className="mb-12">
          <div className="font-orbitron text-4xl font-black mb-2 leading-none"
            style={{ color: 'var(--game-blue)', textShadow: '0 0 30px rgba(0,200,255,0.5)' }}>
            WASH
          </div>
          <div className="font-orbitron text-4xl font-black leading-none text-white">
            SIMULATOR
          </div>
          <div className="font-orbitron text-sm font-bold mt-3 tracking-[0.3em]"
            style={{ color: 'var(--game-orange)' }}>
            3D SANDBOX EDITION
          </div>
          <div className="mt-4 h-px w-32" style={{ background: 'var(--game-blue)', boxShadow: '0 0 8px var(--game-blue)' }} />
        </div>

        {/* Кнопки меню */}
        <nav className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id as Parameters<typeof setScreen>[0])}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-lg transition-all duration-200 group"
              style={{
                background: 'rgba(0,200,255,0.04)',
                border: '1px solid rgba(0,200,255,0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,200,255,0.12)';
                e.currentTarget.style.borderColor = 'rgba(0,200,255,0.5)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,200,255,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,200,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(0,200,255,0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.3)' }}>
                <Icon name={item.icon} size={18} className="text-blue-400" />
              </div>
              <div className="text-left">
                <div className="font-orbitron text-sm font-bold text-white tracking-wider">
                  {item.label}
                </div>
                <div className="font-rajdhani text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {item.desc}
                </div>
              </div>
              <Icon name="ChevronRight" size={16} className="ml-auto opacity-30 group-hover:opacity-70 transition-opacity text-blue-400" />
            </button>
          ))}
        </nav>

        {/* Нижний блок */}
        <div className="mt-12 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--game-green)', boxShadow: '0 0 6px var(--game-green)' }} />
            <span className="font-rajdhani text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Физика воды: АКТИВНА
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--game-green)', boxShadow: '0 0 6px var(--game-green)' }} />
            <span className="font-rajdhani text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              RPM: 400 — 6000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}