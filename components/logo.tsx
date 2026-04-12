//logo component
import { Search } from "lucide-react";
import Link from "next/link";
export default function Logo() {
  return (
    <Link href="/" className="text-center">
    <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-600 rounded-lg flex items-center justify-center">
          <Search className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
          OUTAudits
        </span>
    </div>
    </Link>
  );
}
