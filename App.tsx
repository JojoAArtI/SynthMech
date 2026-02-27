import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { SpurGearCalculator } from './components/SpurGearCalculator';
import { HelicalGearCalculator } from './components/HelicalGearCalculator';
import { BevelGearCalculator } from './components/BevelGearCalculator';
import { WormGearCalculator } from './components/WormGearCalculator';
import { ShaftCalculator } from './components/ShaftCalculator';
import { SpringCalculator } from './components/SpringCalculator';
import { CalculatorMode } from './types';

function App() {
  const [currentMode, setCurrentMode] = useState<CalculatorMode>('SPUR_GEAR');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const getTitle = (mode: CalculatorMode) => {
    switch (mode) {
      case 'SPUR_GEAR': return 'Spur Gear Design Module';
      case 'HELICAL_GEAR': return 'Helical Gear Design Module';
      case 'BEVEL_GEAR': return 'Bevel Gear Design Module';
      case 'WORM_GEAR': return 'Worm Gear Design Module';
      case 'SHAFT': return 'Shaft Design Module';
      case 'SPRING': return 'Spring Design Module';
      default: return 'Machine Design';
    }
  };

  const renderCalculator = () => {
    switch (currentMode) {
      case 'SPUR_GEAR': return <SpurGearCalculator />;
      case 'HELICAL_GEAR': return <HelicalGearCalculator />;
      case 'BEVEL_GEAR': return <BevelGearCalculator />;
      case 'WORM_GEAR': return <WormGearCalculator />;
      case 'SHAFT': return <ShaftCalculator />;
      case 'SPRING': return <SpringCalculator />;
      default: return <SpurGearCalculator />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#f8fafc] text-zinc-800'} font-sans overflow-x-hidden flex`}>
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-72 z-30">
        <Sidebar currentMode={currentMode} onModeChange={setCurrentMode} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen relative">

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern opacity-60 dark:opacity-40" />

        {/* Top Header */}
        <header className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-20 px-4 sm:px-8 h-24 flex items-center justify-between bg-white/80 dark:bg-[#050505]/80 backdrop-blur-sm shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-6">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>

            <div>
              <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest mb-1 font-mono">
                Active Workstation //
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight font-tech uppercase transition-colors">
                {getTitle(currentMode)}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="hidden sm:block text-right">
              <div className="text-[10px] font-bold text-zinc-500 uppercase">Local Time</div>
              <div className="font-mono text-sm text-zinc-700 dark:text-zinc-400">14:02:55 UTC</div>
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-600 dark:text-zinc-400"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden sm:flex w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 items-center justify-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-[#0a0a0a] border-r border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in slide-in-from-left duration-200">
              <Sidebar currentMode={currentMode} onModeChange={(m) => { setCurrentMode(m); setSidebarOpen(false); }} />
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <main className="flex-grow p-4 sm:p-12 w-full relative z-10 transition-colors duration-300">
          {renderCalculator()}
        </main>
      </div>
    </div>
  );
}

export default App;