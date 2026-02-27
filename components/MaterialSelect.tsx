import React, { useState } from 'react';
import { MATERIALS } from '../constants';
import { ChevronDown, X } from 'lucide-react';

interface MaterialSelectProps {
  label: string;
  selectedId: string;
  onSelect: (id: string) => void;
  sigmaOverride: number | null;
  onSigmaChange: (val: number | null) => void;
  bhnOverride: number | null;
  onBhnChange: (val: number | null) => void;
  icon?: React.ReactNode;
}

export const MaterialSelect: React.FC<MaterialSelectProps> = ({
  label,
  selectedId,
  onSelect,
  sigmaOverride,
  onSigmaChange,
  bhnOverride,
  onBhnChange,
  icon,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const selectedMaterial = MATERIALS.find((m) => m.id === selectedId) || MATERIALS[0];

  const currentSigma = sigmaOverride !== null ? sigmaOverride : selectedMaterial.sigma;
  const currentBhn = bhnOverride !== null ? bhnOverride : selectedMaterial.bhn;
  const isModified = sigmaOverride !== null || bhnOverride !== null;

  const handleReset = () => {
    onSigmaChange(null);
    onBhnChange(null);
  };

  return (
    <div className="relative group">
      {/* Label Header */}
      <div className="flex justify-between items-end mb-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest font-tech group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {label}
          </span>
          {isModified && (
            <button onClick={handleReset} className="text-[10px] text-red-600 hover:text-red-500 font-mono border border-red-200 dark:border-red-900/50 px-1 rounded-sm bg-red-50 dark:bg-red-900/20">
              [RESET]
            </button>
          )}
        </div>
        <button
          onClick={() => setShowInfo(true)}
          className="text-[10px] text-zinc-400 dark:text-zinc-600 hover:text-black dark:hover:text-white underline underline-offset-2 font-mono"
        >
          DETAILS
        </button>
      </div>

      {/* Main Selection Area */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 p-0.5 rounded-sm relative hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-sm">
        <select
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full bg-transparent text-black dark:text-white font-mono text-sm py-2 px-3 pr-8 appearance-none focus:outline-none cursor-pointer"
        >
          {MATERIALS.map((m) => (
            <option key={m.id} value={m.id} className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900">
              {m.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
          <ChevronDown size={14} />
        </div>
      </div>

      {/* Properties Quick View / Edit */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {/* Sigma */}
        <div className={`p-2 border ${sigmaOverride !== null ? 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/10' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50'}`}>
          <label className="block text-[8px] text-zinc-500 dark:text-zinc-500 uppercase font-bold mb-1">STRESS (MPa)</label>
          <input
            type="number"
            value={currentSigma}
            onChange={(e) => onSigmaChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
            className="w-full bg-transparent border-none p-0 text-black dark:text-zinc-200 font-mono text-sm focus:ring-0"
          />
        </div>
        {/* BHN */}
        <div className={`p-2 border ${bhnOverride !== null ? 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/10' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50'}`}>
          <label className="block text-[8px] text-zinc-500 dark:text-zinc-500 uppercase font-bold mb-1">HARDNESS (BHN)</label>
          <input
            type="number"
            value={currentBhn}
            onChange={(e) => onBhnChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
            className="w-full bg-transparent border-none p-0 text-black dark:text-zinc-200 font-mono text-sm focus:ring-0"
          />
        </div>
      </div>

      {/* Detail Modal Overlay */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 max-w-md w-full shadow-2xl relative">
            <div className="flex justify-between items-center p-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold font-tech text-black dark:text-white uppercase tracking-tight">{selectedMaterial.name}</h3>
              <button onClick={() => setShowInfo(false)} className="text-zinc-400 hover:text-black dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed border-l-2 border-zinc-200 dark:border-zinc-800 pl-4">
                {selectedMaterial.description}
              </p>
              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Applications</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMaterial.typicalApplications?.map((app, i) => (
                    <span key={i} className="text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-1 font-mono">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};