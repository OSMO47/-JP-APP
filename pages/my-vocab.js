import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import WordCard from '@/components/WordCard';

const storageKey = 'jlpt-my-vocabulary';
const levelOptions = [
  { value: 'N5', label: 'JLPT N5' },
  { value: 'N4', label: 'JLPT N4' },
  { value: 'N3', label: 'JLPT N3' }
];

const defaultForm = {
  word: '',
  reading: '',
  meaning: '',
  level: 'N5'
};

export default function MyVocabularyPage() {
  const [form, setForm] = useState(defaultForm);
  const [vocabulary, setVocabulary] = useState([]);
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setVocabulary(parsed);
        }
      } catch (err) {
        console.error('Failed to parse local vocabulary', err);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(storageKey, JSON.stringify(vocabulary));
  }, [vocabulary]);

  const filteredVocabulary = useMemo(() => {
    if (filterLevel === 'ALL') return vocabulary;
    return vocabulary.filter((item) => item.level === filterLevel);
  }, [filterLevel, vocabulary]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    if (!form.word.trim() || !form.meaning.trim()) {
      setError('กรุณากรอกคำศัพท์ภาษาญี่ปุ่นและคำแปลภาษาไทย');
      return;
    }

    const generatedId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString();

    setVocabulary((prev) => [{ ...form, id: generatedId }, ...prev]);
    setForm(defaultForm);
  };

  const handleDelete = (id) => {
    setVocabulary((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-sakura">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-midnight">คลังคำศัพท์ของฉัน</h1>
            <p className="text-moss">เก็บคำศัพท์ที่อยากท่องจำ พร้อมแบ่งระดับ JLPT ได้ตามต้องการ</p>
          </div>
          <Link
            href="/"
            className="self-start rounded-full border border-sky px-4 py-2 text-sm font-medium text-sky transition hover:bg-sky/10"
          >
            ← กลับหน้าหลัก
          </Link>
        </header>

        <section className="grid gap-6 md:grid-cols-[1.3fr,1fr]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-moss/20 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-midnight">เพิ่มคำศัพท์ใหม่</h2>
            <div>
              <label className="block text-sm font-medium text-moss">คำศัพท์ภาษาญี่ปุ่น (漢字/かな)</label>
              <input
                type="text"
                name="word"
                value={form.word}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-moss/30 bg-white px-4 py-2 text-midnight focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/40"
                placeholder="เช่น 勉強 หรือ べんきょう"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-moss">การอ่าน (よみかた)</label>
              <input
                type="text"
                name="reading"
                value={form.reading}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-moss/30 bg-white px-4 py-2 text-midnight focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/40"
                placeholder="เช่น べんきょう"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-moss">คำแปลภาษาไทย</label>
              <input
                type="text"
                name="meaning"
                value={form.meaning}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-moss/30 bg-white px-4 py-2 text-midnight focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/40"
                placeholder="เช่น การเรียน"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-moss">ระดับ JLPT</label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-moss/30 bg-white px-4 py-2 text-midnight focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/40"
              >
                {levelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="mt-2 rounded-2xl bg-sky px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky/80"
            >
              บันทึกคำศัพท์
            </button>
          </form>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-midnight">คำศัพท์ทั้งหมด</h2>
              <select
                value={filterLevel}
                onChange={(event) => setFilterLevel(event.target.value)}
                className="rounded-full border border-moss/30 bg-white px-4 py-2 text-sm text-midnight focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/40"
              >
                <option value="ALL">ทุกระดับ</option>
                {levelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {filteredVocabulary.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-moss/30 bg-white/70 p-8 text-center text-moss">
                ยังไม่มีคำศัพท์บันทึกไว้ ลองเพิ่มคำศัพท์คำแรกได้เลย!
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredVocabulary.map((item) => (
                  <div key={item.id} className="relative">
                    <WordCard
                      word={item.word}
                      reading={item.reading}
                      meaning={item.meaning}
                      level={item.level}
                      footer="บันทึกโดยฉัน"
                    />
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="absolute right-4 top-4 rounded-full border border-red-300 bg-white px-3 py-1 text-xs font-semibold text-red-500 shadow-sm transition hover:bg-red-50"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
