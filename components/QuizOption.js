const baseStyles =
  'w-full rounded-lg border border-xpBlue/30 bg-white/90 px-5 py-3 text-left text-base font-semibold text-xpText shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-xpYellow focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed';

export default function QuizOption({ primary, selected, correct, showCorrect, disabled, onClick }) {
  const stateClass = selected
    ? correct
      ? ' border-xpGreen bg-xpGreen/15 text-xpNavy'
      : ' border-rose-400 bg-rose-100 text-rose-700'
    : showCorrect && correct
    ? ' border-xpGreen/80 bg-xpGreen/10 text-xpNavy'
    : disabled
    ? ''
    : ' hover:-translate-y-0.5 hover:border-xpBlue hover:bg-xpCream/80';

  return (
    <button type="button" disabled={disabled} onClick={onClick} className={baseStyles + stateClass}>
      <span className="block text-lg font-semibold leading-tight">{primary}</span>
    </button>
  );
}
