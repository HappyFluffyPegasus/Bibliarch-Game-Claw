import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        'bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl',
        hover && 'transition-all duration-300 hover:bg-white/10 hover:border-white/20',
        className
      )}
    >
      {children}
    </div>
  )
}
