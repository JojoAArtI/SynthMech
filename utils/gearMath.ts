import { ERROR_VELOCITY_TABLE, STANDARD_MODULES } from '../constants';
import { SpurGearInput, ToothSystem } from '../types';

export interface CalculationResult {
  mTheoretical: number;
  mStandard: number;
  dp: number;
  dg: number;
  b: number;
  v: number;
  ft: number;
  fd: number;
  fw: number;
  isSafe: boolean;
  weakerMember: string;
  sigmaUsed: number;
  yFactor: number;
}

function getLewisFactor(z: number, system: ToothSystem): number {
  if (system === ToothSystem.FULL_DEPTH_14_5) {
    return 0.124 - 0.684 / z;
  } else if (system === ToothSystem.FULL_DEPTH_20) {
    return 0.154 - 0.912 / z;
  } else {
    // Stub
    return 0.175 - 0.95 / z;
  }
}

function getErrorFromVelocity(v: number): number {
  for (const [vel, e] of ERROR_VELOCITY_TABLE) {
    if (v <= vel) return e;
  }
  return ERROR_VELOCITY_TABLE[ERROR_VELOCITY_TABLE.length - 1][1];
}

function getNextStandardModule(m: number): number {
  for (const sm of STANDARD_MODULES) {
    if (sm >= m) return sm;
  }
  return STANDARD_MODULES[STANDARD_MODULES.length - 1];
}

function calculateBuckinghamDynamicLoad(Ft: number, v: number, b: number, C = 11860): number {
  const sqrtTerm = Math.sqrt(b * C + Ft);
  const numerator = 21 * v * (b * C + Ft);
  const denominator = 21 * v + sqrtTerm;
  
  // Avoid division by zero if v is 0 (though unlikely in design)
  if (denominator === 0) return Ft;
  
  return Ft + numerator / denominator;
}

