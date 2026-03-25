import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import Icon from '@/components/ui/icon';

export default function SettingsScene() {
  const { setScreen } = useGameStore();
  const [graphics, setGraphics] = useState('ultra');
  const [shadows, setShadows] = useState(true);
  const [waterPhysics, setWaterPhysics] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [particles, setParticles] = useState(true);
  const [volume, setVolume] = useState(70);
  const [sfxVolume, setSfxVolume] = useState(80);

  const graphicsOptions = [
    { id: 'low', label: 'Низкое', desc: 'Для слабых устройств' },
    { id: 'medium', label: 'Среднее', desc: 'Оптимальный баланс' },
    { id: 'high', label: 'Высокое', desc: 'Детальная графика' },
    { id: 'ultra', label: 'Ультра', desc: 'Максимальное качество' },
  ];

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className="w-12 h-6 rounded-full transition-all duration-300 relative"
      style={{ background: value ? 'var(--game-blue)' : 'rgba(255,255,255,0.1)' }}
    >
      <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300"
        style={{ left: value ? '26px' : '2px', boxShadow: value ? '0 0 8px rgba(0,200,255,0.5)' : 'none' }} />
    </button>
  );

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col" style={{ background: 'var(--game-bg)' }}>

      {/* Хедер */}
      <div className="flex-shrink-0 flex items-center gap-4 px-8 py-4"
        style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(0,200,255,0.12)' }}>
        <button
          onClick={() => setScreen('menu')}
          className="flex items-center gap-2 font-orbitron text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <Icon name="ArrowLeft" size={14} />
          НАЗАД
        </button>
        <span className="font-orbitron text-sm tracking-widest" style={{ color: 'var(--game-blue)' }}>
          НАСТРОЙКИ
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto space-y-8">

          {/* Графика */}
          <section>
            <h2 className="font-orbitron text-xs tracking-widest mb-4" style={{ color: 'var(--game-blue)' }}>
              ГРАФИКА
            </h2>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {graphicsOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setGraphics(opt.id)}
                  className="p-4 rounded-xl text-center transition-all"
                  style={{
                    background: graphics === opt.id ? 'rgba(0,200,255,0.15)' : 'rgba(255,255,255,0.03)',
                    border: graphics === opt.id ? '1px solid var(--game-blue)' : '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="font-orbitron text-xs font-bold text-white mb-1">{opt.label}</div>
                  <div className="font-rajdhani text-xs text-white/30">{opt.desc}</div>
                </button>
              ))}
            </div>

            <div className="space-y-4 rounded-xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {[
                { label: 'Тени', desc: 'Реалистичное затенение', value: shadows, onChange: setShadows },
                { label: 'Физика воды', desc: 'Симуляция жидкости в барабане', value: waterPhysics, onChange: setWaterPhysics },
                { label: 'Вибрация', desc: 'Анимация вибрации при высоких RPM', value: vibration, onChange: setVibration },
                { label: 'Частицы', desc: 'Брызги воды, пыль, пена', value: particles, onChange: setParticles },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <div className="font-orbitron text-sm text-white">{item.label}</div>
                    <div className="font-rajdhani text-xs text-white/30 mt-0.5">{item.desc}</div>
                  </div>
                  <Toggle value={item.value} onChange={item.onChange} />
                </div>
              ))}
            </div>
          </section>

          {/* Звук */}
          <section>
            <h2 className="font-orbitron text-xs tracking-widest mb-4" style={{ color: 'var(--game-orange)' }}>
              ЗВУК
            </h2>
            <div className="space-y-4 rounded-xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-orbitron text-sm text-white">Музыка</span>
                  <span className="font-orbitron text-sm" style={{ color: 'var(--game-blue)' }}>{volume}%</span>
                </div>
                <input type="range" min={0} max={100} value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, var(--game-blue) ${volume}%, rgba(255,255,255,0.1) ${volume}%)` }}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-orbitron text-sm text-white">Эффекты</span>
                  <span className="font-orbitron text-sm" style={{ color: 'var(--game-orange)' }}>{sfxVolume}%</span>
                </div>
                <input type="range" min={0} max={100} value={sfxVolume}
                  onChange={(e) => setSfxVolume(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, var(--game-orange) ${sfxVolume}%, rgba(255,255,255,0.1) ${sfxVolume}%)` }}
                />
              </div>
            </div>
          </section>

          {/* О игре */}
          <section>
            <h2 className="font-orbitron text-xs tracking-widest mb-4 text-white/30">О ИГРЕ</h2>
            <div className="rounded-xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="font-orbitron text-sm font-bold text-white mb-1">WASH SIMULATOR 3D</div>
              <div className="font-orbitron text-xs text-white/30 mb-3">Sandbox Edition v1.0.0</div>
              <div className="font-rajdhani text-sm text-white/40 leading-relaxed">
                Полный симулятор стиральных машин с фотореалистичной графикой,
                физикой воды, настройкой от 400 до 6000 RPM и режимом песочницы.
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
