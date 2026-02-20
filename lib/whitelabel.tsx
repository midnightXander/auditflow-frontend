'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface WhiteLabelConfig {
  agencyName: string
  agencyLogo: string | null        // base64 or URL
  agencyUrl: string
  accentColor: string              // hex
  reportFooter: string
  preparedBy: string
  clientName: string
}

const defaults: WhiteLabelConfig = {
  agencyName: 'AuditFlow',
  agencyLogo: null,
  agencyUrl: 'https://auditflow.io',
  accentColor: '#0075FF',
  reportFooter: 'Confidential — prepared exclusively for the client named above.',
  preparedBy: '',
  clientName: '',
}

interface WhiteLabelContextType {
  config: WhiteLabelConfig
  setConfig: (c: Partial<WhiteLabelConfig>) => void
}

const WhiteLabelContext = createContext<WhiteLabelContextType>({
  config: defaults,
  setConfig: () => {},
})

export function WhiteLabelProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<WhiteLabelConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('wl_config')
        if (saved) return { ...defaults, ...JSON.parse(saved) }
      } catch {}
    }
    return defaults
  })

  const setConfig = (partial: Partial<WhiteLabelConfig>) => {
    setConfigState(prev => {
      const next = { ...prev, ...partial }
      if (typeof window !== 'undefined') {
        localStorage.setItem('wl_config', JSON.stringify(next))
      }
      return next
    })
  }

  return (
    <WhiteLabelContext.Provider value={{ config, setConfig }}>
      {children}
    </WhiteLabelContext.Provider>
  )
}

export const useWhiteLabel = () => useContext(WhiteLabelContext)