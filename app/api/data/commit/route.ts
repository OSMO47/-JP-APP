import { NextResponse } from 'next/server';
import { mergeVocabulary, previewMerge, validateImportPayload } from '@/lib/merge';
import { getBaseVocabulary } from '@/lib/vocab';
import type { VocabItem } from '@/types/vocab';

interface Payload {
  strategy: 'append-only' | 'upsert' | 'skip-duplicates';
  data: unknown;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;
    const payload = validateImportPayload(body.data);
    const { normalised } = previewMerge(payload, getBaseVocabulary());
    const { items, result } = mergeVocabulary(body.strategy, getBaseVocabulary(), normalised as VocabItem[], payload._meta);
    return NextResponse.json({ items, result });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
