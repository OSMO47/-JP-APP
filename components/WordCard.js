export default function WordCard({ word, reading, meaning, level, footer }) {
  return (
    <div className="w-full rounded-2xl border border-moss/20 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-moss/70">{level}</span>
        {footer && <span className="text-xs text-moss/70">{footer}</span>}
      </div>
      <div className="mt-3 text-3xl font-semibold text-midnight">{word}</div>
      {reading && <div className="mt-1 text-lg text-moss">{reading}</div>}
      <div className="mt-4 text-base text-midnight/80">{meaning}</div>
    </div>
  );
}
