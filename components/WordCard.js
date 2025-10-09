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

  const primaryLine = showWordDetails ? word || reading || meaning || '—' : '???';
  const readingLine = showWordDetails && reading && reading !== word ? reading : null;
  const romajiLine = showWordDetails && romaji ? romaji : null;

  return (
    <div className="w-full rounded-[28px] border border-midnight/10 bg-white/80 p-6 shadow-paper">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-moss/70">
        {level ? <span>{level}</span> : <span>&nbsp;</span>}
        {footer && <span className="tracking-normal text-[11px] text-moss/80">{footer}</span>}
      </div>

      <div className="mt-6 space-y-3 text-center">
        <p className="text-3xl font-display text-midnight">{primaryLine}</p>
        {readingLine && <p className="text-xl text-midnight/80">{readingLine}</p>}
        {(romajiLine || showMeaningFirst) && (
          <p className="text-xs uppercase tracking-[0.5em] text-moss/70">
            {romajiLine || '‧ ‧ ‧'}
          </p>
        )}
        {pos && showWordDetails && (
          <span className="inline-flex items-center justify-center rounded-full border border-midnight/15 bg-parchment/70 px-3 py-1 text-[11px] font-semibold text-midnight/80">
            {pos}
          </span>
        )}
      </div>

      {meaning && (
        <div className="mt-6 rounded-2xl border border-parchment/60 bg-sakura/60 p-5 text-base leading-relaxed text-midnight/80">
          <p className="font-semibold text-midnight/90">{meaning}</p>
          {subMeaning && <p className="mt-1 text-sm text-moss/80">{subMeaning}</p>}
        </div>
      )}

      {topic && (
        <div className="mt-4 space-y-1 rounded-2xl border border-gold/30 bg-parchment/70 p-4 text-xs leading-relaxed text-midnight/70">
          <p className="font-semibold text-midnight/80">หมวดคำศัพท์: {topic}</p>
          {topicNote && <p>{topicNote}</p>}
        </div>
      )}
      {example && (example.ja || example.kana || example.thai) && (
        <div className="mt-4 space-y-1 rounded-2xl border border-moss/20 bg-white/80 p-4 text-sm text-midnight/85">
          {example.ja && <p className="font-medium text-midnight">{example.ja}</p>}
          {example.kana && <p className="text-moss">{example.kana}</p>}
          {example.thai && <p className="text-midnight/70">{example.thai}</p>}
        </div>
      )}
    </div>
  );
}
