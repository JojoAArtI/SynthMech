import { ERROR_VELOCITY_TABLE, STANDARD_MODULES } from '../constants';
import { 
  SpurGearInput, HelicalGearInput, BevelGearInput, WormGearInput, 
  ShaftInput, SpringInput, ToothSystem, GenericResult 
} from '../types';

// --- Shared Helpers ---

function getLewisFactor(z: number, system: ToothSystem): number {
  // For helical/bevel, 'z' passed here is formative teeth
  if (system === ToothSystem.FULL_DEPTH_14_5) {
    return 0.124 - 0.684 / z;
  } else if (system === ToothSystem.FULL_DEPTH_20) {
    return 0.154 - 0.912 / z;
  } else {
    return 0.175 - 0.95 / z;
  }
}

function getNextStandardModule(m: number): number {
  for (const sm of STANDARD_MODULES) {
    if (sm >= m) return sm;
  }
  return STANDARD_MODULES[STANDARD_MODULES.length - 1];
}

// --- Calculators ---

export function calculateSpurGear(input: SpurGearInput, sigmaP: number, sigmaG: number, bhnP: number): GenericResult {
  const { power, speedPinion, ratio, teethPinion: zp, toothSystem, faceWidthMethod, faceWidthFactor, faceWidthValue } = input;
  
  const zg = Math.round(zp * ratio);
  const T = (9550 * power / speedPinion) * 1000; // N-mm
  
  // Lewis Factors
  const yP = getLewisFactor(zp, toothSystem);
  const yG = getLewisFactor(zg, toothSystem);
  
  // Identify Weak
  const strengthP = sigmaP * yP;
  const strengthG = sigmaG * yG;
  
  let designSigma = sigmaP;
  let designY = yP;
  let designZ = zp;
  let weakMember = 'Pinion';

  if (strengthG < strengthP) {
    weakMember = 'Gear';
    designSigma = sigmaG;
    designY = yG;
    designZ = zg;
  }
  
  // Module Calc
  let mTheoretical = 0;
  
  if (faceWidthMethod === 'VALUE') {
     mTheoretical = Math.sqrt((2 * T) / (designZ * designSigma * faceWidthValue * designY));
  } else {
     mTheoretical = Math.pow((2 * T) / (designSigma * faceWidthFactor * designY * designZ), 1/3);
  }

  const m = getNextStandardModule(mTheoretical);
  const dp = m * zp;
  const dg = m * zg;
  const b = faceWidthMethod === 'FACTOR' ? faceWidthFactor * m : faceWidthValue;
  
  // Loads
  const Ft = (2 * T) / dp;
  const v = (Math.PI * dp * speedPinion) / 60000;
  
  // Dynamic Load (Buckingham)
  const C = 11860; // Steel/Steel 20 deg error assumption
  const Fd = Ft + (21 * v * (b * C + Ft)) / (21 * v + Math.sqrt(b * C + Ft));
  
  // Wear
  const Q = (2 * zg) / (zp + zg);
  const K = 0.16 * Math.pow(bhnP / 100, 2);
  const Fw = dp * b * Q * K;
  
  const isSafe = Fw >= Fd;

  return {
    isSafe,
    mainValue: m.toString(),
    mainLabel: 'Standard Module',
    mainUnit: 'mm',
    subText: isSafe ? 'Design is SAFE against wear' : 'Design is NOT SAFE against wear',
    items: [
      { label: 'Weaker Member', value: weakMember },
      { label: 'Face Width', value: b.toFixed(2), unit: 'mm' },
      { label: 'Pitch Dia (Pinion)', value: dp.toFixed(2), unit: 'mm' },
      { label: 'Pitch Dia (Gear)', value: dg.toFixed(2), unit: 'mm' },
      { label: 'Tangential Load', value: (Ft/1000).toFixed(2), unit: 'kN' },
      { label: 'Dynamic Load', value: (Fd/1000).toFixed(2), unit: 'kN' },
      { label: 'Wear Load', value: (Fw/1000).toFixed(2), unit: 'kN', highlight: true, status: isSafe ? 'safe' : 'unsafe' },
    ]
  };
}

