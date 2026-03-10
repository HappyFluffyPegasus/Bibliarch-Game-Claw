import { GlassCard } from './GlassCard'

interface ShortcutCategory {
  name: string
  shortcuts: { key: string; description: string }[]
}

const SHORTCUTS: ShortcutCategory[] = [
  {
    name: 'Navigation',
    shortcuts: [
      { key: 'Cmd/Ctrl + K', description: 'Open Command Palette' },
      { key: 'Esc', description: 'Close modal/dialog' },
      { key: '?', description: 'Show keyboard shortcuts' }
    ]
  },
  {
    name: 'Editing',
    shortcuts: [
      { key: 'Cmd/Ctrl + Z', description: 'Undo' },
      { key: 'Cmd/Ctrl + Y', description: 'Redo' },
      { key: 'Cmd/Ctrl + S', description: 'Save (auto-save enabled)' }
    ]
  },
  {
    name: 'Life Mode',
    shortcuts: [
      { key: 'Space', description: 'Play/Pause simulation' },
      { key: '→', description: 'Speed up time' },
      { key: '←', description: 'Slow down time' }
    ]
  }
]

export function KeyboardShortcuts({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <GlassCard className="w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          {SHORTCUTS.map(category => (
            <div key={category.name}>
              <h3 className="font-medium text-muted-foreground mb-3">{category.name}</h3>
              
              <div className="space-y-2">
                {category.shortcuts.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between py-2"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs bg-white/10 rounded font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground mt-6 text-center">
          Press ? anytime to show this reference
        </p>
      </GlassCard>
    </div>
  )
}
