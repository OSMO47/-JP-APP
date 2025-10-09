import { NextResponse } from 'next/server';
import { updateStatsForAnswer } from '@/lib/quiz';
import type { VocabStat } from '@/types/vocab';

interface Payload {
  wordId: string;
  correct: boolean;
  stat?: VocabStat;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Payload;
  if (!body?.wordId) {
    return NextResponse.json({ message: 'wordId is required' }, { status: 400 });
  }
  const updated = updateStatsForAnswer(body.wordId, body.stat, body.correct);
  return NextResponse.json(updated);
}
