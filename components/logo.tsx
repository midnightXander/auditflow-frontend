//logo component
import { Search } from "lucide-react";
import Link from "next/link";
export default function Logo() {
  return (
    <Link href="/" className="text-center">
    <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-[#00a4c6] rounded-lg flex items-center justify-center">
          <Search className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-white">
          OUTAUDITS
        </span>
    </div>
    </Link>
  );
}
