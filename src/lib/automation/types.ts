import { AutomationRule, ControlMode } from '../types/database.types';

export interface ZoneTelemetry {
  zoneId: string;
  rowIndex: number;
  occupantCount: number;
  ambientLux?: number;
}

export interface ClassroomAutomationInput {
  classroomId: string;
  blockId: string;
  totalOccupancy: number;
  rowOccupancy: Record<number, number>; // rowIndex (1..N) -> count
  ambientLux: number; // overall classroom lux or from daylight sensor
  temperatureC: number;
  humidityPercent: number;
  lastSensorReadingAt: string; // ISO string to check for sensor loss / failsafe
  devices: Array<{
    deviceId: string;
    zoneId?: string | null;
    deviceType: 'light' | 'fan' | 'sensor' | 'power_meter' | 'camera';
    currentPower: boolean;
    currentBrightness: number;
    currentFanSpeed: number;
    mode: ControlMode;
    overrideUntil?: string | null;
    lastCommandTime?: string | null;
  }>;
  zones: Array<{
    id: string;
    rowIndex: number;
    name: string;
    targetLux: number;
    minSafetyLuxPercent: number;
  }>;
  rule: AutomationRule;
  upcomingClassInMinutes?: number | null; // e.g. 5 means class in 5 min
  roomEmptySince?: string | null; // ISO string when occupancy reached 0
}

export interface DeviceAction {
  deviceId: string;
  deviceType: 'light' | 'fan';
  zoneId?: string | null;
  powerOn: boolean;
  brightnessPercent: number;
  fanSpeed: number;
  mode: ControlMode;
  reason: string;
}

export interface AutomationDecision {
  classroomId: string;
  timestamp: string;
  actions: DeviceAction[];
  events: Array<{
    eventType: string;
    zoneId?: string | null;
    deviceId?: string | null;
    triggerInputs: Record<string, unknown>;
    actionsTaken: Record<string, unknown>;
    explanation: string;
  }>;
  isFailsafe: boolean;
}
