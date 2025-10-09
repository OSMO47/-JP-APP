'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/db';
import { aggregateStats } from '@/lib/stats';
import { buildQuizQuestion, updateStatsForAnswer } from '@/lib/quiz';
import { getBaseVocabulary } from '@/lib/vocab';
import type {
  ImportPayload,
  ImportResult,
  JLPTLevel,
  MergePreview,
  QuizQuestion,
  VocabItem,
  VocabStat
} from '@/types/vocab';
import type { AppSettings } from '@/types/settings';
import { defaultSettings } from '@/types/settings';
import { mergeVocabulary, previewMerge, validateImportPayload } from '@/lib/merge';

interface ImportState {
  preview?: MergePreview;
  pending?: {
    meta: ImportPayload['_meta'];
    items: VocabItem[];
  };
}

interface VocabContextValue {
  baseVocabulary: VocabItem[];
  customVocabulary: VocabItem[];
  vocabulary: VocabItem[];
  stats: VocabStat[];
  aggregatedStats: ReturnType<typeof aggregateStats>;
  settings: AppSettings;
  loading: boolean;
  activeLevels: JLPTLevel[];
  lastQuiz?: QuizQuestion;
  reviewList: VocabItem[];
  topMistakes: Array<{ vocab: VocabItem | undefined; stat: VocabStat }>;
  startQuiz(levels?: JLPTLevel[]): QuizQuestion;
  recordAnswer(wordId: string, correct: boolean): Promise<void>;
  addCustomVocab(item: Omit<VocabItem, 'id'>): Promise<VocabItem>;
  updateCustomVocab(id: string, patch: Partial<VocabItem>): Promise<void>;
  removeCustomVocab(id: string): Promise<void>;
  setSettings(settings: AppSettings): void;
  queueImport(file: ImportPayload): MergePreview;
  commitImport(strategy: 'append-only' | 'upsert' | 'skip-duplicates'): Promise<ImportResult | undefined>;
  rollbackImport(): void;
  clearStats(): Promise<void>;
}

const VocabContext = createContext<VocabContextValue | undefined>(undefined);
const SETTINGS_KEY = 'jlpt-vocab-settings';

function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return defaultSettings;
  const raw = window.localStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings;
  try {
    const parsed = JSON.parse(raw) as AppSettings;
    return { ...defaultSettings, ...parsed };
  } catch (error) {
    console.error('Failed to parse settings', error);
    return defaultSettings;
  }
}

function persistSettings(settings: AppSettings) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function makeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

