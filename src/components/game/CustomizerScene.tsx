import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Suspense, useState } from 'react';
import * as THREE from 'three';
import WashingMachine3D from './WashingMachine3D';
import { useGameStore } from '@/store/gameStore';
import Icon from '@/components/ui/icon';

const decals = [
  { id: 'flames', label: 'Пламя', icon: 'Flame' },
  { id: 'lightning', label: 'Молния', icon: 'Zap' },
  { id: 'stars', label: 'Звёзды', icon: 'Star' },
  { id: 'skull', label: 'Череп', icon: 'Skull' },
  { id: 'wave', label: 'Волны', icon: 'Waves' },
  { id: 'circuit', label: 'Схема', icon: 'Circuit' },
];

const finishes = [
  { id: 'matte', label: 'Матовый', metalness: 0.1, roughness: 0.9 },
  { id: 'glossy', label: 'Глянец', metalness: 0.3, roughness: 0.1 },
  { id: 'metallic', label: 'Металлик', metalness: 0.9, roughness: 0.2 },
  { id: 'brushed', label: 'Шлифованный', metalness: 0.8, roughness: 0.4 },
];

export default function CustomizerScene() {
  const { machine, updateMachine, setScreen } = useGameStore();
  const [selectedDecal, setSelectedDecal] = useState<string | null>(null);
  const [selectedFinish, setSelectedFinish] = useState('glossy');
  const [glowEnabled, setGlowEnabled] = useState(false);
  const [glowColor, setGlowColor] = useState('#00c8ff');

  return (
    <div className="w-full h-screen flex overflow-hidden" style={{ background: 'var(--game-bg)' }}>

      {/* Хедер */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-3"
        style={{ background: 'rgba(0,0,0,0.7)', borderBottom: '1px solid rgba(0,200,255,0.12)', backdropFilter: 'blur(10px)' }}>
        <button
          onClick={() => setScreen('menu')}
          className="flex items-center gap-2 font-orbitron text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <Icon name="ArrowLeft" size={14} />
          МЕНЮ
        </button>
        <span className="font-orbitron text-xs tracking-widest" style={{ color: 'var(--game-blue)' }}>
          КАСТОМИЗАЦИЯ — {machine.name}
        </span>
        <button
          onClick={() => setScreen('workshop')}
          className="font-orbitron text-xs px-4 py-2 rounded-lg transition-all"
          style={{ background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.3)', color: 'var(--game-blue)' }}
        >
          МАСТЕРСКАЯ
        </button>
      </div>

      {/* 3D */}
      <div className="flex-1 pt-12">
        <Canvas
          camera={{ position: [3, 2, 5], fov: 45 }}
          shadows
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.3 }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 8, 5]} intensity={2} castShadow />
            <pointLight position={[-3, 2, 3]} intensity={1} color="#0066ff" />
            {glowEnabled && <pointLight position={[0, 0, 2]} intensity={3} color={glowColor} distance={4} />}
            <Environment preset="studio" />
            <ContactShadows position={[0, -1.6, 0]} opacity={0.7} scale={6} blur={1.5} />
            <WashingMachine3D />
            <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.8} minDistance={3} maxDistance={10} />
          </Suspense>
        </Canvas>
      </div>

      {/* Боковая панель */}
      <div className="w-80 flex-shrink-0 flex flex-col pt-12"
        style={{ background: 'var(--game-panel)', borderLeft: '1px solid rgba(0,200,255,0.1)' }}>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* Декали */}
          <section>
            <p className="font-orbitron text-xs tracking-wider text-white/40 mb-3">ДЕКАЛИ / НАКЛЕЙКИ</p>
            <div className="grid grid-cols-3 gap-2">
              {decals.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDecal(selectedDecal === d.id ? null : d.id)}
                  className="p-3 rounded-xl flex flex-col items-center gap-2 transition-all"
                  style={{
                    background: selectedDecal === d.id ? 'rgba(255,107,0,0.2)' : 'rgba(255,255,255,0.03)',
                    border: selectedDecal === d.id ? '1px solid var(--game-orange)' : '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <Icon name={d.icon as Parameters<typeof Icon>[0]['name']} size={20}
                    className={selectedDecal === d.id ? 'text-orange-400' : 'text-white/30'} />
                  <span className="font-rajdhani text-xs text-white/60">{d.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Покрытие */}
          <section>
            <p className="font-orbitron text-xs tracking-wider text-white/40 mb-3">ПОКРЫТИЕ</p>
            <div className="grid grid-cols-2 gap-2">
              {finishes.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFinish(f.id)}
                  className="p-3 rounded-xl text-center transition-all"
                  style={{
                    background: selectedFinish === f.id ? 'rgba(0,200,255,0.15)' : 'rgba(255,255,255,0.03)',
                    border: selectedFinish === f.id ? '1px solid var(--game-blue)' : '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="font-orbitron text-xs text-white">{f.label}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Подсветка */}
          <section>
            <p className="font-orbitron text-xs tracking-wider text-white/40 mb-3">RGB ПОДСВЕТКА</p>
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-orbitron text-sm text-white">Подсветка</span>
                <button
                  onClick={() => setGlowEnabled(!glowEnabled)}
                  className="w-12 h-6 rounded-full transition-all duration-300 relative"
                  style={{ background: glowEnabled ? 'var(--game-blue)' : 'rgba(255,255,255,0.1)' }}
                >
                  <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300"
                    style={{ left: glowEnabled ? '26px' : '2px' }} />
                </button>
              </div>

              {glowEnabled && (
                <div>
                  <p className="font-rajdhani text-xs text-white/40 mb-2">ЦВЕТ ПОДСВЕТКИ</p>
                  <div className="flex gap-2">
                    {['#00c8ff', '#ff3333', '#00ff88', '#ff6b00', '#aa44ff', '#ffffff'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setGlowColor(c)}
                        className="w-8 h-8 rounded-full transition-all"
                        style={{
                          background: c,
                          border: glowColor === c ? '2px solid white' : '2px solid transparent',
                          boxShadow: glowColor === c ? `0 0 10px ${c}` : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Имя машины */}
          <section>
            <p className="font-orbitron text-xs tracking-wider text-white/40 mb-3">НАЗВАНИЕ</p>
            <input
              type="text"
              value={machine.name}
              onChange={(e) => updateMachine({ name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl font-orbitron text-sm text-white outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,200,255,0.2)' }}
              placeholder="Название машины..."
            />
          </section>
        </div>

        <div className="p-5 border-t" style={{ borderColor: 'rgba(0,200,255,0.1)' }}>
          <button
            onClick={() => setScreen('sandbox')}
            className="w-full py-4 rounded-xl font-orbitron text-sm font-bold tracking-wider btn-primary"
          >
            ЗАПУСТИТЬ В ПЕСОЧНИЦЕ
          </button>
        </div>
      </div>
    </div>
  );
}
