import { NextResponse } from 'next/server';
import { previewMerge, validateImportPayload } from '@/lib/merge';
import { getBaseVocabulary } from '@/lib/vocab';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = validateImportPayload(body);
    const { preview } = previewMerge(payload, getBaseVocabulary());
    return NextResponse.json(preview);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
