import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, User, Palette, Bell, Shield, Database,
  Download, Upload, Trash2, Moon, Sun, Globe,
  Keyboard, ChevronRight, Save
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

interface SettingsSection {
  id: string;
  name: string;
  icon: typeof Settings;
  description: string;
}

const settingsSections: SettingsSection[] = [
  { id: 'account', name: 'Account', icon: User, description: 'Manage your profile' },
  { id: 'appearance', name: 'Appearance', icon: Palette, description: 'Themes and display' },
  { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Email and push settings' },
  { id: 'privacy', name: 'Privacy', icon: Shield, description: 'Data sharing' },
  { id: 'data', name: 'Data Management', icon: Database, description: 'Export and backup' },
  { id: 'shortcuts', name: 'Keyboard Shortcuts', icon: Keyboard, description: 'Hotkeys' },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [language, setLanguage] = useState('en');
  const [compactMode, setCompactMode] = useState(false);

  const exportData = () => {
    const data = {
      stories: [],
      characters: [],
      settings: { theme, language },
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bibliarch-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="h-screen flex bg-background">
      <div className="w-72 border-r border-border bg-card/50">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </h2>
        </div>

        <div className="p-2">
          <div className="space-y-1">
            {settingsSections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors",
                    activeSection === section.id ? "bg-primary/10 text-primary" : "hover:bg-accent"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-medium">{section.name}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl">
          {activeSection === 'account' && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-6">Account Settings</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-3xl">👤</div>
                  <div>
                    <p className="font-medium">Storyteller</p>
                    <p className="text-sm text-muted-foreground">storyteller@example.com</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Display Name</label>
                    <input type="text" defaultValue="Storyteller" className="w-full px-3 py-2 bg-background border border-input rounded-lg" />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Bio</label>
                    <textarea defaultValue="Creating worlds..." className="w-full px-3 py-2 bg-background border border-input rounded-lg min-h-[100px]" />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </GlassCard>
          )}

          {activeSection === 'appearance' && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-6">Appearance</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'light', icon: Sun, label: 'Light' },
                      { id: 'dark', icon: Moon, label: 'Dark' },
                      { id: 'system', icon: Globe, label: 'System' },
                    ].map(({ id, icon: Icon, label }) => (
                      <button
                        key={id}
                        onClick={() => setTheme(id as any)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                          theme === id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                        )}
                      >
                        <Icon className="w-6 h-6" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-3 py-2 bg-background border border-input rounded-lg">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Compact Mode</p>
                    <p className="text-sm text-muted-foreground">Reduce padding and spacing</p>
                  </div>
                  
                  <button
                    onClick={() => setCompactMode(!compactMode)}
                    className={cn("w-12 h-6 rounded-full transition-colors relative", compactMode ? "bg-primary" : "bg-muted-foreground/30")}
                  >
                    <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", compactMode ? "left-7" : "left-1")} />
                  </button>
                </div>
              </div>
            </GlassCard>
          )}

          {activeSection === 'data' && (
            <>
              <GlassCard className="p-6 mb-6">
                <h3 className="text-lg font-semibold mb-6">Data Management</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <Download className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Export Data</p>
                        <p className="text-sm text-muted-foreground">Download all your stories</p>
                      </div>
                    </div>
                    
                    <button onClick={exportData} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Export</button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Upload className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Import Data</p>
                        <p className="text-sm text-muted-foreground">Restore from backup</p>
                      </div>
                    </div>
                    
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Import</button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium">Delete All Data</p>
                        <p className="text-sm text-muted-foreground">Permanently remove everything</p>
                      </div>
                    </div>
                    
                    <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg">Delete</button>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Storage Usage</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Stories</span>
                      <span className="text-muted-foreground">45 MB</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Assets</span>
                      <span className="text-muted-foreground">128 MB</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Total: 185 MB used of 1 GB</p>
                </div>
              </GlassCard>
            </>
          )}

          {activeSection === 'shortcuts' && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-6">Keyboard Shortcuts</h3>
              
              <div className="space-y-4">
                {[
                  { action: 'Quick Save', keys: ['Ctrl', 'S'] },
                  { action: 'Undo', keys: ['Ctrl', 'Z'] },
                  { action: 'Redo', keys: ['Ctrl', 'Y'] },
                  { action: 'New Note', keys: ['Ctrl', 'N'] },
                  { action: 'Command Palette', keys: ['Ctrl', 'K'] },
                  { action: 'Search', keys: ['Ctrl', 'F'] },
                ].map(({ action, keys }) => (
                  <div key={action} className="flex items-center justify-between py-2">
                    <span>{action}</span>
                    <div className="flex items-center gap-1">
                      {keys.map((key, i) => (
                        <span key={key} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">{key}</kbd>
                          {i < keys.length - 1 && <span className="text-muted-foreground">+</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
