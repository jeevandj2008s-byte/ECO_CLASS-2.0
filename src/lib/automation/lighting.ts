export interface LightingCalculationParams {
  occupantsInZone: number;
  totalRoomOccupants: number;
  ambientLux: number;
  currentBrightness: number;
  targetLux: number;
  minSafetyLuxPercent: number;
  hysteresis: number; // e.g. 30 lux
}

export interface LightingCalculationResult {
  targetBrightnessPercent: number;
  powerOn: boolean;
  explanation: string;
}

/**
 * Calculates optimal artificial lighting level for a specific bench row zone.
 * - Daylight harvesting: targetArtificialLux = max(0, targetLux - ambientLux)
 * - Occupancy density scaling: Slightly increases lux if crowded
 * - Hysteresis anti-flapping: avoids changing brightness if current brightness yields lux within tolerance
 * - Safety rule: If occupants > 0, brightness is NEVER 0.
 * - If empty: dims to minSafetyLuxPercent (e.g. 10%) or 0 if configured.
 */
export function calculateZoneLighting(params: LightingCalculationParams): LightingCalculationResult {
  const {
    occupantsInZone,
    totalRoomOccupants,
    ambientLux,
    currentBrightness,
    targetLux,
    minSafetyLuxPercent,
    hysteresis,
  } = params;

  // 1. If row is EMPTY
  if (occupantsInZone === 0) {
    if (minSafetyLuxPercent > 0) {
      return {
        targetBrightnessPercent: minSafetyLuxPercent,
        powerOn: true,
        explanation: `Bench row is unoccupied. Dimmed to ${minSafetyLuxPercent}% minimum safety level to conserve power.`,
      };
    }
    return {
      targetBrightnessPercent: 0,
      powerOn: false,
      explanation: 'Bench row is unoccupied and minimum safety level is 0%. Light switched off.',
    };
  }

  // 2. Zone is OCCUPIED
  // Target lux scaling based on occupancy density:
  // Baseline is targetLux (e.g. 400). If many people are in the room, bump up to +50 lux for active classroom.
  const occupancyBoost = Math.min(50, Math.floor(totalRoomOccupants / 5) * 10);
  const effectiveTargetLux = targetLux + occupancyBoost;

  // Daylight harvesting:
  // If ambient lux (natural daylight) is >= effectiveTargetLux, artificial light can be minimal/off.
  const luxDeficit = effectiveTargetLux - ambientLux;

  if (luxDeficit <= 0) {
    // Ambient daylight is sufficient on its own!
    // But since occupants are present, maintain a gentle 15% fill light or minSafety to prevent shadowing
    const daylightFill = Math.max(15, minSafetyLuxPercent);
    return {
      targetBrightnessPercent: daylightFill,
      powerOn: true,
      explanation: `Ample natural daylight detected (${ambientLux.toFixed(0)} lux >= target ${effectiveTargetLux.toFixed(0)} lux). Maintained gentle ${daylightFill}% fill lighting for occupants.`,
    };
  }

  // Linear / proportional mapping of deficit lux to brightness %
  // Assuming 100% LED output produces approximately 450-500 lux at desk level
  const maxFixtureLux = 450;
  const rawTargetPercent = Math.min(100, Math.max(15, Math.round((luxDeficit / maxFixtureLux) * 100)));

  // Hysteresis check:
  // If existing brightness produces output within hysteresis band (approx 30 lux ~ 6-7%), do not flap
  const percentDelta = Math.abs(rawTargetPercent - currentBrightness);
  const hysteresisPercentThreshold = Math.max(5, Math.round((hysteresis / maxFixtureLux) * 100));

  if (percentDelta < hysteresisPercentThreshold && currentBrightness > 0) {
    // Keep current brightness to prevent flickering/flapping
    return {
      targetBrightnessPercent: currentBrightness,
      powerOn: true,
      explanation: `Current brightness ${currentBrightness}% is within hysteresis tolerance (±${hysteresis} lux). Kept stable to prevent flicker.`,
    };
  }

  // Safety rule: Never allow 0% when occupied
  const finalBrightness = Math.max(15, rawTargetPercent);

  return {
    targetBrightnessPercent: finalBrightness,
    powerOn: true,
    explanation: `Active occupants (${occupantsInZone} in row). Adjusted brightness to ${finalBrightness}% to reach target ${effectiveTargetLux.toFixed(0)} lux (ambient: ${ambientLux.toFixed(0)} lux).`,
  };
}
