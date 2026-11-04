import SakuraCanvas from './components/canvas/SakuraCanvas';

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#1c1c1e] text-[#f2f0ed] flex flex-col items-center justify-center p-6 overflow-hidden">
      <SakuraCanvas className="pointer-events-none fixed inset-0 z-0 h-full w-full" />
      <div className="relative z-10 max-w-md text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#f3a4c2] font-semibold">
          Portfolio
        </span>
        <h1 className="text-3xl font-bold tracking-tight">
          Juan Camilo García
        </h1>
        <p className="text-sm text-[#aaa7a3]">
          Creative Frontend & Systems Engineer · SnackMasterDev
        </p>
      </div>
    </div>
  );
}
