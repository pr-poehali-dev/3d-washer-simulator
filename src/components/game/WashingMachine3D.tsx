import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

interface Props {
  showDoor?: boolean;
}

function WaterParticles({ count = 80, active }: { count?: number; active: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const positions = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.9,
      y: (Math.random() - 0.5) * 0.9,
      z: 0,
      vx: (Math.random() - 0.5) * 0.01,
      vy: (Math.random() - 0.5) * 0.01,
      phase: Math.random() * Math.PI * 2,
    })), [count]);

  useFrame((state) => {
    if (!mesh.current || !active) return;
    const t = state.clock.elapsedTime;
    positions.forEach((p, i) => {
      const wave = Math.sin(t * 4 + p.phase) * 0.05;
      dummy.position.set(p.x + wave, p.y + wave * 0.5, p.z + 0.02);
      dummy.scale.setScalar(0.04 + Math.sin(t * 2 + p.phase) * 0.01);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#4488ff"
        transparent
        opacity={0.7}
        metalness={0}
        roughness={0}
        emissive="#0044ff"
        emissiveIntensity={0.3}
      />
    </instancedMesh>
  );
}

function WaterSurface({ level, rpm }: { level: number; rpm: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(1.6, 1.6, 32, 32), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const speed = rpm / 1000;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const wave = Math.sin(x * 4 + t * speed * 3) * 0.03
        + Math.cos(y * 3 + t * speed * 2) * 0.025
        + Math.sin((x + y) * 5 + t * speed * 4) * 0.015;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  if (level <= 0) return null;
  const waterY = -1.0 + level * 1.8;

  return (
    <mesh ref={meshRef} geometry={geo} position={[0, waterY, 0.3]} rotation={[0, 0, 0]}>
      <meshStandardMaterial
        color="#1a6aff"
        transparent
        opacity={0.6}
        metalness={0.2}
        roughness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Drum({ type, rpm, isRunning }: { type: string; rpm: number; isRunning: boolean }) {
  const drumRef = useRef<THREE.Group>(null);
  const rpmRef = useRef(0);

  useFrame((_, delta) => {
    if (!drumRef.current) return;
    const targetRpm = isRunning ? rpm : 0;
    rpmRef.current += (targetRpm - rpmRef.current) * delta * 2;
    drumRef.current.rotation.z += (rpmRef.current / 60) * delta * Math.PI * 2;
  });

  const holeCount = type === 'hexagonal' ? 6 : type === 'diamond' ? 8 : 12;
  const drumRadius = 0.72;

  return (
    <group ref={drumRef}>
      {/* Барабан — цилиндр */}
      <mesh>
        <cylinderGeometry args={[drumRadius, drumRadius, 1.5, 64, 1, true]} />
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.95}
          roughness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Передняя крышка барабана */}
      <mesh position={[0, 0.76, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, drumRadius, 64]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Задняя крышка */}
      <mesh position={[0, -0.76, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.0, drumRadius, 64]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Рёбра барабана */}
      {Array.from({ length: holeCount }).map((_, i) => {
        const angle = (i / holeCount) * Math.PI * 2;
        return (
          <mesh key={i} position={[
            Math.cos(angle) * (drumRadius - 0.02),
            0,
            Math.sin(angle) * (drumRadius - 0.02)
          ]} rotation={[0, -angle + Math.PI / 2, 0]}>
            <boxGeometry args={[0.03, 1.4, 0.06]} />
            <meshStandardMaterial color="#888" metalness={0.95} roughness={0.05} />
          </mesh>
        );
      })}

      {/* Отверстия (имитация) */}
      {Array.from({ length: 3 }).map((_, ring) =>
        Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const r = drumRadius - 0.08;
          const y = (ring - 1) * 0.45;
          return (
            <mesh key={`hole-${ring}-${i}`} position={[
              Math.cos(angle) * r,
              y,
              Math.sin(angle) * r
            ]}>
              <circleGeometry args={[0.04, 8]} />
              <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
            </mesh>
          );
        })
      )}
    </group>
  );
}

export default function WashingMachine3D({ showDoor = true }: Props) {
  const { machine, doorOpen, isWaterVisible } = useGameStore();
  const vibRef = useRef<THREE.Group>(null);
  const vibPhaseRef = useRef(0);

  useFrame((_, delta) => {
    if (!vibRef.current) return;
    if (machine.isRunning && machine.rpm > 800) {
      vibPhaseRef.current += delta * machine.rpm * 0.1;
      const vibAmp = Math.min((machine.rpm / 6000) * 0.015, 0.015);
      vibRef.current.position.x = Math.sin(vibPhaseRef.current * 15) * vibAmp;
      vibRef.current.position.y = Math.abs(Math.sin(vibPhaseRef.current * 12)) * vibAmp * 0.5;
    } else {
      vibRef.current.position.x *= 0.9;
      vibRef.current.position.y *= 0.9;
    }
  });

  const bodyColors: Record<string, string> = {
    white: '#f0f0f0',
    silver: '#c0c0c8',
    black: '#1a1a1a',
    chrome: '#d8d8e0',
    red: '#cc2222',
    blue: '#1144cc',
  };
  const bodyColor = bodyColors[machine.bodyColor] || '#f0f0f0';

  return (
    <group ref={vibRef}>
      {/* ===== КОРПУС ===== */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 2.5, 2.2]} />
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.25}
          roughness={0.15}
          envMapIntensity={2}
        />
      </mesh>

      {/* Боковые скосы */}
      {[-1.1, 1.1].map((x, i) => (
        <mesh key={i} position={[x * 0.995, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 2.48, 2.18]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.7} roughness={0.2} />
        </mesh>
      ))}

      {/* ===== ВНУТРЕННЯЯ ОБЛАСТЬ (видна через стекло) ===== */}
      <mesh position={[0, -0.1, 1.06]}>
        <cylinderGeometry args={[0.78, 0.78, 1.55, 64]} />
        <meshStandardMaterial color="#1a1a2a" metalness={0.3} roughness={0.8} side={THREE.BackSide} />
      </mesh>

      {/* Барабан */}
      <group position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <Drum type={machine.drumType} rpm={machine.rpm} isRunning={machine.isRunning} />
        <WaterSurface level={machine.waterLevel} rpm={machine.isRunning ? machine.rpm : 0} />
        {isWaterVisible && <WaterParticles active={machine.isRunning} />}
      </group>

      {/* ===== ДВЕРЦА ===== */}
      {showDoor && (
        <group position={[0, -0.1, 1.12]} rotation={[0, doorOpen ? -Math.PI / 2.5 : 0, 0]}>
          {/* Рамка дверцы */}
          <mesh castShadow>
            <torusGeometry args={[0.72, 0.06, 16, 64]} />
            <meshStandardMaterial color="#444" metalness={0.85} roughness={0.1} />
          </mesh>
          {/* Стекло */}
          <mesh>
            <circleGeometry args={[0.68, 64]} />
            <meshStandardMaterial
              color="#88aaff"
              metalness={0.0}
              roughness={0.0}
              transparent
              opacity={0.25}
              envMapIntensity={3}
            />
          </mesh>
          {/* Ручка дверцы */}
          <mesh position={[0.72, 0, 0.04]}>
            <cylinderGeometry args={[0.04, 0.04, 0.25, 16]} />
            <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* ===== ПАНЕЛЬ УПРАВЛЕНИЯ ===== */}
      <mesh position={[0, 1.38, 0]} castShadow>
        <boxGeometry args={[2.2, 0.24, 2.2]} />
        <meshStandardMaterial color={bodyColor} metalness={0.2} roughness={0.2} />
      </mesh>

      {/* Дисплей */}
      <mesh position={[0, 1.38, 0.9]}>
        <boxGeometry args={[0.7, 0.1, 0.08]} />
        <meshStandardMaterial
          color="#001122"
          emissive="#00c8ff"
          emissiveIntensity={machine.isRunning ? 1.5 : 0.4}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Крутилки */}
      {[-0.65, 0.65].map((x, i) => (
        <group key={i} position={[x, 1.38, 0.85]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.12, 32]} />
            <meshStandardMaterial color="#222" metalness={0.8} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
            <meshStandardMaterial color={i === 0 ? '#00c8ff' : '#ff6b00'} emissive={i === 0 ? '#00c8ff' : '#ff6b00'} emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}

      {/* Кнопки */}
      {[-0.25, 0, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 1.38, 0.82]}>
          <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />
          <meshStandardMaterial
            color={i === 1 ? '#00ff88' : '#00c8ff'}
            emissive={i === 1 ? '#00ff88' : '#00c8ff'}
            emissiveIntensity={machine.isRunning && i === 1 ? 2 : 0.3}
          />
        </mesh>
      ))}

      {/* ===== ЯЩИК ДЛЯ ПОРОШКА ===== */}
      <mesh position={[-0.7, 1.0, 1.05]} castShadow>
        <boxGeometry args={[0.5, 0.12, 0.15]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.1} roughness={0.5} />
      </mesh>

      {/* ===== НОЖКИ ===== */}
      {[[-0.8, -0.7], [-0.8, 0.7], [0.8, -0.7], [0.8, 0.7]].map(([x, z], i) => (
        <mesh key={i} position={[x, -1.35, z]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.2, 16]} />
          <meshStandardMaterial color="#555" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* ===== СВЕТОВЫЕ ЭФФЕКТЫ ===== */}
      {machine.isRunning && (
        <pointLight
          position={[0, -0.1, 1.2]}
          intensity={machine.rpm / 2000}
          color="#4488ff"
          distance={3}
        />
      )}
    </group>
  );
}