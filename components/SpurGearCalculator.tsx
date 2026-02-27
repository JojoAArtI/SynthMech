import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { InputGroup } from './InputGroup';
import { MaterialSelect } from './MaterialSelect';
import { ResultCard } from './ResultCard';
import { MATERIALS, TOOTH_SYSTEM_LABELS } from '../constants';
import { SpurGearInput, ToothSystem, GenericResult } from '../types';
import { calculateSpurGear } from '../utils/calculators';

const DEFAULT_STATE: SpurGearInput = {
  power: 15,
  speedPinion: 1000,
  ratio: 4,
  teethPinion: 20,
  materialPinionId: 'c30_ht',
  materialGearId: 'ci_35',
  sigmaPinionOverride: null,
  sigmaGearOverride: null,
  bhnPinionOverride: null,
  bhnGearOverride: null,
  toothSystem: ToothSystem.STUB_20,
  faceWidthMethod: 'FACTOR',
  faceWidthFactor: 10,
  faceWidthValue: 40,
  diameterPinion: null,
};

export const SpurGearCalculator: React.FC = () => {
  const [state, setState] = useState<SpurGearInput>(DEFAULT_STATE);
  const [result, setResult] = useState<GenericResult | null>(null);

  const updateState = (key: keyof SpurGearInput, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleMaterialChange = (type: 'PINION' | 'GEAR', id: string) => {
    setState((prev) => ({
      ...prev,
      [type === 'PINION' ? 'materialPinionId' : 'materialGearId']: id,
      [type === 'PINION' ? 'sigmaPinionOverride' : 'sigmaGearOverride']: null,
      [type === 'PINION' ? 'bhnPinionOverride' : 'bhnGearOverride']: null,
    }));
  };

  const calculate = () => {
    const basePinion = MATERIALS.find(m => m.id === state.materialPinionId) || MATERIALS[0];
    const baseGear = MATERIALS.find(m => m.id === state.materialGearId) || MATERIALS[0];

    const sP = state.sigmaPinionOverride ?? basePinion.sigma;
    const sG = state.sigmaGearOverride ?? baseGear.sigma;
    const bP = state.bhnPinionOverride ?? basePinion.bhn;

    setResult(calculateSpurGear(state, sP, sG, bP));
  };



  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in fade-in duration-700">
      {/* Left Input Column */}
      <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 sm:gap-12">

        {/* Section 01: Parameters */}
        <div className="relative border-l border-zinc-300 dark:border-zinc-800 pl-4 sm:pl-8 ml-2 sm:ml-4 transition-colors">
          {/* Decorative Marker */}
          <div className="absolute -left-1.5 top-0 w-3 h-3 bg-white dark:bg-black border border-black dark:border-zinc-600 rotate-45 transition-colors" />

          <h3 className="text-lg font-bold font-tech text-black dark:text-white mb-4 flex items-center gap-4 transition-colors">
            <span className="text-zinc-500 text-sm font-mono">[01]</span>
            OPERATING CONDITIONS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <InputGroup label="Power (P)" value={state.power} onChange={(v) => updateState('power', parseFloat(v))} type="number" unit="kW" />
            <InputGroup label="Speed (Np)" value={state.speedPinion} onChange={(v) => updateState('speedPinion', parseFloat(v))} type="number" unit="RPM" />
            <InputGroup label="Ratio (G)" value={state.ratio} onChange={(v) => updateState('ratio', parseFloat(v))} type="number" />
          </div>
        </div>

        {/* Section 02: Materials */}
        <div className="relative border-l border-zinc-300 dark:border-zinc-800 pl-4 sm:pl-8 ml-2 sm:ml-4 transition-colors">
          <div className="absolute -left-1.5 top-0 w-3 h-3 bg-white dark:bg-black border border-black dark:border-zinc-600 rotate-45 transition-colors" />

          <h3 className="text-lg font-bold font-tech text-black dark:text-white mb-4 flex items-center gap-4 transition-colors">
            <span className="text-zinc-500 text-sm font-mono">[02]</span>
            MATERIAL PROPERTIES
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MaterialSelect
              label="Pinion Material" selectedId={state.materialPinionId} onSelect={(id) => handleMaterialChange('PINION', id)}
              sigmaOverride={state.sigmaPinionOverride} onSigmaChange={(val) => updateState('sigmaPinionOverride', val)}
              bhnOverride={state.bhnPinionOverride} onBhnChange={(val) => updateState('bhnPinionOverride', val)}
            />
            <MaterialSelect
              label="Gear Material" selectedId={state.materialGearId} onSelect={(id) => handleMaterialChange('GEAR', id)}
              sigmaOverride={state.sigmaGearOverride} onSigmaChange={(val) => updateState('sigmaGearOverride', val)}
              bhnOverride={state.bhnGearOverride} onBhnChange={(val) => updateState('bhnGearOverride', val)}
            />
          </div>
        </div>

        {/* Section 03: Geometry */}
        <div className="relative border-l border-zinc-300 dark:border-zinc-800 pl-4 sm:pl-8 ml-2 sm:ml-4 pb-4 transition-colors">
          <div className="absolute -left-1.5 top-0 w-3 h-3 bg-white dark:bg-black border border-black dark:border-zinc-600 rotate-45 transition-colors" />

          <h3 className="text-lg font-bold font-tech text-black dark:text-white mb-4 flex items-center gap-4 transition-colors">
            <span className="text-zinc-500 text-sm font-mono">[03]</span>
            GEOMETRY CONFIG
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <InputGroup label="Pinion Teeth (z)" value={state.teethPinion} onChange={(v) => updateState('teethPinion', parseInt(v))} type="number" step="1" />
            <div className="flex flex-col group">
              <div className="flex justify-between items-end mb-1">
                <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest font-tech group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">TOOTH PROFILE</label>
              </div>
              <select value={state.toothSystem} onChange={(e) => updateState('toothSystem', parseInt(e.target.value))} className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 text-black dark:text-zinc-100 font-mono text-sm py-2.5 px-3 rounded-sm focus:border-black dark:focus:border-white appearance-none shadow-sm transition-colors">
                {Object.entries(TOOTH_SYSTEM_LABELS).map(([val, label]) => (
                  <option key={val} value={val} className="bg-white dark:bg-zinc-900">{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sub-panel for face width */}
          <div className="bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 p-6 relative transition-colors">
            <div className="absolute top-0 left-0 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-600 dark:text-zinc-400 font-mono transition-colors">FACE WIDTH CONFIG</div>
            <div className="flex items-center gap-4 mb-4 mt-2">
              <button onClick={() => updateState('faceWidthMethod', 'FACTOR')} className={`text-xs px-4 py-2 font-mono uppercase border transition-all ${state.faceWidthMethod === 'FACTOR' ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'text-zinc-500 border-zinc-300 dark:border-zinc-700 hover:text-black dark:hover:text-white bg-white dark:bg-transparent'}`}>Factor (k)</button>
              <button onClick={() => updateState('faceWidthMethod', 'VALUE')} className={`text-xs px-4 py-2 font-mono uppercase border transition-all ${state.faceWidthMethod === 'VALUE' ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'text-zinc-500 border-zinc-300 dark:border-zinc-700 hover:text-black dark:hover:text-white bg-white dark:bg-transparent'}`}>Value (b)</button>
            </div>
            {state.faceWidthMethod === 'FACTOR' ? (
              <InputGroup label="Factor Value" value={state.faceWidthFactor} onChange={(v) => updateState('faceWidthFactor', parseFloat(v))} type="number" />
            ) : (
              <InputGroup label="Width (mm)" value={state.faceWidthValue} onChange={(v) => updateState('faceWidthValue', parseFloat(v))} type="number" unit="mm" />
            )}
          </div>
        </div>
      </div>

      {/* Right Result Column */}
      <div className="lg:col-span-5 relative">
        <div className="sticky top-28">
          <ResultCard result={result} />

          <button
            onClick={calculate}
            className="w-full mt-4 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-bold font-tech text-lg py-4 border-2 border-transparent active:scale-[0.99] transition-all uppercase tracking-widest flex items-center justify-center gap-4 group shadow-lg"
          >
            <span>Run Simulation</span>
            <Settings className="group-hover:rotate-180 transition-transform duration-700" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};