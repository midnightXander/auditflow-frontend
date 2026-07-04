'use client'

import { X, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface UpgradeToProModalProps {
  isOpen: boolean
  onClose: () => void
//   currentPlan?: 'free' | 'pro' | 'agency'
   currentPlan?: string
}

const proFeatures = [
  { name: 'Monthly audits', free: '5', pro: 'Unlimited' },
  { name: 'Crawl pages', free: '100', pro: '500'},
  { name: 'Competitor analysis', free: '3', pro: 'Unlimited' },
  { name: 'Keyword tracking', free: '_', pro: 'Unlimited' },
  { name: 'Lead capture widget', free: '—', pro: '✓' },
//   { name: 'API access', free: '—', pro: '✓' },
  { name: 'Priority support', free: '—', pro: '✓' },
]

export function UpgradeToProModal({ isOpen, onClose, currentPlan = 'free' }: UpgradeToProModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-[0px_20px_40px_rgba(0,0,0,0.15)] max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        style={{ border: '1px solid #e4e9ed' }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between p-6 border-b"
          style={{ borderColor: '#e4e9ed', backgroundColor: '#ffffff' }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#141e27' }}>
              Unlock Pro Features
            </h2>
            <p className="text-sm mt-1" style={{ color: '#44576a' }}>
            Get unlimited audits, keyword tracking, and competitor analysis and embed lead widget
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" style={{ color: '#44576a' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Plan Badge */}
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: 'rgba(0,164,198,0.05)', borderColor: '#e4e9ed' }}
          >
            <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: '#44576a' }}>
              Current Plan
            </p>
            <p className="text-lg font-bold capitalize" style={{ color: '#141e27' }}>
              {currentPlan === 'free' ? 'Free' : currentPlan === 'pro' ? 'Pro' : 'Agency'}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Free Plan */}
            <div
              className="p-4 rounded-lg border"
              style={{ backgroundColor: '#f5f7fa', borderColor: '#e4e9ed' }}
            >
              <h3 className="font-semibold mb-1" style={{ color: '#141e27' }}>
                Free
              </h3>
              <div className="text-2xl font-bold mb-4" style={{ color: '#44576a' }}>
                $0
              </div>
              <ul className="space-y-2">
                {proFeatures.map((feature) => (
                  <li key={feature.name} className="text-xs" style={{ color: '#44576a' }}>
                    <span className="font-medium">{feature.name}:</span> {feature.free}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Plan - Highlighted */}
            <div
              className="p-4 rounded-lg border-2 relative"
              style={{ backgroundColor: 'rgba(0,164,198,0.05)', borderColor: '#00a4c6' }}
            >
              <div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: '#00a4c6', color: '#ffffff' }}
              >
                Recommended
              </div>
              <h3 className="font-semibold mb-1" style={{ color: '#141e27' }}>
                Pro
              </h3>
              <div className="text-2xl font-bold mb-1" style={{ color: '#00a4c6' }}>
                $13
              </div>
              <p className="text-xs mb-4" style={{ color: '#44576a' }}>
                per month
              </p>
              <ul className="space-y-2">
                {proFeatures.map((feature) => (
                  <li key={feature.name} className="text-xs flex items-start gap-2" style={{ color: '#141e27' }}>
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#34d399' }} />
                    <span className="font-medium">{feature.pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature Highlights */}
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: '#f5f7fa' }}
          >
            <p className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: '#44576a' }}>
              What's included in Pro
            </p>
            <ul className="space-y-2">
              {[
                'Unlimited SEO audits and crawls',
                'Advanced competitor analysis',
                'Lead capture widget integration',
                'Full API access for integrations',
                'Priority email support',
                'Custom white-label options',
              ].map((item, i) => (
                <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#141e27' }}>
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: '#00a4c6' }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 flex items-center gap-3 p-6 border-t"
          style={{ borderColor: '#e4e9ed', backgroundColor: '#ffffff' }}
        >
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded text-sm font-medium border transition-all duration-200 hover:bg-gray-50"
            style={{ borderColor: '#e4e9ed', color: '#44576a' }}
          >
            Maybe later
          </button>
          <Link href="/dashboard/billing" className="flex-1">
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: '#00a4c6' }}
            >
              Upgrade to Pro
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
