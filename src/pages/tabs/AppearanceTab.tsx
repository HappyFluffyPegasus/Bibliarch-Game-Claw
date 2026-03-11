import { useCharacterStore } from '../../stores/characterStore'
import { Slider } from '../../components/Slider'
import { ColorPicker } from '../../components/ColorPicker'

interface AppearanceTabProps {
  morphTargets: string[]
}

export function AppearanceTab({ morphTargets }: AppearanceTabProps) {
  const { character, updateAppearance } = useCharacterStore()
  
  if (!character) return null
  
  const { appearance } = character
  
  return (
    <div className="space-y-8 max-w-2xl">
      {/* Colors Section */}
      <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-500"></span>
          Colors
        </h3>
        
        <div className="grid grid-cols-3 gap-6">
          <ColorPicker
            label="Skin Tone"
            value={appearance.skinTone}
            onChange={(color) => updateAppearance('skinTone', color)}
          />
          
          <ColorPicker
            label="Hair Color"
            value={appearance.hairColor}
            onChange={(color) => updateAppearance('hairColor', color)}
          />
          
          <ColorPicker
            label="Eye Color"
            value={appearance.eyeColor}
            onChange={(color) => updateAppearance('eyeColor', color)}
          />
        </div>
      </section>
      
      {/* Body Shape Section */}
      <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Body Shape
        </h3>
        
        <div className="space-y-6">
          <Slider
            label="Height"
            value={appearance.height}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => updateAppearance('height', value)}
            description="Adjust character height"
          />
          
          <Slider
            label="Weight"
            value={appearance.weight}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => updateAppearance('weight', value)}
            description="Adjust body mass"
          />
          
          <Slider
            label="Muscle Definition"
            value={appearance.muscle}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => updateAppearance('muscle', value)}
            description="Adjust muscle visibility"
          />
        </div>
      </section>
      
      {/* Face Shape Section */}
      <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          Face Shape
        </h3>
        
        <div className="space-y-6">
          <Slider
            label="Face Shape"
            value={appearance.faceShape}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => updateAppearance('faceShape', value)}
            description="Adjust overall face structure"
          />
          
          <Slider
            label="Eye Size"
            value={appearance.eyeSize}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => updateAppearance('eyeSize', value)}
            description="Adjust eye size"
          />
          
          <Slider
            label="Eye Spacing"
            value={appearance.eyeSpacing}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => updateAppearance('eyeSpacing', value)}
            description="Adjust distance between eyes"
          />
          
          <Slider
            label="Nose Size"
            value={appearance.noseSize}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => updateAppearance('noseSize', value)}
            description="Adjust nose size"
          />
          
          <Slider
            label="Mouth Size"
            value={appearance.mouthSize}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => updateAppearance('mouthSize', value)}
            description="Adjust mouth and lip size"
          />
        </div>
      </section>
      
      {/* Additional Morph Targets (if any found in model) */}
      {morphTargets.length > 0 && (
        <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Model Shape Keys ({morphTargets.length} found)
          </h3>
          
          <div className="space-y-4">
            {morphTargets.map((morph) => (
              <div key={morph} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm">{morph}</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  defaultValue="0"
                  className="w-32"
                  onChange={(e) => {
                    // This would need to be connected to the viewer ref
                    console.log(`${morph}: ${e.target.value}`)
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
