import { NextRequest, NextResponse } from 'next/server';
import { deviceSimulator } from '@/lib/simulator/device-simulator';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const room = deviceSimulator.getClassroom(id) || deviceSimulator.getAllClassrooms()[0];

  if (!room) {
    return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });
  }

  // Construct devices list with real-time state
  const devices = Array.from(room.devices.values()).map((dev) => ({
    id: dev.id,
    type: dev.type,
    name: dev.type === 'light' ? `Row ${dev.rowIndex} Light` : 'Ceiling Fan',
    rowIndex: dev.rowIndex,
    zoneId: dev.zoneId,
    powerOn: dev.powerOn,
    brightnessPercent: dev.brightnessPercent,
    fanSpeed: dev.fanSpeed,
    liveWatts: dev.currentWatts,
    mode: 'auto',
  }));

  // Power flow hierarchy: Supply -> Block -> Room -> Zones -> Devices
  const powerFlow = {
    supply: { name: 'Main Campus Grid Transformer', status: 'normal' },
    block: { id: room.blockId, name: 'Turing Block Main Subpanel', totalWatts: room.powerMeter.watts },
    classroom: { id: room.classroomId, name: room.name, totalWatts: room.powerMeter.watts, breakerTripped: room.isBreakerTripped },
    zones: [1, 2, 3, 4, 5].map((r) => {
      const dev = devices.find((d) => d.rowIndex === r);
      return {
        rowIndex: r,
        name: `Zone Row ${r}`,
        occupants: room.occupancy.rows[r] || 0,
        liveWatts: dev ? dev.liveWatts : 0,
        brightnessPercent: dev ? dev.brightnessPercent : 0,
      };
    }),
  };

  return NextResponse.json({
    classroom_id: room.classroomId,
    block_id: room.blockId,
    name: room.name,
    occupancy: room.occupancy,
    environment: room.environment,
    power_meter: room.powerMeter,
    is_breaker_tripped: room.isBreakerTripped,
    devices,
    power_flow: powerFlow,
  });
}
