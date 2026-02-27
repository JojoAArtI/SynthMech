import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { InputGroup } from './InputGroup';
import { MaterialSelect } from './MaterialSelect';
import { ResultCard } from './ResultCard';
import { MATERIALS } from '../constants';
import { HelicalGearInput, GenericResult } from '../types';
import { calculateHelicalGear } from '../utils/calculators';

const DEFAULT_STATE: HelicalGearInput = {
  power: 20,
  speedPinion: 1200,
  ratio: 4,
  teethPinion: 20,
  helixAngle: 15,
  materialPinionId: 'c45',
  materialGearId: 'ci_35',
  sigmaPinionOverride: null,
  sigmaGearOverride: null,
  bhnPinionOverride: null,
  bhnGearOverride: null,
  toothSystem: 3, // STUB_20
  faceWidthMethod: 'FACTOR',
  faceWidthFactor: 12,
  faceWidthValue: 0,
  diameterPinion: null,
};

export const HelicalGearCalculator: React.FC = () => {
  const [state, setState] = useState<HelicalGearInput>(DEFAULT_STATE);
  const [result, setResult] = useState<GenericResult | null>(null);

  const updateState = (key: keyof HelicalGearInput, value: any) => {
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
    const pMat = MATERIALS.find(m => m.id === state.materialPinionId) || MATERIALS[0];
    const gMat = MATERIALS.find(m => m.id === state.materialGearId) || MATERIALS[0];
    const sP = state.sigmaPinionOverride ?? pMat.sigma;
    const sG = state.sigmaGearOverride ?? gMat.sigma;
    const bP = state.bhnPinionOverride ?? pMat.bhn;

    setResult(calculateHelicalGear(state, sP, sG, bP));
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
            <InputGroup label="Power (P)" value={state.power} onChange={v => updateState('power', parseFloat(v))} type="number" unit="kW" />
            <InputGroup label="Pinion Speed (Np)" value={state.speedPinion} onChange={v => updateState('speedPinion', parseFloat(v))} type="number" unit="RPM" />
            <InputGroup label="Gear Ratio (G)" value={state.ratio} onChange={v => updateState('ratio', parseFloat(v))} type="number" />
            <InputGroup label="Helix Angle (ψ)" value={state.helixAngle} onChange={v => updateState('helixAngle', parseFloat(v))} type="number" unit="deg" />
          </div>
        </div>

        {/* Section 02 */}
        <div className="relative border-l border-zinc-300 dark:border-zinc-800 pl-4 sm:pl-8 ml-2 sm:ml-4 transition-colors">
          <div className="absolute -left-1.5 top-0 w-3 h-3 bg-white dark:bg-black border border-black dark:border-zinc-600 rotate-45 transition-colors" />
          <h3 className="text-xl font-bold font-tech text-black dark:text-white mb-6 flex items-center gap-4 transition-colors">
            <span className="text-zinc-500 text-sm font-mono">[02]</span>
            MATERIAL PROPERTIES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MaterialSelect
              label="Pinion Material" selectedId={state.materialPinionId} onSelect={id => handleMaterialChange('PINION', id)}
              sigmaOverride={state.sigmaPinionOverride} onSigmaChange={v => updateState('sigmaPinionOverride', v)}
              bhnOverride={state.bhnPinionOverride} onBhnChange={v => updateState('bhnPinionOverride', v)}
            />
            <MaterialSelect
              label="Gear Material" selectedId={state.materialGearId} onSelect={id => handleMaterialChange('GEAR', id)}
              sigmaOverride={state.sigmaGearOverride} onSigmaChange={v => updateState('sigmaGearOverride', v)}
              bhnOverride={state.bhnGearOverride} onBhnChange={v => updateState('bhnGearOverride', v)}
            />
          </div>
        </div>

        {/* Section 03 */}
        <div className="relative border-l border-zinc-300 dark:border-zinc-800 pl-4 sm:pl-8 ml-2 sm:ml-4 pb-4 transition-colors">
          <div className="absolute -left-1.5 top-0 w-3 h-3 bg-white dark:bg-black border border-black dark:border-zinc-600 rotate-45 transition-colors" />
          <h3 className="text-xl font-bold font-tech text-black dark:text-white mb-6 flex items-center gap-4 transition-colors">
            <span className="text-zinc-500 text-sm font-mono">[03]</span>
            GEOMETRY CONFIG
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputGroup label="Pinion Teeth (z)" value={state.teethPinion} onChange={v => updateState('teethPinion', parseInt(v))} type="number" />
            <InputGroup label="Face Width Factor (k)" value={state.faceWidthFactor} onChange={v => updateState('faceWidthFactor', parseFloat(v))} type="number" />
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