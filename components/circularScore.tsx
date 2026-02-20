'use client'

import { useEffect, useState } from 'react'
import { getScoreColor, getScoreLabel } from '@/lib/utils'

interface CircularScoreProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animate?: boolean
}

export function CircularScore({ 
  score, 
  size = 'md', 
  showLabel = true,
  animate = true 
}: CircularScoreProps) {
  const [displayScore, setDisplayScore] = useState(0)
  
  useEffect(() => {
    if (!animate) {
      setDisplayScore(score)
      return
    }
    
    let start = 0
    const end = score
    const duration = 1000
    const increment = end / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayScore(end)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.floor(start))
      }
    }, 16)
    
    return () => clearInterval(timer)
  }, [score, animate])
  
  const scoreColor = getScoreColor(score)
  const scoreLabel = getScoreLabel(score)
  
  const sizes = {
    sm: { width: 80, height: 80, fontSize: '1.5rem', strokeWidth: 6 },
    md: { width: 120, height: 120, fontSize: '2.5rem', strokeWidth: 8 },
    lg: { width: 160, height: 160, fontSize: '3.5rem', strokeWidth: 10 }
  }
  
  const { width, height, fontSize, strokeWidth } = sizes[size]
  const radius = (width - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (displayScore / 100) * circumference
  
  const colors = {
    success: '#10B981',
    info: '#06B6D4',
    warning: '#F59E0B',
    error: '#EF4444'
  }
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke={colors[scoreColor as keyof typeof colors]}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ fontSize }}
        >
          <span className="font-bold text-gray-900">
            {Math.round(displayScore)}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            /100
          </span>
        </div>
      </div>
      {showLabel && (
        <span 
          className={`text-sm font-semibold`}
          style={{ color: colors[scoreColor as keyof typeof colors] }}
        >
          {scoreLabel}
        </span>
      )}
    </div>
  )
}