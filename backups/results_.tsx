"use client";

/**
 * /ai-visibility/[jobId] — AI Visibility Audit results page.
 *
 * Polls GET /api/ai-visibility/audit/{jobId} every 2s while status is
 * pending/running, then renders the score ring + sub-score breakdown +
 * checklist + ranked fixes, matching the existing Lighthouse-style
 * results page look (same ring pattern, same brand colors).
 *
 * ADAPT: swap the fetch() calls for your existing API client / auth
 * header pattern (this assumes a bearer token in localStorage, matching
 * a common pattern for this kind of app — update to yours).
 */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/dashboardLayout";

const PRIMARY = "#00A4C6";
const ACCENT = "#0DD3B6";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

type SubScores = {
  entity_clarity: number | null;
  eeat: number | null;
  content_structure: number | null;
  crawlability: number | null;
};

type Fix = { impact: "high" | "medium" | "low"; category: string; fix: string };

type AuditResponse = {
  job_id: string;
  url: string;
  client_name: string | null;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  overall_score: number | null;
  sub_scores: SubScores;
  layer2_requested: boolean;
  layer2_completed: boolean;
  results: any;
  error: string | null;
};

const SUB_SCORE_LABELS: Record<keyof SubScores, string> = {
  entity_clarity: "Entity Clarity",
  eeat: "E-E-A-T Signals",
  content_structure: "Content Structure",
  crawlability: "AI Bot Crawlability",
};

