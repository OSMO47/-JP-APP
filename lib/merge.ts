import { z } from 'zod';
import type { ImportPayload, ImportResult, JLPTLevel, MergePreview, VocabItem } from '@/types/vocab';

const importSchema = z.object({
  _meta: z.object({
    source: z.string(),
    version: z.string(),
    level: z.enum(['N5', 'N4', 'N3']).optional()
  }),
  items: z
    .array(
      z.object({
        id: z.string().optional(),
        kanji: z.string().optional().default(''),
        kana: z.string().min(1),
        meaning_th: z.string().min(1),
        meaning_en: z.string().optional(),
        level: z.enum(['N5', 'N4', 'N3'])
      })
    )
    .min(1)
});

export function validateImportPayload(data: unknown): ImportPayload {
  return importSchema.parse(data);
}

function uid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 12);
}

function checksum(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return `chk_${Math.abs(hash).toString(16)}`;
}

function normaliseItem(item: ImportPayload['items'][number], fallbackLevel?: JLPTLevel): VocabItem {
  const id = item.id ?? `${(item.level ?? fallbackLevel ?? 'N5').toLowerCase()}-${uid()}`;
  return {
    id,
    kanji: item.kanji ?? '',
    kana: item.kana,
    meaning_th: item.meaning_th,
    meaning_en: item.meaning_en,
    level: item.level ?? fallbackLevel ?? 'N5'
  };
}

export function previewMerge(
  payload: ImportPayload,
  existing: VocabItem[]
): { preview: MergePreview; normalised: VocabItem[] } {
  const fallbackLevel = payload._meta.level;
  const normalised = payload.items.map((item) => normaliseItem(item, fallbackLevel));
  const preview: MergePreview = {
    newItems: [],
    duplicates: [],
    conflicts: []
  };

  for (const item of normalised) {
    const found = existing.find((existingItem) => existingItem.id === item.id);
    if (!found) {
      preview.newItems.push(item);
      continue;
    }
    if (found.kana !== item.kana || found.meaning_th !== item.meaning_th || found.kanji !== item.kanji) {
      preview.conflicts.push(item);
      continue;
    }
    preview.duplicates.push(item);
  }

  return { preview, normalised };
}

export function mergeVocabulary(
  strategy: 'append-only' | 'upsert' | 'skip-duplicates',
  existing: VocabItem[],
  incoming: VocabItem[],
  meta: ImportPayload['_meta']
): { items: VocabItem[]; result: ImportResult } {
  const map = new Map(existing.map((item) => [item.id, item] as const));
  let importedCount = 0;
  let skippedCount = 0;
  let updatedCount = 0;

  for (const item of incoming) {
    const has = map.has(item.id);
    if (!has) {
      map.set(item.id, item);
      importedCount += 1;
      continue;
    }
    if (strategy === 'append-only' || strategy === 'skip-duplicates') {
      skippedCount += 1;
      continue;
    }
    map.set(item.id, item);
    updatedCount += 1;
  }

  const digest = checksum(JSON.stringify(incoming));

  const result: ImportResult = {
    appliedStrategy: strategy,
    importedCount,
    skippedCount,
    updatedCount,
    meta: {
      source: meta.source,
      version: meta.version,
      level: meta.level,
      importedAt: new Date().toISOString(),
      checksum: digest
    }
  };

  return { items: Array.from(map.values()), result };
}
