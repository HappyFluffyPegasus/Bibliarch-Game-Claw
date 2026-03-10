import { Component, type ErrorInfo, type ReactNode } from 'react'
import { GlassCard } from './GlassCard'
import { Button } from './Button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ errorInfo })
  }
  
  handleReload = () => {
    window.location.reload()
  }
  
  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4"
        >
          <GlassCard className="max-w-md w-full p-8 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center"
            >
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            
            <p className="text-muted-foreground mb-6"
            >
              We've encountered an unexpected error. Don't worry, your data is safe.
            </p>
            
            {this.state.error && (
              <div className="mb-6 p-4 bg-red-500/10 rounded-lg text-left overflow-auto"
              >
                <code className="text-xs text-red-400"
                >
                  {this.state.error.toString()}
                </code>
              </div>
            )}
            
            <div className="flex gap-3 justify-center"
            >
              <Button variant="outline" onClick={this.handleReset}>
                Try Again
              </Button>
              
              <Button onClick={this.handleReload}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload App
              </Button>
            </div>
          </GlassCard>
        </div>
      )
    }
    
    return this.props.children
  }
}
