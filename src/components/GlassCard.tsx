import { cn } from '@/lib/utils'
import type { ReactNode, HTMLAttributes } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
}

export function GlassCard({ children, className, hover = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl',
        hover && 'transition-all duration-300 hover:bg-white/10 hover:border-white/20',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
