import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ReactNode } from 'react'

interface ToolCarouselCardProps {
  icon: ReactNode
  title: string
  description: string
  briefPoints: string[]
  previewContent: ReactNode
  ctaText: string
  ctaHref: string
  gradientFrom: string
  gradientTo: string
  accentColor: string
}

export function ToolCarouselCard({
  icon,
  title,
  description,
  briefPoints,
  previewContent,
  ctaText,
  ctaHref,
  gradientFrom,
  gradientTo,
  accentColor,
}: ToolCarouselCardProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
      {/* Header */}
      <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} p-6 text-white`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-3">{icon}</div>
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-sm opacity-90 mt-2">{description}</p>
          </div>
        </div>
      </div>

      {/* Brief Points */}
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <ul className="space-y-2">
          {briefPoints.map((point, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <div className={`w-4 h-4 rounded-full ${accentColor}`} />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Preview */}
      <div className="flex-1 p-6 m-2 rounded-2xl border bg-white overflow-auto">
        <p className="text-xs font-semibold text-gray-500 mb-4 uppercase">Result Preview</p>
        {previewContent}
      </div>

      {/* CTA */}
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <Link href={ctaHref}>
          <Button className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700">
            {ctaText} →
          </Button>
        </Link>
      </div>
    </div>
  )
}