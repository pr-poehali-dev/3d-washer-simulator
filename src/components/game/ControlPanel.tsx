import { useGameStore } from '@/store/gameStore';
import Icon from '@/components/ui/icon';

const programs = [
  { id: 'cotton', label: 'Хлопок', rpm: 1200, temp: 60, time: 90 },
  { id: 'synthetic', label: 'Синтетика', rpm: 800, temp: 40, time: 60 },
  { id: 'delicate', label: 'Деликатная', rpm: 400, temp: 30, time: 45 },
  { id: 'sport', label: 'Спорт', rpm: 1600, temp: 40, time: 75 },
  { id: 'quick', label: 'Быстрая', rpm: 1000, temp: 30, time: 15 },
  { id: 'max', label: 'ТУРБО MAX', rpm: 6000, temp: 95, time: 120 },
];

export default function ControlPanel() {
  const {
    machine,
    setRpm,
    setWaterLevel,
    setTemperature,
    toggleRunning,
    toggleDoor,
    doorOpen,
    updateMachine,
    setScreen,
  } = useGameStore();

  const handleProgram = (p: typeof programs[0]) => {
    setRpm(p.rpm);
    setTemperature(p.temp);
  };

  const rpmPercent = ((machine.rpm - 400) / (6000 - 400)) * 100;
  const rpmColor = machine.rpm < 2000 ? '#00ff88' : machine.rpm < 4000 ? '#ffaa00' : '#ff3333';

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-1"
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,200,255,0.3) transparent' }}>

      {/* Статус машины */}
      <div className="rounded-xl p-4" style={{
        background: 'rgba(0,200,255,0.05)',
        border: '1px solid rgba(0,200,255,0.2)',
      }}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-orbitron text-xs tracking-widest text-white/60">СТАТУС</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full pulse-glow"
              style={{ background: machine.isRunning ? 'var(--game-green)' : '#555' }} />
            <span className="font-orbitron text-xs" style={{ color: machine.isRunning ? 'var(--game-green)' : '#555' }}>
              {machine.isRunning ? 'РАБОТАЕТ' : 'СТОП'}
            </span>
          </div>
        </div>

        {/* RPM индикатор */}
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="font-rajdhani text-sm text-white/50">Обороты</span>
            <span className="font-orbitron text-sm font-bold" style={{ color: rpmColor }}>
              {machine.rpm.toLocaleString()} RPM
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${rpmPercent}%`,
                background: `linear-gradient(to right, #00ff88, ${rpmColor})`,
                boxShadow: `0 0 8px ${rpmColor}`,
              }} />
          </div>
        </div>

        {/* Температура */}
        <div className="flex justify-between">
          <span className="font-rajdhani text-sm text-white/50">Температура</span>
          <span className="font-orbitron text-sm" style={{ color: '#ff8844' }}>
            {machine.temperature}°C
          </span>
        </div>
      </div>

      {/* Слайдер RPM */}
      <div className="rounded-xl p-4" style={{
        background: 'rgba(255,107,0,0.05)',
        border: '1px solid rgba(255,107,0,0.2)',
      }}>
        <div className="flex justify-between mb-2">
          <span className="font-orbitron text-xs tracking-wider text-white/60">ОБОРОТЫ</span>
          <span className="font-orbitron text-sm font-bold" style={{ color: rpmColor }}>
            {machine.rpm.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={400}
          max={6000}
          step={100}
          value={machine.rpm}
          onChange={(e) => setRpm(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #00ff88 0%, #ffaa00 50%, #ff3333 100%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="font-rajdhani text-xs text-white/30">400</span>
          <span className="font-rajdhani text-xs text-white/30">6000</span>
        </div>
      </div>

      {/* Уровень воды */}
      <div className="rounded-xl p-4" style={{
        background: 'rgba(0,68,255,0.05)',
        border: '1px solid rgba(0,68,255,0.25)',
      }}>
        <div className="flex justify-between mb-2">
          <span className="font-orbitron text-xs tracking-wider text-white/60">ВОДА</span>
          <span className="font-orbitron text-sm" style={{ color: '#4488ff' }}>
            {Math.round(machine.waterLevel * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={machine.waterLevel}
          onChange={(e) => setWaterLevel(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #001133, #4488ff)` }}
        />
      </div>

      {/* Температура */}
      <div className="rounded-xl p-4" style={{
        background: 'rgba(255,100,0,0.05)',
        border: '1px solid rgba(255,100,0,0.2)',
      }}>
        <div className="flex justify-between mb-2">
          <span className="font-orbitron text-xs tracking-wider text-white/60">ТЕМПЕРАТУРА</span>
          <span className="font-orbitron text-sm" style={{ color: '#ff8844' }}>
            {machine.temperature}°C
          </span>
        </div>
        <input
          type="range"
          min={20}
          max={95}
          step={5}
          value={machine.temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #0044ff, #ff4400)` }}
        />
      </div>

      {/* Программы */}
      <div className="rounded-xl p-4" style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <span className="font-orbitron text-xs tracking-wider text-white/60 block mb-3">ПРОГРАММЫ</span>
        <div className="grid grid-cols-2 gap-2">
          {programs.map((p) => (
            <button
              key={p.id}
              onClick={() => handleProgram(p)}
              className="px-3 py-2 rounded-lg text-left transition-all duration-200"
              style={{
                background: p.id === 'max' ? 'rgba(255,51,51,0.15)' : 'rgba(0,200,255,0.07)',
                border: p.id === 'max' ? '1px solid rgba(255,51,51,0.4)' : '1px solid rgba(0,200,255,0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = p.id === 'max' ? 'rgba(255,51,51,0.25)' : 'rgba(0,200,255,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = p.id === 'max' ? 'rgba(255,51,51,0.15)' : 'rgba(0,200,255,0.07)';
              }}
            >
              <div className="font-rajdhani text-xs font-bold text-white">{p.label}</div>
              <div className="font-rajdhani text-xs text-white/40 mt-0.5">
                {p.rpm.toLocaleString()} RPM · {p.temp}°
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Управление */}
      <div className="flex gap-2">
        <button
          onClick={toggleRunning}
          className="flex-1 py-3 rounded-xl font-orbitron text-sm font-bold tracking-wider transition-all duration-200"
          style={{
            background: machine.isRunning
              ? 'rgba(255,51,51,0.2)'
              : 'linear-gradient(135deg, rgba(0,180,80,0.3), rgba(0,255,136,0.2))',
            border: machine.isRunning ? '1px solid #ff3333' : '1px solid #00ff88',
            color: machine.isRunning ? '#ff3333' : '#00ff88',
            boxShadow: machine.isRunning ? '0 0 15px rgba(255,51,51,0.3)' : '0 0 15px rgba(0,255,136,0.3)',
          }}
        >
          {machine.isRunning ? 'СТОП' : 'СТАРТ'}
        </button>

        <button
          onClick={toggleDoor}
          className="px-4 py-3 rounded-xl transition-all duration-200"
          style={{
            background: doorOpen ? 'rgba(255,170,0,0.2)' : 'rgba(0,200,255,0.1)',
            border: doorOpen ? '1px solid rgba(255,170,0,0.5)' : '1px solid rgba(0,200,255,0.3)',
          }}
        >
          <Icon name={doorOpen ? 'DoorOpen' : 'DoorClosed'} size={18}
            className={doorOpen ? 'text-yellow-400' : 'text-blue-400'} />
        </button>

        <button
          onClick={() => updateMachine({ bodyColor: 'white', rpm: 1200, waterLevel: 0, temperature: 40, isRunning: false })}
          className="px-4 py-3 rounded-xl transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Icon name="RotateCcw" size={18} className="text-white/40" />
        </button>
      </div>

      {/* Назад */}
      <button
        onClick={() => setScreen('menu')}
        className="w-full py-2 rounded-lg font-rajdhani text-sm transition-all"
        style={{ color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
      >
        ← Главное меню
      </button>
    </div>
  );
}
