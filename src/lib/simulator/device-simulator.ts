import { mqttBroker } from '../mqtt/client';
import { MQTT_TOPICS } from '../mqtt/topics';
import { PRESET_SCENARIOS, SimulatorScenarioConfig } from './scenarios';

export interface VirtualActuator {
  id: string;
  type: 'light' | 'fan';
  zoneId?: string | null;
  rowIndex?: number;
  powerOn: boolean;
  brightnessPercent: number;
  fanSpeed: number;
  ratedWatts: number;
  currentWatts: number;
}

export interface VirtualClassroomState {
  classroomId: string;
  blockId: string;
  campusId: string;
  name: string;
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
  powerMeter: {
    amps: number;
    volts: number;
    watts: number;
    frequencyHz: number;
  };
  devices: Map<string, VirtualActuator>;
  isBreakerTripped: boolean;
}

export class DeviceSimulator {
  private classrooms = new Map<string, VirtualClassroomState>();
  private tickInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor() {
    this.setupMqttCommandListeners();
  }

  public registerClassroom(config: {
    classroomId: string;
    blockId: string;
    campusId?: string;
    name: string;
    rowCount?: number;
  }) {
    const campusId = config.campusId || 'main';
    const rowCount = config.rowCount || 5;

    const devices = new Map<string, VirtualActuator>();

    // 5 Row Lights
    for (let r = 1; r <= rowCount; r++) {
      const id = `light-r${r}-${config.classroomId.slice(0, 8)}`;
      devices.set(id, {
        id,
        type: 'light',
        rowIndex: r,
        zoneId: `z-${r}`,
        powerOn: false,
        brightnessPercent: 0,
        fanSpeed: 0,
        ratedWatts: 60.0,
        currentWatts: 0.0,
      });
    }

    // 2 Fans
    const fan1Id = `fan-f-${config.classroomId.slice(0, 8)}`;
    const fan2Id = `fan-r-${config.classroomId.slice(0, 8)}`;
    devices.set(fan1Id, {
      id: fan1Id,
      type: 'fan',
      powerOn: false,
      brightnessPercent: 0,
      fanSpeed: 0,
      ratedWatts: 75.0,
      currentWatts: 0.0,
    });
    devices.set(fan2Id, {
      id: fan2Id,
      type: 'fan',
      powerOn: false,
      brightnessPercent: 0,
      fanSpeed: 0,
      ratedWatts: 75.0,
      currentWatts: 0.0,
    });

    const rows: Record<number, number> = {};
    for (let r = 1; r <= rowCount; r++) rows[r] = 0;

    this.classrooms.set(config.classroomId, {
      classroomId: config.classroomId,
      blockId: config.blockId,
      campusId,
      name: config.name,
      occupancy: { total: 0, students: 0, teachers: 0, rows },
      environment: { lux: 250, temp: 24.5, humidity: 50 },
      powerMeter: { amps: 0.1, volts: 230, watts: 23, frequencyHz: 50.0 },
      devices,
      isBreakerTripped: false,
    });
  }

  public getClassroom(classroomId: string): VirtualClassroomState | undefined {
    return this.classrooms.get(classroomId);
  }

  public getAllClassrooms(): VirtualClassroomState[] {
    return Array.from(this.classrooms.values());
  }

  public applyScenario(classroomId: string, scenarioCode: string): boolean {
    const room = this.classrooms.get(classroomId);
    const scenario = PRESET_SCENARIOS[scenarioCode];
    if (!room || !scenario) return false;

    room.occupancy = { ...scenario.occupancy };
    room.environment = { ...scenario.environment };

    if (scenario.incident) {
      room.powerMeter.amps = scenario.incident.amps;
      room.powerMeter.volts = scenario.incident.volts;
      room.powerMeter.watts = scenario.incident.watts;
    } else {
      this.recalculatePower(room);
    }

    return true;
  }

