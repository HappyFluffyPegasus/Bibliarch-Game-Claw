import { useEffect, useRef } from 'react'
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Color4 } from '@babylonjs/core'

interface BabylonViewerProps {
  modelUrl?: string
  className?: string
}

export function BabylonViewer({ modelUrl, className }: BabylonViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)
  
  useEffect(() => {
    if (!canvasRef.current) return
    
    const engine = new Engine(canvasRef.current, true)
    engineRef.current = engine
    
    const scene = new Scene(engine)
    scene.clearColor = new Color4(0.05, 0.05, 0.1, 1)
    
    // Camera
    const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), scene)
    camera.attachControl(canvasRef.current, true)
    camera.wheelPrecision = 50
    
    // Light
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7
    
    // Ground
    const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene)
    const groundMat = new StandardMaterial('groundMat', scene)
    groundMat.diffuseColor = new Color3(0.2, 0.2, 0.3)
    ground.material = groundMat
    
    // Character placeholder
    const box = MeshBuilder.CreateBox('character', { size: 2 }, scene)
    box.position.y = 1
    const boxMat = new StandardMaterial('boxMat', scene)
    boxMat.diffuseColor = new Color3(0.4, 0.6, 1)
    box.material = boxMat
    
    // Animation loop
    engine.runRenderLoop(() => {
      scene.render()
    })
    
    // Resize
    const handleResize = () => engine.resize()
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      scene.dispose()
      engine.dispose()
    }
  }, [modelUrl])
  
  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', outline: 'none' }}
    />
  )
}
