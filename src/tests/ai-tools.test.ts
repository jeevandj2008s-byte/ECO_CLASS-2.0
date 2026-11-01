import { describe, it, expect } from 'vitest';
import { executeToolCall } from '../lib/ai/tools';
import { claudeAssistant } from '../lib/ai/claude';

describe('AI Assistant Server-Side Tool Calling & Security Matrix', () => {
  const roomId = 'c1000000-0000-0000-0000-000000000204';

  it('allows read-only queries for all users including students', async () => {
    const studentCtx = {
      userId: 'stud-1',
      userEmail: 'student@campus.edu',
      userRole: 'user' as const,
      assignedBlocks: [],
    };

    const status = await executeToolCall('get_classroom_status', { classroom_id: roomId }, studentCtx);
    expect(status.error).toBeUndefined();
    expect(status.classroom_id).toBe(roomId);
    expect(status.total_occupancy).toBeDefined();

    const decision = await executeToolCall('explain_automation_decision', { classroom_id: roomId }, studentCtx);
    expect(decision.recent_events).toBeDefined();
    expect(decision.recent_events.length).toBeGreaterThan(0);
  });

  it('FORBIDS regular user from executing destructive action (switch_off_devices)', async () => {
    const studentCtx = {
      userId: 'stud-1',
      userEmail: 'student@campus.edu',
      userRole: 'user' as const,
      assignedBlocks: [],
    };

    const result = await executeToolCall(
      'switch_off_devices',
      { classroom_id: roomId, device_ids: ['light-1'], reason: 'Test switch off' },
      studentCtx
    );

    expect(result.error).toBeDefined();
    expect(result.code).toBe('FORBIDDEN');
  });

  it('ALLOWS worker/HOD/Admin to execute device control with audit logging', async () => {
    const workerCtx = {
      userId: 'work-1',
      userEmail: 'technician@campus.edu',
      userRole: 'worker' as const,
      assignedBlocks: ['b1000000-0000-0000-0000-000000000001'],
    };

    const result = await executeToolCall(
      'switch_off_devices',
      { classroom_id: roomId, device_ids: ['light-r1-c1000000'], reason: 'Routine evening maintenance' },
      workerCtx
    );

    expect(result.error).toBeUndefined();
    expect(result.success).toBe(true);
    expect(result.audit_recorded).toBe(true);
  });

  it('processes natural language questions and resolves appropriate tools', async () => {
    const ctx = {
      userId: 'admin-1',
      userEmail: 'admin@campus.edu',
      userRole: 'admin' as const,
    };

    const q1 = await claudeAssistant.processMessage('What is happening in Block B?', [], ctx);
    expect(q1.toolCallsExecuted).toContain('get_block_summary');
    expect(q1.response).toContain('Block B');

    const q2 = await claudeAssistant.processMessage('How many students are in 204?', [], ctx);
    expect(q2.toolCallsExecuted).toContain('get_classroom_status');
    expect(q2.response).toContain('Room 204');
  });
});
