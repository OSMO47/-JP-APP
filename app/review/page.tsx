'use client';

import { useMemo } from 'react';
import { MistakeList } from '@/components/MistakeList';
import { QuizCard } from '@/components/QuizCard';
import { useVocab } from '@/components/providers/VocabProvider';
import type { JLPTLevel } from '@/types/vocab';

export default function ReviewPage() {
  const { reviewList } = useVocab();
  const levels = useMemo(() => Array.from(new Set(reviewList.map((item) => item.level))) as JLPTLevel[], [reviewList]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white/70 p-6 shadow">
        <h1 className="text-2xl font-bold">ทบทวนคำที่พลาด</h1>
        <p className="text-sm text-moss">ระบบ Leitner จะจัดคิวตามระดับกล่องและวันนัดหมาย</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {reviewList.length === 0 ? (
            <p className="text-sm text-moss">ยังไม่มีคำที่ต้องทบทวน</p>
          ) : (
            reviewList.slice(0, 10).map((item) => (
              <div key={item.id} className="rounded-xl border border-sky/20 bg-sky/5 p-3">
                <div className="text-lg font-semibold">{item.kanji || item.kana}</div>
                <div className="text-sm text-moss">{item.meaning_th}</div>
                <div className="text-xs text-moss">ระดับ {item.level}</div>
              </div>
            ))
          )}
        </div>
      </section>
      <section className="rounded-2xl bg-white/70 p-6 shadow">
        <h2 className="text-xl font-semibold">Top Mistakes</h2>
        <MistakeList />
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">ฝึกเฉพาะคำที่พลาด</h2>
        <QuizCard levels={levels.length > 0 ? levels : undefined} />
      </section>
    </div>
  );
}
