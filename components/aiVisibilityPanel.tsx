'use client'

import Link from 'next/link';
import { Globe, ShieldCheck, Bot } from 'lucide-react';

type SubScores = {
  entity_clarity?: number | null;
  eeat_signals?: number | null;
  content_structure?: number | null;
  crawlability?: number | null;
};

type AiVisibilitySummary = {
  jobId: string;
  url?: string;
  overall_score?: number | null;
  status?: string;
  top_fixes?: string[];
  sub_scores?: SubScores;
};

const scoreColor = (score: number | null | undefined) => {
  if (score === null || score === undefined) return '#8896a4';
  if (score >= 80) return '#34d399';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

export default function AiVisibilityPanel({ summary }: { summary: AiVisibilitySummary }) {
  const { jobId, url, overall_score, top_fixes, sub_scores } = summary;

  return (
    <div className="bg-white border border-[#e4e9ed] rounded p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-[#8896a4] mb-1">AI Visibility</div>
          <div className="font-semibold text-[#141e27] truncate">{url ?? 'Unknown URL'}</div>
          {/* <div className="text-xs text-[#44576a] mt-1">ID: {jobId}</div> */}
        </div>

        <div className="flex flex-col items-end">
          <div className="text-xs text-[#8896a4] uppercase">Score</div>
          <div className="text-2xl font-bold" style={{ color: scoreColor(overall_score) }}>
            {overall_score ?? '--'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#8896a4]" />
          <div className="truncate"  >Entity <span className="font-bold" style={{ color: scoreColor(sub_scores?.entity_clarity) }}>{sub_scores?.entity_clarity ?? '--'}</span></div>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#8896a4]" />
          <div className="truncate"  >E‑E‑A‑T <span className="font-bold" style={{ color: scoreColor(sub_scores?.eeat_signals) }}>{sub_scores?.eeat_signals ?? '--'}</span></div>
        </div>
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#8896a4]" />
          <div className="truncate">Crawl <span className="font-bold" style={{ color: scoreColor(sub_scores?.crawlability) }} >{sub_scores?.crawlability ?? '--'}</span></div>
        </div>
      </div>
    
    <h3 className="font-bold mt-4" >Top Fixes</h3>
      {top_fixes && top_fixes.length > 0 && (
        <ul className="mt-3 text-sm text-[#44576a] list-disc pl-5">
          {top_fixes.map((f, i) => (
            <li key={i} className="truncate">{f}</li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex justify-end">
        <Link href={`/ai-visibility`} className="px-3 py-1.5 bg-[#00a4c6] text-white rounded text-sm hover:opacity-90">
          See full AI visibility audit
        </Link>
      </div>
    </div>
  );
}