import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { InputGroup } from './InputGroup';
import { MaterialSelect } from './MaterialSelect';
import { ResultCard } from './ResultCard';
import { MATERIALS } from '../constants';
import { WormGearInput, GenericResult } from '../types';
import { calculateWormGear } from '../utils/calculators';

const DEFAULT_STATE: WormGearInput = {
  power: 5,
  speedWorm: 1440,
  ratio: 20,
  zWorm: 2,
  qFactor: 11,
  materialWormId: 'c45',
  materialWheelId: 'phos_bronze',
  sigmaWormOverride: null,
  sigmaWheelOverride: null,
};

export const WormGearCalculator: React.FC = () => {
  const [state, setState] = useState<WormGearInput>(DEFAULT_STATE);
  const [result, setResult] = useState<GenericResult | null>(null);

  const updateState = (key: keyof WormGearInput, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const calculate = () => {
    const wheelMat = MATERIALS.find(m => m.id === state.materialWheelId) || MATERIALS[0];
    const sWheel = state.sigmaWheelOverride ?? wheelMat.sigma;
    setResult(calculateWormGear(state, sWheel));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in fade-in duration-700">
      <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 sm:gap-12">

        {/* Section 01 */}
        <div className="relative border-l border-zinc-300 dark:border-zinc-800 pl-4 sm:pl-8 ml-2 sm:ml-4 transition-colors">
          <div className="absolute -left-1.5 top-0 w-3 h-3 bg-white dark:bg-black border border-black dark:border-zinc-600 rotate-45 transition-colors" />
          <h3 className="text-xl font-bold font-tech text-black dark:text-white mb-6 flex items-center gap-4 transition-colors">
            <span className="text-zinc-500 text-sm font-mono">[01]</span>
            OPERATING CONDITIONS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputGroup label="Power (kW)" value={state.power} onChange={v => updateState('power', parseFloat(v))} type="number" />
            <InputGroup label="Worm Speed (RPM)" value={state.speedWorm} onChange={v => updateState('speedWorm', parseFloat(v))} type="number" />
            <InputGroup label="Gear Ratio" value={state.ratio} onChange={v => updateState('ratio', parseFloat(v))} type="number" />
          </div>
        </div>

        {/* Section 02 */}
        <div className="relative border-l border-zinc-300 dark:border-zinc-800 pl-4 sm:pl-8 ml-2 sm:ml-4 transition-colors">
          <div className="absolute -left-1.5 top-0 w-3 h-3 bg-white dark:bg-black border border-black dark:border-zinc-600 rotate-45 transition-colors" />
          <h3 className="text-xl font-bold font-tech text-black dark:text-white mb-6 flex items-center gap-4 transition-colors">
            <span className="text-zinc-500 text-sm font-mono">[02]</span>
            WORM CONFIGURATION
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputGroup label="Worm Starts (z1)" value={state.zWorm} onChange={v => updateState('zWorm', parseFloat(v))} type="number" />
            <InputGroup label="Diameter Factor (q)" value={state.qFactor} onChange={v => updateState('qFactor', parseFloat(v))} type="number" placeholder="Std: 10, 11, 12" />
          </div>
        </div>

        {/* Section 03 */}
        <div className="relative border-l border-zinc-300 dark:border-zinc-800 pl-4 sm:pl-8 ml-2 sm:ml-4 pb-4 transition-colors">
          <div className="absolute -left-1.5 top-0 w-3 h-3 bg-white dark:bg-black border border-black dark:border-zinc-600 rotate-45 transition-colors" />
          <h3 className="text-xl font-bold font-tech text-black dark:text-white mb-6 flex items-center gap-4 transition-colors">
            <span className="text-zinc-500 text-sm font-mono">[03]</span>
            MATERIAL PROPERTIES
          </h3>
          <MaterialSelect
            label="Worm Wheel Material" selectedId={state.materialWheelId} onSelect={id => updateState('materialWheelId', id)}
            sigmaOverride={state.sigmaWheelOverride} onSigmaChange={v => updateState('sigmaWheelOverride', v)}
            bhnOverride={null} onBhnChange={() => { }}
          />
          <div className="mt-4 p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono transition-colors">
            NOTE: Worm assumed to be hardened steel. Design based on weaker wheel material.
          </div>
        </div>

      </div>

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