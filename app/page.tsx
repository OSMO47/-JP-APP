"use client";

import Link from 'next/link';
import { allLevels } from '@/lib/vocab';
import { useVocab } from '@/components/providers/VocabProvider';

export default function HomePage() {
  const { aggregatedStats, reviewList } = useVocab();
  const levels = allLevels();

  return (
    <div className="space-y-8">
      <section className="grid gap-4 rounded-2xl bg-white/70 p-6 shadow-lg ring-1 ring-sakura">
        <h1 className="text-3xl font-bold">JLPT Vocabulary Trainer</h1>
        <p className="text-moss">
          เลือกโหมดที่ต้องการฝึกได้ทันที พร้อมระบบบันทึกคำผิด Leitner SRS และโหมดออฟไลน์.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {levels.map((level) => (
            <div key={level} className="rounded-xl border border-sky/30 bg-sky/10 p-4">
              <div className="text-sm uppercase text-sky">ระดับ</div>
              <div className="text-2xl font-semibold">{level}</div>
            </div>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link className="rounded-xl bg-sky px-4 py-3 text-center font-semibold text-white" href="/quiz">
            เริ่มทำ Quiz
          </Link>
          <Link className="rounded-xl border border-moss px-4 py-3 text-center font-semibold text-midnight" href="/review">
            ทบทวนคำที่พลาด
          </Link>
          <Link className="rounded-xl border border-moss px-4 py-3 text-center font-semibold text-midnight" href="/my-vocab">
            คลังคำศัพท์ของฉัน
          </Link>
        </div>
      </section>
      <section className="grid gap-4 rounded-2xl bg-white/70 p-6 shadow-lg ring-1 ring-sakura">
        <h2 className="text-2xl font-semibold">ภาพรวมสถิติ</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-moss/30 p-4">
            <p className="text-sm text-moss">จำนวนคำที่ตอบ</p>
            <p className="text-3xl font-bold">{aggregatedStats.totalAnswered}</p>
          </div>
          <div className="rounded-xl border border-moss/30 p-4">
            <p className="text-sm text-moss">ความแม่นยำ</p>
            <p className="text-3xl font-bold">{(aggregatedStats.accuracy * 100).toFixed(0)}%</p>
          </div>
          <div className="rounded-xl border border-moss/30 p-4">
            <p className="text-sm text-moss">สถิติ Streak สูงสุด</p>
            <p className="text-3xl font-bold">{aggregatedStats.streak}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">คำที่ต้องทบทวนวันนี้</h3>
          {reviewList.length === 0 ? (
            <p className="text-sm text-moss">เยี่ยมมาก! ยังไม่มีคำที่ต้องทบทวน</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {reviewList.slice(0, 6).map((item) => (
                <li key={item.id} className="rounded-xl border border-sky/20 bg-sky/5 p-3">
                  <div className="text-lg font-semibold">{item.kanji || item.kana}</div>
                  <div className="text-sm text-moss">{item.meaning_th}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
