'use client';

import localforage from 'localforage';
import type { ImportMeta, VocabItem, VocabStat } from '@/types/vocab';

const vocabStore = localforage.createInstance({
  name: 'jlpt-vocab',
  storeName: 'vocabulary'
});

const statsStore = localforage.createInstance({
  name: 'jlpt-vocab',
  storeName: 'stats'
});

const metaStore = localforage.createInstance({
  name: 'jlpt-vocab',
  storeName: 'meta'
});

export async function getAllVocabulary(): Promise<VocabItem[]> {
  const items: VocabItem[] = [];
  await vocabStore.iterate<VocabItem, void>((value) => {
    if (value) {
      items.push(value);
    }
  });
  return items;
}

export async function setVocabulary(items: VocabItem[]) {
  await vocabStore.clear();
  await Promise.all(items.map((item) => vocabStore.setItem(item.id, item)));
}

export async function upsertVocabulary(item: VocabItem) {
  await vocabStore.setItem(item.id, item);
}

export async function removeVocabulary(id: string) {
  await vocabStore.removeItem(id);
}

export async function getStat(wordId: string): Promise<VocabStat | undefined> {
  return statsStore.getItem<VocabStat>(wordId);
}

export async function setStat(wordId: string, stat: VocabStat) {
  await statsStore.setItem(wordId, stat);
}

export async function getAllStats(): Promise<VocabStat[]> {
  const items: VocabStat[] = [];
  await statsStore.iterate<VocabStat, void>((value) => {
    if (value) {
      items.push(value);
    }
  });
  return items;
}

export async function clearStats() {
  await statsStore.clear();
}

export async function setMeta(meta: ImportMeta) {
  await metaStore.setItem(meta.source, meta);
}

export async function getAllMeta(): Promise<ImportMeta[]> {
  const items: ImportMeta[] = [];
  await metaStore.iterate<ImportMeta, void>((value) => {
    if (value) {
      items.push(value);
    }
  });
  return items;
}

export const db = {
  getAllVocabulary,
  setVocabulary,
  upsertVocabulary,
  removeVocabulary,
  getStat,
  setStat,
  getAllStats,
  clearStats,
  setMeta,
  getAllMeta
};
