export interface SimulatorScenarioConfig {
  code: string;
  name: string;
  description: string;
  occupancy: {
    total: number;
    students: number;
    teachers: number;
    rows: Record<number, number>;
  };
  environment: {
    lux: number;
    temp: number;
    humidity: number;
  };
  incident?: {
    type: 'short_circuit' | 'overcurrent' | 'smoke_alarm' | 'high_temp';
    amps: number;
    volts: number;
    watts: number;
  };
}

export const PRESET_SCENARIOS: Record<string, SimulatorScenarioConfig> = {
  lone_student_back: {
    code: 'lone_student_back',
    name: 'One Student on Last Bench',
    description: '1 student sitting in row 5. Verifies precision bench-row lighting without illuminating empty rows.',
    occupancy: {
      total: 1,
      students: 1,
      teachers: 0,
      rows: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 },
    },
    environment: {
      lux: 120,
      temp: 24.0,
      humidity: 48,
    },
  },
  full_class_morning: {
    code: 'full_class_morning',
    name: 'Full Class (Morning)',
    description: '30 students present with 1 teacher. Overcast morning (220 lux), moderate temp.',
    occupancy: {
      total: 30,
      students: 29,
      teachers: 1,
      rows: { 1: 6, 2: 6, 3: 6, 4: 6, 5: 6 },
    },
    environment: {
      lux: 220,
      temp: 26.8,
      humidity: 62,
    },
  },
  sunny_day_daylight_harvest: {
    code: 'sunny_day_daylight_harvest',
    name: 'Sunny Afternoon Daylight Harvesting',
    description: 'Full class with strong direct sunlight (750 lux). Engine dims artificial LEDs to save max energy.',
    occupancy: {
      total: 30,
      students: 29,
      teachers: 1,
      rows: { 1: 6, 2: 6, 3: 6, 4: 6, 5: 6 },
    },
    environment: {
      lux: 750,
      temp: 29.5,
      humidity: 68,
    },
  },
  empty_room_idle: {
    code: 'empty_room_idle',
    name: 'Empty Room (Shutdown)',
    description: 'No occupants. Tests automatic standby dimming and complete auto-powerdown.',
    occupancy: {
      total: 0,
      students: 0,
      teachers: 0,
      rows: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
    environment: {
      lux: 100,
      temp: 25.0,
      humidity: 50,
    },
  },
  power_surge: {
    code: 'power_surge',
    name: 'Electrical Power Surge',
    description: 'Current spikes to 34 Amps on branch circuit. Breaker triggers emergency overcurrent incident.',
    occupancy: {
      total: 10,
      students: 10,
      teachers: 0,
      rows: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2 },
    },
    environment: {
      lux: 350,
      temp: 27.0,
      humidity: 55,
    },
    incident: {
      type: 'overcurrent',
      amps: 34.2,
      volts: 248.0,
      watts: 8481.6,
    },
  },
  short_circuit: {
    code: 'short_circuit',
    name: 'Short Circuit & Instantaneous Trip',
    description: 'Live phase touches neutral, drawing 110 Amps with voltage collapse. Automated cut tripped.',
    occupancy: {
      total: 12,
      students: 12,
      teachers: 0,
      rows: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 0 },
    },
    environment: {
      lux: 300,
      temp: 26.0,
      humidity: 50,
    },
    incident: {
      type: 'short_circuit',
      amps: 110.0,
      volts: 15.0,
      watts: 1650.0,
    },
  },
};
