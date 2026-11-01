'use client';

import Classroom3DPage from '../classroom/[id]/page';
import { CAMPUS_CONFIG } from '@/lib/config/campus';

export default function Classroom3DEntryPage() {
  const paramsPromise = Promise.resolve({ id: CAMPUS_CONFIG.defaultClassroomId });
  return <Classroom3DPage params={paramsPromise} />;
}
