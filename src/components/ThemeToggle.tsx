import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from './Button'

type Theme = 'dark' | 'light' | 'system'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('bibliarch-theme') as Theme
    if (saved) setTheme(saved)
  }, [])
  
  useEffect(() => {
    if (!mounted) return
    
    localStorage.setItem('bibliarch-theme', theme)
    
    const root = document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark')
      root.style.setProperty('--background', '222 47% 6%')
      root.style.setProperty('--foreground', '210 40% 98%')
    } else if (theme === 'light') {
      root.classList.remove('dark')
      root.style.setProperty('--background', '0 0% 100%')
      root.style.setProperty('--foreground', '222 47% 11%')
    }
  }, [theme, mounted])
  
  if (!mounted) return null
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={theme === 'dark' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setTheme('dark')}
      >
        <Moon className="w-4 h-4 mr-1" /> Dark
      </Button>
      
      <Button
        variant={theme === 'light' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setTheme('light')}
      >
        <Sun className="w-4 h-4 mr-1" /> Light
      </Button>
    </div>
  )
}
