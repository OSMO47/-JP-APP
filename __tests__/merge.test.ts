import { mergeVocabulary, previewMerge, validateImportPayload } from '@/lib/merge';
import { getBaseVocabulary } from '@/lib/vocab';

const samplePayload = {
  _meta: { source: 'test-pack', version: '1.0.0', level: 'N5' },
  items: [
    { kana: 'あたらしい', kanji: '新しい', meaning_th: 'ใหม่', level: 'N5' },
    { kana: 'ふるい', kanji: '古い', meaning_th: 'เก่า', level: 'N5' }
  ]
};

describe('merge helpers', () => {
  it('validates and previews payloads', () => {
    const payload = validateImportPayload(samplePayload);
    const { preview } = previewMerge(payload, getBaseVocabulary());
    expect(preview.newItems.length).toBeGreaterThan(0);
  });

  it('merges vocabulary according to strategy', () => {
    const payload = validateImportPayload(samplePayload);
    const { normalised } = previewMerge(payload, getBaseVocabulary());
    const { items, result } = mergeVocabulary('append-only', getBaseVocabulary(), normalised, payload._meta);
    expect(items.length).toBeGreaterThan(getBaseVocabulary().length);
    expect(result.importedCount).toBe(normalised.length);
  });
});
