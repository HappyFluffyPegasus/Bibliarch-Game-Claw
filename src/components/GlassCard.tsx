import { ReactNode } from 'react';
import { cn } from './utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({ children, className, hover = false, glow = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden",
        "bg-card/80 backdrop-blur-xl",
        "border border-border/50",
        "shadow-lg",
        hover && "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-primary/30",
        glow && "shadow-primary/20",
        className
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedContainer({ children, className, delay = 0 }: AnimatedContainerProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-4",
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {children}
    </div>
  );
}

export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400",
        "bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Badge({ children, variant = 'default', className }: { 
  children: ReactNode; 
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}) {
  const variants = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}