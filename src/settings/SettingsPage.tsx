import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, User, Palette, Bell, Shield, Database,
  Keyboard, Globe, Moon, Sun, Laptop, ChevronRight,
  Save, RefreshCw, Trash2, AlertTriangle, Check
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

type SettingsTab = 'general' | 'appearance' | 'notifications' | 'privacy' | 'shortcuts' | 'data';

interface SettingItem {
  id: string;
  label: string;
  description?: string;
  type: 'toggle' | 'select' | 'button' | 'danger';
  value?: boolean | string;
  options?: { value: string; label: string }[];
}

const settingsSections: Record<SettingsTab, SettingItem[]> = {
  general: [
    { id: 'language', label: 'Language', type: 'select', value: 'en', options: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Español' },
      { value: 'fr', label: 'Français' },
      { value: 'de', label: 'Deutsch' },
      { value: 'ja', label: '日本語' },
    ]},
    { id: 'autosave', label: 'Auto-save', description: 'Automatically save your work every 30 seconds', type: 'toggle', value: true },
    { id: 'spellcheck', label: 'Spell check', description: 'Check spelling while you type', type: 'toggle', value: true },
  ],
  appearance: [
    { id: 'theme', label: 'Theme', type: 'select', value: 'system', options: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'system', label: 'System' },
    ]},
    { id: 'animations', label: 'Animations', description: 'Enable smooth animations throughout the app', type: 'toggle', value: true },
    { id: 'glassmorphism', label: 'Glassmorphism', description: 'Enable frosted glass effects', type: 'toggle', value: true },
    { id: 'compactMode', label: 'Compact mode', description: 'Reduce spacing for more content', type: 'toggle', value: false },
  ],
  notifications: [
    { id: 'emailNotifications', label: 'Email notifications', description: 'Receive updates via email', type: 'toggle', value: true },
    { id: 'achievementNotifications', label: 'Achievement alerts', description: 'Show popups when unlocking achievements', type: 'toggle', value: true },
    { id: 'collaborationAlerts', label: 'Collaboration alerts', description: 'Notify when collaborators make changes', type: 'toggle', value: true },
    { id: 'reminders', label: 'Writing reminders', description: 'Daily reminders to write', type: 'toggle', value: false },
  ],
  privacy: [
    { id: 'publicProfile', label: 'Public profile', description: 'Make your profile visible to others', type: 'toggle', value: false },
    { id: 'shareAnalytics', label: 'Share analytics', description: 'Help improve the app by sharing usage data', type: 'toggle', value: true },
    { id: 'twoFactor', label: 'Two-factor authentication', type: 'button' },
  ],
  shortcuts: [
    { id: 'saveShortcut', label: 'Save', type: 'button' },
    { id: 'undoShortcut', label: 'Undo', type: 'button' },
    { id: 'redoShortcut', label: 'Redo', type: 'button' },
    { id: 'searchShortcut', label: 'Search', type: 'button' },
    { id: 'commandPalette', label: 'Command Palette', type: 'button' },
  ],
  data: [
    { id: 'exportData', label: 'Export all data', description: 'Download a copy of all your stories', type: 'button' },
    { id: 'importData', label: 'Import data', description: 'Import stories from a backup file', type: 'button' },
    { id: 'clearCache', label: 'Clear cache', description: 'Free up space by clearing temporary files', type: 'button' },
    { id: 'deleteAccount', label: 'Delete account', description: 'Permanently delete your account and all data', type: 'danger' },
  ],
};

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [settings, setSettings] = useState<Record<string, any>>({
    language: 'en',
    autosave: true,
    spellcheck: true,
    theme: 'system',
    animations: true,
    glassmorphism: true,
    compactMode: false,
    emailNotifications: true,
    achievementNotifications: true,
    collaborationAlerts: true,
    reminders: false,
    publicProfile: false,
    shareAnalytics: true,
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (id: string) => {
    setSettings(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSelect = (id: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'general' as SettingsTab, label: 'General', icon: Settings },
    { id: 'appearance' as SettingsTab, label: 'Appearance', icon: Palette },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'privacy' as SettingsTab, label: 'Privacy', icon: Shield },
    { id: 'shortcuts' as SettingsTab, label: 'Shortcuts', icon: Keyboard },
    { id: 'data' as SettingsTab, label: 'Data', icon: Database },
  ];

  return (
    <div className="h-screen flex bg-background">
      <div className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Customize your experience</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{tab.label}</span>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform",
                    activeTab === tab.id && "rotate-90"
                  )} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">Story Creator</p>
              <p className="text-xs text-muted-foreground truncate">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6 capitalize">{activeTab} Settings</h2>

              <GlassCard className="divide-y divide-border">
                {settingsSections[activeTab].map((setting, index) => (
                  <div 
                    key={setting.id}
                    className="flex items-center justify-between p-6"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{setting.label}</p>
                      {setting.description && (
                        <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
                      )}
                    </div>

                    <div className="ml-4">
                      {setting.type === 'toggle' && (
                        <button
                          onClick={() => handleToggle(setting.id)}
                          className={cn(
                            "w-12 h-6 rounded-full transition-colors relative",
                            settings[setting.id] ? "bg-primary" : "bg-muted-foreground/30"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                            settings[setting.id] ? "left-7" : "left-1"
                          )} />
                        </button>
                      )}

                      {setting.type === 'select' && setting.options && (
                        <select
                          value={settings[setting.id]}
                          onChange={(e) => handleSelect(setting.id, e.target.value)}
                          className="px-4 py-2 bg-background border border-input rounded-lg"
                        >
                          {setting.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      )}

                      {setting.type === 'button' && (
                        <button className="px-4 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors">
                          Configure
                        </button>
                      )}

                      {setting.type === 'danger' && (
                        <button className="px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </GlassCard>
            </motion.div>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-card/50">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>Changes are automatically saved</span>
            </div>

            <button
              onClick={handleSave}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all",
                saved 
                  ? "bg-green-500 text-white" 
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
