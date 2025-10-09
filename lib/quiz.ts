import type { JLPTLevel, QuizQuestion, VocabItem, VocabStat } from '@/types/vocab';
import { getBaseVocabulary, resolveLevels } from '@/lib/vocab';

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickIncorrectOptions(correct: VocabItem, pool: VocabItem[], count: number): VocabItem[] {
  const filtered = pool.filter((item) => item.id !== correct.id);
  return shuffle(filtered).slice(0, count);
}

function uid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
}

export function buildQuizQuestion(levels?: JLPTLevel[]): QuizQuestion {
  const targetLevels = resolveLevels(levels);
  const vocabulary = getBaseVocabulary(targetLevels);
  if (vocabulary.length < 4) {
    throw new Error('Not enough vocabulary to build a quiz question.');
  }
  const [correct, ...rest] = shuffle(vocabulary);
  const incorrectOptions = pickIncorrectOptions(correct, rest, 3);
  return {
    prompt: correct.kanji || correct.kana,
    reading: correct.kana,
    level: correct.level,
    wordId: correct.id,
    options: shuffle([
      { id: uid(), label: correct.meaning_th, isCorrect: true },
      ...incorrectOptions.map((option) => ({
        id: uid(),
        label: option.meaning_th,
        isCorrect: false
      }))
    ])
  };
}

export function updateStatsForAnswer(
  wordId: string,
  stat: VocabStat | undefined,
  correct: boolean,
  now = new Date()
): VocabStat {
  const base: VocabStat =
    stat ?? {
      wordId,
      correctCount: 0,
      wrongCount: 0,
      lastSeenAt: now.toISOString(),
      lastAnswerCorrect: undefined,
      streak: 0,
      box: 1,
      proficiencyScore: 0
    };

  const nextBox = correct ? Math.min((base.box ?? 1) + 1, 5) : Math.max((base.box ?? 1) - 1, 1);
  const streak = correct ? (base.lastAnswerCorrect ? base.streak + 1 : 1) : 0;
  const correctCount = base.correctCount + (correct ? 1 : 0);
  const wrongCount = base.wrongCount + (correct ? 0 : 1);
  const proficiencyScore = correctCount / Math.max(correctCount + wrongCount, 1);

  return {
    wordId,
    correctCount,
    wrongCount,
    lastSeenAt: now.toISOString(),
    lastAnswerCorrect: correct,
    streak,
    box: nextBox as VocabStat['box'],
    proficiencyScore
  };
}

export function needsReview(stat: VocabStat, reference = new Date()): boolean {
  const intervals = {
    1: 0,
    2: 2,
    3: 4,
    4: 7,
    5: 14
  } as const;
  const days = intervals[stat.box];
  const lastSeen = new Date(stat.lastSeenAt);
  const diff = (reference.getTime() - lastSeen.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= days;
}