export function calculateHelicalGear(input: HelicalGearInput, sigmaP: number, sigmaG: number, bhnP: number): GenericResult {
  const { power, speedPinion, ratio, teethPinion: zp, toothSystem, faceWidthFactor, helixAngle } = input;
  
  const zg = Math.round(zp * ratio);
  const T = (9550 * power / speedPinion) * 1000;
  
  // Formative teeth
  const cosPsi = Math.cos(helixAngle * Math.PI / 180);
  const zeP = zp / Math.pow(cosPsi, 3);
  const zeG = zg / Math.pow(cosPsi, 3);
  
  const yP = getLewisFactor(zeP, toothSystem);
  const yG = getLewisFactor(zeG, toothSystem);
  
  let designSigma = sigmaP;
  let designY = yP;
  let designZ = zp; // Use actual Z for torque/geometry, but Y is based on Ze
  
  if ((sigmaG * yG) < (sigmaP * yP)) {
    designSigma = sigmaG;
    designY = yG;
    designZ = zg;
  }
  
  // Normal module calculation
  const mnTheoretical = Math.pow( (2 * T * cosPsi) / (designZ * designSigma * faceWidthFactor * designY), 1/3 );
  const mn = getNextStandardModule(mnTheoretical);
  
  // Geometry
  const mt = mn / cosPsi; // Transverse module
  const dp = mt * zp;
  const dg = mt * zg;
  const b = faceWidthFactor * mn;
  
  const Ft = (2 * T) / dp;
  // const v = (Math.PI * dp * speedPinion) / 60000;
  
  const isSafe = true;

  return {
    isSafe,
    mainValue: mn.toString(),
    mainLabel: 'Normal Module',
    mainUnit: 'mm',
    subText: `Helix Angle: ${helixAngle}°`,
    items: [
      { label: 'Transverse Module', value: mt.toFixed(3), unit: 'mm' },
      { label: 'Face Width', value: b.toFixed(2), unit: 'mm' },
      { label: 'Pitch Dia (Pinion)', value: dp.toFixed(2), unit: 'mm' },
      { label: 'Pitch Dia (Gear)', value: dg.toFixed(2), unit: 'mm' },
      { label: 'Formative Teeth (P)', value: zeP.toFixed(1) },
      { label: 'Tangential Load', value: (Ft/1000).toFixed(2), unit: 'kN' },
    ]
  };
}

export function calculateBevelGear(input: BevelGearInput, sigmaP: number): GenericResult {
  const { power, speedPinion, ratio, teethPinion: zp, shaftAngle } = input;
  
  const zg = Math.round(zp * ratio);
  const thetaP = Math.atan(Math.sin(shaftAngle * Math.PI/180) / (ratio + Math.cos(shaftAngle * Math.PI/180)));
  const thetaG = (shaftAngle * Math.PI/180) - thetaP;
  
  const T = (9550 * power / speedPinion) * 1000;
  
  const mTheoretical = Math.pow((2*T)/(sigmaP * 10 * 0.1 * zp), 1/3); // Approx
  const m = getNextStandardModule(mTheoretical);
  
  const dp = m * zp;
  const dg = m * zg;
  const L = 0.5 * Math.sqrt(dp*dp + dg*dg);
  const b = L / 3;

  return {
    isSafe: true,
    mainValue: m.toString(),
    mainLabel: 'Module',
    mainUnit: 'mm',
    subText: 'Straight Bevel Gear',
    items: [
      { label: 'Cone Distance', value: L.toFixed(2), unit: 'mm' },
      { label: 'Face Width', value: b.toFixed(2), unit: 'mm' },
      { label: 'Pitch Angle (Pinion)', value: (thetaP * 180 / Math.PI).toFixed(2), unit: 'deg' },
      { label: 'Pitch Angle (Gear)', value: (thetaG * 180 / Math.PI).toFixed(2), unit: 'deg' },
      { label: 'Pitch Dia (Pinion)', value: dp.toFixed(2), unit: 'mm' },
      { label: 'Pitch Dia (Gear)', value: dg.toFixed(2), unit: 'mm' },
    ]
  };
}

