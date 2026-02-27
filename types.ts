export enum ToothSystem {
  FULL_DEPTH_14_5 = 1,
  FULL_DEPTH_20 = 2,
  STUB_20 = 3,
}

export type CalculatorMode = 'SPUR_GEAR' | 'HELICAL_GEAR' | 'BEVEL_GEAR' | 'WORM_GEAR' | 'SHAFT' | 'SPRING';

export interface Material {
  id: string;
  name: string;
  sigma: number; // Allowable bending stress (MPa) or Yield for Shafts
  bhn: number;   // Brinell Hardness Number
  tau?: number;  // Shear stress (MPa) - optional, for shafts/springs
  description?: string;
  typicalApplications?: string[];
}

// --- Inputs ---

export interface SpurGearInput {
  power: number; 
  speedPinion: number; 
  ratio: number;
  teethPinion: number;
  materialPinionId: string;
  materialGearId: string;
  sigmaPinionOverride: number | null;
  sigmaGearOverride: number | null;
  bhnPinionOverride: number | null;
  bhnGearOverride: number | null;
  toothSystem: ToothSystem;
  faceWidthMethod: 'FACTOR' | 'VALUE';
  faceWidthFactor: number;
  faceWidthValue: number;
  diameterPinion: number | null;
}

export interface HelicalGearInput extends SpurGearInput {
  helixAngle: number; // degrees
}

export interface BevelGearInput extends SpurGearInput {
  shaftAngle: number; // degrees, usually 90
}

export interface WormGearInput {
  power: number;
  speedWorm: number;
  ratio: number;
  zWorm: number; // Number of starts
  qFactor: number; // Diameter factor (usually 10-12)
  materialWormId: string;
  materialWheelId: string;
  sigmaWormOverride: number | null;
  sigmaWheelOverride: number | null;
}

export interface ShaftInput {
  power: number;
  speed: number;
  bendingMoment: number; // N-m
  materialId: string;
  yieldStrengthOverride: number | null;
  factorKb: number; // Shock & Fatigue factor (Bending)
  factorKt: number; // Shock & Fatigue factor (Torsion)
  safetyFactor: number;
}

export interface SpringInput {
  load: number; // N
  deflection: number; // mm (optional target)
  materialId: string;
  shearStressOverride: number | null;
  springIndex: number; // C = D/d
  rigidityModulus: number; // G (GPa)
}

// --- Results ---

export interface GenericResultItem {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
  status?: 'safe' | 'unsafe' | 'neutral';
}

export interface GenericResult {
  isSafe: boolean;
  mainValue: string;
  mainLabel: string;
  mainUnit: string;
  subText: string;
  items: GenericResultItem[];
}