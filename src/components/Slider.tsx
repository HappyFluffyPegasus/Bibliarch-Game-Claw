interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  description?: string
}

export function Slider({ label, value, min, max, step = 0.01, onChange, description }: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-medium text-white/80">{label}</label>
        <span className="text-sm text-white/50 font-mono">{Math.round(value * 100)}%</span>
      </div>
      
      {description && (
        <p className="text-xs text-white/40">{description}</p>
      )}
      
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
    </div>
  )
}

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label className="font-medium text-white/80">{label}</label>
      
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white/10"
        />
        
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-white/5 rounded-lg border border-white/10 text-sm font-mono uppercase"
        />
      </div>
    </div>
  )
}
