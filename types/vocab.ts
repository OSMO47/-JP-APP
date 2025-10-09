export type JLPTLevel = 'N5' | 'N4' | 'N3';

export interface VocabItem {
  id: string;
  kanji: string;
  kana: string;
  meaning_th: string;
  level: JLPTLevel;
  meaning_en?: string;
  tags?: string[];
}

export interface QuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  prompt: string;
  wordId: string;
  reading: string;
  level: JLPTLevel;
  options: QuizOption[];
}

export interface VocabStat {
  wordId: string;
  correctCount: number;
  wrongCount: number;
  lastSeenAt: string;
  lastAnswerCorrect?: boolean;
  streak: number;
  box: 1 | 2 | 3 | 4 | 5;
  proficiencyScore: number;
}

export interface ImportMeta {
  source: string;
  version: string;
  level?: JLPTLevel;
  importedAt: string;
  checksum: string;
}

export interface ImportPayload {
  _meta: {
    source: string;
    version: string;
    level?: JLPTLevel;
  };
  items: Array<Omit<VocabItem, 'id'> & { id?: string }>;
}

export interface MergePreview {
  newItems: VocabItem[];
  duplicates: VocabItem[];
  conflicts: VocabItem[];
}

export interface ImportResult {
  appliedStrategy: 'append-only' | 'upsert' | 'skip-duplicates';
  importedCount: number;
  skippedCount: number;
  updatedCount: number;
  meta: ImportMeta;
}
