import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/Button'
import { Moon, Sun, Volume2, Monitor } from 'lucide-react'

export function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </header>
      
      <div className="space-y-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              
              <div>
                <h3 className="font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">Dark mode is always on</p>
              </div>
            </div>
            
            <Button variant="outline" size="sm" disabled>Dark</Button>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              
              <div>
                <h3 className="font-medium">Audio</h3>
                <p className="text-sm text-muted-foreground">Sound effects and music</p>
              </div>
            </div>
            
            <Button variant="outline" size="sm">On</Button>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Monitor className="w-5 h-5" />
              </div>
              
              <div>
                <h3 className="font-medium">Graphics</h3>
                <p className="text-sm text-muted-foreground">Visual quality settings</p>
              </div>
            </div>
            
            <Button variant="outline" size="sm">High</Button>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
