import { NextRequest, NextResponse } from 'next/server';
import { AIChatRequestSchema } from '@/lib/validation/schemas';
import { claudeAssistant } from '@/lib/ai/claude';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = AIChatRequestSchema.parse(body);

    const userEmail = req.headers.get('x-user-email') || 'staff@ecoclass.campus.edu';
    const userRole = (req.headers.get('x-user-role') as any) || 'worker';
    const userId = req.headers.get('x-user-id') || 'usr-staff-1';

    const ctx = {
      userId,
      userEmail,
      userRole,
      assignedBlocks: ['b1000000-0000-0000-0000-000000000001'],
    };

    const result = await claudeAssistant.processMessage(validated.message, [], ctx);

    return NextResponse.json({
      success: true,
      conversation_id: validated.conversation_id || `conv-${Date.now()}`,
      response: result.response,
      tools_executed: result.toolCallsExecuted,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
