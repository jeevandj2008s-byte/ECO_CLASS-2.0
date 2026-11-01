import { NextResponse } from 'next/server';

export async function GET() {
  const openApiSpec = {
    openapi: '3.0.3',
    info: {
      title: 'Eco Class (Sustainable Class) API',
      version: '1.0.0',
      description:
        'RESTful API for the Eco Class smart-classroom energy conservation and automation platform for colleges.',
      contact: {
        name: 'Eco Class Engineering Team',
        email: 'engineering@ecoclass.campus.edu',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local Development Server',
      },
    ],
    paths: {
      '/campus': {
        get: {
          summary: 'Get campus topology',
          description: 'Retrieves all departments, academic blocks, and floors.',
          responses: {
            '200': { description: 'Campus topology hierarchy' },
          },
        },
      },
      '/classrooms/{id}': {
        get: {
          summary: 'Get live classroom state',
          description: 'Returns real-time occupancy, environmental sensor readings, zone brightness, and power flow.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            '200': { description: 'Live classroom state and devices' },
          },
        },
      },
      '/classrooms/{id}/layout': {
        get: {
          summary: 'Get 3D room layout & digital twin model',
          description: 'Returns rows, benches, seats with exact coordinate offsets for 3D rendering.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            '200': { description: '3D layout model' },
          },
        },
      },
      '/devices/commands': {
        post: {
          summary: 'Send device control command',
          description: 'Idempotent command to adjust brightness, fan speed, or set manual override.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    device_id: { type: 'string' },
                    power_on: { type: 'boolean' },
                    brightness_percent: { type: 'number', minimum: 0, maximum: 100 },
                    fan_speed: { type: 'number', minimum: 0, maximum: 5 },
                    mode: { type: 'string', enum: ['auto', 'manual', 'forced_off'] },
                    override_duration_seconds: { type: 'number' },
                    idempotency_key: { type: 'string' },
                  },
                  required: ['device_id'],
                },
              },
            },
          },
          responses: {
            '200': { description: 'Command dispatched and queued' },
          },
        },
      },
      '/devices/telemetry': {
        post: {
          summary: 'Ingest sensor telemetry',
          description: 'Sensor data ingestion endpoint (lux, temp, humidity, voltage, amps, watts).',
          responses: {
            '200': { description: 'Telemetry processed' },
          },
        },
      },
      '/automation/tick': {
        post: {
          summary: 'Execute automation engine tick',
          description: 'Evaluates occupancy, daylight harvesting, fan cooling, and schedules for a classroom.',
          responses: {
            '200': { description: 'Automation decisions evaluated and applied' },
          },
        },
      },
      '/occupancy/manual': {
        post: {
          summary: 'Manual occupancy input',
          description: 'Used by 3D classroom page to simulate or manually record people presence per row.',
          responses: {
            '200': { description: 'Occupancy recorded' },
          },
        },
      },
      '/incidents': {
        get: {
          summary: 'List emergency incidents',
          description: 'Returns open and acknowledged emergency hazards (staff only).',
          responses: {
            '200': { description: 'Emergency incidents list' },
          },
        },
        post: {
          summary: 'Raise emergency incident',
          description: 'Staff manual trigger or automated breaker trip.',
          responses: {
            '201': { description: 'Incident created and power cut applied' },
          },
        },
      },
      '/ai/chat': {
        post: {
          summary: 'AI Assistant query',
          description: 'Chat with the Claude-powered energy supervisor with server-side tool calling.',
          responses: {
            '200': { description: 'Assistant answer with tools executed' },
          },
        },
      },
      '/simulator/inject': {
        post: {
          summary: 'Simulator state injection',
          description: 'Inject people, environment, or electrical faults into the virtual classroom.',
          responses: {
            '200': { description: 'State injected' },
          },
        },
      },
    },
  };

  return NextResponse.json(openApiSpec);
}