export function calculateWormGear(input: WormGearInput, sigmaWheel: number): GenericResult {
  const { power, speedWorm, ratio, zWorm, qFactor } = input;

  const zGear = Math.round(zWorm * ratio);
  const speedGear = speedWorm / ratio;
  
  // Torque on Gear (Output Torque)
  const Tg = (9550 * power / speedGear) * 1000; // N-mm
  
  // Design Logic: Based on Strength of Worm Wheel (usually Bronze, weaker)
  // Tangential Load on Wheel Ft = 2*Tg / dg
  // Strength Fs = sigma * b * y * m
  // Geometry: dg = m * z_g; dw = m * q; b (effective) approx 0.75 * dw ? 
  // Standard approximation: Fs should approx Ft.
  // m^3 = (2 * Tg) / (z_g * sigma * y * widthFactor * q)
  // Let's assume effective width factor K relative to m is derived from dw.
  // Using a simplified iterative estimation or rough formula:
  // m >= 1.24 * cbrt( Tg / (z_g * sigma * y) ) assuming standard proportions.
  
  // Let's use Lewis Factor for 20 deg full depth as approximation for wheel teeth
  const y = getLewisFactor(zGear, ToothSystem.FULL_DEPTH_20); 
  
  // Approx formula: m = cbrt( 2*Tg / (z_g * sigma * y * 0.5 * q) ) - assuming face width ~ 0.5 * dw
  const widthFactor = 0.5 * qFactor; 
  const mTheoretical = Math.pow( (2 * Tg) / (zGear * sigmaWheel * y * widthFactor), 1/3 );
  
  const m = getNextStandardModule(mTheoretical);
  
  // Dimensions
  const dw = m * qFactor;
  const dg = m * zGear;
  const b = widthFactor * m; // Approx face width of wheel
  const centerDistance = 0.5 * (dw + dg);
  
  // Forces
  const Ft_gear = (2 * Tg) / dg;
  // Axial force on worm = Tangential on gear
  
  // Sliding Velocity
  const leadAngleRad = Math.atan(zWorm / qFactor);
  const vw = (Math.PI * dw * speedWorm) / 60000; // m/s
  const vs = vw / Math.cos(leadAngleRad); // Sliding velocity
  
  return {
    isSafe: true,
    mainValue: m.toString(),
    mainLabel: 'Axial Module',
    mainUnit: 'mm',
    subText: `Wheel Teeth: ${zGear}`,
    items: [
      { label: 'Worm Diameter', value: dw.toFixed(2), unit: 'mm' },
      { label: 'Wheel Diameter', value: dg.toFixed(2), unit: 'mm' },
      { label: 'Center Distance', value: centerDistance.toFixed(2), unit: 'mm' },
      { label: 'Face Width (Wheel)', value: b.toFixed(2), unit: 'mm' },
      { label: 'Lead Angle', value: (leadAngleRad * 180 / Math.PI).toFixed(2), unit: 'deg' },
      { label: 'Tangential Load (Wheel)', value: (Ft_gear/1000).toFixed(2), unit: 'kN' },
      { label: 'Sliding Velocity', value: vs.toFixed(2), unit: 'm/s' },
    ]
  };
}

export function calculateShaft(input: ShaftInput, yieldStrength: number): GenericResult {
  const { power, speed, bendingMoment, factorKb, factorKt, safetyFactor } = input;
  
  const T = (60 * power * 1000) / (2 * Math.PI * speed); // Torque N-m
  const M = bendingMoment;
  
  const tauMax = yieldStrength / (2 * safetyFactor); // Max shear stress theory
  
  // d^3 = (16 / (pi * tau)) * sqrt( (Kb*M)^2 + (Kt*T)^2 )
  const equivalentLoad = Math.sqrt(Math.pow(factorKb * M, 2) + Math.pow(factorKt * T, 2));
  const dCubed = (16 * equivalentLoad) / (Math.PI * (tauMax * 1e6)); // tau in Pa
  const d = Math.pow(dCubed, 1/3) * 1000; // mm
  
  // Round up to nearest 5mm
  const dStandard = Math.ceil(d / 5) * 5;

  return {
    isSafe: true,
    mainValue: dStandard.toString(),
    mainLabel: 'Shaft Diameter',
    mainUnit: 'mm',
    subText: `Calculated: ${d.toFixed(2)} mm`,
    items: [
      { label: 'Torque', value: T.toFixed(2), unit: 'N-m' },
      { label: 'Bending Moment', value: M.toString(), unit: 'N-m' },
      { label: 'Equiv. Twisting Moment', value: equivalentLoad.toFixed(2), unit: 'N-m' },
      { label: 'Allowable Shear', value: tauMax.toFixed(2), unit: 'MPa' },
      { label: 'Safety Factor', value: safetyFactor.toString() },
    ]
  };
}

export function calculateSpring(input: SpringInput, tauPermissible: number): GenericResult {
  const { load, springIndex, rigidityModulus } = input;
  
  // Wahl factor
  const C = springIndex;
  const K = (4 * C - 1)/(4 * C - 4) + (0.615 / C);
  
  // tau = K * (8 * F * C) / (pi * d^2)
  // d^2 = K * 8 * F * C / (pi * tau)
  const dSquared = (K * 8 * load * C) / (Math.PI * tauPermissible);
  const d = Math.sqrt(dSquared);
  
  // Standard wire gauge rounding (simplified)
  const dStd = Math.ceil(d * 10) / 10;
  const D = C * dStd;
  
  // Stiffness k = Gd / 8C^3 n
  // assume n = 10 for display
  const n = 10;
  const k = (rigidityModulus * 1e3 * dStd) / (8 * Math.pow(C, 3) * n);
  const deflection = load / k;

  return {
    isSafe: true,
    mainValue: dStd.toFixed(1),
    mainLabel: 'Wire Diameter',
    mainUnit: 'mm',
    subText: `Mean Dia: ${D.toFixed(1)} mm`,
    items: [
      { label: 'Wahl Factor', value: K.toFixed(3) },
      { label: 'Max Shear Stress', value: tauPermissible.toString(), unit: 'MPa' },
      { label: 'Active Coils (Assumed)', value: n.toString() },
      { label: 'Stiffness', value: k.toFixed(2), unit: 'N/mm' },
      { label: 'Deflection', value: deflection.toFixed(2), unit: 'mm' },
    ]
  };
}