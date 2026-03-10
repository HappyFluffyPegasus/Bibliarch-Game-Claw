import { create } from 'zustand'
import { useEffect } from 'react'

interface UndoableAction {
  id: string
  type: string
  undo: () => void
  redo: () => void
  description: string
}

interface UndoStore {
  history: UndoableAction[]
  currentIndex: number
  canUndo: boolean
  canRedo: boolean
  
  addAction: (action: Omit<UndoableAction, 'id'>) => void
  undo: () => void
  redo: () => void
  clear: () => void
}

export const useUndoStore = create<UndoStore>()((set, get) => ({
  history: [],
  currentIndex: -1,
  canUndo: false,
  canRedo: false,
  
  addAction: (action) => {
    const { history, currentIndex } = get()
    
    // Remove any future actions if we're in the middle of history
    const newHistory = history.slice(0, currentIndex + 1)
    
    // Add new action
    const newAction: UndoableAction = {
      ...action,
      id: crypto.randomUUID()
    }
    
    newHistory.push(newAction)
    
    // Limit history to 50 actions
    if (newHistory.length > 50) {
      newHistory.shift()
    }
    
    set({
      history: newHistory,
      currentIndex: newHistory.length - 1,
      canUndo: true,
      canRedo: false
    })
  },
  
  undo: () => {
    const { history, currentIndex } = get()
    
    if (currentIndex >= 0) {
      const action = history[currentIndex]
      action.undo()
      
      const newIndex = currentIndex - 1
      set({
        currentIndex: newIndex,
        canUndo: newIndex >= 0,
        canRedo: true
      })
    }
  },
  
  redo: () => {
    const { history, currentIndex } = get()
    
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1
      const action = history[newIndex]
      action.redo()
      
      set({
        currentIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < history.length - 1
      })
    }
  },
  
  clear: () => {
    set({
      history: [],
      currentIndex: -1,
      canUndo: false,
      canRedo: false
    })
  }
}))

// Keyboard shortcut hook
export function useUndoKeyboard() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        useUndoStore.getState().undo()
      }
      
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        useUndoStore.getState().redo()
      }
    }
    
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}

// Component to show undo/redo status
export function UndoRedoStatus() {
  const { canUndo, canRedo, undo, redo } = useUndoStore()
  
  useUndoKeyboard()
  
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={undo}
        disabled={!canUndo}
        className="px-2 py-1 text-sm rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Undo (Ctrl+Z)"
      >
        ↩️ Undo
      </button>
      
      <button
        onClick={redo}
        disabled={!canRedo}
        className="px-2 py-1 text-sm rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Redo (Ctrl+Y)"
      >
        Redo ↪️
      </button>
    </div>
  )
}
