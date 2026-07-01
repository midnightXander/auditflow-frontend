//logo component
import { Search } from "lucide-react";
import Link from "next/link";

const VARIANTS = {
  default : "text-white",
  dark : "text-gray-900"
}

export default function Logo({variant = 'default'}: {variant?: 'default' | 'dark'}) {
  const PRIMARY = '#00A4C6'
  const ACCENT  = '#0DD3B6'
  return (
    <Link href="/" className="text-center">
    <div className="flex items-center gap-2">
        {/* <div className="w-10 h-10 bg-[#00a4c6] rounded-lg flex items-center justify-center">
          <Search className="w-6 h-6 text-white" />
        </div> */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="6" fill={PRIMARY} />
        <path d="M6 20 L11 12 L16 16 L21 8" stroke="white" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="21" cy="8" r="2.5" fill={ACCENT} />
      </svg>
        <span className={`text-xl font-bold ${VARIANTS[variant]}`}>
          OUTAUDITS
        </span>
    </div>
    </Link>
  );
}
