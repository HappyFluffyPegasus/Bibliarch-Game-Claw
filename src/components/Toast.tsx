import { useEffect, useState } from 'react'
import { X, CheckCircle, Info, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'info' | 'warning' | 'error'

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastProps {
  toast: ToastMessage
  onDismiss: (id: string) => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onDismiss(toast.id), 300)
    }, toast.duration || 5000)
    
    return () => clearTimeout(timer)
  }, [toast, onDismiss])
  
  const icons = {
    success: CheckCircle,
    info: Info,
    warning: AlertCircle,
    error: AlertCircle
  }
  
  const colors = {
    success: 'text-green-400 border-green-400/30',
    info: 'text-blue-400 border-blue-400/30',
    warning: 'text-yellow-400 border-yellow-400/30',
    error: 'text-red-400 border-red-400/30'
  }
  
  const Icon = icons[toast.type]
  
  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border bg-white/10 backdrop-blur-xl shadow-lg',
        colors[toast.type],
        isExiting ? 'animate-out slide-out-to-right' : 'animate-in slide-in-from-right'
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 mt-0.5" />
          
          <div className="flex-1">
            <h4 className="font-medium text-sm">{toast.title}</h4>
            {toast.message && (
              <p className="text-sm text-muted-foreground mt-1">{toast.message}</p>
            )}
          </div>
          
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Toast Container
import { create } from 'zustand'

interface ToastStore {
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  dismissToast: (id: string) => void
}

export const useToast = create<ToastStore>()((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID()
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }]
    }))
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
  }
}))

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  )
}
