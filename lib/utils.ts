import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'success'
  if (score >= 70) return 'info'
  if (score >= 50) return 'warning'
  return 'error'
}

export function getScoreColorClass(score: number): string {
  if (score >= 90) return 'text-success-500'
  if (score >= 70) return 'text-info-500'
  if (score >= 50) return 'text-warning-500'
  return 'text-error-500'
}

export function getScoreBgClass(score: number): string {
  if (score >= 90) return 'bg-success-50 text-success-700'
  if (score >= 70) return 'bg-info-50 text-info-700'
  if (score >= 50) return 'bg-warning-50 text-warning-700'
  return 'bg-error-50 text-error-700'
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Needs Improvement'
  return 'Poor'
}

export function formatUrl(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.hostname + parsed.pathname
  } catch {
    return url
  }
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatTime = (timestamp: string) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 30) return `${days}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

export function formatDateRelative(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return `${diffSeconds} seconds ago`
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  return `${diffDays} days ago`
}

export function formatDateDistanceToNow(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = past.getTime() - now.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return `${diffSeconds} seconds`
  if (diffMinutes < 60) return `${diffMinutes} minutes`
  if (diffHours < 24) return `${diffHours} hours`
  return `${diffDays} days`
}