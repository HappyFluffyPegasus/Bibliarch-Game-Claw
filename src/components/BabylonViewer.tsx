import { useEffect, useRef } from 'react'
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Color4 } from '@babylonjs/core'

interface BabylonViewerProps {
  width?: string
  height?: string
  backgroundColor?: string
  showGround?: boolean
}

export function BabylonViewer({ 
  width = '100%', 
  height = '400px',
  backgroundColor = '#0f172a',
  showGround = true 
}: BabylonViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const sceneRef = useRef<Scene | null>(null)
  
  useEffect(() => {
    if (!canvasRef.current) return
    
    // Create engine
    const engine = new Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true
    })
    engineRef.current = engine
    
    // Create scene
    const scene = new Scene(engine)
    sceneRef.current = scene
    
    // Set background color
    const color = Color3.FromHexString(backgroundColor)
    scene.clearColor = new Color4(color.r, color.g, color.b, 1)
    
    // Create camera
    const camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2.5,
      10,
      Vector3.Zero(),
      scene
    )
    camera.attachControl(canvasRef.current, true)
    camera.wheelPrecision = 50
    
    // Create light
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7
    
    // Create ground
    if (showGround) {
      const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene)
      const groundMaterial = new StandardMaterial('groundMat', scene)
      groundMaterial.diffuseColor = new Color3(0.2, 0.2, 0.3)
      groundMaterial.specularColor = new Color3(0.1, 0.1, 0.1)
      ground.material = groundMaterial
    }
    
    // Create a simple character placeholder (capsule)
    const character = MeshBuilder.CreateCapsule('character', { radius: 0.5, height: 2 }, scene)
    character.position.y = 1
    const charMaterial = new StandardMaterial('charMat', scene)
    charMaterial.diffuseColor = new Color3(0.4, 0.6, 1)
    character.material = charMaterial
    
    // Render loop
    engine.runRenderLoop(() => {
      scene.render()
    })
    
    // Handle resize
    const handleResize = () => {
      engine.resize()
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      scene.dispose()
      engine.dispose()
    }
  }, [backgroundColor, showGround])
  
  return (
    <canvas
      ref={canvasRef}
      style={{ width, height, outline: 'none', borderRadius: '8px' }}
      touch-action="none"
    />
  )
}
