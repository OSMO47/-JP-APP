import type { VocabItem, VocabStat } from '@/types/vocab';
import { needsReview } from '@/lib/quiz';

export interface AggregatedStats {
  totalAnswered: number;
  accuracy: number;
  streak: number;
  topMistakes: Array<{ stat: VocabStat; vocab?: VocabItem }>;
  reviewQueue: Array<{ stat: VocabStat; vocab?: VocabItem }>;
}

export function aggregateStats(stats: VocabStat[], vocab: VocabItem[]): AggregatedStats {
  const totalCorrect = stats.reduce((sum, stat) => sum + stat.correctCount, 0);
  const totalWrong = stats.reduce((sum, stat) => sum + stat.wrongCount, 0);
  const totalAnswered = totalCorrect + totalWrong;
  const accuracy = totalAnswered === 0 ? 0 : totalCorrect / totalAnswered;
  const topMistakes = [...stats]
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, 10)
    .map((stat) => ({
      stat,
      vocab: vocab.find((item) => item.id === stat.wordId)
    }));
  const reviewQueue = stats
    .filter((stat) => needsReview(stat))
    .sort((a, b) => new Date(a.lastSeenAt).getTime() - new Date(b.lastSeenAt).getTime())
    .map((stat) => ({
      stat,
      vocab: vocab.find((item) => item.id === stat.wordId)
    }));

  const streak = stats.reduce((max, stat) => Math.max(max, stat.streak), 0);

  return {
    totalAnswered,
    accuracy,
    streak,
    topMistakes,
    reviewQueue
  };
}

export function computeProficiency(stat: VocabStat): number {
  const total = stat.correctCount + stat.wrongCount;
  if (!total) return 0;
  return stat.correctCount / total;
}
