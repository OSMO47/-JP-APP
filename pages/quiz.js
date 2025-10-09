import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import WordCard from '@/components/WordCard';
import QuizOption from '@/components/QuizOption';
import n5Words from '@/data/vocab_n5.json';
import n4Words from '@/data/vocab_n4.json';
import n3Words from '@/data/vocab_n3.json';

const normalizeWordEntry = (entry, { level, setId, setTitle, setNumber, setComment, index }) => {
  if (!entry || typeof entry !== 'object') return null;

  const word = entry.word || entry.kanji || entry.term || entry.kana || entry.jp || `คำศัพท์ ${index + 1}`;
  const reading = entry.reading || entry.kana || entry.furigana || '';
  const meaning = entry.meaning || entry.thai || entry.translation || entry.definition || '';
  const english = entry.english || entry.en || entry.meaning_en || '';
  const romaji = entry.romaji || entry.romanji || '';
  const pos = entry.pos || entry.partOfSpeech || '';
  const example = entry.example && typeof entry.example === 'object' ? entry.example : null;

  return {
    id: entry.id || `${setId || level}-word-${index}`,
    word,
    reading,
    romaji,
    meaning,
    english,
    pos,
    example,
    level,
    setId: setId || null,
    setTitle: setTitle || null,
    setNumber: typeof setNumber === 'number' ? setNumber : null,
    setComment: setComment || ''
  };
};

const parseLevelData = (rawEntries, level) => {
  const words = [];
  const sets = [];
  const setMeta = {};

  if (!rawEntries) {
    return { words, sets, setMeta };
  }

  const arrayEntries = Array.isArray(rawEntries)
    ? rawEntries
    : Array.isArray(rawEntries.sets)
    ? rawEntries.sets
    : [];

  const looksLikeSetCollection = arrayEntries.every(
    (item) => item && typeof item === 'object' && Array.isArray(item.words)
  );

  if (looksLikeSetCollection) {
    arrayEntries.forEach((setItem, setIndex) => {
      const setId = `${level}-set-${setItem.set ?? setIndex + 1}`;
      const title = (setItem.title && setItem.title.trim()) || `หมวดที่ ${setItem.set ?? setIndex + 1}`;
      const comment = (setItem._comment && setItem._comment.trim()) || '';
      const setNumber = typeof setItem.set === 'number' ? setItem.set : setIndex + 1;

      const normalized = (Array.isArray(setItem.words) ? setItem.words : [])
        .map((entry, wordIndex) =>
          normalizeWordEntry(entry, {
            level,
            setId,
            setTitle: title,
            setNumber,
            setComment: comment,
            index: wordIndex
          })
        )
        .filter(Boolean);

      if (normalized.length > 0) {
        sets.push({
          id: setId,
          title,
          comment,
          number: setNumber,
          count: normalized.length
        });
        setMeta[setId] = {
          id: setId,
          title,
          comment,
          number: setNumber,
          count: normalized.length
        };
        words.push(...normalized);
      }
    });
  } else if (Array.isArray(arrayEntries)) {
    const normalized = arrayEntries
      .map((entry, index) =>
        normalizeWordEntry(entry, {
          level,
          setId: null,
          setTitle: null,
          setNumber: null,
          setComment: '',
          index
        })
      )
      .filter(Boolean);

    words.push(...normalized);
  }

  return { words, sets, setMeta };
};

