import n3 from '@/data/n3.json';
import n4 from '@/data/n4.json';
import n5 from '@/data/n5.json';
import type { JLPTLevel, VocabItem } from '@/types/vocab';

const baseData: Record<JLPTLevel, VocabItem[]> = {
  N3: n3,
  N4: n4,
  N5: n5
};

export function getBaseVocabulary(levels?: JLPTLevel[]): VocabItem[] {
  if (!levels || levels.length === 0) {
    return [...baseData.N3, ...baseData.N4, ...baseData.N5];
  }
  return levels.flatMap((level) => baseData[level]);
}

export function findVocabById(id: string): VocabItem | undefined {
  const level = id.slice(0, 2).toUpperCase() as JLPTLevel;
  const list = baseData[level];
  return list?.find((item) => item.id === id);
}

export function resolveLevels(levels: JLPTLevel | JLPTLevel[] | undefined): JLPTLevel[] {
  if (!levels) return ['N5', 'N4', 'N3'];
  return Array.isArray(levels) ? levels : [levels];
}

export function allLevels(): JLPTLevel[] {
  return ['N5', 'N4', 'N3'];
}
