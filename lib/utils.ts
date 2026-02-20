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