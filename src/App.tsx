import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { LoadingScreen } from './components/LoadingScreen'
import { CommandPalette } from './components/CommandPalette'
import { useEffect, useState } from 'react'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return p + 20
      })
    }, 200)
    
    return () => clearInterval(interval)
  }, [])
  
  if (isLoading) {
    return <LoadingScreen progress={progress} />
  }
  
  return (
    <BrowserRouter>
      <AppRoutes />
      <CommandPalette />
    </BrowserRouter>
  )
}

export default App
