import { useState } from 'react'
import { GlassCard } from './GlassCard'
import { Button } from './Button'
import { Download, Upload, FileJson } from 'lucide-react'
import { db } from '@/db/database'

export function DataExport() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  
  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      // Get all data from database
      const data = {
        stories: await db.stories.toArray(),
        characters: await db.characters.toArray(),
        locations: await db.locations.toArray(),
        worldEvents: await db.worldEvents.toArray(),
        exportDate: new Date().toISOString(),
        version: '2.0'
      }
      
      // Create blob and download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `bibliarch-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
    
    setIsExporting(false)
  }
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsImporting(true)
    
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      // Validate data structure
      if (!data.stories || !Array.isArray(data.stories)) {
        throw new Error('Invalid backup file')
      }
      
      // Import to database (would need proper merging logic in production)
      console.log('Import data:', data)
      alert('Import preview: Check console for data. Full import would merge with existing data.')
      
    } catch (error) {
      console.error('Import failed:', error)
      alert('Import failed. Invalid file format.')
    }
    
    setIsImporting(false)
  }
  
  return (
    <GlassCard className="p-6">
      <h3 className="font-medium mb-4">Data Backup & Restore</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-5 h-5 text-primary" />
            <div>
              <div className="font-medium">Export All Data</div>
              <div className="text-sm text-muted-foreground">Download a complete backup of your stories</div>
            </div>
          </div>
          
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="mt-2"
          >
            {isExporting ? 'Exporting...' : 'Export to JSON'}
          </Button>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Upload className="w-5 h-5 text-primary" />
            <div>
              <div className="font-medium">Import Data</div>
              <div className="text-sm text-muted-foreground">Restore from a previous backup</div>
            </div>
          </div>
          
          <label className="mt-2 inline-block">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button variant="outline" disabled={isImporting} as="span">
              <FileJson className="w-4 h-4 mr-2" />
              {isImporting ? 'Importing...' : 'Import from JSON'}
            </Button>
          </label>
        </div>
      </div>
    </GlassCard>
  )
}
