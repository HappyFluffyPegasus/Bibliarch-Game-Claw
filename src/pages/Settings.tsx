import { useAppStore } from '@/stores/appStore'
import { Volume2, Palette, Monitor, HelpCircle, Save } from 'lucide-react'

export function Settings() {
  const { settings, updateSettings } = useAppStore()
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-8">
        {/* Audio Settings */}
        <section className="p-6 bg-slate-900 rounded-xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Volume2 className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold">Audio</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white/60">Master Volume</label>
                <span>{settings.masterVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.masterVolume}
                onChange={(e) => updateSettings({ masterVolume: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white/60">Music Volume</label>
                <span>{settings.musicVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.musicVolume}
                onChange={(e) => updateSettings({ musicVolume: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white/60">SFX Volume</label>
                <span>{settings.sfxVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sfxVolume}
                onChange={(e) => updateSettings({ sfxVolume: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </section>
        
        {/* Graphics Settings */}
        <section className="p-6 bg-slate-900 rounded-xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold">Graphics</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/60 mb-2">Graphics Quality</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((quality) => (
                  <button
                    key={quality}
                    onClick={() => updateSettings({ graphicsQuality: quality })}
                    className={`flex-1 py-2 rounded capitalize ${
                      settings.graphicsQuality === quality
                        ? 'bg-purple-600'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Theme Settings */}
        <section className="p-6 bg-slate-900 rounded-xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/60 mb-2">Theme</label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={`flex-1 py-2 rounded flex items-center justify-center gap-2 ${
                    settings.theme === 'dark'
                      ? 'bg-purple-600'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span>🌙</span> Dark
                </button>
                <button
                  onClick={() => updateSettings({ theme: 'light' })}
                  className={`flex-1 py-2 rounded flex items-center justify-center gap-2 ${
                    settings.theme === 'light'
                      ? 'bg-purple-600'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span>☀️</span> Light
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* General Settings */}
        <section className="p-6 bg-slate-900 rounded-xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Save className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold">General</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block">Auto-save</label>
                <p className="text-sm text-white/50">Automatically save your work</p>
              </div>
              <button
                onClick={() => updateSettings({ autoSave: !settings.autoSave })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.autoSave ? 'bg-purple-600' : 'bg-white/20'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                  style={{ marginTop: '2px' }}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="block">Show Tutorials</label>
                <p className="text-sm text-white/50">Display helpful tips and guides</p>
              </div>
              <button
                onClick={() => updateSettings({ showTutorials: !settings.showTutorials })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.showTutorials ? 'bg-purple-600' : 'bg-white/20'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.showTutorials ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                  style={{ marginTop: '2px' }}
                />
              </button>
            </div>
          </div>
        </section>
        
        {/* About */}
        <section className="p-6 bg-slate-900 rounded-xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold">About</h2>
          </div>
          
          <div className="text-white/60">
            <p>Bibliarch v2.0 - Story Creation Platform</p>
            <p className="text-sm mt-2">Built with React, TypeScript, and Babylon.js</p>
          </div>
        </section>
      </div>
    </div>
  )
}
