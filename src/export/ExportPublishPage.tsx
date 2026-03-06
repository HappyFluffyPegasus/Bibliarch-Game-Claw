import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, FileJson, FileImage, FileCode, Package,
  Check, Copy, ExternalLink, Settings, ChevronDown,
  Gamepad2, Globe, Smartphone, Monitor
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

interface ExportFormat {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  extension: string;
  options: ExportOption[];
}

interface ExportOption {
  id: string;
  label: string;
  type: 'checkbox' | 'select' | 'number';
  defaultValue: any;
  options?: { value: string; label: string }[];
}

const exportFormats: ExportFormat[] = [
  {
    id: 'json',
    name: 'JSON Data',
    icon: <FileJson className="w-5 h-5" />,
    description: 'Raw story data for integration',
    extension: 'json',
    options: [
      { id: 'pretty', label: 'Pretty print', type: 'checkbox', defaultValue: true },
      { id: 'includeMetadata', label: 'Include metadata', type: 'checkbox', defaultValue: true },
    ]
  },
  {
    id: 'html',
    name: 'HTML Story',
    icon: <FileCode className="w-5 h-5" />,
    description: 'Standalone playable story',
    extension: 'html',
    options: [
      { id: 'theme', label: 'Theme', type: 'select', defaultValue: 'dark', options: [
        { value: 'dark', label: 'Dark' },
        { value: 'light', label: 'Light' },
        { value: 'colorful', label: 'Colorful' },
      ]},
      { id: 'autoplay', label: 'Autoplay audio', type: 'checkbox', defaultValue: false },
    ]
  },
  {
    id: 'images',
    name: 'Image Assets',
    icon: <FileImage className="w-5 h-5" />,
    description: 'Export all story images',
    extension: 'zip',
    options: [
      { id: 'quality', label: 'Quality', type: 'select', defaultValue: 'high', options: [
        { value: 'low', label: 'Low (72 DPI)' },
        { value: 'medium', label: 'Medium (150 DPI)' },
        { value: 'high', label: 'High (300 DPI)' },
      ]},
      { id: 'format', label: 'Format', type: 'select', defaultValue: 'png', options: [
        { value: 'png', label: 'PNG' },
        { value: 'jpg', label: 'JPEG' },
        { value: 'webp', label: 'WebP' },
      ]},
    ]
  },
  {
    id: 'unity',
    name: 'Unity Package',
    icon: <Gamepad2 className="w-5 h-5" />,
    description: 'Unity game engine import',
    extension: 'unitypackage',
    options: [
      { id: 'version', label: 'Unity Version', type: 'select', defaultValue: '2022', options: [
        { value: '2021', label: 'Unity 2021 LTS' },
        { value: '2022', label: 'Unity 2022 LTS' },
        { value: '2023', label: 'Unity 2023+' },
      ]},
    ]
  },
  {
    id: 'web',
    name: 'Web Build',
    icon: <Globe className="w-5 h-5" />,
    description: 'Deploy to web hosting',
    extension: 'zip',
    options: [
      { id: 'optimize', label: 'Optimize assets', type: 'checkbox', defaultValue: true },
      { id: 'pwa', label: 'Enable PWA', type: 'checkbox', defaultValue: true },
    ]
  },
];

const platforms = [
  { id: 'desktop', name: 'Desktop', icon: Monitor, formats: ['json', 'html', 'images', 'unity'] },
  { id: 'mobile', name: 'Mobile', icon: Smartphone, formats: ['json', 'html', 'web'] },
  { id: 'web', name: 'Web', icon: Globe, formats: ['html', 'web', 'json'] },
];

