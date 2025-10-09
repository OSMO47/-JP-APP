import { NextResponse } from 'next/server';
import { aggregateStats } from '@/lib/stats';
import { getBaseVocabulary } from '@/lib/vocab';
import type { VocabStat } from '@/types/vocab';

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawStats = searchParams.get('stats');
  let stats: VocabStat[] = [];
  if (rawStats) {
    try {
      stats = JSON.parse(rawStats) as VocabStat[];
    } catch (error) {
      return NextResponse.json({ message: 'Invalid stats payload' }, { status: 400 });
    }
  }
  const aggregated = aggregateStats(stats, getBaseVocabulary());
  return NextResponse.json(aggregated.topMistakes);
}
