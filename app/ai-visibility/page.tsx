'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  FileSearch,
  CheckCircle2,
  Zap,
  ArrowRight,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboardLayout'
import RecentAiVisibilityAudits from '@/components/recentAiVisibilityAudits';
import NewAiVisibilityAuditModal from '@/components/newAiVisibilityAudit';
import EmptyState from '@/components/emptyState';
import { fetchWithAuth, useAuth } from '@/lib/auth-context'

export default function AiVisibilityAudits() {
  const { user } = useAuth()
  const [showNewAudit, setShowNewAudit] = useState(false);
  const [stats, setStats] = useState<any>(null)
  const [recentAudits, setRecentAudits] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      fetchStats()
      fetchRecentAudits()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/ai-visibility/kpis`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch AI Visibility stats:', error)
    }
  }

  const fetchRecentAudits = async () => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/ai-visibility/history`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        // history returns an array
        setRecentAudits(data)
      }
    } catch (error) {
      console.error('Failed to fetch AI visibility audits:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm mb-1">
              <Link href="/dashboard" className="hover:underline" style={{ color: '#44576a' }}>Dashboard</Link>
              <ArrowRight className="w-3 h-3" style={{ color: '#8896a4' }} />
              <span style={{ color: '#141e27' }} className="font-medium">AI Visibility</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#141e27' }}>AI Visibility Audits</h1>
          </div>
          <button
            onClick={() => setShowNewAudit(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded text-sm font-medium text-white border-none cursor-pointer hover:opacity-90"
            style={{ backgroundColor: '#00a4c6' }}
          >
            <Plus className="w-4 h-4" />
            Run AI Visibility Audit
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Audits', value: stats?.total_audits || 0, icon: FileSearch, color: '#00a4c6' },
            { label: 'Avg Score', value: stats?.avg_overall_score ? Math.round(stats.avg_overall_score) : 0, icon: CheckCircle2, color: '#34d399' },
            { label: 'Perplexity Cited', value: stats?.pct_perplexity_cited ? stats.pct_perplexity_cited + '%' : '0%', icon: Zap, color: '#6366f1' },
            { label: 'This Month', value: stats?.audits_this_month || 0, icon: Zap, color: '#6366f1' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded p-4 flex items-center gap-3" style={{ border: '1px solid #e4e9ed' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}10` }}>
                <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: '#141e27' }}>{stat.value}</p>
                <p className="text-[11px]" style={{ color: '#44576a' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {recentAudits.length === 0 && (
          <EmptyState 
            onNew={() => setShowNewAudit(true)}
            headline='No AI visibility audits yet'
            subText={`Start an AI visibility audit to view recent audits details.`}
            buttonText='Run AI Visibility Audit'
            icon={<FileSearch className="w-8 h-8 text-[#34d399]" />}
          />        
        )}
        {recentAudits.length > 0 && (          
          <RecentAiVisibilityAudits recentAudits={recentAudits} />         
        )}
      </div>

      {showNewAudit && <NewAiVisibilityAuditModal onClose={() => {
        setShowNewAudit(false);
        // Optimistically refresh if user just closed
        fetchStats();
        fetchRecentAudits();
      }} />}
    </DashboardLayout>
  );
}
