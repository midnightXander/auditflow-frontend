//logo component
import { Search } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-600 rounded-lg flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
            </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-ransparent">
            OUTAudits
        </span>
    </div>
  );
}
