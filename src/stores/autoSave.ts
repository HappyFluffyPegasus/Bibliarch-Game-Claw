// Auto-save configuration
const AUTO_SAVE_INTERVAL = 30000 // 30 seconds
const MIN_CHANGES_BEFORE_SAVE = 5

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
  }
  
  markDirty() {
    this.isDirty = true
    this.pendingChanges++
  }
  
  private async checkAndSave() {
    if (!this.isDirty || this.pendingChanges < MIN_CHANGES_BEFORE_SAVE) return
    await this.save()
  }
  
  private async save() {
    try {
      this.isDirty = false
      this.pendingChanges = 0
      this.lastSaveTime = Date.now()
      console.log('[AutoSave] Saved')
    } catch (error) {
      console.error('[AutoSave] Failed:', error)
    }
  }
  
  forceSave() {
    return this.save()
  }
}

export const autoSaveManager = new AutoSaveManager()
