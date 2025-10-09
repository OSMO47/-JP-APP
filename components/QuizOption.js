const baseStyles =
  'w-full rounded-xl border border-moss/20 bg-white px-5 py-3 text-left text-base font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-sky disabled:cursor-not-allowed disabled:opacity-75';

export default function QuizOption({ primary, secondary, selected, correct, showCorrect, disabled, onClick }) {
  const stateClass = selected
    ? correct
      ? ' border-sky bg-sky/10 text-midnight'
      : ' border-red-400 bg-red-100 text-red-600'
    : showCorrect && correct
    ? ' border-sky/80 bg-sky/10 text-midnight'
    : disabled
    ? ''
    : ' hover:border-sky hover:bg-sky/5';

  return (
    <button type="button" disabled={disabled} onClick={onClick} className={baseStyles + stateClass}>
      <span className="block text-base font-semibold">{primary}</span>
      {secondary && <span className="mt-1 block text-sm text-moss/90">{secondary}</span>}
    </button>
  );
}
