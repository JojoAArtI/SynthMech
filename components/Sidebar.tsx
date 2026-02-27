import React from 'react';
import { CalculatorMode } from '../types';

interface SidebarProps {
  currentMode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, onModeChange }) => {
  const menuItems: { id: CalculatorMode; label: string; number: string }[] = [
    { id: 'SPUR_GEAR', label: 'Spur Gear', number: '01' },
    { id: 'HELICAL_GEAR', label: 'Helical Gear', number: '02' },
    { id: 'BEVEL_GEAR', label: 'Bevel Gear', number: '03' },
    { id: 'WORM_GEAR', label: 'Worm Gear', number: '04' },
    { id: 'SHAFT', label: 'Shaft Design', number: '05' },
    { id: 'SPRING', label: 'Spring Design', number: '06' },
  ];

  return (
    <aside className="w-full lg:w-72 h-full bg-white dark:bg-[#0a0a0a] border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-30 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-colors duration-300">
      {/* Brand Header */}
      <div className="h-24 flex flex-col justify-center px-8 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tighter text-black dark:text-white font-tech uppercase">
          SYNTH<span className="text-zinc-400 dark:text-zinc-600">MECH</span>
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-[2px] w-4 bg-blue-600"></div>
          <span className="text-[10px] tracking-[0.2em] text-zinc-500 dark:text-zinc-500 uppercase font-bold">Engineering Suite</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-8 px-6">
        <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-6 pl-2">
          Design Modules
        </div>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onModeChange(item.id)}
              className={`
                group w-full flex items-center justify-between p-3 rounded-none border-b border-zinc-100 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300
                ${currentMode === item.id ? 'bg-zinc-50 dark:bg-zinc-900 text-black dark:text-white border-black dark:border-white' : 'text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-zinc-300 hover:pl-5'}
              `}
            >
              <div className="flex items-baseline gap-4">
                <span className={`font-mono text-xs font-bold ${currentMode === item.id ? 'text-black dark:text-white' : 'text-blue-600 dark:text-blue-500'}`}>
                  [{item.number}]
                </span>
                <span className="font-tech font-medium text-lg tracking-tight">
                  {item.label}
                </span>
              </div>

              {/* Active Indicator */}
              {currentMode === item.id && (
                <div className="w-1.5 h-1.5 bg-black dark:bg-white rotate-45" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer / Status */}
      <div className="p-8 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-500 font-mono mb-2">
          <span>SYSTEM STATUS</span>
          <span className="text-emerald-600 dark:text-emerald-500 font-bold">ONLINE</span>
        </div>
        <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
          <div className="h-full w-full bg-zinc-400 dark:bg-zinc-600 animate-pulse origin-left" />
        </div>
        <div className="mt-4 text-[10px] text-zinc-400 dark:text-zinc-600 font-tech uppercase tracking-widest text-center">
          v2.5.0 // Build 2024
        </div>
      </div>
    </aside>
  );
};