'use client';

import { useState } from 'react';
import { useVocab } from '@/components/providers/VocabProvider';
import { VocabForm } from '@/components/VocabForm';
import type { VocabItem } from '@/types/vocab';

export default function MyVocabPage() {
  const { customVocabulary, addCustomVocab, removeCustomVocab } = useVocab();
  const [saving, setSaving] = useState(false);

  const handleAdd = async (item: Omit<VocabItem, 'id'>) => {
    setSaving(true);
    try {
      await addCustomVocab(item);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white/70 p-6 shadow">
        <h1 className="text-2xl font-bold">คลังคำศัพท์ของฉัน</h1>
        <p className="text-sm text-moss">เพิ่ม ลบ หรือแก้ไขคำศัพท์ที่ต้องการได้เลย</p>
        <VocabForm onSubmit={handleAdd} submitLabel={saving ? 'กำลังบันทึก...' : 'เพิ่มคำศัพท์'} />
      </section>
      <section className="rounded-2xl bg-white/70 p-6 shadow">
        <h2 className="text-xl font-semibold">คำศัพท์ที่เพิ่มเอง</h2>
        {customVocabulary.length === 0 ? (
          <p className="text-sm text-moss">ยังไม่มีคำศัพท์ที่เพิ่มเอง</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {customVocabulary.map((item) => (
              <li key={item.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-lg font-semibold">{item.kanji || item.kana}</div>
                  <div className="text-sm text-moss">{item.kana}</div>
                  <div className="text-sm text-moss">{item.meaning_th}</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomVocab(item.id)}
                  className="self-start rounded-xl border border-red-400 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  ลบคำนี้
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
