import { UserRole } from '../types/database.types';
import { getAdminClient } from '../supabase/admin';

export interface AuthContext {
  userId: string;
  email: string;
  role: UserRole;
  departmentId?: string | null;
  assignedBlocks: string[];
}

export async function getUserAuthContext(userId: string): Promise<AuthContext | null> {
  if (process.env.NODE_ENV === 'test') {
    return {
      userId,
      email: 'test@campus.edu',
      role: 'admin',
      assignedBlocks: ['b1'],
    };
  }

  const supabase = getAdminClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, email, role, department_id')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    return null;
  }

  let assignedBlocks: string[] = [];
  if (profile.role === 'worker') {
    const { data: blocks } = await supabase
      .from('worker_block_assignments')
      .select('block_id')
      .eq('worker_id', userId);
    assignedBlocks = (blocks || []).map((b) => b.block_id);
  }

  return {
    userId: profile.id,
    email: profile.email,
    role: profile.role as UserRole,
    departmentId: profile.department_id,
    assignedBlocks,
  };
}

export function canControlClassroom(
  ctx: AuthContext,
  classroomId: string,
  blockId: string,
  departmentId?: string | null
): boolean {
  if (ctx.role === 'admin') return true;
  if (ctx.role === 'hod') {
    return !!ctx.departmentId && ctx.departmentId === departmentId;
  }
  if (ctx.role === 'worker') {
    return ctx.assignedBlocks.includes(blockId);
  }
  return false;
}

export async function logAuditEvent(params: {
  actorId?: string | null;
  actorEmail?: string | null;
  actorRole?: UserRole | null;
  action: string;
  targetResource: string;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const supabase = getAdminClient();
  try {
    await supabase.from('audit_logs').insert({
      actor_id: params.actorId || null,
      actor_email: params.actorEmail || null,
      actor_role: params.actorRole || null,
      action: params.action,
      target_resource: params.targetResource,
      target_id: params.targetId || null,
      metadata: params.metadata || {},
      ip_address: params.ipAddress || null,
      user_agent: params.userAgent || null,
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
