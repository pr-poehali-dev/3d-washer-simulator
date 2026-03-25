import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Suspense, useState } from 'react';
import * as THREE from 'three';
import WashingMachine3D from './WashingMachine3D';
import { useGameStore, DrumType, MotorType, KnobType, BodyColor } from '@/store/gameStore';
import Icon from '@/components/ui/icon';

const drumOptions: { id: DrumType; label: string; desc: string }[] = [
  { id: 'standard', label: 'Стандартный', desc: 'Классический барабан с круглыми отверстиями' },
  { id: 'hexagonal', label: 'Гексагональный', desc: '6-гранная геометрия для равномерной стирки' },
  { id: 'perforated', label: 'Перфорированный', desc: 'Максимальная перфорация, быстрый слив' },
  { id: 'diamond', label: 'Алмазный', desc: 'Ромбовидный узор, премиум класс' },
];

const motorOptions: { id: MotorType; label: string; desc: string; power: string }[] = [
  { id: 'belt-drive', label: 'Ременной', desc: 'Классика, надёжность, тихая работа', power: '1200W' },
  { id: 'brushless', label: 'Щёточный', desc: 'Мощный, проверенный временем', power: '1500W' },
  { id: 'inverter', label: 'Инверторный', desc: 'Эффективность и плавная регулировка', power: '1800W' },
  { id: 'direct-drive', label: 'Прямой привод', desc: 'Прямое соединение, макс. RPM', power: '2200W' },
];

const knobOptions: { id: KnobType; label: string }[] = [
  { id: 'round', label: 'Круглые' },
  { id: 'lever', label: 'Рычаги' },
  { id: 'digital', label: 'Цифровые' },
  { id: 'retro', label: 'Ретро' },
];

const colorOptions: { id: BodyColor; label: string; hex: string }[] = [
  { id: 'white', label: 'Белый', hex: '#f0f0f0' },
  { id: 'silver', label: 'Серебро', hex: '#c0c0c8' },
  { id: 'black', label: 'Чёрный', hex: '#1a1a1a' },
  { id: 'chrome', label: 'Хром', hex: '#d8d8e0' },
  { id: 'red', label: 'Красный', hex: '#cc2222' },
  { id: 'blue', label: 'Синий', hex: '#1144cc' },
];

type Tab = 'drum' | 'motor' | 'knobs' | 'color';

