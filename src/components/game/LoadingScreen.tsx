import { useEffect, useState } from 'react';

interface Props {
  onComplete?: () => void;
}

const loadingSteps = [
  'Инициализация физического движка...',
  'Загрузка материалов и текстур...',
  'Компиляция шейдеров...',
  'Подготовка физики воды...',
  'Калибровка барабанов...',
  'Запуск симулятора...',
];

export default function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 4 + 1.5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDone(true);
            setFadeOut(true);
            setTimeout(() => onComplete?.(), 600);
          }, 400);
          return 100;
        }
        setStepIndex(Math.floor((next / 100) * loadingSteps.length));
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500"
      style={{
        background: 'var(--game-bg)',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* Фоновые линии */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-px opacity-10"
            style={{
              top: `${10 + i * 11}%`,
              left: 0,
              right: 0,
              background: 'linear-gradient(to right, transparent, var(--game-blue), transparent)',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Центральный блок */}
      <div className="flex flex-col items-center gap-8 w-80">

        {/* Анимированный барабан */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Внешнее кольцо */}
          <div
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: 'rgba(0,200,255,0.2)',
              borderTopColor: 'var(--game-blue)',
              animation: 'spin 2s linear infinite',
              boxShadow: '0 0 20px rgba(0,200,255,0.2)',
            }}
          />
          {/* Среднее кольцо */}
          <div
            className="absolute inset-4 rounded-full border-2"
            style={{
              borderColor: 'rgba(0,200,255,0.1)',
              borderBottomColor: 'rgba(0,200,255,0.6)',
              animation: 'spin 1.5s linear infinite reverse',
            }}
          />
          {/* Центральный элемент */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(0,200,255,0.2) 0%, transparent 70%)',
              border: '1px solid rgba(0,200,255,0.4)',
            }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: 'var(--game-blue)',
                boxShadow: '0 0 12px var(--game-blue)',
                animation: 'pulse-glow 1s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* Заголовок */}
        <div className="text-center">
          <div
            className="font-orbitron text-3xl font-black mb-1"
            style={{ color: 'var(--game-blue)', textShadow: '0 0 20px rgba(0,200,255,0.4)' }}
          >
            WASH
          </div>
          <div className="font-orbitron text-3xl font-black text-white">SIMULATOR</div>
          <div
            className="font-orbitron text-xs tracking-[0.3em] mt-2"
            style={{ color: 'var(--game-orange)' }}
          >
            3D SANDBOX EDITION
          </div>
        </div>

        {/* Прогресс-бар */}
        <div className="w-full">
          <div
            className="h-1 rounded-full overflow-hidden mb-3"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(to right, #0066cc, var(--game-blue))',
                boxShadow: '0 0 10px rgba(0,200,255,0.6)',
              }}
            />
          </div>

          <div className="flex justify-between items-center">
            <span
              className="font-rajdhani text-xs transition-all duration-300"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              {loadingSteps[Math.min(stepIndex, loadingSteps.length - 1)]}
            </span>
            <span
              className="font-orbitron text-sm font-bold"
              style={{ color: done ? 'var(--game-green)' : 'var(--game-blue)' }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Нижние индикаторы */}
        <div className="flex gap-3">
          {['ФИЗИКА', 'ГРАФИКА', '3D', 'ЗВУК'].map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-1 rounded-full transition-all duration-300"
                style={{
                  background: progress >= (i + 1) * 25
                    ? 'var(--game-blue)'
                    : 'rgba(255,255,255,0.1)',
                  boxShadow: progress >= (i + 1) * 25 ? '0 0 6px var(--game-blue)' : 'none',
                }}
              />
              <span className="font-orbitron text-xs" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '9px' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
