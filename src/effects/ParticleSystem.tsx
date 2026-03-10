import { useEffect, useRef } from 'react'

interface ParticleSystemProps {
  type: 'sparks' | 'confetti' | 'magic' | 'rain' | 'snow'
  active: boolean
}

export function ParticleSystem({ type, active }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  
  useEffect(() => {
    if (!active || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      color: string
      size: number
    }> = []
    
    const colors = {
      sparks: ['#fbbf24', '#f59e0b', '#ef4444'],
      confetti: ['#ef4444', '#3b82f6', '#22c55e', '#fbbf24', '#a855f7'],
      magic: ['#a855f7', '#ec4899', '#3b82f6'],
      rain: ['#60a5fa', '#93c5fd'],
      snow: ['#e5e7eb', '#f3f4f6']
    }
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: type === 'rain' || type === 'snow' ? Math.random() * 3 + 2 : (Math.random() - 0.5) * 2,
        life: 1,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
        size: Math.random() * 3 + 1
      })
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(p => {
        // Update position
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.01
        
        // Reset if dead or out of bounds
        if (p.life <= 0 || p.y > canvas.height || p.x < 0 || p.x > canvas.width) {
          p.x = Math.random() * canvas.width
          p.y = type === 'rain' || type === 'snow' ? -10 : Math.random() * canvas.height
          p.life = 1
        }
        
        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life
        ctx.fill()
      })
      
      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [active, type])
  
  if (!active) return null
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
