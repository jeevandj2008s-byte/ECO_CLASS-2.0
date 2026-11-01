import { NextResponse } from 'next/server';

export async function GET() {
  const departments = [
    { id: 'd1000000-0000-0000-0000-000000000001', code: 'CSE', name: 'Computer Science and Engineering' },
    { id: 'd1000000-0000-0000-0000-000000000002', code: 'ECE', name: 'Electronics and Communication' },
  ];

  const blocks = [
    {
      id: 'b1000000-0000-0000-0000-000000000001',
      name: 'Turing Academic Block',
      code: 'BLOCK-A',
      campus_name: 'Main Green Campus',
      floors_count: 4,
    },
    {
      id: 'b1000000-0000-0000-0000-000000000002',
      name: 'Tesla Technology Block',
      code: 'BLOCK-B',
      campus_name: 'Main Green Campus',
      floors_count: 4,
    },
  ];

  return NextResponse.json({ departments, blocks });
}
