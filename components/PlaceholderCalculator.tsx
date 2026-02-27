import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
}

export const PlaceholderCalculator: React.FC<PlaceholderProps> = ({ title }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center min-h-[500px] text-center p-8 bg-[#151b2b] rounded-xl border border-slate-700/50 border-dashed animate-in fade-in duration-500">
      <div className="bg-slate-800/50 p-6 rounded-full mb-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-indigo-500/20 blur-xl group-hover:bg-indigo-500/30 transition-colors" />
        <Construction size={48} className="text-indigo-400 relative z-10" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">{title} Calculator</h2>
      <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
        The calculation module for {title.toLowerCase()} is currently being implemented. 
        Please use the Spur Gear calculator for now, or check back later for updates.
      </p>
      <button className="mt-8 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700">
        Notify me when ready
      </button>
    </div>
  );
};