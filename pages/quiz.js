import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import WordCard from '@/components/WordCard';
import QuizOption from '@/components/QuizOption';
import n5Words from '@/data/vocab_n5.json';
import n4Words from '@/data/vocab_n4.json';
import n3Words from '@/data/vocab_n3.json';

const normalizeVocabulary = (entries, level) =>
  entries
    .filter(Boolean)
    .map((item, index) => {
      const word = item.word || item.kanji || item.term || item.kana || `คำศัพท์ ${index + 1}`;
      const reading = item.reading || item.kana || '';
      const meaning = item.meaning || item.thai || '';
      const english = item.english || item.en || '';
      const romaji = item.romaji || item.romanji || '';
      const pos = item.pos || item.partOfSpeech || '';
      const example = item.example || null;

      return {
        id: item.id || `${level}-${index}`,
        word,
        reading,
        romaji,
        meaning,
        english,
        pos,
        example,
        level
      };
    });

const vocabByLevel = {
  N5: normalizeVocabulary(n5Words, 'N5'),
  N4: normalizeVocabulary(n4Words, 'N4'),
  N3: normalizeVocabulary(n3Words, 'N3')
};

const shuffle = (list) => {
  const array = [...list];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }
  return array;
};

const levelOptions = [
  { value: 'N5', label: 'JLPT N5' },
  { value: 'N4', label: 'JLPT N4' },
  { value: 'N3', label: 'JLPT N3' }
];

