import { useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/Button'
import { Download, Globe } from 'lucide-react'

const exportFormats = [
  { id: 'web', name: 'Web (HTML)', description: 'Play in browser', icon: Globe },
  { id: 'desktop', name: 'Desktop App', description: 'Windows/Mac/Linux', icon: Download },
]

export function ExportPublishPage() {
  const [selectedFormat, setSelectedFormat] = useState('web')
  const [isExporting, setIsExporting] = useState(false)
  
  const handleExport = async () => {
    setIsExporting(true)
    await new Promise(r => setTimeout(r, 2000))
    setIsExporting(false)
    alert('Export complete! (Demo)')
  }
  
  return (
    <div className="max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Export & Publish</h1>
        <p className="text-muted-foreground">Share your story with the world</p>
      </header>
      
      <GlassCard className="p-6 mb-4">
        <h3 className="font-medium mb-4">Choose Format</h3>
        
        <div className="space-y-3">
          {exportFormats.map(fmt => (
            <button
              key={fmt.id}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedFormat === fmt.id
                  ? 'border-primary bg-primary/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
              onClick={() => setSelectedFormat(fmt.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <fmt.icon className="w-5 h-5" />
                </div>
                
                <div>
                  <div className="font-medium">{fmt.name}</div>
                  <div className="text-sm text-muted-foreground">{fmt.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </GlassCard>
      
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Ready to export?</h3>
            <p className="text-sm text-muted-foreground">Your story will be packaged for {selectedFormat === 'web' ? 'web deployment' : 'desktop'}</p>
          </div>
          
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Exporting...' : (<><Download className="w-4 h-4 mr-2" /> Export</>)}
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}
