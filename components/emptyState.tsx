
export default function EmptyState({ onNew, headline, subText, buttonText, icon }: { onNew(): void, headline: string, subText: string, buttonText: string, icon: any }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded border-2 border-dashed border-gray-200 flex items-center justify-center mb-6">
        {/* <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M4 22 L10 14 L16 18 L22 8" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".4" />
          <circle cx="22" cy="8" r="2.5" fill={ACCENT} opacity=".6" />
        </svg> */}
        {icon}
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1">{headline}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        {subText}
      </p>
      <button
        onClick={onNew}
        className="px-5 py-2 rounded text-sm font-semibold text-white bg-[#00A4C6] hover:bg-[#0093B2] transition-colors"
      >
        + {buttonText}
      </button>
    </div>
  )
}