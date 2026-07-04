'use client'

import { X, Star, Zap, TrendingUp, Users2, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface TryProModalProps {
  isOpen: boolean
  onClose: () => void
  onStartTrial?: () => void
}

const proHighlights = [
  {
    icon: Zap,
    title: 'Unlimited Audits',
    description: 'Run as many SEO audits as you want with no restrictions',
  },
  {
    icon: TrendingUp,
    title: 'Keyword Tracking',
    description: 'Monitor 500+ keywords and track your SERP rankings',
  },
  {
    icon: Users2,
    title: 'Competitor Analysis',
    description: 'Compare your SEO performance against top competitors',
  },
  {
    icon: Sparkles,
    title: 'Lead Widget',
    description: 'Capture leads directly from your audit reports',
  },
]

export function TryProModal({ isOpen, onClose, onStartTrial }: TryProModalProps) {
  if (!isOpen) return null

  const handleStartTrial = () => {
    onStartTrial?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-[0px_20px_40px_rgba(0,0,0,0.15)] max-w-md w-full mx-4"
        style={{ border: '1px solid #e4e9ed' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded transition-colors z-10"
        >
          <X className="w-5 h-5" style={{ color: '#44576a' }} />
        </button>

        {/* Header */}
        <div
          className="p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(0,164,198,0.1) 0%, rgba(13,211,182,0.1) 100%)',
          }}
        >
          <div className="flex justify-center mb-4">
            <Star className="w-12 h-12" style={{ color: '#00a4c6' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#141e27' }}>
            Try Pro for Free
          </h2>
          <p className="text-sm" style={{ color: '#44576a' }}>
            Explore unlimited audits and advanced features
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* No Credit Card Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold w-full justify-center"
            style={{ backgroundColor: 'rgba(52,211,153,0.15)', color: '#34d399' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            No credit card required
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            {proHighlights.map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={i}
                  className="p-3 rounded-lg border"
                  style={{ backgroundColor: '#f5f7fa', borderColor: '#e4e9ed' }}
                >
                  <Icon className="w-4 h-4 mb-2" style={{ color: '#00a4c6' }} />
                  <p className="text-xs font-semibold mb-1" style={{ color: '#141e27' }}>
                    {item.title}
                  </p>
                  <p className="text-[11px]" style={{ color: '#44576a' }}>
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Trial Duration */}
          <div
            className="p-4 rounded-lg text-center"
            style={{ backgroundColor: 'rgba(0,164,198,0.05)', borderColor: '#e4e9ed', border: '1px solid #e4e9ed' }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: '#141e27' }}>
              7-Day Free Trial
            </p>
            <p className="text-xs" style={{ color: '#44576a' }}>
              Full access to all Pro features. Cancel anytime.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 p-6 border-t" style={{ borderColor: '#e4e9ed' }}>
          <button
            onClick={handleStartTrial}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded font-medium text-white transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: '#00a4c6' }}
          >
            Start Free Trial
            <Zap className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded font-medium transition-all duration-200 hover:bg-gray-50"
            style={{ color: '#44576a', border: '1px solid #e4e9ed' }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
