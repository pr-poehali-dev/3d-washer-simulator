import { useGameStore } from '@/store/gameStore';
import Icon from '@/components/ui/icon';

const prebuiltMachines = [
  {
    id: 'classic',
    name: 'ClassicWash Pro',
    drum: 'Стандартный',
    motor: 'Ременной',
    color: '#f0f0f0',
    maxRpm: 1600,
    rating: 4,
    tier: 'Базовый',
  },
  {
    id: 'sport',
    name: 'TurboSpin X3',
    drum: 'Перфорированный',
    motor: 'Инверторный',
    color: '#cc2222',
    maxRpm: 4000,
    rating: 5,
    tier: 'Спорт',
  },
  {
    id: 'ultra',
    name: 'UltraDrive DD7',
    drum: 'Алмазный',
    motor: 'Прямой привод',
    color: '#1a1a1a',
    maxRpm: 6000,
    rating: 5,
    tier: 'Ультра',
  },
  {
    id: 'hex',
    name: 'HexWave Silver',
    drum: 'Гексагональный',
    motor: 'Щёточный',
    color: '#c0c0c8',
    maxRpm: 2800,
    rating: 4,
    tier: 'Средний',
  },
  {
    id: 'chrome',
    name: 'ChromeMaster',
    drum: 'Алмазный',
    motor: 'Прямой привод',
    color: '#d8d8e0',
    maxRpm: 6000,
    rating: 5,
    tier: 'Элита',
  },
  {
    id: 'azure',
    name: 'AzureFlow',
    drum: 'Перфорированный',
    motor: 'Инверторный',
    color: '#1144cc',
    maxRpm: 3200,
    rating: 4,
    tier: 'Продвинутый',
  },
];

export default function GarageScene() {
  const { setScreen, updateMachine } = useGameStore();

  const selectMachine = (m: typeof prebuiltMachines[0]) => {
    updateMachine({
      name: m.name,
      bodyColor: m.color === '#f0f0f0' ? 'white' :
        m.color === '#cc2222' ? 'red' :
        m.color === '#1a1a1a' ? 'black' :
        m.color === '#c0c0c8' ? 'silver' :
        m.color === '#d8d8e0' ? 'chrome' : 'blue',
      rpm: m.maxRpm,
    });
    setScreen('sandbox');
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col" style={{ background: 'var(--game-bg)' }}>

      {/* Хедер */}
      <div className="flex-shrink-0 flex items-center justify-between px-8 py-4"
        style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(0,200,255,0.12)' }}>
        <button
          onClick={() => setScreen('menu')}
          className="flex items-center gap-2 font-orbitron text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <Icon name="ArrowLeft" size={14} />
          НАЗАД
        </button>
        <div>
          <span className="font-orbitron text-lg font-bold" style={{ color: 'var(--game-blue)' }}>
            ГАРАЖ
          </span>
          <span className="font-orbitron text-xs text-white/30 ml-3">— КОЛЛЕКЦИЯ МАШИН</span>
        </div>
        <button
          onClick={() => setScreen('workshop')}
          className="flex items-center gap-2 font-orbitron text-xs px-4 py-2 rounded-lg"
          style={{ background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.3)', color: 'var(--game-blue)' }}
        >
          <Icon name="Plus" size={12} />
          СОЗДАТЬ НОВУЮ
        </button>
      </div>

      {/* Сетка машин */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
          {prebuiltMachines.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = '1px solid rgba(0,200,255,0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Превью */}
              <div className="h-40 flex items-center justify-center relative overflow-hidden"
                style={{ background: `radial-gradient(ellipse at center, ${m.color}22 0%, #050810 70%)` }}>
                {/* Схематичный силуэт */}
                <div className="relative">
                  <div className="w-20 h-22 rounded-lg flex items-center justify-center"
                    style={{ background: m.color, boxShadow: `0 0 30px ${m.color}44` }}>
                    <div className="w-12 h-12 rounded-full border-4 border-white/20 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border-2 border-white/40" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 right-3 font-orbitron text-xs px-2 py-0.5 rounded"
                  style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                  {m.tier}
                </div>
              </div>

              {/* Инфо */}
              <div className="p-5">
                <div className="font-orbitron text-sm font-bold text-white mb-3">{m.name}</div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between">
                    <span className="font-rajdhani text-xs text-white/40">Барабан</span>
                    <span className="font-rajdhani text-xs text-white/70">{m.drum}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-rajdhani text-xs text-white/40">Мотор</span>
                    <span className="font-rajdhani text-xs text-white/70">{m.motor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-rajdhani text-xs text-white/40">Макс. RPM</span>
                    <span className="font-orbitron text-xs font-bold" style={{ color: m.maxRpm >= 5000 ? '#ff3333' : m.maxRpm >= 3000 ? '#ffaa00' : '#00ff88' }}>
                      {m.maxRpm.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Рейтинг */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-4 h-1 rounded-full"
                      style={{ background: i < m.rating ? 'var(--game-blue)' : 'rgba(255,255,255,0.1)' }} />
                  ))}
                </div>

                <button
                  onClick={() => selectMachine(m)}
                  className="w-full py-2.5 rounded-lg font-orbitron text-xs font-bold tracking-wider transition-all"
                  style={{
                    background: 'rgba(0,200,255,0.1)',
                    border: '1px solid rgba(0,200,255,0.3)',
                    color: 'var(--game-blue)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,200,255,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,200,255,0.1)';
                  }}
                >
                  ВЫБРАТЬ И ЗАПУСТИТЬ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