export function ExportPublishPage() {
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [selectedPlatform, setSelectedPlatform] = useState('desktop');
  const [exportOptions, setExportOptions] = useState<Record<string, any>>({});
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [completedExport, setCompletedExport] = useState<string | null>(null);

  const currentFormat = exportFormats.find(f => f.id === selectedFormat);
  const currentPlatform = platforms.find(p => p.id === selectedPlatform);

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate export progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setExportProgress(i);
    }
    
    setIsExporting(false);
    setCompletedExport(currentFormat?.name || '');
    
    // Auto-clear success message after 3 seconds
    setTimeout(() => setCompletedExport(null), 3000);
  };

  const updateOption = (optionId: string, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [selectedFormat]: {
        ...prev[selectedFormat],
        [optionId]: value
      }
    }));
  };

  const getOptionValue = (option: ExportOption) => {
    return exportOptions[selectedFormat]?.[option.id] ?? option.defaultValue;
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Left Panel - Platform & Format Selection */}
      <div className="w-80 border-r border-border bg-card/50 flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold mb-2">Export & Publish</h1>
          <p className="text-sm text-muted-foreground">Package your story for distribution</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Platform Selection */}
          <div className="p-4">
            <h3 className="text-sm font-medium mb-3">Target Platform</h3>
            <div className="space-y-2">
              {platforms.map(platform => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.id}
                    onClick={() => {
                      setSelectedPlatform(platform.id);
                      // Reset format if not supported on new platform
                      if (!platform.formats.includes(selectedFormat)) {
                        setSelectedFormat(platform.formats[0]);
                      }
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                      selectedPlatform === platform.id
                        ? "border-primary bg-primary/10"
                        : "border-transparent hover:border-border"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1 text-left font-medium">{platform.name}</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      selectedPlatform === platform.id && "rotate-180"
                    )} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format Selection */}
          <div className="p-4">
            <h3 className="text-sm font-medium mb-3">Export Format</h3>
            <div className="space-y-2">
              {exportFormats
                .filter(format => currentPlatform?.formats.includes(format.id))
                .map(format => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={cn(
                      "w-full p-3 rounded-xl border-2 transition-all text-left",
                      selectedFormat === format.id
                        ? "border-primary bg-primary/10"
                        : "border-transparent hover:border-border"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div className={cn(
                        "p-2 rounded-lg",
                        selectedFormat === format.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        {format.icon}
                      </div>
                      <span className="font-medium">{format.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">.{format.extension}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{format.description}</p>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFormat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlassCard className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-primary/10 rounded-2xl">
                      {currentFormat?.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{currentFormat?.name}</h2>
                      <p className="text-muted-foreground">{currentFormat?.description}</p>
                    </div>
                  </div>

                  {/* Export Options */}
                  <div className="space-y-6">
                    <h3 className="font-semibold">Export Options</h3>
                    
                    {currentFormat?.options.map(option => (
                      <div key={option.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                        <label className="font-medium">{option.label}</label>
                        
                        {option.type === 'checkbox' && (
                          <button
                            onClick={() => updateOption(option.id, !getOptionValue(option))}
                            className={cn(
                              "w-12 h-6 rounded-full transition-colors relative",
                              getOptionValue(option) ? "bg-primary" : "bg-muted-foreground/30"
                            )}
                          >
                            <div className={cn(
                              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                              getOptionValue(option) ? "left-7" : "left-1"
                            )} />
                          </button>
                        )}

                        {option.type === 'select' && option.options && (
                          <select
                            value={getOptionValue(option)}
                            onChange={(e) => updateOption(option.id, e.target.value)}
                            className="px-4 py-2 bg-background border border-input rounded-lg"
                          >
                            {option.options.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        )}

                        {option.type === 'number' && (
                          <input
                            type="number"
                            value={getOptionValue(option)}
                            onChange={(e) => updateOption(option.id, Number(e.target.value))}
                            className="w-24 px-4 py-2 bg-background border border-input rounded-lg text-right"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Export Preview */}
                  <div className="mt-8 p-4 bg-muted/50 rounded-xl">
                    <h4 className="text-sm font-medium mb-2">Export Preview</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>12 scenes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileImage className="w-4 h-4" />
                        <span>24 images</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileJson className="w-4 h-4" />
                        <span>~450 KB</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Export Button Bar */}
        <div className="p-6 border-t border-border bg-card/50">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isExporting && (
                <div className="flex items-center gap-3">
                  <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{exportProgress}%</span>
                </div>
              )}
              
              {completedExport && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-green-500"
                >
                  <Check className="w-5 h-5" />
                  <span>{completedExport} exported successfully!</span>
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button 
                className="flex items-center gap-2 px-4 py-2.5 hover:bg-accent rounded-xl transition-colors"
              >
                <Settings className="w-4 h-4" />
                Advanced
              </button>
              
              <button
                onClick={handleExport}
                disabled={isExporting}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all",
                  isExporting
                    ? "bg-muted cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Exporting...' : 'Export Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
