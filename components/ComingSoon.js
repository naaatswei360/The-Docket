export default function ComingSoon({ label, className = '' }) {
  return (
    <button
      type="button"
      disabled
      title="Coming soon"
      className={`cursor-not-allowed rounded-lg border border-gray-600 bg-gray-800/60 px-5 py-3 text-gray-400 opacity-60 ${className}`}
    >
      {label} <span className="ml-1 text-xs">(Coming soon)</span>
    </button>
  );
}