export default function WorkshopScene() {
  const { machine, updateMachine, setScreen } = useGameStore();
  const [activeTab, setActiveTab] = useState<Tab>('drum');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'drum', label: 'Барабан', icon: 'Circle' },
    { id: 'motor', label: 'Мотор', icon: 'Zap' },
    { id: 'knobs', label: 'Крутилки', icon: 'Settings2' },
    { id: 'color', label: 'Цвет', icon: 'Palette' },
  ];

  return (
    <div className="w-full h-screen flex overflow-hidden" style={{ background: 'var(--game-bg)' }}>

      {/* Топ-бар */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-3"
        style={{ background: 'rgba(0,0,0,0.7)', borderBottom: '1px solid rgba(0,200,255,0.15)', backdropFilter: 'blur(10px)' }}>
        <button
          onClick={() => setScreen('menu')}
          className="flex items-center gap-2 font-orbitron text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <Icon name="ArrowLeft" size={14} />
          МЕНЮ
        </button>
        <span className="font-orbitron text-xs tracking-widest" style={{ color: 'var(--game-blue)' }}>
          МАСТЕРСКАЯ — {machine.name}
        </span>
        <button
          onClick={() => setScreen('sandbox')}
          className="flex items-center gap-2 font-orbitron text-xs px-4 py-2 rounded-lg transition-all"
          style={{ background: 'rgba(0,200,255,0.15)', border: '1px solid rgba(0,200,255,0.4)', color: 'var(--game-blue)' }}
        >
          ТЕСТИРОВАТЬ
          <Icon name="Play" size={12} />
        </button>
      </div>

      {/* 3D Preview */}
      <div className="flex-1 pt-12">
        <Canvas
          camera={{ position: [3, 2, 5], fov: 45 }}
          shadows
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 8, 5]} intensity={2} castShadow shadow-mapSize={[2048, 2048]} />
            <pointLight position={[-3, 3, 3]} intensity={1} color="#0066ff" />
            <Environment preset="studio" />
            <ContactShadows position={[0, -1.6, 0]} opacity={0.6} scale={6} blur={2} />
            <WashingMachine3D />
            <OrbitControls
              enablePan={false}
              autoRotate
              autoRotateSpeed={1}
              maxPolarAngle={Math.PI / 2.1}
              minDistance={4}
              maxDistance={10}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Боковая панель */}
      <div className="w-96 flex-shrink-0 flex flex-col pt-12"
        style={{ background: 'var(--game-panel)', borderLeft: '1px solid rgba(0,200,255,0.1)' }}>

        {/* Вкладки */}
        <div className="flex border-b" style={{ borderColor: 'rgba(0,200,255,0.1)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center py-3 gap-1 transition-all"
              style={{
                background: activeTab === tab.id ? 'rgba(0,200,255,0.1)' : 'transparent',
                borderBottom: activeTab === tab.id ? '2px solid var(--game-blue)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--game-blue)' : 'rgba(255,255,255,0.35)',
              }}
            >
              <Icon name={tab.icon as Parameters<typeof Icon>[0]['name']} size={16} />
              <span className="font-orbitron text-xs tracking-wide">{tab.label.toUpperCase()}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">

          {/* Барабан */}
          {activeTab === 'drum' && (
            <div className="space-y-3">
              <p className="font-orbitron text-xs tracking-wider text-white/40 mb-4">ТИП БАРАБАНА</p>
              {drumOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateMachine({ drumType: opt.id })}
                  className="w-full p-4 rounded-xl text-left transition-all"
                  style={{
                    background: machine.drumType === opt.id ? 'rgba(0,200,255,0.15)' : 'rgba(255,255,255,0.03)',
                    border: machine.drumType === opt.id ? '1px solid var(--game-blue)' : '1px solid rgba(255,255,255,0.07)',
                    boxShadow: machine.drumType === opt.id ? '0 0 15px rgba(0,200,255,0.2)' : 'none',
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-orbitron text-sm font-bold text-white">{opt.label}</span>
                    {machine.drumType === opt.id && (
                      <Icon name="CheckCircle" size={14} className="text-blue-400" />
                    )}
                  </div>
                  <p className="font-rajdhani text-xs text-white/40">{opt.desc}</p>
                </button>
              ))}
            </div>
          )}

          {/* Мотор */}
          {activeTab === 'motor' && (
            <div className="space-y-3">
              <p className="font-orbitron text-xs tracking-wider text-white/40 mb-4">ТИП МОТОРА</p>
              {motorOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateMachine({ motorType: opt.id })}
                  className="w-full p-4 rounded-xl text-left transition-all"
                  style={{
                    background: machine.motorType === opt.id ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.03)',
                    border: machine.motorType === opt.id ? '1px solid var(--game-orange)' : '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-orbitron text-sm font-bold text-white">{opt.label}</span>
                    <span className="font-orbitron text-xs" style={{ color: 'var(--game-orange)' }}>{opt.power}</span>
                  </div>
                  <p className="font-rajdhani text-xs text-white/40">{opt.desc}</p>
                </button>
              ))}
            </div>
          )}

          {/* Крутилки */}
          {activeTab === 'knobs' && (
            <div className="space-y-3">
              <p className="font-orbitron text-xs tracking-wider text-white/40 mb-4">ТИП КРУТИЛОК</p>
              <div className="grid grid-cols-2 gap-3">
                {knobOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateMachine({ knobType: opt.id })}
                    className="p-4 rounded-xl text-center transition-all"
                    style={{
                      background: machine.knobType === opt.id ? 'rgba(0,200,255,0.15)' : 'rgba(255,255,255,0.03)',
                      border: machine.knobType === opt.id ? '1px solid var(--game-blue)' : '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <Icon name="Settings2" size={24} className={machine.knobType === opt.id ? 'text-blue-400 mx-auto mb-2' : 'text-white/30 mx-auto mb-2'} />
                    <div className="font-orbitron text-xs text-white">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Цвет */}
          {activeTab === 'color' && (
            <div className="space-y-3">
              <p className="font-orbitron text-xs tracking-wider text-white/40 mb-4">ЦВЕТ КОРПУСА</p>

              {/* Название машины */}
              <div className="mb-4">
                <label className="font-orbitron text-xs text-white/40 block mb-2">НАЗВАНИЕ</label>
                <input
                  type="text"
                  value={machine.name}
                  onChange={(e) => updateMachine({ name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl font-orbitron text-sm text-white outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(0,200,255,0.2)',
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateMachine({ bodyColor: opt.id })}
                    className="p-3 rounded-xl flex flex-col items-center gap-2 transition-all"
                    style={{
                      background: machine.bodyColor === opt.id ? 'rgba(0,200,255,0.15)' : 'rgba(255,255,255,0.03)',
                      border: machine.bodyColor === opt.id ? '1px solid var(--game-blue)' : '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <div className="w-10 h-10 rounded-full border-2"
                      style={{ background: opt.hex, borderColor: machine.bodyColor === opt.id ? 'var(--game-blue)' : 'transparent' }} />
                    <span className="font-rajdhani text-xs text-white">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Кнопка тестировать внизу */}
        <div className="p-5 border-t" style={{ borderColor: 'rgba(0,200,255,0.1)' }}>
          <button
            onClick={() => setScreen('sandbox')}
            className="w-full py-4 rounded-xl font-orbitron text-sm font-bold tracking-wider transition-all btn-primary"
          >
            ЗАПУСТИТЬ В ПЕСОЧНИЦЕ
          </button>
        </div>
      </div>
    </div>
  );
}
