const baseStyles =
  'w-full rounded-xl border border-midnight/10 bg-parchment/80 px-5 py-3 text-left text-base font-medium tracking-wide transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1 focus:ring-offset-parchment disabled:cursor-not-allowed disabled:opacity-80';

export default function QuizOption({ primary, secondary, selected, correct, showCorrect, disabled, onClick }) {
  const stateClass = selected
    ? correct
      ? ' border-sky bg-sky/15 text-midnight'
      : ' border-rose-400 bg-rose-100 text-rose-700'
    : showCorrect && correct
    ? ' border-sky/70 bg-sky/10 text-midnight'
    : disabled
    ? ''
    : ' hover:border-gold hover:bg-white/80';

  return (
    <button type="button" disabled={disabled} onClick={onClick} className={baseStyles + stateClass}>
      <span className="block text-base font-semibold text-midnight">{primary}</span>
      {secondary && <span className="mt-1 block text-sm text-moss/80">{secondary}</span>}
    </button>
  );
}
