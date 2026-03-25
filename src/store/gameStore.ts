import { create } from 'zustand';

export type GameScreen = 'menu' | 'workshop' | 'sandbox' | 'garage' | 'customizer' | 'settings';

export type DrumType = 'standard' | 'hexagonal' | 'perforated' | 'diamond';
export type MotorType = 'brushless' | 'inverter' | 'direct-drive' | 'belt-drive';
export type KnobType = 'round' | 'lever' | 'digital' | 'retro';
export type BodyColor = 'white' | 'silver' | 'black' | 'chrome' | 'red' | 'blue';

export interface WashingMachine {
  id: string;
  name: string;
  drumType: DrumType;
  motorType: MotorType;
  knobType: KnobType;
  bodyColor: BodyColor;
  rpm: number;
  waterLevel: number;
  temperature: number;
  isRunning: boolean;
  vibration: number;
}

export interface ClothItem {
  id: string;
  type: 'shirt' | 'jeans' | 'towel' | 'sock' | 'dress';
  color: string;
  weight: number;
  isWet: boolean;
}

interface GameState {
  screen: GameScreen;
  machine: WashingMachine;
  clothes: ClothItem[];
  isWaterVisible: boolean;
  sandboxMode: boolean;
  doorOpen: boolean;
  currentRpm: number;
  waterSplash: number;
  
  setScreen: (screen: GameScreen) => void;
  updateMachine: (updates: Partial<WashingMachine>) => void;
  setRpm: (rpm: number) => void;
  setWaterLevel: (level: number) => void;
  setTemperature: (temp: number) => void;
  toggleRunning: () => void;
  toggleDoor: () => void;
  addCloth: (cloth: ClothItem) => void;
  removeCloth: (id: string) => void;
  clearClothes: () => void;
  setSandboxMode: (mode: boolean) => void;
  setCurrentRpm: (rpm: number) => void;
}

const defaultMachine: WashingMachine = {
  id: 'machine-1',
  name: 'WashMaster X1',
  drumType: 'standard',
  motorType: 'direct-drive',
  knobType: 'digital',
  bodyColor: 'white',
  rpm: 1200,
  waterLevel: 0,
  temperature: 40,
  isRunning: false,
  vibration: 0,
};

export const useGameStore = create<GameState>((set) => ({
  screen: 'menu',
  machine: defaultMachine,
  clothes: [],
  isWaterVisible: false,
  sandboxMode: false,
  doorOpen: false,
  currentRpm: 0,
  waterSplash: 0,

  setScreen: (screen) => set({ screen }),
  updateMachine: (updates) =>
    set((state) => ({ machine: { ...state.machine, ...updates } })),
  setRpm: (rpm) => set((state) => ({ machine: { ...state.machine, rpm } })),
  setWaterLevel: (waterLevel) =>
    set((state) => ({ machine: { ...state.machine, waterLevel }, isWaterVisible: waterLevel > 0 })),
  setTemperature: (temperature) =>
    set((state) => ({ machine: { ...state.machine, temperature } })),
  toggleRunning: () =>
    set((state) => ({
      machine: { ...state.machine, isRunning: !state.machine.isRunning },
    })),
  toggleDoor: () => set((state) => ({ doorOpen: !state.doorOpen })),
  addCloth: (cloth) =>
    set((state) => ({ clothes: [...state.clothes, cloth] })),
  removeCloth: (id) =>
    set((state) => ({ clothes: state.clothes.filter((c) => c.id !== id) })),
  clearClothes: () => set({ clothes: [] }),
  setSandboxMode: (sandboxMode) => set({ sandboxMode }),
  setCurrentRpm: (currentRpm) => set({ currentRpm }),
}));