export function VocabProvider({ children }: { children: React.ReactNode }) {
  const baseVocabulary = useMemo(() => getBaseVocabulary(), []);
  const [customVocabulary, setCustomVocabulary] = useState<VocabItem[]>([]);
  const [stats, setStats] = useState<VocabStat[]>([]);
  const [settings, setSettingsState] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [lastQuiz, setLastQuiz] = useState<QuizQuestion>();
  const [importState, setImportState] = useState<ImportState>({});

  useEffect(() => {
    setSettingsState(loadSettings());
  }, []);

  useEffect(() => {
    async function hydrate() {
      setLoading(true);
      try {
        const [vocab, statsResult] = await Promise.all([db.getAllVocabulary(), db.getAllStats()]);
        setCustomVocabulary(vocab);
        setStats(statsResult);
      } finally {
        setLoading(false);
      }
    }
    void hydrate();
  }, []);

  const vocabulary = useMemo(() => [...baseVocabulary, ...customVocabulary], [baseVocabulary, customVocabulary]);

  const aggregatedStats = useMemo(() => aggregateStats(stats, vocabulary), [stats, vocabulary]);

  const reviewList = useMemo(() => {
    return aggregatedStats.reviewQueue
      .map((entry) => entry.vocab)
      .filter((item): item is VocabItem => Boolean(item));
  }, [aggregatedStats.reviewQueue]);

  const topMistakes = useMemo(() => aggregatedStats.topMistakes, [aggregatedStats]);

  const activeLevels = useMemo(() => settings.levels, [settings.levels]);

  const startQuiz = useCallback(
    (levels?: JLPTLevel[]) => {
      const question = buildQuizQuestion(levels ?? activeLevels);
      setLastQuiz(question);
      return question;
    },
    [activeLevels]
  );

  const recordAnswer = useCallback(async (wordId: string, correct: boolean) => {
    setStats((prev) => {
      const current = prev.find((item) => item.wordId === wordId);
      const updated = updateStatsForAnswer(wordId, current, correct);
      void db.setStat(wordId, updated);
      const others = prev.filter((item) => item.wordId !== wordId);
      return [...others, updated];
    });
  }, []);

  const addCustomVocab = useCallback(async (item: Omit<VocabItem, 'id'>) => {
    const newItem: VocabItem = { ...item, id: `custom-${makeId()}` };
    await db.upsertVocabulary(newItem);
    setCustomVocabulary((prev) => [...prev, newItem]);
    return newItem;
  }, []);

  const updateCustomVocab = useCallback(async (id: string, patch: Partial<VocabItem>) => {
    setCustomVocabulary((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...patch, id } : item));
      const updated = next.find((item) => item.id === id);
      if (updated) {
        void db.upsertVocabulary(updated);
      }
      return next;
    });
  }, []);

  const removeCustomVocab = useCallback(async (id: string) => {
    await db.removeVocabulary(id);
    setCustomVocabulary((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const setSettings = useCallback((next: AppSettings) => {
    setSettingsState(next);
    persistSettings(next);
  }, []);

  const queueImport = useCallback(
    (file: ImportPayload) => {
      const payload = validateImportPayload(file);
      const { preview, normalised } = previewMerge(payload, customVocabulary);
      setImportState({ preview, pending: { meta: payload._meta, items: normalised } });
      return preview;
    },
    [customVocabulary]
  );

  const commitImport = useCallback(
    async (strategy: 'append-only' | 'upsert' | 'skip-duplicates') => {
      if (!importState.pending) return undefined;
      const incoming = importState.pending.items;
      const { items, result } = mergeVocabulary(strategy, customVocabulary, incoming, importState.pending.meta);
      await db.setVocabulary(items);
      setCustomVocabulary(items);
      setImportState({});
      await db.setMeta(result.meta);
      return result;
    },
    [customVocabulary, importState.pending]
  );

  const rollbackImport = useCallback(() => {
    setImportState({});
  }, []);

  const clearStats = useCallback(async () => {
    await db.clearStats();
    setStats([]);
  }, []);

  const value = useMemo<VocabContextValue>(
    () => ({
      baseVocabulary,
      customVocabulary,
      vocabulary,
      stats,
      aggregatedStats,
      settings,
      loading,
      activeLevels,
      lastQuiz,
      reviewList,
      topMistakes,
      startQuiz,
      recordAnswer,
      addCustomVocab,
      updateCustomVocab,
      removeCustomVocab,
      setSettings,
      queueImport,
      commitImport,
      rollbackImport,
      clearStats
    }),
    [
      baseVocabulary,
      customVocabulary,
      vocabulary,
      stats,
      aggregatedStats,
      settings,
      loading,
      activeLevels,
      lastQuiz,
      reviewList,
      topMistakes,
      startQuiz,
      recordAnswer,
      addCustomVocab,
      updateCustomVocab,
      removeCustomVocab,
      setSettings,
      queueImport,
      commitImport,
      rollbackImport,
      clearStats
    ]
  );

  return <VocabContext.Provider value={value}>{children}</VocabContext.Provider>;
}

export function useVocab() {
  const context = useContext(VocabContext);
  if (!context) {
    throw new Error('useVocab must be used within VocabProvider');
  }
  return context;
}
