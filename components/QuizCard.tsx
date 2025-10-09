'use client';

import { useCallback, useEffect, useState } from 'react';
import { useVocab } from '@/components/providers/VocabProvider';
import type { JLPTLevel, QuizQuestion } from '@/types/vocab';

interface QuizCardProps {
  levels?: JLPTLevel[];
}

type QuizState = 'idle' | 'answered';

export function QuizCard({ levels }: QuizCardProps) {
  const { startQuiz, recordAnswer } = useVocab();
  const [question, setQuestion] = useState<QuizQuestion | undefined>();
  const [state, setState] = useState<QuizState>('idle');
  const [selected, setSelected] = useState<string | undefined>();
  const [correct, setCorrect] = useState<boolean | undefined>();

  const loadQuestion = useCallback(() => {
    const next = startQuiz(levels);
    setQuestion(next);
    setState('idle');
    setSelected(undefined);
    setCorrect(undefined);
  }, [levels, startQuiz]);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  if (!question) {
    return <div className="rounded-xl bg-white p-6 shadow">กำลังโหลดคำถาม...</div>;
  }

  const handleAnswer = async (optionId: string, isCorrect: boolean) => {
    if (state === 'answered') return;
    setSelected(optionId);
    setCorrect(isCorrect);
    setState('answered');
    await recordAnswer(question.wordId, isCorrect);
  };

  return (
    <div className="space-y-6 rounded-2xl bg-white/70 p-6 shadow">
      <div>
        <div className="text-sm uppercase text-moss">ระดับ {question.level}</div>
        <div className="text-4xl font-bold text-midnight">{question.prompt}</div>
        <div className="text-lg text-moss">{question.reading}</div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => {
          const isActive = selected === option.id;
          const isAnswer = state === 'answered' && option.isCorrect;
          const statusClass =
            state === 'answered'
              ? option.isCorrect
                ? 'border-green-500 bg-green-100 text-green-900'
                : isActive
                ? 'border-red-500 bg-red-100 text-red-900'
                : 'border-slate-200 bg-white'
              : 'border-slate-200 bg-white hover:border-sky hover:bg-sky/10';
          return (
            <button
              key={option.id}
              className={`rounded-xl border px-4 py-3 text-left transition ${statusClass}`}
              onClick={() => handleAnswer(option.id, option.isCorrect)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {state === 'answered' && (
        <div className={`rounded-xl border px-4 py-3 ${correct ? 'border-green-400 bg-green-50 text-green-800' : 'border-red-400 bg-red-50 text-red-800'}`}>
          {correct ? 'ตอบถูกต้อง! เก่งมาก' : 'ตอบผิด ลองทบทวนอีกครั้งนะ'}
        </div>
      )}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => loadQuestion()}
          className="rounded-xl border border-moss px-4 py-2 text-sm font-semibold hover:border-sky hover:text-sky"
        >
          ข้าม
        </button>
        {state === 'answered' && (
          <button
            type="button"
            onClick={() => loadQuestion()}
            className="rounded-xl bg-sky px-4 py-2 text-sm font-semibold text-white"
          >
            คำถามถัดไป
          </button>
        )}
      </div>
    </div>
  );
}
