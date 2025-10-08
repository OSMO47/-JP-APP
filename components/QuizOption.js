const baseStyles =
  'w-full rounded-xl border border-moss/20 bg-white px-5 py-3 text-left text-base font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-sky disabled:cursor-not-allowed disabled:opacity-75';

export default function QuizOption({ label, selected, correct, disabled, onClick }) {
  const stateClass = selected
    ? correct
      ? ' border-sky bg-sky/10 text-midnight'
      : ' border-red-400 bg-red-100 text-red-600'
    : disabled
    ? ''
    : ' hover:border-sky hover:bg-sky/5';

  return (
    <button type="button" disabled={disabled} onClick={onClick} className={baseStyles + stateClass}>
      {label}
    </button>
  );
}
