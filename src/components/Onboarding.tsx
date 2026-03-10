import { useState } from 'react'
import { GlassCard } from './GlassCard'
import { Button } from './Button'

const steps = [
  {
    title: "Welcome to Bibliarch",
    description: "Create stories with living characters that evolve over time.",
    icon: "📚"
  },
  {
    title: "Build Your World",
    description: "Create locations from continents to buildings with our hierarchical system.",
    icon: "🌍"
  },
  {
    title: "Create Characters",
    description: "Design characters with personalities, memories, and relationships.",
    icon: "👤"
  },
  {
    title: "Watch Them Live",
    description: "Life Mode lets you watch characters interact and create emergent stories.",
    icon: "✨"
  }
]

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md p-8 text-center">
        <div className="text-6xl mb-4">{steps[step].icon}</div>
        
        <h2 className="text-2xl font-bold mb-2">{steps[step].title}</h2>
        <p className="text-muted-foreground mb-6">{steps[step].description}</p>
        
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i === step ? 'bg-primary' : 'bg-white/20'}`}
            />
          ))}
        </div>
        
        <div className="flex justify-between">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
          ) : (
            <div />
          )}
          
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          ) : (
            <Button onClick={onComplete}>Get Started</Button>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
