/**
 * MQTT Topic Design for Eco Class Smart Campus
 *
 * Topic Hierarchy:
 * - Telemetry (Device -> Cloud):
 *   ecoclass/campus/{campus_id}/block/{block_id}/room/{room_id}/device/{device_id}/telemetry
 *
 * - Commands (Cloud -> Device):
 *   ecoclass/campus/{campus_id}/block/{block_id}/room/{room_id}/device/{device_id}/command
 *
 * - Acknowledgements (Device -> Cloud):
 *   ecoclass/campus/{campus_id}/block/{block_id}/room/{room_id}/device/{device_id}/ack
 *
 * - Last-Will & Testament (LWT) / Heartbeat (Device -> Cloud):
 *   ecoclass/campus/{campus_id}/device/{device_id}/status
 *   Payload: {"status": "online"|"offline", "last_seen": ISO8601}
 */

export const MQTT_TOPICS = {
  telemetry: (campusId = 'main', blockId: string, roomId: string, deviceId: string) =>
    `ecoclass/campus/${campusId}/block/${blockId}/room/${roomId}/device/${deviceId}/telemetry`,

  command: (campusId = 'main', blockId: string, roomId: string, deviceId: string) =>
    `ecoclass/campus/${campusId}/block/${blockId}/room/${roomId}/device/${deviceId}/command`,

  ack: (campusId = 'main', blockId: string, roomId: string, deviceId: string) =>
    `ecoclass/campus/${campusId}/block/${blockId}/room/${roomId}/device/${deviceId}/ack`,

  status: (campusId = 'main', deviceId: string) =>
    `ecoclass/campus/${campusId}/device/${deviceId}/status`,

  wildcardTelemetry: (campusId = '+', blockId = '+', roomId = '+', deviceId = '+') =>
    `ecoclass/campus/${campusId}/block/${blockId}/room/${roomId}/device/${deviceId}/telemetry`,

  wildcardAck: (campusId = '+', blockId = '+', roomId = '+', deviceId = '+') =>
    `ecoclass/campus/${campusId}/block/${blockId}/room/${roomId}/device/${deviceId}/ack`,

  wildcardStatus: (campusId = '+', deviceId = '+') =>
    `ecoclass/campus/${campusId}/device/${deviceId}/status`,
};

export function parseMqttTopic(topic: string): {
  type: 'telemetry' | 'command' | 'ack' | 'status' | 'unknown';
  campusId?: string;
  blockId?: string;
  roomId?: string;
  deviceId?: string;
} {
  const parts = topic.split('/');
  // ecoclass/campus/{c}/device/{d}/status
  if (parts.length === 5 && parts[0] === 'ecoclass' && parts[1] === 'campus' && parts[4] === 'status') {
    return { type: 'status', campusId: parts[2], deviceId: parts[3] };
  }
  // ecoclass/campus/{c}/block/{b}/room/{r}/device/{d}/{action}
  if (parts.length === 8 && parts[0] === 'ecoclass' && parts[1] === 'campus') {
    const action = parts[7];
    if (action === 'telemetry' || action === 'command' || action === 'ack') {
      return {
        type: action,
        campusId: parts[2],
        blockId: parts[4],
        roomId: parts[6],
        deviceId: parts[7],
      };
    }
  }
  return { type: 'unknown' };
}
