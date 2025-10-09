'use client';

import { useState } from 'react';
import { QuizCard } from '@/components/QuizCard';
import { useVocab } from '@/components/providers/VocabProvider';
import type { JLPTLevel } from '@/types/vocab';

const levelOptions: JLPTLevel[] = ['N5', 'N4', 'N3'];

export default function QuizPage() {
  const { activeLevels } = useVocab();
  const [levels, setLevels] = useState<JLPTLevel[]>(activeLevels);

  const toggleLevel = (level: JLPTLevel) => {
    setLevels((prev) => {
      if (prev.includes(level)) {
        return prev.filter((item) => item !== level);
      }
      return [...prev, level];
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white/70 p-6 shadow">
        <h1 className="text-2xl font-bold">โหมด Quiz</h1>
        <p className="text-sm text-moss">เลือกระดับ JLPT ที่ต้องการฝึกจากด้านล่าง</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {levelOptions.map((level) => {
            const active = levels.includes(level);
            return (
              <button
                key={level}
                type="button"
                onClick={() => toggleLevel(level)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active ? 'bg-sky text-white' : 'border border-moss text-moss hover:border-sky hover:text-sky'
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>
      <QuizCard levels={levels} />
    </div>
  );
}
