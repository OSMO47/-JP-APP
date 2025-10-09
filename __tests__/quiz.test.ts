import { buildQuizQuestion, needsReview, updateStatsForAnswer } from '@/lib/quiz';

describe('quiz helpers', () => {
  it('creates a question with four options and one correct answer', () => {
    const question = buildQuizQuestion(['N5']);
    expect(question.options).toHaveLength(4);
    expect(question.options.filter((option) => option.isCorrect)).toHaveLength(1);
  });

  it('updates stats with leitner progression', () => {
    const base = updateStatsForAnswer('n5-0001', undefined, true);
    expect(base.correctCount).toBe(1);
    expect(base.box).toBe(2);
    const wrong = updateStatsForAnswer('n5-0001', base, false);
    expect(wrong.box).toBe(1);
    expect(wrong.wrongCount).toBe(1);
  });

  it('determines review requirement based on intervals', () => {
    const now = new Date();
    const stat = updateStatsForAnswer('n5-0001', undefined, true, new Date(now.getTime() - 5 * 86400000));
    expect(needsReview(stat, now)).toBe(true);
  });
});
