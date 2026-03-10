import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number
  max?: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

export function ProgressBar({
  progress,
  max = 100,
  label,
  size = 'md',
  color = 'bg-primary',
  className
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (progress / max) * 100))
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4'
  }
  
  return (
    <div className={cn('w-full', className)}>
      {(label || max !== 100) && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className={cn('w-full bg-white/10 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full transition-all duration-300 rounded-full', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
