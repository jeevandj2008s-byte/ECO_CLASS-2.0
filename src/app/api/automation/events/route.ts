import { NextResponse } from 'next/server';

export async function GET() {
  const events = [
    {
      id: 'evt-1',
      event_type: 'ZONE_ILLUMINATION_ADAPT',
      classroom_name: 'IoT & Embedded Systems Lab (CR-204)',
      zone_name: 'Row 5 (Last Bench)',
      trigger_inputs: { rowIndex: 5, occupantsInRow: 1, ambientLux: 150 },
      actions_taken: { brightness: 80, powerOn: true },
      explanation: 'Occupants detected in Row 5 (1 student). Boosted artificial brightness to 80% to reach 400 lux target.',
      created_at: new Date(Date.now() - 60 * 1000).toISOString(),
    },
    {
      id: 'evt-2',
      event_type: 'ZONE_IDLE_DIM',
      classroom_name: 'IoT & Embedded Systems Lab (CR-204)',
      zone_name: 'Row 1 (Front Row)',
      trigger_inputs: { rowIndex: 1, occupantsInRow: 0, ambientLux: 150 },
      actions_taken: { brightness: 10, powerOn: true },
      explanation: 'Bench row 1 is unoccupied. Dimmed to 10% minimum safety level to conserve energy.',
      created_at: new Date(Date.now() - 120 * 1000).toISOString(),
    },
    {
      id: 'evt-3',
      event_type: 'FAN_COOLING_ACTIVE',
      classroom_name: 'IoT & Embedded Systems Lab (CR-204)',
      zone_name: 'Ceiling Fan Hub',
      trigger_inputs: { temperatureC: 28.5, humidityPercent: 68, totalOccupants: 15 },
      actions_taken: { fanSpeed: 3, powerOn: true },
      explanation: 'Temperature 28.5°C exceeded comfort threshold 26.5°C. Fan speed set to 3 for occupants.',
      created_at: new Date(Date.now() - 300 * 1000).toISOString(),
    },
  ];

  return NextResponse.json({ events });
}
