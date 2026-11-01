import { NextRequest, NextResponse } from 'next/server';
import { TelemetryIngestSchema } from '@/lib/validation/schemas';
import { deviceSimulator } from '@/lib/simulator/device-simulator';
import { EmergencyIncidentService } from '@/lib/emergency/service';
import { mqttBroker } from '@/lib/mqtt/client';
import { MQTT_TOPICS } from '@/lib/mqtt/topics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = TelemetryIngestSchema.parse(body);

    // Update simulator state
    deviceSimulator.injectState(validated.classroom_id, {
      environment: {
        lux: validated.lux,
        temp: validated.temperature_c,
        humidity: validated.humidity_percent,
      },
    });

    // Check for electrical anomalies / emergencies
    const emergencyResult = await EmergencyIncidentService.evaluateTelemetry({
      classroomId: validated.classroom_id,
      blockId: 'b1000000-0000-0000-0000-000000000001',
      zoneId: validated.zone_id,
      deviceId: validated.device_id,
      currentAmps: validated.current_amps,
      voltageVolts: validated.voltage_volts,
      powerWatts: validated.power_watts,
      temperatureC: validated.temperature_c,
    });

    // Publish telemetry upstream on MQTT
    const topic = MQTT_TOPICS.telemetry(
      'main',
      'b1',
      validated.classroom_id,
      validated.device_id || 'sensor-hub'
    );
    await mqttBroker.publish(topic, validated);

    return NextResponse.json({
      success: true,
      ingested: true,
      emergency_triggered: emergencyResult !== null,
      emergency_details: emergencyResult,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Invalid telemetry data' },
      { status: 400 }
    );
  }
}
