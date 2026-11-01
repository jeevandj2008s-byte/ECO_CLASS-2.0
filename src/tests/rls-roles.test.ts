import { describe, it, expect } from 'vitest';
import { canControlClassroom, AuthContext } from '../lib/auth/permissions';

describe('RLS & Role Permission Matrix Verification', () => {
  const deptCSE = 'd1000000-0000-0000-0000-000000000001';
  const deptECE = 'd1000000-0000-0000-0000-000000000002';

  const blockA = 'b1000000-0000-0000-0000-000000000001';
  const blockB = 'b1000000-0000-0000-0000-000000000002';

  const classroom204 = 'c1000000-0000-0000-0000-000000000204'; // in Block A, CSE

  it('ADMIN: has universal control across all blocks and departments', () => {
    const adminCtx: AuthContext = {
      userId: 'admin-uuid-1',
      email: 'admin@ecoclass.edu',
      role: 'admin',
      assignedBlocks: [],
    };

    expect(canControlClassroom(adminCtx, classroom204, blockA, deptCSE)).toBe(true);
    expect(canControlClassroom(adminCtx, classroom204, blockB, deptECE)).toBe(true);
  });

  it('HOD: can control classrooms in their own department, but NOT other departments', () => {
    const hodCSE: AuthContext = {
      userId: 'hod-cse-1',
      email: 'hod.cse@ecoclass.edu',
      role: 'hod',
      departmentId: deptCSE,
      assignedBlocks: [],
    };

    // Allowed in CSE
    expect(canControlClassroom(hodCSE, classroom204, blockA, deptCSE)).toBe(true);

    // Denied in ECE
    expect(canControlClassroom(hodCSE, classroom204, blockB, deptECE)).toBe(false);
  });

  it('WORKER: can control classrooms in assigned blocks, regardless of department', () => {
    const workerBlockA: AuthContext = {
      userId: 'worker-1',
      email: 'worker1@ecoclass.edu',
      role: 'worker',
      assignedBlocks: [blockA], // Assigned only to Block A
    };

    // Allowed in Block A
    expect(canControlClassroom(workerBlockA, classroom204, blockA, deptCSE)).toBe(true);

    // Denied in Block B
    expect(canControlClassroom(workerBlockA, classroom204, blockB, deptCSE)).toBe(false);
  });

  it('USER (Student / Faculty): strictly read-only, cannot control any devices', () => {
    const studentUser: AuthContext = {
      userId: 'student-1',
      email: 'student@ecoclass.edu',
      role: 'user',
      assignedBlocks: [],
    };

    expect(canControlClassroom(studentUser, classroom204, blockA, deptCSE)).toBe(false);
  });
});
