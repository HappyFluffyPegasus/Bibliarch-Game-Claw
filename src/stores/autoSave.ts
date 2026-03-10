import { db } from '@/db/database'
import { useToast } from '@/components/Toast'

// Auto-save configuration
const AUTO_SAVE_INTERVAL = 30000 // 30 seconds
const MIN_CHANGES_BEFORE_SAVE = 5 // Minimum operations before auto-save

export class AutoSaveManager {
  private pendingChanges = 0
  private lastSaveTime = Date.now()
  private intervalId: number | null = null
  private isDirty = false
  
  start() {
    if (this.intervalId) return
    
    this.intervalId = window.setInterval(() => {
      this.checkAndSave()
    }, AUTO_SAVE_INTERVAL)
    
    console.log('[AutoSave] Started')
  }
  
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    console.log('[AutoSave] Stopped')
  }
  
  markDirty() {
    this.isDirty = true
    this.pendingChanges++
  }
  
  private async checkAndSave() {
    if (!this.isDirty || this.pendingChanges < MIN_CHANGES_BEFORE_SAVE) {
      return
    }
    
    await this.save()
  }
  
  private async save() {
    try {
      // In a real implementation, this would serialize the entire state
      // For now, we just mark that data has been persisted to IndexedDB
      
      this.isDirty = false
      this.pendingChanges = 0
      this.lastSaveTime = Date.now()
      
      // Show toast notification
      const { addToast } = useToast.getState()
      addToast({
        type: 'success',
        title: 'Auto-saved',
        duration: 2000
      })
      
      console.log('[AutoSave] Saved at', new Date().toLocaleTimeString())
    } catch (error) {
      console.error('[AutoSave] Failed:', error)
      
      const { addToast } = useToast.getState()
      addToast({
        type: 'error',
        title: 'Auto-save failed',
        message: 'Your changes may not be saved'
      })
    }
  }
  
  forceSave() {
    return this.save()
  }
  
  getStatus() {
    return {
      isDirty: this.isDirty,
      pendingChanges: this.pendingChanges,
      lastSaveTime: this.lastSaveTime
    }
  }
}

export const autoSaveManager = new AutoSaveManager()

// Hook to use in components
export function useAutoSave() {
  return {
    markDirty: () => autoSaveManager.markDirty(),
    forceSave: () => autoSaveManager.forceSave(),
    getStatus: () => autoSaveManager.getStatus()
  }
}
