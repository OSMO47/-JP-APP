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
    <div className="min-h-screen px-4 py-12 md:py-16">
      <header className="mx-auto flex max-w-5xl flex-col gap-5 rounded-[36px] border border-midnight/10 bg-white/80 px-8 py-16 text-center shadow-paper">
        <h1 className="text-4xl font-display tracking-[0.18em] text-midnight md:text-5xl">JLPT Vocabulary Trainer</h1>
        <p className="text-lg leading-relaxed text-midnight/75 md:text-xl">
          ฝึกคำศัพท์ภาษาญี่ปุ่นพร้อมบรรยากาศห้องเรียนญี่ปุ่นโบราณ เลือกระดับที่ต้องการแล้วเริ่มแบบทดสอบได้ทันที
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-midnight/80">
          <Link
            href="/my-vocab"
            className="rounded-full border border-midnight/15 bg-parchment/80 px-6 py-2 font-semibold text-midnight transition hover:bg-white"
          >
            จัดการคำศัพท์ของฉัน
          </Link>
          <a
            href="#levels"
            className="rounded-full border border-sky/70 px-6 py-2 font-semibold text-sky transition hover:bg-sky/10"
          >
            เลือกระดับ JLPT
          </a>
        </div>
      </header>

      <main
        id="levels"
        className="mx-auto mt-10 grid max-w-5xl gap-6 px-2 pb-16 md:grid-cols-3 md:gap-8 md:px-0"
      >
        {levels.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => handleStart(level.value)}
            className="flex flex-col gap-3 rounded-[28px] border border-midnight/10 bg-parchment/80 p-6 text-left shadow-paper transition duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-lg"
          >
            <span className="text-xs uppercase tracking-[0.35em] text-moss/70">{level.value}</span>
            <span className="text-2xl font-display text-midnight">{level.label}</span>
            <span className="text-base leading-relaxed text-midnight/75">{level.description}</span>
            {level.summary && level.summary.setCount > 0 && (
              <div className="mt-4 rounded-2xl border border-gold/30 bg-white/75 p-4 text-sm text-midnight/75">
                <p className="font-semibold text-midnight">
                  คำศัพท์ {level.summary.wordCount} คำ · {level.summary.setCount} หมวด
                </p>
                <ul className="mt-2 space-y-1">
                  {level.summary.sets.slice(0, 3).map((set) => (
                    <li key={set.title} className="flex items-center justify-between text-midnight/70">
                      <span>{set.title}</span>
                      <span>{set.count} คำ</span>
                    </li>
                  ))}
                </ul>
                {level.summary.setCount > 3 && (
                  <p className="mt-3 text-xs text-midnight/60">
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

      <footer className="mx-auto mt-8 max-w-5xl rounded-full border border-midnight/10 bg-white/70 py-5 text-center text-sm text-midnight/70">
        © {new Date().getFullYear()} Nihongo Practice | สนับสนุนการเรียนรู้ด้วยใจ
      </footer>
    </div>
  );
}
