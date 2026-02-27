import React from 'react';
import { GenericResult } from '../types';
import { Activity } from 'lucide-react';

interface ResultCardProps {
  result: GenericResult | null;
  emptyTitle?: string;
  emptyMessage?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  result, 
  emptyTitle = "AWAITING INPUT", 
  emptyMessage = "Configure parameters to initiate calculation sequence." 
}) => {
  if (!result) {
    return (
      <div className="min-h-[250px] flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 p-6 relative overflow-hidden group shadow-sm transition-colors duration-300">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
        {/* Animated scanning line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-scan-slow" />
        
        <div className="relative z-10 text-center">
          <div className="w-12 h-12 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:border-black dark:group-hover:border-white transition-colors">
            <Activity className="text-zinc-400 dark:text-zinc-600 group-hover:text-black dark:group-hover:text-white transition-colors" size={20} />
          </div>
          <h3 className="text-lg font-bold text-black dark:text-white font-tech tracking-tight mb-2">{emptyTitle}</h3>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-500 font-mono max-w-xs mx-auto leading-relaxed uppercase tracking-wide">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 flex flex-col w-full relative overflow-hidden shadow-lg shadow-zinc-200/50 dark:shadow-none transition-colors duration-300">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-48 h-48 border border-zinc-100 dark:border-zinc-800/50 rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border border-zinc-100 dark:border-zinc-800/50 rounded-full -translate-x-1/2 translate-y-1/2" />
      
      {/* Header */}
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 relative z-10 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full ${result.isSafe ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Analysis Output</span>
            </div>
            <h2 className={`text-2xl font-bold font-tech leading-none ${result.isSafe ? 'text-black dark:text-white' : 'text-red-600 dark:text-red-500'}`}>
              {result.isSafe ? 'DESIGN OPTIMAL' : 'DESIGN UNSAFE'}
            </h2>
          </div>
          
          <div className="text-right">
             <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
               {result.mainLabel}
             </div>
             <div className="text-3xl font-mono font-light text-black dark:text-white tracking-tighter">
               {result.mainValue}<span className="text-sm text-zinc-500 dark:text-zinc-500 ml-1">{result.mainUnit}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Grid Data */}
      <div className="grid grid-cols-2 gap-px bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800 relative z-10">
        {result.items.map((item, idx) => (
          <div 
            key={idx} 
            className={`
              p-3 bg-white dark:bg-[#0a0a0a] hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors
              ${item.highlight ? (item.status === 'safe' ? 'bg-zinc-50 dark:bg-emerald-950/10 border-l-2 border-l-emerald-500' : 'bg-red-50 dark:bg-red-950/10 border-l-2 border-l-red-500') : ''}
            `}
          >
            <div className="flex justify-between items-start mb-1">
               <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider font-tech">
                 {item.label}
               </span>
               {item.unit && <span className="text-[9px] text-zinc-500 dark:text-zinc-500 font-mono">[{item.unit}]</span>}
            </div>
            <div className={`font-mono text-sm ${item.highlight && item.status === 'unsafe' ? 'text-red-600 dark:text-red-500 font-bold' : 'text-zinc-900 dark:text-zinc-200'}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Visuals */}
      <div className="p-3 bg-zinc-50 dark:bg-zinc-950 flex justify-between items-center">
         <div className="flex gap-1">
           {[...Array(5)].map((_, i) => (
             <div key={i} className={`w-1 h-3 ${i < 3 ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
           ))}
         </div>
         <div className="font-mono text-[9px] text-zinc-400 dark:text-zinc-600">
           ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
         </div>
      </div>
    </div>
  );
};