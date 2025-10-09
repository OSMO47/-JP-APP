'use client';

import { useState } from 'react';
import type { JLPTLevel, VocabItem } from '@/types/vocab';

interface VocabFormProps {
  initial?: Partial<VocabItem>;
  onSubmit: (item: Omit<VocabItem, 'id'>) => Promise<void> | void;
  submitLabel?: string;
}

const levels: JLPTLevel[] = ['N5', 'N4', 'N3'];

export function VocabForm({ initial, onSubmit, submitLabel = 'บันทึกคำศัพท์' }: VocabFormProps) {
  const [kanji, setKanji] = useState(initial?.kanji ?? '');
  const [kana, setKana] = useState(initial?.kana ?? '');
  const [meaning, setMeaning] = useState(initial?.meaning_th ?? '');
  const [level, setLevel] = useState<JLPTLevel>((initial?.level as JLPTLevel) ?? 'N5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(undefined);
    if (!kana || !meaning) {
      setError('กรุณาระบุคำอ่านและความหมาย');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        kanji,
        kana,
        meaning_th: meaning,
        level,
        meaning_en: initial?.meaning_en
      });
      setKanji('');
      setKana('');
      setMeaning('');
      setLevel('N5');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span>คำศัพท์ (คันจิ)</span>
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={kanji}
            onChange={(event) => setKanji(event.target.value)}
            placeholder="学校"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>คำอ่าน (คานะ)*</span>
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={kana}
            onChange={(event) => setKana(event.target.value)}
            placeholder="がっこう"
            required
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span>ความหมายภาษาไทย*</span>
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          value={meaning}
          onChange={(event) => setMeaning(event.target.value)}
          placeholder="โรงเรียน"
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span>ระดับ JLPT</span>
        <select
          className="rounded-lg border border-slate-300 px-3 py-2"
          value={level}
          onChange={(event) => setLevel(event.target.value as JLPTLevel)}
        >
          {levels.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-sky px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? 'กำลังบันทึก...' : submitLabel}
      </button>
    </form>
  );
}
