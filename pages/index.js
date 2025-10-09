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
      <header className="mx-auto flex max-w-5xl flex-col gap-5 rounded-[36px] border border-xpBlue/40 bg-xpPanel/95 px-8 py-16 text-center shadow-window">
        <h1 className="text-4xl font-display text-xpText md:text-5xl">JLPT Vocabulary Trainer</h1>
        <p className="text-lg leading-relaxed text-xpText/80 md:text-xl">
          ฝึกตอบคันจิจากคำแปลภาษาไทยในสไตล์ Windows XP แสนคุ้นตา เลือกระดับที่ต้องการแล้วเริ่มแบบทดสอบได้ทันที
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-xpText/80">
          <Link
            href="/my-vocab"
            className="rounded-full border border-xpBlue/40 bg-white/90 px-6 py-2 font-semibold text-xpBlue shadow-sm transition hover:bg-xpCream/90"
          >
            จัดการคำศัพท์ของฉัน
          </Link>
          <a
            href="#levels"
            className="rounded-full border border-xpBlue/60 bg-gradient-to-r from-xpBlue to-xpBlueLight px-6 py-2 font-semibold text-white shadow-sm transition hover:from-xpBlue/90 hover:to-xpBlueLight/90"
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
            className="flex flex-col gap-3 rounded-[28px] border border-xpBlue/40 bg-xpPanel/95 p-6 text-left shadow-window transition duration-200 hover:-translate-y-1 hover:border-xpBlue hover:shadow-lg"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-xpText/60">{level.value}</span>
            <span className="text-2xl font-display text-xpText">{level.label}</span>
            <span className="text-base leading-relaxed text-xpText/75">{level.description}</span>
            {level.summary && level.summary.setCount > 0 && (
              <div className="mt-4 rounded-2xl border border-xpGray/70 bg-white/90 p-4 text-sm text-xpText/75 shadow-sm">
                <p className="font-semibold text-xpText">
                  คำศัพท์ {level.summary.wordCount} คำ · {level.summary.setCount} หมวด
                </p>
                <ul className="mt-2 space-y-1">
                  {level.summary.sets.slice(0, 3).map((set) => (
                    <li key={set.title} className="flex items-center justify-between text-xpText/70">
                      <span>{set.title}</span>
                      <span>{set.count} คำ</span>
                    </li>
                  ))}
                </ul>
                {level.summary.setCount > 3 && (
                  <p className="mt-3 text-xs text-xpText/60">
                    …และหมวดเพิ่มเติมอีก {level.summary.setCount - 3} หมวดให้เลือกในโหมดแบบทดสอบ
                  </p>
                )}
              </div>
            )}
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-xpBlue">
              เริ่มแบบทดสอบ
              <span aria-hidden>→</span>
            </span>
          </button>
        ))}
      </main>

      <footer className="mx-auto mt-8 max-w-5xl rounded-full border border-xpBlue/40 bg-white/85 py-5 text-center text-sm text-xpText/70 shadow-sm">
        © {new Date().getFullYear()} Nihongo Practice | บรรยากาศเก่ายุค XP แต่ความรู้ใหม่เสมอ
      </footer>
    </div>
  );
}
