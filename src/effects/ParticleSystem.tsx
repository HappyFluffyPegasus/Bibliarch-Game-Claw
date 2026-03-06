import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
}

interface ParticleSystemConfig {
  type: 'rain' | 'snow' | 'fire' | 'magic' | 'leaves' | 'dust';
  count: number;
  color?: string;
  windX?: number;
  windY?: number;
  gravity?: number;
}

export function useParticleSystem(canvasRef: React.RefObject<HTMLCanvasElement>, config: ParticleSystemConfig) {
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const isActiveRef = useRef(true);

  const createParticle = useCallback((width: number, height: number): Particle => {
    const { type, color, windX = 0, windY = 0 } = config;
    
    switch (type) {
      case 'rain':
        return {
          x: Math.random() * width,
          y: -10,
          vx: windX + (Math.random() - 0.5) * 0.5,
          vy: 15 + Math.random() * 5,
          life: 1,
          maxLife: 1,
          size: 1 + Math.random() * 2,
          color: color || '#a5d8ff',
          alpha: 0.6 + Math.random() * 0.4
        };
      
      case 'snow':
        return {
          x: Math.random() * width,
          y: -10,
          vx: windX + (Math.random() - 0.5) * 2,
          vy: 1 + Math.random() * 2,
          life: 1,
          maxLife: 1,
          size: 2 + Math.random() * 3,
          color: color || '#ffffff',
          alpha: 0.8 + Math.random() * 0.2
        };
      
      case 'fire':
        return {
          x: width / 2 + (Math.random() - 0.5) * 100,
          y: height - 50 + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: -3 - Math.random() * 3,
          life: 1,
          maxLife: 1,
          size: 4 + Math.random() * 6,
          color: color || ['#ff6b35', '#f7931e', '#ffd23f'][Math.floor(Math.random() * 3)],
          alpha: 1
        };
      
      case 'magic':
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5 - 0.5,
          life: 1,
          maxLife: 1 + Math.random() * 2,
          size: 2 + Math.random() * 4,
          color: color || ['#9d4edd', '#c77dff', '#e0aaff'][Math.floor(Math.random() * 3)],
          alpha: 0.8
        };
      
      case 'leaves':
        return {
          x: Math.random() * width,
          y: -10,
          vx: windX + (Math.random() - 0.5) * 3,
          vy: 2 + Math.random() * 2,
          life: 1,
          maxLife: 1,
          size: 6 + Math.random() * 4,
          color: color || ['#e63946', '#f4a261', '#2a9d8f'][Math.floor(Math.random() * 3)],
          alpha: 0.9
        };
      
      case 'dust':
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          life: 1,
          maxLife: 2 + Math.random() * 3,
          size: 1 + Math.random() * 2,
          color: color || '#d4a574',
          alpha: 0.3 + Math.random() * 0.3
        };
      
      default:
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          life: 1,
          maxLife: 1,
          size: 2,
          color: '#ffffff',
          alpha: 1
        };
    }
  }, [config]);

  const updateParticles = useCallback((width: number, height: number) => {
    const particles = particlesRef.current;
    const { type, gravity = 0 } = config;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      
      // Apply gravity for some types
      if (type === 'fire' || type === 'magic') {
        p.vy += gravity || -0.02;
      }
      
      // Update life
      p.life -= 0.01;
      
      // Remove dead particles
      if (p.life <= 0 || p.y > height + 50 || p.x < -50 || p.x > width + 50) {
        particles.splice(i, 1);
      }
    }

    // Spawn new particles
    while (particles.length < config.count) {
      particles.push(createParticle(width, height));
    }
  }, [config, createParticle]);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;

    particles.forEach(p => {
      const lifeRatio = p.life / p.maxLife;
      const currentAlpha = p.alpha * lifeRatio;
      
      ctx.save();
      ctx.globalAlpha = currentAlpha;
      ctx.fillStyle = p.color;
      
      if (config.type === 'rain') {
        // Draw rain as lines
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.stroke();
      } else if (config.type === 'snow') {
        // Draw snow as circles with glow
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (config.type === 'fire') {
        // Draw fire with gradient
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Default circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    });
  }, [config.type]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isActiveRef.current = true;

    const animate = () => {
      if (!isActiveRef.current) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      updateParticles(width, height);
      drawParticles(ctx);

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize particles
    for (let i = 0; i < config.count; i++) {
      particlesRef.current.push(createParticle(canvas.width, canvas.height));
    }

    animate();

    return () => {
      isActiveRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [canvasRef, config, createParticle, updateParticles, drawParticles]);

  return {
    restart: () => {
      particlesRef.current = [];
      const canvas = canvasRef.current;
      if (canvas) {
        for (let i = 0; i < config.count; i++) {
          particlesRef.current.push(createParticle(canvas.width, canvas.height));
        }
      }
    }
  };
}

// Pre-built effect presets
export const particlePresets = {
  rain: { type: 'rain' as const, count: 200, color: '#a5d8ff' },
  snow: { type: 'snow' as const, count: 150, color: '#ffffff' },
  fire: { type: 'fire' as const, count: 100, color: '#ff6b35' },
  magic: { type: 'magic' as const, count: 80, color: '#9d4edd' },
  leaves: { type: 'leaves' as const, count: 50, color: '#e63946' },
  dust: { type: 'dust' as const, count: 100, color: '#d4a574' },
};
