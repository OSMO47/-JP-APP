export default function WordCard({
  word,
  reading,
  romaji,
  meaning,
  subMeaning,
  pos,
  example,
  level,
  footer,
  topic,
  topicNote,
  emphasis = 'word',
  answerRevealed = true
}) {
  const showMeaningFirst = emphasis === 'meaning' && meaning;
  const showWordDetails = !showMeaningFirst || answerRevealed;

  return (
    <div className="w-full rounded-2xl border border-moss/20 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        {level ? (
          <span className="text-xs uppercase tracking-widest text-moss/70">{level}</span>
        ) : (
          <span className="text-xs text-moss/70">&nbsp;</span>
        )}
        {footer && <span className="text-xs text-moss/70">{footer}</span>}
      </div>

      {showMeaningFirst ? (
        <>
          <div className="mt-3 text-3xl font-semibold text-midnight">
            {meaning || word || '—'}
          </div>
          {subMeaning && <div className="mt-1 text-sm text-moss/90">{subMeaning}</div>}
          {showWordDetails && (
            <div className="mt-4 space-y-2 rounded-xl bg-sky/5 p-4 text-midnight">
              {word && <p className="text-xl font-semibold text-midnight">{word}</p>}
              {reading && reading !== word && <p className="text-lg text-moss">{reading}</p>}
              {romaji && (
                <p className="text-xs uppercase tracking-[0.3em] text-moss/70">{romaji}</p>
              )}
              {pos && (
                <span className="inline-flex w-fit rounded-full bg-sky/10 px-3 py-1 text-xs font-semibold text-sky">
                  {pos}
                </span>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mt-3 text-3xl font-semibold text-midnight">{word || meaning || '—'}</div>
          {reading && reading !== word && <div className="mt-1 text-lg text-moss">{reading}</div>}
          {romaji && <div className="text-sm uppercase tracking-[0.3em] text-moss/70">{romaji}</div>}
          {pos && (
            <div className="mt-3 inline-flex rounded-full bg-sky/10 px-3 py-1 text-xs font-semibold text-sky">{pos}</div>
          )}
          {meaning && <div className="mt-4 text-base text-midnight/80">{meaning}</div>}
          {subMeaning && <div className="mt-1 text-sm text-moss/90">{subMeaning}</div>}
        </>
      )}

      {topic && (
        <div className="mt-4 space-y-1 rounded-xl bg-moss/5 p-4 text-xs leading-relaxed text-moss/90">
          <p className="font-semibold text-moss">หมวดคำศัพท์: {topic}</p>
          {topicNote && <p className="text-moss/80">{topicNote}</p>}
        </div>
      )}
      {example && (example.ja || example.kana || example.thai) && (
        <div className="mt-4 space-y-1 rounded-xl bg-sakura/40 p-4 text-sm text-midnight/80">
          {example.ja && <p className="font-medium text-midnight">{example.ja}</p>}
          {example.kana && <p className="text-moss">{example.kana}</p>}
          {example.thai && <p className="text-midnight/70">{example.thai}</p>}
        </div>
      )}
    </div>
  );
}
