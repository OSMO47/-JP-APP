'use client';

import { useMemo } from 'react';
import { useVocab } from '@/components/providers/VocabProvider';

export function MistakeList() {
  const { topMistakes } = useVocab();
  const data = useMemo(() => topMistakes.slice(0, 10), [topMistakes]);

  if (data.length === 0) {
    return <p className="text-sm text-moss">ยังไม่มีคำที่พลาดบ่อย</p>;
  }

  return (
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-sakura/70 text-left text-xs uppercase text-moss">
        <tr>
          <th className="px-3 py-2">คำศัพท์</th>
          <th className="px-3 py-2">ความหมาย</th>
          <th className="px-3 py-2 text-right">จำนวนผิด</th>
          <th className="px-3 py-2 text-right">Streak</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map(({ vocab, stat }) => (
          <tr key={stat.wordId} className="odd:bg-white even:bg-sky/5">
            <td className="px-3 py-2 font-semibold">{vocab?.kanji || vocab?.kana || stat.wordId}</td>
            <td className="px-3 py-2">{vocab?.meaning_th ?? '-'}</td>
            <td className="px-3 py-2 text-right font-semibold text-red-500">{stat.wrongCount}</td>
            <td className="px-3 py-2 text-right">{stat.streak}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
