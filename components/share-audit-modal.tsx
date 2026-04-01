'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Share2, Copy } from 'lucide-react'

interface ShareAuditModalProps {
  open: boolean
  onClose: () => void
  clientName: string
  setClientName: (v: string) => void
  shareLink: string | null
  isGenerating: boolean
  generate: () => Promise<void>
  copy: () => Promise<void>
  copied: boolean
}

export default function ShareAuditModal({
  open,
  onClose,
  clientName,
  setClientName,
  shareLink,
  isGenerating,
  generate,
  copy,
  copied,
}: ShareAuditModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-semibold">Share audit with client</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm">Close</button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-gray-600">Create a personalized share link for your client. They will see a read-only, branded view of the audit.</p>

          <div>
            <label className="text-xs text-gray-600 font-medium">Client name (optional)</label>
            <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client name (e.g. Acme Ltd)" />
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={generate} disabled={isGenerating} className="gap-2">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : <Share2 className="w-4 h-4"/>}
              <span className="text-sm">Generate link</span>
            </Button>
            <Button variant="ghost" onClick={() => setClientName('')} className="text-sm">Reset</Button>
            <div className="ml-auto text-xs text-gray-500">Once generated, copy the link and share with your client.</div>
          </div>

          {shareLink && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-gray-800 truncate">{shareLink}</p>
                <p className="text-xs text-gray-500">Anyone with this link can view the report (read-only).</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Button onClick={copy} size="sm" className="gap-2">
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">{copied ? 'Copied' : 'Copy'}</span>
                </Button>
                <a href={shareLink} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">Open</a>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-100 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