export default function QuizPage() {
  const router = useRouter();
  const queryLevel = useMemo(() => router.query.level, [router.query.level]);
  const [level, setLevel] = useState('N5');
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, total: 0 });

  useEffect(() => {
    if (typeof queryLevel === 'string' && vocabByLevel[queryLevel]) {
      setLevel(queryLevel);
    }
  }, [queryLevel]);

  const createQuestion = useCallback(
    (targetLevel) => {
      const pool = vocabByLevel[targetLevel];
      if (!pool || pool.length === 0) {
        setQuestion(null);
        setOptions([]);
        return;
      }

      const correctWord = pool[Math.floor(Math.random() * pool.length)];
      const distractorPool = pool.filter(
        (item) => item.id !== correctWord.id && item.meaning && item.meaning !== correctWord.meaning
      );
      const shuffledDistractors = shuffle(distractorPool).slice(0, 3);

      while (shuffledDistractors.length < 3 && distractorPool.length > 0) {
        const candidate = distractorPool[Math.floor(Math.random() * distractorPool.length)];
        if (!shuffledDistractors.includes(candidate)) {
          shuffledDistractors.push(candidate);
        } else {
          break;
        }
      }

      if (shuffledDistractors.length < 3) {
        const fallbackPool = shuffle(pool).filter(
          (item) => item.id !== correctWord.id && !shuffledDistractors.includes(item)
        );
        for (const candidate of fallbackPool) {
          if (shuffledDistractors.length >= 3) break;
          shuffledDistractors.push(candidate);
        }
      }

      const choices = shuffle([...shuffledDistractors, correctWord]).map((item) => ({
        id: item.id,
        meaning: item.meaning || item.english || '—',
        english: item.meaning && item.english && item.meaning !== item.english ? item.english : '',
        isCorrect: item.id === correctWord.id
      }));

      setQuestion(correctWord);
      setOptions(choices);
      setSelectedIndex(null);
    },
    []
  );

  useEffect(() => {
    createQuestion(level);
  }, [createQuestion, level]);

  const handleSelect = (index) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    setStats((prev) => ({
      correct: prev.correct + (options[index]?.isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (options[index]?.isCorrect ? 0 : 1),
      total: prev.total + 1
    }));
  };

  const handleNext = () => {
    createQuestion(level);
  };

  const handleLevelChange = (event) => {
    const value = event.target.value;
    setLevel(value);
    setStats({ correct: 0, incorrect: 0, total: 0 });
    router.replace({ pathname: '/quiz', query: { level: value } }, undefined, { shallow: true });
  };

  return (
    <div className="min-h-screen bg-sakura">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-midnight">โหมดสุ่มคำศัพท์</h1>
            <p className="text-moss">เลือกคำตอบที่ตรงกับความหมายของคำศัพท์ญี่ปุ่น</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-moss shadow-sm">
              <span>ระดับ:</span>
              <select
                value={level}
                onChange={handleLevelChange}
                className="bg-transparent text-midnight focus:outline-none"
              >
                {levelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <Link
              href="/"
              className="rounded-full border border-sky px-4 py-2 text-sm font-medium text-sky transition hover:bg-sky/10"
            >
              ← กลับหน้าหลัก
            </Link>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[2fr,3fr]">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-moss/20 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-midnight">สถิติของฉัน</h2>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-moss">ถูกต้อง</p>
                  <p className="text-2xl font-bold text-midnight">{stats.correct}</p>
                </div>
                <div>
                  <p className="text-sm text-moss">ผิด</p>
                  <p className="text-2xl font-bold text-midnight">{stats.incorrect}</p>
                </div>
                <div>
                  <p className="text-sm text-moss">ทั้งหมด</p>
                  <p className="text-2xl font-bold text-midnight">{stats.total}</p>
                </div>
              </div>
              {stats.total > 0 && (
                <p className="mt-4 text-center text-sm text-moss">
                  คะแนนรวม: {Math.round((stats.correct / stats.total) * 100)}%
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full rounded-2xl border border-sky bg-sky/10 px-6 py-3 text-sm font-semibold text-sky transition hover:bg-sky/20"
            >
              สุ่มคำศัพท์ใหม่
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {question ? (
              <>
                <WordCard
                  word={question.word}
                  reading={question.reading}
                  romaji={question.romaji}
                  pos={question.pos}
                  meaning={
                    selectedIndex !== null
                      ? question.meaning
                      : 'เลือกความหมายที่ถูกต้องสำหรับคำศัพท์นี้'
                  }
                  subMeaning={selectedIndex !== null ? question.english : ''}
                  example={selectedIndex !== null ? question.example : undefined}
                  level={`ระดับ ${question.level}`}
                  footer={`คลังคำศัพท์ทั้งหมด ${vocabByLevel[question.level]?.length ?? 0} คำ`}
                />
                <div className="grid gap-3">
                  {options.map((option, index) => (
                    <QuizOption
                      key={option.id}
                      primary={option.meaning}
                      secondary={option.english}
                      selected={selectedIndex === index}
                      correct={option.isCorrect}
                      showCorrect={selectedIndex !== null}
                      disabled={selectedIndex !== null}
                      onClick={() => handleSelect(index)}
                    />
                  ))}
                </div>
                {selectedIndex !== null && (
                  <div className="space-y-2 rounded-xl border border-moss/20 bg-white p-4 text-sm text-midnight/80">
                    <p>
                      {options[selectedIndex]?.isCorrect
                        ? 'เยี่ยมมาก! คุณตอบถูกต้อง 🎉'
                        : 'ยังไม่ถูก ลองสุ่มคำถัดไปได้เลยนะ'}
                    </p>
                    {!options[selectedIndex]?.isCorrect && (
                      <p className="text-moss">
                        คำตอบที่ถูกต้องคือ {question.meaning}
                        {question.english ? ` (${question.english})` : ''}
                      </p>
                    )}
                    {question.example && (question.example.ja || question.example.thai) && (
                      <div className="rounded-lg bg-sakura/40 p-3 text-xs text-midnight/80">
                        {question.example.ja && <p className="font-medium text-midnight">{question.example.ja}</p>}
                        {question.example.kana && <p className="text-moss">{question.example.kana}</p>}
                        {question.example.thai && <p className="text-midnight/70">{question.example.thai}</p>}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-moss/30 bg-white/60 p-10 text-center text-moss">
                ไม่มีคำศัพท์ในระดับนี้ในขณะนี้
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
