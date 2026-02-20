'use client'

import { Progress } from '@/components/progress'
import { getScoreColorClass, getScoreBgClass } from '@/lib/utils'
import { Badge } from '@/components/badge'

interface ScoreBarProps {
  label: string
  score: number
  icon?: React.ReactNode
  showBadge?: boolean
}

export function ScoreBar({ label, score, icon, showBadge = false }: ScoreBarProps) {
  const getProgressColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-green-600'
    if (score >= 70) return 'from-blue-500 to-blue-600'
    if (score >= 50) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }
  
  const getVariant = (score: number) => {
    if (score >= 90) return 'success'
    if (score >= 70) return 'info'
    if (score >= 50) return 'warning'
    return 'destructive'
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${getScoreColorClass(score)}`}>
            {score}
          </span>
          {showBadge && (
            <Badge variant={getVariant(score)} className="text-xs">
              {score >= 90 ? '✓' : score >= 50 ? '⚠' : '✗'}
            </Badge>
          )}
        </div>
      </div>
      <Progress 
        value={score} 
        className="h-2"
        indicatorClassName={`bg-gradient-to-r ${getProgressColor(score)}`}
      />
    </div>
  )
}