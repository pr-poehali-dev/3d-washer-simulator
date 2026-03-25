import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import WashingMachine3D from './WashingMachine3D';
import ControlPanel from './ControlPanel';
import { useGameStore } from '@/store/gameStore';
import Icon from '@/components/ui/icon';

function Room() {
  return (
    <group>
      {/* Пол */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0c1018" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Задняя стена */}
      <mesh position={[0, 3, -6]} receiveShadow>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#0a0d14" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Боковые стены */}
      <mesh position={[-8, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#090c12" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Сетка на полу */}
      <gridHelper args={[20, 20, '#0a3050', '#0a2030']} position={[0, -1.59, 0]} />
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  );
}

export default function SandboxScene() {
  const { machine, setScreen } = useGameStore();
  const rpmColor = machine.rpm < 2000 ? '#00ff88' : machine.rpm < 4000 ? '#ffaa00' : '#ff3333';

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden" style={{ background: 'var(--game-bg)' }}>

      {/* Топ-бар */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3"
        style={{ background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(0,200,255,0.15)', backdropFilter: 'blur(10px)' }}>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setScreen('menu')}
            className="flex items-center gap-2 font-orbitron text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <Icon name="ArrowLeft" size={14} />
            МЕНЮ
          </button>
          <div className="w-px h-5 bg-white/10" />
          <span className="font-orbitron text-xs tracking-widest" style={{ color: 'var(--game-blue)' }}>
            РЕЖИМ ПЕСОЧНИЦЫ
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full"
              style={{ background: machine.isRunning ? 'var(--game-green)' : '#444', boxShadow: machine.isRunning ? '0 0 6px #00ff88' : 'none' }} />
            <span className="font-orbitron text-xs" style={{ color: machine.isRunning ? 'var(--game-green)' : '#444' }}>
              {machine.isRunning ? 'АКТИВНО' : 'ПРОСТОЙ'}
            </span>
          </div>
          <div className="font-orbitron text-sm font-bold" style={{ color: rpmColor }}>
            {machine.isRunning ? machine.rpm.toLocaleString() : '0'} RPM
          </div>
          <div className="font-orbitron text-xs" style={{ color: '#ff8844' }}>
            {machine.temperature}°C
          </div>
          <div className="font-orbitron text-xs" style={{ color: '#4488ff' }}>
            ВОДА {Math.round(machine.waterLevel * 100)}%
          </div>
        </div>
      </div>

      {/* Основная область */}
      <div className="flex flex-1 overflow-hidden">

        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas
            camera={{ position: [5, 3, 6], fov: 45 }}
            shadows
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          >
            <Suspense fallback={<LoadingFallback />}>
              {/* Освещение */}
              <ambientLight intensity={0.4} color="#1a2030" />
              <directionalLight
                position={[8, 10, 5]}
                intensity={2}
                castShadow
              />
              <pointLight position={[-4, 4, 2]} intensity={1.2} color="#0066ff" />
              <pointLight position={[4, 2, -3]} intensity={0.6} color="#002244" />
              <spotLight
                position={[0, 8, 0]}
                intensity={2}
                angle={0.4}
                penumbra={0.5}
                castShadow
                color="#ffffff"
              />
              {machine.isRunning && (
                <pointLight
                  position={[0, 0, 3]}
                  intensity={machine.rpm / 3000}
                  color="#00aaff"
                  distance={5}
                />
              )}

              <Environment preset="warehouse" />
              <Room />

              {/* Тени */}
              <ContactShadows
                position={[0, -1.59, 0]}
                opacity={0.8}
                scale={8}
                blur={2}
                far={4}
                color="#000022"
              />

              <WashingMachine3D />

              <OrbitControls
                enablePan={true}
                enableZoom={true}
                maxPolarAngle={Math.PI / 2.1}
                minDistance={3}
                maxDistance={15}
              />

            </Suspense>
          </Canvas>

          {/* Подсказки управления */}
          <div className="absolute bottom-4 left-4 pointer-events-none">
            <div className="font-rajdhani text-xs text-white/25 space-y-1">
              <div>ЛКМ: вращение камеры</div>
              <div>ПКМ: перемещение</div>
              <div>Колёсо: масштаб</div>
            </div>
          </div>

          {/* Эффект виньетки при высоких RPM */}
          {machine.isRunning && machine.rpm > 3000 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, transparent 50%, rgba(255,51,51,${(machine.rpm - 3000) / 30000}) 100%)`,
              }}
            />
          )}
        </div>

        {/* Панель управления */}
        <div className="w-80 flex-shrink-0 p-4 overflow-y-auto"
          style={{ background: 'var(--game-panel)', borderLeft: '1px solid rgba(0,200,255,0.1)' }}>

          <div className="font-orbitron text-xs tracking-widest mb-4" style={{ color: 'var(--game-blue)' }}>
            ПАНЕЛЬ УПРАВЛЕНИЯ
          </div>

          <ControlPanel />
        </div>
      </div>
    </div>
  );
}