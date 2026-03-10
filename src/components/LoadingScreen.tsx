import { useEffect, useState } from 'react'
import { useAppStore } from '../stores/appStore'

export function LoadingScreen() {
  const { isLoading, loadingMessage } = useAppStore()
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    if (isLoading) {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev
          return prev + Math.random() * 15
        })
      }, 200)
      
      return () => clearInterval(interval)
    } else {
      setProgress(100)
    }
  }, [isLoading])
  
  if (!isLoading && progress >= 100) return null
  
  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center"
    >
      <div className="mb-8"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
        >
          Bibliarch
        </h1>
        <p className="text-center text-white/60 mt-2">Story Creation Platform</p>
      </div>
      
      <div className="w-80 h-2 bg-white/10 rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      
      <p className="mt-4 text-white/80 text-sm">
        {loadingMessage || 'Loading...'}
      </p>
      
      <p className="mt-8 text-white/40 text-xs max-w-md text-center">
        Tip: Use Cmd/Ctrl + K to open the command palette for quick navigation
      </p>
    </div>
  )
}
