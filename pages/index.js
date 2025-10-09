import Link from 'next/link';
import { useRouter } from 'next/router';
import n5Words from '@/data/vocab_n5.json';

const n5SetSummary = Array.isArray(n5Words)
  ? (() => {
      const sets = n5Words
        .filter((set) => set && Array.isArray(set.words) && set.words.length > 0)
        .map((set, index) => ({
          title:
            set.title && set.title.trim()
              ? set.title
              : `หมวดที่ ${typeof set.set === 'number' ? set.set : index + 1}`,
          count: set.words.length
        }));
      const wordCount = sets.reduce((total, current) => total + current.count, 0);
      return {
        sets,
        wordCount,
        setCount: sets.length
      };
    })()
  : { sets: [], wordCount: 0, setCount: 0 };

const levels = [
  {
    label: 'JLPT N5',
    value: 'N5',
    description: 'พื้นฐานสำหรับผู้เริ่มต้น',
    summary: n5SetSummary
  },
  { label: 'JLPT N4', value: 'N4', description: 'เสริมคำศัพท์ระดับกลางต้น' },
  { label: 'JLPT N3', value: 'N3', description: 'เตรียมพร้อมสำหรับระดับกลาง' }
];

export default function HomePage() {
  const router = useRouter();

  const handleStart = (level) => {
    router.push({ pathname: '/quiz', query: { level } });
  };

  return (
    <div className="min-h-screen bg-sakura">
      <header className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-16 text-center md:py-24">
        <h1 className="text-4xl font-bold text-midnight md:text-5xl">JLPT Vocabulary Trainer</h1>
        <p className="text-lg text-moss md:text-xl">
          ฝึกคำศัพท์ภาษาญี่ปุ่นพร้อมคำแปลภาษาไทย เลือกระดับที่ต้องการแล้วเริ่มแบบทดสอบได้ทันที
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-moss">
          <Link href="/my-vocab" className="rounded-full bg-white px-5 py-2 font-medium shadow-sm hover:bg-sky/10">
            จัดการคำศัพท์ของฉัน
          </Link>
          <a
            href="#levels"
            className="rounded-full border border-sky px-5 py-2 font-medium text-sky transition hover:bg-sky/10"
          >
            เลือกระดับ JLPT
          </a>
        </div>
      </header>

      <main id="levels" className="mx-auto grid max-w-5xl gap-6 px-6 pb-16 md:grid-cols-3">
        {levels.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => handleStart(level.value)}
            className="flex flex-col gap-3 rounded-2xl border border-moss/20 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="text-sm uppercase tracking-[0.2em] text-sky">{level.value}</span>
            <span className="text-2xl font-semibold text-midnight">{level.label}</span>
            <span className="text-base text-moss">{level.description}</span>
            {level.summary && level.summary.setCount > 0 && (
              <div className="mt-3 rounded-xl bg-sakura/50 p-4 text-sm text-moss">
                <p className="font-semibold text-midnight/80">
                  คำศัพท์ {level.summary.wordCount} คำ · {level.summary.setCount} หมวด
                </p>
                <ul className="mt-2 space-y-1">
                  {level.summary.sets.slice(0, 3).map((set) => (
                    <li key={set.title} className="flex items-center justify-between text-moss/80">
                      <span>{set.title}</span>
                      <span>{set.count} คำ</span>
                    </li>
                  ))}
                </ul>
                {level.summary.setCount > 3 && (
                  <p className="mt-2 text-xs text-moss/70">
                    …และหมวดเพิ่มเติมอีก {level.summary.setCount - 3} หมวดให้เลือกในโหมดแบบทดสอบ
                  </p>
                )}
              </div>
            )}
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky">
              เริ่มแบบทดสอบ
              <span aria-hidden>→</span>
            </span>
          </button>
        ))}
      </main>

      <footer className="bg-white/60 py-6 text-center text-sm text-moss">
        © {new Date().getFullYear()} Nihongo Practice | สนับสนุนการเรียนรู้ด้วยใจ
      </footer>
    </div>
  );
}