export function calculateGearDesign(
  inputs: SpurGearInput,
  pinionMat: { sigma: number; bhn: number },
  gearMat: { sigma: number; bhn: number }
): CalculationResult {
  const {
    power,
    speedPinion: Np,
    ratio,
    teethPinion: zp,
    toothSystem,
    faceWidthMethod,
    faceWidthFactor,
    faceWidthValue,
    diameterPinion: inputDp
  } = inputs;

  // 1. Resolve basic geometry
  const zg = Math.round(zp * ratio);
  
  // 2. Identify Weaker Member
  const sigmaP = pinionMat.sigma;
  const sigmaG = gearMat.sigma;
  
  const yP = getLewisFactor(zp, toothSystem);
  const yG = getLewisFactor(zg, toothSystem);
  
  const strengthP = sigmaP * yP;
  const strengthG = sigmaG * yG;
  
  let weakerMember: 'PINION' | 'GEAR' = 'PINION';
  let designSigma = sigmaP;
  let designY = yP;
  let designZ = zp;
  
  if (strengthG < strengthP) {
    weakerMember = 'GEAR';
    designSigma = sigmaG;
    designY = yG;
    designZ = zg;
  }

  // 3. Torque
  // Power (P) in kW -> Torque (T) in N-mm
  // T = (P * 60) / (2 * pi * N) * 10^6 ?? 
  // Standard formula: T = (9550 * P / N) * 1000 for N-mm
  const T = (9550 * power / Np) * 1000;

  // 4. Calculate Module
  let mTheoretical = 0;
  
  // Case A: Diameter is known
  if (inputDp && inputDp > 0) {
    // Ft_temp assuming diameter
    const Ft_temp = (2 * T) / inputDp;
    // Need k? Or b?
    // If diameter is known, usually we verify stresses. 
    // But the python code calculates 'm' using sqrt formula.
    // m = sqrt( Ft / (sigma * k * y) ) assuming b = k*m
    // If b is fixed value, use m = Ft / (sigma * b * y)
    
    if (faceWidthMethod === 'VALUE') {
      // Ft = sigma * b * y * m
      // (2T / (m*z)) = sigma * b * y * m
      // 2T / z = sigma * b * y * m^2
      // m = sqrt( 2T / (z * sigma * b * y) )
      mTheoretical = Math.sqrt((2 * T) / (designZ * designSigma * faceWidthValue * designY));
    } else {
      // b = k * m
      // Ft = sigma * (k*m) * y * m
      // 2T / (m*z) = sigma * k * y * m^2
      // 2T / z = sigma * k * y * m^3
      // m = cbrt( 2T / (z * sigma * k * y) )
      // Wait, python used sqrt for diameter known? 
      // Python: m_theoretical = math.sqrt(Ft_temp / (sigma * k * y)) 
      // Ft_temp = 2T/dp. dp = m*z. So Ft_temp = 2T/(m*z).
      // m = sqrt( (2T/mz) / (sigma * k * y) )
      // m^2 = 2T / (m * z * sigma * k * y)
      // m^3 = ... same cube root.
      
      // Let's stick to Python's structure which forces 'k' usage if diameter unknown
      // But if diameter IS known (dp), then dp is fixed. m = dp / zp.
      // So theoretical module IS derived directly from geometry.
      // However, we probably want the module required for STRENGTH.
      
      // Python logic for diameter known:
      // Ft_temp = 2 * T / dp
      // m_theoretical = math.sqrt(Ft_temp / (sigma * k * y))
      // This logic assumes we want to find 'm' that satisfies strength for the LOAD at that diameter, assuming b varies with m? 
      // Let's just follow the Python path exactly.
      const k = faceWidthFactor;
      const Ft_tmp = (2 * T) / inputDp;
      mTheoretical = Math.sqrt(Ft_tmp / (designSigma * k * designY));
    }
  } else {
    // Case B: Diameter unknown
    if (faceWidthMethod === 'VALUE') {
       // Derived above: m = sqrt( 2T / (z * sigma * b * y) )
       mTheoretical = Math.sqrt((2 * T) / (designZ * designSigma * faceWidthValue * designY));
    } else {
       // Python logic: m = ((2 * T) / (sigma * k * y * z)) ** (1/3)
       const k = faceWidthFactor;
       mTheoretical = Math.pow((2 * T) / (designSigma * k * designY * designZ), 1/3);
    }
  }

  // 5. Select Standard Module
  const mStandard = getNextStandardModule(mTheoretical);

  // 6. Final Geometry
  // If diameter was input, Python OVERWRITES it with m * z logic?
  // Python: dp = m * zp. Yes, it recalculates dp based on standard module.
  const dp = mStandard * zp;
  const dg = mStandard * zg;
  
  let b = faceWidthValue;
  if (faceWidthMethod === 'FACTOR') {
    b = faceWidthFactor * mStandard;
  }

  // 7. Loads
  const Ft = (2 * T) / dp;
  const v = (Math.PI * dp * Np) / (60 * 1000); // m/s (dp is mm)
  
  // 8. Dynamic Load
  const Fd = calculateBuckinghamDynamicLoad(Ft, v, b);
  
  // 9. Wear Load
  // Q = 2*zg / (zp + zg) for external gears.
  // Assumes external gears (no internal input)
  const Q = (2 * zg) / (zp + zg);
  
  // K factor. Python uses BHN from material?
  // Python: BHN=200, K = 0.16 * (BHN/100)^2
  // We should use weaker member BHN or pinion BHN? 
  // Usually wear is checked on Pinion because it undergoes more cycles.
  // But strictly, K depends on the combination of materials. 
  // If both steel: K = (sigma_es^2 * sin(phi) * (1/Ep + 1/Eg)) / 1.4 ... complex.
  // The Python script simplifies K based on a single BHN.
  // "inferred / assumed from material stress" -> implies using the WEAKER member's BHN or the PINION's?
  // Let's use the Pinion's BHN as it's the most critical for wear typically, unless specified.
  // The prompt Python code has `BHN = 200`. Hardcoded.
  // But the screenshot shows BHN in the material card. 
  // We will use the Pinion BHN for calculation to be more "Pro".
  const BHN = pinionMat.bhn; 
  const K = 0.16 * Math.pow(BHN / 100, 2);
  
  const Fw = dp * b * Q * K;

  const isSafe = Fw >= Fd;

  return {
    mTheoretical,
    mStandard,
    dp,
    dg,
    b,
    v,
    ft: Ft,
    fd: Fd,
    fw: Fw,
    isSafe,
    weakerMember,
    sigmaUsed: designSigma,
    yFactor: designY,
  };
}