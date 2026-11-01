export interface FanCalculationParams {
  totalOccupants: number;
  temperatureC: number;
  humidityPercent: number;
  currentFanSpeed: number; // 0..5
  tempThreshold: number; // e.g. 26.5 C
  tempHysteresis: number; // e.g. 0.5 C
  humidityThreshold: number; // e.g. 70 %
  isRoomEmptyGraceActive: boolean; // true if room empty but within grace window
}

export interface FanCalculationResult {
  targetSpeed: number; // 0..5
  powerOn: boolean;
  explanation: string;
}

/**
 * Calculates optimal fan speed:
 * - Must be occupied (or in active empty grace period)
 * - Triggers if temperature > tempThreshold or humidity > humidityThreshold
 * - Speed scales from 1 to 5 based on how far temperature exceeds threshold and occupancy count
 * - Hysteresis prevents rapid on/off flapping near the threshold
 */
export function calculateFanControl(params: FanCalculationParams): FanCalculationResult {
  const {
    totalOccupants,
    temperatureC,
    humidityPercent,
    currentFanSpeed,
    tempThreshold,
    tempHysteresis,
    humidityThreshold,
    isRoomEmptyGraceActive,
  } = params;

  // 1. If room has 0 occupants and grace period has elapsed
  if (totalOccupants === 0 && !isRoomEmptyGraceActive) {
    return {
      targetSpeed: 0,
      powerOn: false,
      explanation: 'Room is empty and grace period elapsed. Fans turned off to conserve energy.',
    };
  }

  // 2. Check if temperature or humidity exceeds comfort thresholds
  const tempOver = temperatureC - tempThreshold;
  const humidityOver = humidityPercent - humidityThreshold;

  const requiresCooling = tempOver > 0 || humidityOver > 0;

  if (!requiresCooling) {
    // If currently running, check hysteresis before switching off completely
    if (currentFanSpeed > 0 && tempOver > -tempHysteresis) {
      return {
        targetSpeed: currentFanSpeed,
        powerOn: true,
        explanation: `Temperature ${temperatureC.toFixed(1)}°C is within cooling hysteresis band (threshold ${tempThreshold}°C). Maintained speed ${currentFanSpeed}.`,
      };
    }

    return {
      targetSpeed: 0,
      powerOn: false,
      explanation: `Climate comfortable (Temp: ${temperatureC.toFixed(1)}°C, Humidity: ${humidityPercent.toFixed(0)}%). Fans kept off.`,
    };
  }

  // 3. Compute speed (1 to 5)
  // Base speed from temperature delta
  let speed = 1;
  if (tempOver >= 4.0) speed = 5;
  else if (tempOver >= 3.0) speed = 4;
  else if (tempOver >= 2.0) speed = 3;
  else if (tempOver >= 1.0) speed = 2;
  else speed = 1;

  // High humidity adds +1 speed boost
  if (humidityPercent >= 75 && speed < 5) {
    speed += 1;
  }

  // High occupancy adds +1 speed boost (body heat accumulation)
  if (totalOccupants >= 20 && speed < 5) {
    speed += 1;
  }

  // If in empty room grace period, step down to speed 1 or 2
  if (totalOccupants === 0 && isRoomEmptyGraceActive) {
    speed = Math.min(speed, 2);
    return {
      targetSpeed: speed,
      powerOn: true,
      explanation: `Empty room grace period active. Fans running on low comfort setting (${speed}) before auto shutdown.`,
    };
  }

  return {
    targetSpeed: speed,
    powerOn: true,
    explanation: `Occupancy active (${totalOccupants} people), Temp: ${temperatureC.toFixed(1)}°C (threshold: ${tempThreshold}°C), Humidity: ${humidityPercent.toFixed(0)}%. Fan speed set to ${speed}.`,
  };
}
