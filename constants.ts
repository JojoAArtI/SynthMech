import { Material, ToothSystem } from './types';

export const STANDARD_MODULES = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 32, 40, 50];

// Velocity (m/s) -> Error (mm)
export const ERROR_VELOCITY_TABLE: [number, number][] = [
  [1.0, 0.096], [2.0, 0.088], [2.5, 0.084], [3.0, 0.0785],
  [4.0, 0.071], [5.0, 0.064], [6.0, 0.059],
  [8.0, 0.050], [10.0, 0.0386], [12.0, 0.033],
  [15.0, 0.023], [20.0, 0.0155], [25.0, 0.013]
];

export const MATERIALS: Material[] = [
  { 
    id: 'c30_ht', 
    name: 'Steel C30 Heat Treated', 
    sigma: 220.6, 
    bhn: 300,
    tau: 130,
    description: 'Medium carbon steel subjected to heat treatment (quenching and tempering) to achieve a good balance of strength and toughness.',
    typicalApplications: ['Automotive transmission gears', 'Machine tool gears', 'Heavy-duty shafts']
  },
  { 
    id: 'c45', 
    name: 'Steel C45', 
    sigma: 300, 
    bhn: 225,
    tau: 180,
    description: 'Medium carbon steel with higher strength, popular for shafts and axles.',
    typicalApplications: ['Shafts', 'Axles', 'Bolts', 'Gears']
  },
  { 
    id: 'ci_20', 
    name: 'Cast Iron Grade 20', 
    sigma: 100, 
    bhn: 180,
    description: 'A gray cast iron with excellent machinability and vibration damping capacity, but lower tensile strength.',
    typicalApplications: ['Light duty gears', 'Machine bases', 'Pulleys']
  },
  { 
    id: 'ci_35', 
    name: 'Cast Iron Grade 35', 
    sigma: 175, 
    bhn: 220,
    description: 'High-strength gray cast iron used for components requiring better load-bearing capacity.',
    typicalApplications: ['Heavy machinery gears', 'Hydraulic cylinders', 'Diesel engine castings']
  },
  { 
    id: 'bronze', 
    name: 'Bronze', 
    sigma: 85, 
    bhn: 100,
    description: 'Copper-based alloy known for corrosion resistance and low friction against steel.',
    typicalApplications: ['Worm gears', 'Bushings', 'Marine applications']
  },
  { 
    id: 'phos_bronze', 
    name: 'Phosphor Gear Bronze', 
    sigma: 115, 
    bhn: 120,
    description: 'Bronze alloyed with phosphorus to increase fatigue strength, wear resistance, and stiffness.',
    typicalApplications: ['Heavy load worm gears', 'High-speed bushings', 'Switchgear components']
  },
  { 
    id: 'spring_steel', 
    name: 'Chrome Vanadium Steel (Spring)', 
    sigma: 1200, 
    bhn: 400,
    tau: 600,
    description: 'High grade spring steel used for heavy stress applications.',
    typicalApplications: ['Valve springs', 'Suspension springs']
  },
  { 
    id: 'music_wire', 
    name: 'Music Wire (ASTM A228)', 
    sigma: 1500, 
    bhn: 450,
    tau: 700,
    description: 'High carbon steel wire, highest tensile strength of all spring materials.',
    typicalApplications: ['High quality small springs']
  },
  { 
    id: 'custom', 
    name: 'Custom Material', 
    sigma: 0, 
    bhn: 0,
    tau: 0,
    description: 'User-defined material properties.',
    typicalApplications: ['Specialized applications']
  },
];

export const TOOTH_SYSTEM_LABELS: Record<ToothSystem, string> = {
  [ToothSystem.FULL_DEPTH_14_5]: '14.5° Full Depth',
  [ToothSystem.FULL_DEPTH_20]: '20° Full Depth',
  [ToothSystem.STUB_20]: '20° Stub',
};
