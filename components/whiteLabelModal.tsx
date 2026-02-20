'use client'

import { useState, useRef } from 'react'
import { useWhiteLabel, WhiteLabelConfig } from '@/lib/whitelabel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Building2, Upload, Palette, User, Briefcase } from 'lucide-react'

interface WhiteLabelModalProps {
  onClose: () => void
}

export function WhiteLabelModal({ onClose }: WhiteLabelModalProps) {
  const { config, setConfig } = useWhiteLabel()
  const [form, setForm] = useState<WhiteLabelConfig>({ ...config })
  const fileRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setForm(prev => ({ ...prev, agencyLogo: ev.target?.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const save = () => {
    setConfig(form)
    onClose()
  }

  const presetColors = [
    '#0075FF', '#8766FF', '#10B981', '#F59E0B',
    '#EF4444', '#06B6D4', '#6366F1', '#EC4899',
    '#14B8A6', '#F97316', '#8B5CF6', '#1E293B',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{ background: `linear-gradient(135deg, ${form.accentColor}ee, ${form.accentColor}99)` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-none">Agency Branding</h2>
              <p className="text-white/70 text-xs mt-0.5">White-label report settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Agency details */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Building2 className="w-4 h-4" style={{ color: form.accentColor }} />
              Agency Details
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Agency Name *</label>
                <Input
                  value={form.agencyName}
                  onChange={e => setForm(p => ({ ...p, agencyName: e.target.value }))}
                  placeholder="Acme Digital Agency"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Agency Website</label>
                <Input
                  value={form.agencyUrl}
                  onChange={e => setForm(p => ({ ...p, agencyUrl: e.target.value }))}
                  placeholder="https://youragency.com"
                />
              </div>
            </div>
          </section>

          {/* Report recipients */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="w-4 h-4" style={{ color: form.accentColor }} />
              Report Recipients
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Client Name</label>
                <Input
                  value={form.clientName}
                  onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))}
                  placeholder="Client Company Ltd"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Prepared by</label>
                <Input
                  value={form.preparedBy}
                  onChange={e => setForm(p => ({ ...p, preparedBy: e.target.value }))}
                  placeholder="Jane Smith, SEO Lead"
                />
              </div>
            </div>
          </section>

          {/* Logo */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Upload className="w-4 h-4" style={{ color: form.accentColor }} />
              Agency Logo
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-gray-300 transition-colors flex items-center gap-4"
            >
              {form.agencyLogo ? (
                <>
                  <img
                    src={form.agencyLogo}
                    alt="Agency logo"
                    className="h-12 w-auto object-contain rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Logo uploaded</p>
                    <p className="text-xs text-gray-500">Click to replace</p>
                  </div>
                </>
              ) : (
                <div className="text-center w-full">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Click to upload logo</p>
                  <p className="text-xs text-gray-400">PNG, SVG, JPG — shown on PDF cover</p>
                </div>
              )}
            </div>
          </section>

          {/* Accent colour */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Palette className="w-4 h-4" style={{ color: form.accentColor }} />
              Brand Colour
            </div>
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map(color => (
                <button
                  key={color}
                  onClick={() => setForm(p => ({ ...p, accentColor: color }))}
                  className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: form.accentColor === color ? '#1F2937' : 'transparent',
                    boxShadow: form.accentColor === color ? '0 0 0 2px white, 0 0 0 3px #1F2937' : 'none',
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg border border-gray-200 flex-shrink-0"
                style={{ backgroundColor: form.accentColor }}
              />
              <Input
                value={form.accentColor}
                onChange={e => {
                  const v = e.target.value
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setForm(p => ({ ...p, accentColor: v }))
                }}
                placeholder="#0075FF"
                className="font-mono text-sm"
              />
            </div>
          </section>

          {/* Footer text */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              Report Footer
            </div>
            <textarea
              value={form.reportFooter}
              onChange={e => setForm(p => ({ ...p, reportFooter: e.target.value }))}
              rows={2}
              className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Confidential — prepared exclusively for the client named above."
            />
          </section>

          {/* Live preview strip */}
          <section className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Preview</p>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              {/* mini header */}
              <div
                className="flex items-center justify-between px-4 py-2"
                style={{ background: form.accentColor }}
              >
                <div className="flex items-center gap-2">
                  {form.agencyLogo ? (
                    <img src={form.agencyLogo} alt="" className="h-5 w-auto" />
                  ) : (
                    <span className="text-white font-bold text-xs">{form.agencyName || 'Your Agency'}</span>
                  )}
                </div>
                <span className="text-white/70 text-[10px]">Page 1 of 5</span>
              </div>
              {/* mini cover */}
              <div className="bg-gray-50 px-4 py-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Website Audit Report</p>
                <p className="text-xs font-semibold text-gray-800">{form.clientName || 'Client Company'}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Prepared by {form.preparedBy || form.agencyName}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 bg-gray-50">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={save}
            className="flex-1 text-white"
            style={{ background: form.accentColor }}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}