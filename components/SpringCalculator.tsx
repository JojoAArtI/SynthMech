import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { InputGroup } from './InputGroup';
import { MaterialSelect } from './MaterialSelect';
import { ResultCard } from './ResultCard';
import { MATERIALS } from '../constants';
import { SpringInput, GenericResult } from '../types';
import { calculateSpring } from '../utils/calculators';

const DEFAULT_STATE: SpringInput = {
  load: 500, // N
  deflection: 20,
  materialId: 'spring_steel',
  shearStressOverride: null,
  springIndex: 6,
  rigidityModulus: 80, // GPa
};

export const SpringCalculator: React.FC = () => {
  const [state, setState] = useState<SpringInput>(DEFAULT_STATE);
  const [result, setResult] = useState<GenericResult | null>(null);

  const updateState = (key: keyof SpringInput, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const calculate = () => {
    const mat = MATERIALS.find(m => m.id === state.materialId) || MATERIALS[0];
    const tau = state.shearStressOverride ?? mat.tau ?? 500;
    setResult(calculateSpring(state, tau));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in fade-in duration-700">
      <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 sm:gap-12">

        {/* Section 01 */}
        <div className="relative border-l border-zinc-300 dark:border-zinc-800 pl-4 sm:pl-8 ml-2 sm:ml-4 transition-colors">
          <div className="absolute -left-1.5 top-0 w-3 h-3 bg-white dark:bg-black border border-black dark:border-zinc-600 rotate-45 transition-colors" />
          <h3 className="text-xl font-bold font-tech text-black dark:text-white mb-6 flex items-center gap-4 transition-colors">
            <span className="text-zinc-500 text-sm font-mono">[01]</span>
            SPRING PARAMETERS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputGroup label="Axial Load (P)" value={state.load} onChange={v => updateState('load', parseFloat(v))} type="number" unit="N" />
            <InputGroup label="Spring Index (C)" value={state.springIndex} onChange={v => updateState('springIndex', parseFloat(v))} type="number" />
            <InputGroup label="Rigidity Modulus (G)" value={state.rigidityModulus} onChange={v => updateState('rigidityModulus', parseFloat(v))} type="number" unit="GPa" />
          </div>
        </div>

        {/* Section 02 */}
        <div className="relative border-l border-zinc-300 dark:border-zinc-800 pl-4 sm:pl-8 ml-2 sm:ml-4 pb-4 transition-colors">
          <div className="absolute -left-1.5 top-0 w-3 h-3 bg-white dark:bg-black border border-black dark:border-zinc-600 rotate-45 transition-colors" />
          <h3 className="text-xl font-bold font-tech text-black dark:text-white mb-6 flex items-center gap-4 transition-colors">
            <span className="text-zinc-500 text-sm font-mono">[02]</span>
            MATERIAL PROPERTIES
          </h3>
          <MaterialSelect
            label="Spring Material" selectedId={state.materialId} onSelect={id => updateState('materialId', id)}
            sigmaOverride={state.shearStressOverride} onSigmaChange={v => updateState('shearStressOverride', v)}
            bhnOverride={null} onBhnChange={() => { }}
          />
        </div>

      </div>

      <div className="lg:col-span-5 relative">
        <div className="sticky top-28">
          <ResultCard result={result} emptyTitle="SPRING ANALYSIS" emptyMessage="Input spring parameters to calculate wire diameter." />
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