function scoreColor(score: number | null): string {
  if (score === null) return "#94a3b8";
  if (score >= 80) return ACCENT;
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

function ScoreRing({ score, size = 160 }: { score: number | null; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = score ?? 0;
  const offset = circumference - (pct / 100) * circumference;
  const color = scoreColor(score);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={12}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={score === null ? circumference : offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.26}
        fontWeight={700}
        fill="#0f172a"
      >
        {score ?? "—"}
      </text>
    </svg>
  );
}

function SubScoreBar({ label, score }: { label: string; score: number | null }) {
  const color = scoreColor(score);
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-semibold" style={{ color }}>
          {score ?? "—"}
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score ?? 0}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function ImpactBadge({ impact }: { impact: Fix["impact"] }) {
  const styles: Record<Fix["impact"], string> = {
    high: "bg-red-50 text-red-600 border-red-200",
    medium: "bg-amber-50 text-amber-600 border-amber-200",
    low: "bg-slate-50 text-slate-500 border-slate-200",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${styles[impact]}`}>
      {impact.toUpperCase()}
    </span>
  );
}

function CheckRow({ label, pass }: { label: string; pass: boolean }) {
  return (
    <div className="flex items-center gap-2 py-1.5 text-sm">
      <span
        className="flex items-center justify-center w-5 h-5 rounded-full text-white text-xs shrink-0"
        style={{ backgroundColor: pass ? ACCENT : "#ef4444" }}
      >
        {pass ? "✓" : "✕"}
      </span>
      <span className="text-slate-700">{label}</span>
    </div>
  );
}

export default function AiVisibilityResultsPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = params?.jobId;

  const [data, setData] = useState<AuditResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;
    let interval: ReturnType<typeof setInterval>;

    async function poll() {
      try {
        const token = localStorage.getItem("access_token"); // ADAPT
        const res = await fetch(`${API_BASE}/ai-visibility/audit/${jobId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const json: AuditResponse = await res.json();
        if (cancelled) return;
        console.log(json)
        setData(json);
        if (json.status === "completed" || json.status === "failed") {
          clearInterval(interval);
        }
      } catch (err: any) {
        if (!cancelled) setLoadError(err.message || "Failed to load audit");
      }
    }

    poll();
    interval = setInterval(poll, 2000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [jobId]);

  if (loadError) {
    return <StatusScreen message={loadError} tone="error" />;
  }

  if (!data) {
    return <StatusScreen message="Loading audit…" tone="loading" />;
  }

  if (data.status === "pending" || data.status === "running") {
    return (
      <StatusScreen
        message={data.status === "pending" ? "Queued…" : "Analyzing AI visibility signals…"}
        tone="loading"
        progress={data.progress}
      />
    );
  }

  if (data.status === "failed") {
    return <StatusScreen message={data.error || "Audit failed"} tone="error" />;
  }

  const r = data.results || {};
  const fixes: Fix[] = r.fixes || [];
  const entity = r.entity_clarity || {};
  const eeat = r.eeat || {};
  const content = r.content_structure || {};
  const crawl = r.crawlability || {};

  return (
    <DashboardLayout>
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-slate-500 mb-1">AI Visibility Audit</p>
        <h1 className="text-2xl font-bold text-slate-900 break-all">{data.url}</h1>
        {data.client_name && <p className="text-slate-500 mt-1">{data.client_name}</p>}
      </div>

      {/* Score overview */}
      <div
        className="rounded-2xl border border-slate-200 p-8 mb-8 flex flex-col md:flex-row items-center gap-8"
        style={{ background: `linear-gradient(135deg, ${PRIMARY}08, ${ACCENT}08)` }}
      >
        <ScoreRing score={data.overall_score} />
        <div className="flex-1 w-full">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">AI Visibility Score</h2>
          <SubScoreBar label={SUB_SCORE_LABELS.entity_clarity} score={data.sub_scores.entity_clarity} />
          <SubScoreBar label={SUB_SCORE_LABELS.eeat} score={data.sub_scores.eeat} />
          <SubScoreBar label={SUB_SCORE_LABELS.content_structure} score={data.sub_scores.content_structure} />
          <SubScoreBar label={SUB_SCORE_LABELS.crawlability} score={data.sub_scores.crawlability} />
        </div>
      </div>

      {/* AI crawlers */}
      <Section title="AI Crawler Access">
        <div className="grid sm:grid-cols-2 gap-x-8">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-2">Allowed</p>
            {(crawl.ai_bots_allowed || []).map((b: any) => (
              <CheckRow key={b.bot} label={`${b.bot} — ${b.description}`} pass={true} />
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-2">Blocked</p>
            {(crawl.ai_bots_blocked || []).length === 0 && (
              <p className="text-sm text-slate-400">None blocked</p>
            )}
            {(crawl.ai_bots_blocked || []).map((b: any) => (
              <CheckRow key={b.bot} label={`${b.bot} — ${b.description}`} pass={false} />
            ))}
          </div>
        </div>
      </Section>

      {/* Schema coverage */}
      <Section title="Schema Coverage Gap">
        <div className="flex flex-wrap gap-2">
          {(entity.recommended_types_present || []).map((t: string) => (
            <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: ACCENT }}>
              {t}
            </span>
          ))}
          {(entity.recommended_types_missing || []).map((t: string) => (
            <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-full border border-slate-300 text-slate-400">
              {t}
            </span>
          ))}
        </div>
      </Section>

      {/* E-E-A-T checklist */}
      <Section title="E-E-A-T Checklist">
        <CheckRow label="Author byline / Person schema" pass={!!eeat.author_byline_detected} />
        <CheckRow label={`About page (${eeat.about_page?.word_count ?? 0} words)`} pass={!!eeat.about_page?.found} />
        <CheckRow label="Contact page" pass={!!eeat.contact_page_found} />
        <CheckRow label="HTTPS" pass={!!eeat.https} />
        <CheckRow label="Privacy policy" pass={!!eeat.privacy_policy_found} />
        <CheckRow label="Terms of service" pass={!!eeat.terms_of_service_found} />
      </Section>

      {/* Content structure issues */}
      <Section title="Content Structure">
        <CheckRow label="FAQ section / schema" pass={!!(content.faq_schema_present || content.faq_pattern_detected_in_html)} />
        <CheckRow
          label={`Heading hierarchy (${content.heading_hierarchy?.h1_count ?? 0} H1${(content.heading_hierarchy?.h1_count ?? 0) === 1 ? "" : "s"})`}
          pass={!!content.heading_hierarchy?.structure_ok}
        />
        <CheckRow label="Definition-style sentences present" pass={(content.definition_patterns_found ?? 0) > 0} />
        <CheckRow label="Content freshness dates in schema/meta" pass={!!(content.freshness?.date_published || content.freshness?.date_modified)} />
        <CheckRow label="Concise opening paragraph" pass={!!content.aeo?.concise_first_paragraph} />
        {content.heading_hierarchy?.notes?.map((n: string, i: number) => (
          <p key={i} className="text-xs text-red-500 mt-1 ml-7">{n}</p>
        ))}
      </Section>

      {/* Layer 2 citation check */}
      {data.layer2_requested && (
        <Section title="AI Citation Check (Live)">
          {data.layer2_completed ? (
            <div className="flex gap-6">
              <CheckRow label="Cited by Perplexity" pass={!!r.layer2?.perplexity?.cited} />
              <CheckRow label="Cited by Brave AI" pass={!!r.layer2?.brave?.cited} />
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              {r.layer2_note || "Live citation check not available on this run."}
            </p>
          )}
        </Section>
      )}

      {/* Fixes */}
      <Section title="Actionable Fixes">
        <div className="space-y-3">
          {fixes.map((f, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200">
              <ImpactBadge impact={f.impact} />
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-0.5">{f.category}</p>
                <p className="text-sm text-slate-700">{f.fix}</p>
              </div>
            </div>
          ))}
          {fixes.length === 0 && <p className="text-sm text-slate-500">No major issues found.</p>}
        </div>
      </Section>
    </div>
    </DashboardLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-6 mb-6">
      <h3 className="text-base font-semibold text-slate-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function StatusScreen({
  message,
  tone,
  progress,
}: {
  message: string;
  tone: "loading" | "error";
  progress?: number;
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      {tone === "loading" ? (
        <>
          <div
            className="w-14 h-14 rounded-full border-4 border-slate-200 mx-auto mb-6 animate-spin"
            style={{ borderTopColor: PRIMARY }}
          />
          <p className="text-slate-600">{message}</p>
          {typeof progress === "number" && (
            <div className="w-full h-1.5 rounded-full bg-slate-100 mt-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: ACCENT }}
              />
            </div>
          )}
        </>
      ) : (
        <p className="text-red-500">{message}</p>
      )}
    </div>
  );
}