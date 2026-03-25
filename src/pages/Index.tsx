import { useGameStore } from '@/store/gameStore';
import MainMenu from '@/components/game/MainMenu';
import SandboxScene from '@/components/game/SandboxScene';
import WorkshopScene from '@/components/game/WorkshopScene';
import GarageScene from '@/components/game/GarageScene';
import CustomizerScene from '@/components/game/CustomizerScene';
import SettingsScene from '@/components/game/SettingsScene';

export default function Index() {
  const screen = useGameStore((s) => s.screen);

  return (
    <div className="w-screen h-screen overflow-hidden">
      {screen === 'menu' && <MainMenu />}
      {screen === 'sandbox' && <SandboxScene />}
      {screen === 'workshop' && <WorkshopScene />}
      {screen === 'garage' && <GarageScene />}
      {screen === 'customizer' && <CustomizerScene />}
      {screen === 'settings' && <SettingsScene />}
    </div>
  );
}