const vocabByLevel = {
  N5: parseLevelData(n5Words, 'N5'),
  N4: parseLevelData(n4Words, 'N4'),
  N3: parseLevelData(n3Words, 'N3')
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

const formatSetLabel = (set) => {
  if (!set) return '';
  if (set.number && set.title) {
    return `ชุด ${set.number} · ${set.title}`;
  }
  if (set.number) {
    return `ชุด ${set.number}`;
  }
  return set.title;
};

export default function QuizPage() {
  const router = useRouter();
  const queryLevel = useMemo(() => router.query.level, [router.query.level]);
  const querySet = useMemo(() => router.query.set, [router.query.set]);
  const [level, setLevel] = useState('N5');
  const [activeSet, setActiveSet] = useState('all');
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, total: 0 });

  useEffect(() => {
    if (typeof queryLevel === 'string' && vocabByLevel[queryLevel]) {
      setLevel(queryLevel);
    }
  }, [queryLevel]);

  useEffect(() => {
    const levelInfo = vocabByLevel[level];
    const availableSets = levelInfo?.sets ?? [];

    if (typeof querySet === 'string') {
      if (querySet === 'all') {
        setActiveSet('all');
      } else if (availableSets.some((set) => set.id === querySet)) {
        setActiveSet(querySet);
      }
    } else if (availableSets.length === 0) {
      setActiveSet('all');
    }
  }, [level, querySet]);

  useEffect(() => {
    const levelInfo = vocabByLevel[level];
    if (activeSet !== 'all' && levelInfo?.sets?.every((set) => set.id !== activeSet)) {
      setActiveSet('all');
    }
  }, [level, activeSet]);

  const updateRoute = useCallback(
    (nextLevel, nextSet) => {
      const query = { level: nextLevel };
      if (nextSet && nextSet !== 'all') {
        query.set = nextSet;
      }
      router.replace({ pathname: '/quiz', query }, undefined, { shallow: true });
    },
    [router]
  );

  const createQuestion = useCallback(() => {
    const levelInfo = vocabByLevel[level];
    const pool = levelInfo
      ? activeSet === 'all'
        ? levelInfo.words
        : levelInfo.words.filter((item) => item.setId === activeSet)
      : [];

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

    const choices = shuffle([...shuffledDistractors, correctWord]).map((item) => {
      const primary = item.meaning || item.english || '—';
      let secondary = '';
      if (item.meaning && item.english && item.meaning !== item.english) {
        secondary = item.english;
      } else if (item.romaji) {
        secondary = item.romaji;
      } else if (item.reading && item.reading !== item.word) {
        secondary = item.reading;
      }

      return {
        id: item.id,
        primary,
        secondary,
        isCorrect: item.id === correctWord.id
      };
    });

    setQuestion(correctWord);
    setOptions(choices);
    setSelectedIndex(null);
  }, [activeSet, level]);

  useEffect(() => {
    createQuestion();
  }, [createQuestion]);

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
    createQuestion();
  };

  const handleLevelChange = (event) => {
    const value = event.target.value;
    setLevel(value);
    setActiveSet('all');
    setStats({ correct: 0, incorrect: 0, total: 0 });
    updateRoute(value, 'all');
  };

  const handleSetChange = (event) => {
    const value = event.target.value;
    setActiveSet(value);
    setStats({ correct: 0, incorrect: 0, total: 0 });
    updateRoute(level, value);
  };

  const levelInfo = vocabByLevel[level] || { words: [], sets: [], setMeta: {} };
  const selectedSetMeta = activeSet !== 'all' ? levelInfo.setMeta?.[activeSet] : null;

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
            {levelInfo.sets.length > 0 && (
              <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-moss shadow-sm">
                <span>หมวด:</span>
                <select
                  value={activeSet}
                  onChange={handleSetChange}
                  className="bg-transparent text-midnight focus:outline-none"
                >
                  <option value="all">ทั้งหมด ({levelInfo.words.length})</option>
                  {levelInfo.sets.map((set) => (
                    <option key={set.id} value={set.id}>
                      {formatSetLabel(set)} ({set.count})
                    </option>
                  ))}
                </select>
              </label>
            )}
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
              {selectedSetMeta && (
                <div className="mt-4 rounded-xl bg-sky/10 p-4 text-left text-xs text-midnight/80">
                  <p className="font-semibold text-sky">{formatSetLabel(selectedSetMeta)}</p>
                  {selectedSetMeta.comment && (
                    <p className="mt-1 leading-relaxed text-sky/80">{selectedSetMeta.comment}</p>
                  )}
                  <p className="mt-2 text-sky/70">จำนวนคำศัพท์: {selectedSetMeta.count} คำ</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-moss/20 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-midnight">เคล็ดลับ</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-moss">
                <li>ตอบแล้วอย่าลืมอ่านความหมายอีกครั้งเพื่อย้ำความจำ</li>
                <li>สลับหมวดเพื่อฝึกคำศัพท์ให้รอบด้าน</li>
                <li>เพิ่มคำศัพท์ใหม่ในหน้าคลังคำศัพท์ของฉันเพื่อทบทวนเพิ่มเติม</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {question ? (
              <>
                <WordCard
                  word={question.word}
                  reading={question.reading}
                  romaji={question.romaji}
                  meaning={question.meaning}
                  subMeaning={question.english}
                  pos={question.pos}
                  example={selectedIndex !== null ? question.example : null}
                  level={question.level}
                  footer={
                    selectedIndex !== null
                      ? options[selectedIndex]?.isCorrect
                        ? 'ตอบถูกแล้ว!'
                        : 'ลองใหม่อีกครั้งได้เลย'
                      : 'เลือกคำตอบด้านขวา'
                  }
                  topic={
                    question.setTitle
                      ? question.setNumber
                        ? `ชุดที่ ${question.setNumber}${question.setTitle ? ` · ${question.setTitle}` : ''}`
                        : question.setTitle
                      : null
                  }
                  topicNote={question.setComment}
                />
                <div className="grid gap-3 md:grid-cols-2">
                  {options.map((option, index) => (
                    <QuizOption
                      key={option.id}
                      primary={option.primary}
                      secondary={option.secondary}
                      selected={selectedIndex === index}
                      correct={option.isCorrect}
                      showCorrect={selectedIndex !== null}
                      disabled={selectedIndex !== null}
                      onClick={() => handleSelect(index)}
                    />
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="mt-2 rounded-full bg-sky px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky/90"
                  >
                    คำถัดไป
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-moss/40 bg-white p-6 text-center text-moss">
                <p className="text-lg font-semibold text-midnight">ยังไม่มีคำศัพท์ในหมวดนี้</p>
                <p className="mt-2 text-sm">
                  ลองเลือกหมวดอื่นหรือเพิ่มคำศัพท์ใหม่ในหน้า "คำศัพท์ของฉัน" เพื่อเริ่มฝึกทบทวน
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
