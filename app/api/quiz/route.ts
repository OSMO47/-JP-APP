import { NextResponse } from 'next/server';
import { buildQuizQuestion } from '@/lib/quiz';
import type { JLPTLevel } from '@/types/vocab';

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawLevels = searchParams.getAll('level') as JLPTLevel[];
  try {
    const question = buildQuizQuestion(rawLevels.length > 0 ? rawLevels : undefined);
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
