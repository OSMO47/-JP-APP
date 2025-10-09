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
    <div className="w-full overflow-hidden rounded-3xl border border-xpBlue/40 bg-xpPanel shadow-window">
      <div className="flex items-center justify-between bg-gradient-to-r from-xpBlue to-xpBlueLight px-6 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white">
        <span>{level ? `JLPT ${level}` : 'Vocabulary'}</span>
        {footer && <span className="text-[11px] font-normal tracking-normal text-white/90">{footer}</span>}
      </div>

      <div className="space-y-6 px-6 py-6">
        <div className="space-y-2 text-center">
          <p className="text-4xl font-display text-xpBlue">{primaryLine}</p>
          {readingLine && <p className="text-lg font-semibold text-xpText/80">{readingLine}</p>}
          <p className="text-xs uppercase tracking-[0.4em] text-xpText/60">
            {romajiLine ? romajiLine : showWordDetails ? ' ' : '‧ ‧ ‧'}
          </p>
          {pos && showWordDetails && (
            <span className="inline-flex items-center justify-center rounded-full border border-xpGray/60 bg-white/80 px-3 py-1 text-[11px] font-semibold text-xpText/80">
              {pos}
            </span>
          )}
        </div>

        {meaning && (
          <div className="rounded-2xl border border-white/70 bg-white/90 p-5 text-left leading-relaxed text-xpText">
            <p className="text-xs font-semibold uppercase tracking-wide text-xpText/50">คำแปลภาษาไทย</p>
            <p className="mt-1 text-lg font-semibold text-xpText">{meaning}</p>
            {subMeaning && <p className="mt-1 text-sm text-xpBlue">{subMeaning}</p>}
          </div>
        )}

        {topic && (
          <div className="rounded-2xl border border-xpGray/70 bg-xpCream/80 p-4 text-xs leading-relaxed text-xpText/80">
            <p className="font-semibold text-xpText">หมวดคำศัพท์: {topic}</p>
            {topicNote && <p className="mt-1">{topicNote}</p>}
          </div>
        )}

        {example && (example.ja || example.kana || example.thai) && (
          <div className="space-y-1 rounded-2xl border border-xpGray/50 bg-white/85 p-4 text-sm text-xpText">
            {example.ja && <p className="font-semibold text-xpText">{example.ja}</p>}
            {example.kana && <p className="text-xpBlue">{example.kana}</p>}
            {example.thai && <p className="text-xpText/70">{example.thai}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