  public injectState(classroomId: string, update: {
    occupancy?: { total?: number; students?: number; teachers?: number; rows?: Record<number, number> };
    environment?: { lux?: number; temp?: number; humidity?: number };
    incident?: { amps: number; volts: number; watts: number };
  }): boolean {
    const room = this.classrooms.get(classroomId);
    if (!room) return false;

    if (update.occupancy) {
      if (update.occupancy.total !== undefined) room.occupancy.total = update.occupancy.total;
      if (update.occupancy.students !== undefined) room.occupancy.students = update.occupancy.students;
      if (update.occupancy.teachers !== undefined) room.occupancy.teachers = update.occupancy.teachers;
      if (update.occupancy.rows) room.occupancy.rows = { ...room.occupancy.rows, ...update.occupancy.rows };
    }

    if (update.environment) {
      if (update.environment.lux !== undefined) room.environment.lux = update.environment.lux;
      if (update.environment.temp !== undefined) room.environment.temp = update.environment.temp;
      if (update.environment.humidity !== undefined) room.environment.humidity = update.environment.humidity;
    }

    if (update.incident) {
      room.powerMeter.amps = update.incident.amps;
      room.powerMeter.volts = update.incident.volts;
      room.powerMeter.watts = update.incident.watts;
    } else {
      this.recalculatePower(room);
    }

    return true;
  }

  public executeCommand(classroomId: string, deviceId: string, cmd: {
    powerOn?: boolean;
    brightnessPercent?: number;
    fanSpeed?: number;
  }) {
    const room = this.classrooms.get(classroomId);
    if (!room) return;

    const dev = room.devices.get(deviceId);
    if (!dev) return;

    if (cmd.powerOn !== undefined) dev.powerOn = cmd.powerOn;
    if (cmd.brightnessPercent !== undefined) dev.brightnessPercent = cmd.brightnessPercent;
    if (cmd.fanSpeed !== undefined) dev.fanSpeed = cmd.fanSpeed;

    this.recalculatePower(room);

    // Send MQTT ACK
    const ackTopic = MQTT_TOPICS.ack(room.campusId, room.blockId, room.classroomId, dev.id);
    mqttBroker.publish(ackTopic, {
      status: 'acknowledged',
      deviceId: dev.id,
      state: {
        powerOn: dev.powerOn,
        brightnessPercent: dev.brightnessPercent,
        fanSpeed: dev.fanSpeed,
        liveWatts: dev.currentWatts,
      },
      timestamp: new Date().toISOString(),
    });
  }

  public tripBreaker(classroomId: string) {
    const room = this.classrooms.get(classroomId);
    if (!room) return;

    room.isBreakerTripped = true;
    for (const dev of room.devices.values()) {
      dev.powerOn = false;
      dev.brightnessPercent = 0;
      dev.fanSpeed = 0;
      dev.currentWatts = 0;
    }
    room.powerMeter.amps = 0;
    room.powerMeter.watts = 0;
  }

  private recalculatePower(room: VirtualClassroomState) {
    if (room.isBreakerTripped) {
      room.powerMeter.watts = 0;
      room.powerMeter.amps = 0;
      return;
    }

    let totalWatts = 5.0; // standby baseline power (router/sensor)

    for (const dev of room.devices.values()) {
      if (!dev.powerOn) {
        dev.currentWatts = 0.5; // quiescent standby
      } else if (dev.type === 'light') {
        dev.currentWatts = (dev.brightnessPercent / 100) * dev.ratedWatts;
      } else if (dev.type === 'fan') {
        dev.currentWatts = (dev.fanSpeed / 5) * dev.ratedWatts;
      }
      totalWatts += dev.currentWatts;
    }

    room.powerMeter.watts = Number(totalWatts.toFixed(1));
    room.powerMeter.volts = 230;
    room.powerMeter.amps = Number((totalWatts / 230).toFixed(2));
  }

  private setupMqttCommandListeners() {
    mqttBroker.subscribe(MQTT_TOPICS.wildcardTelemetry('+', '+', '+', '+'), () => {});

    // Listen to command wildcard
    mqttBroker.subscribe('ecoclass/campus/+/block/+/room/+/device/+/command', (topic, payload) => {
      try {
        const parsed = JSON.parse(payload.toString());
        const parts = topic.split('/');
        const roomId = parts[6];
        const deviceId = parts[8];

        this.executeCommand(roomId, deviceId, {
          powerOn: parsed.power_on ?? parsed.powerOn,
          brightnessPercent: parsed.brightness_percent ?? parsed.brightnessPercent,
          fanSpeed: parsed.fan_speed ?? parsed.fanSpeed,
        });
      } catch (err) {
        console.error('Simulator command parse error:', err);
      }
    });
  }
}

export const deviceSimulator = new DeviceSimulator();
// Seed CR-204 in simulator
deviceSimulator.registerClassroom({
  classroomId: 'c1000000-0000-0000-0000-000000000204',
  blockId: 'b1000000-0000-0000-0000-000000000001',
  name: 'IoT & Embedded Systems Lab (CR-204)',
  rowCount: 5,
});
