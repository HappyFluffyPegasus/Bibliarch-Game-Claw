import { useEffect, useRef } from 'react'
import { 
  Engine, 
  Scene, 
  ArcRotateCamera, 
  Vector3, 
  HemisphericLight,
  DirectionalLight,
  MeshBuilder, 
  StandardMaterial, 
  Color3, 
  Color4,
  ShadowGenerator,
  Mesh,
  Animation
} from '@babylonjs/core'
import '@babylonjs/loaders'

interface BabylonViewerProps {
  width?: string
  height?: string
  backgroundColor?: string
  showGround?: boolean
  characterColor?: string
  hairColor?: string
  eyeColor?: string
  skinTone?: string
  animate?: boolean
}

export function BabylonViewer({ 
  width = '100%', 
  height = '400px',
  backgroundColor = '#0f172a',
  showGround = true,
  characterColor = '#60a5fa',
  hairColor = '#1a1a1a',
  eyeColor = '#4a4a4a',
  skinTone = '#d4a574',
  animate = true
}: BabylonViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const sceneRef = useRef<Scene | null>(null)
  const characterRef = useRef<Mesh | null>(null)
  
  useEffect(() => {
    if (!canvasRef.current) return
    
    // Create engine
    const engine = new Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true
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
      8,
      new Vector3(0, 1, 0),
      scene
    )
    camera.attachControl(canvasRef.current, true)
    camera.wheelPrecision = 50
    camera.lowerRadiusLimit = 3
    camera.upperRadiusLimit = 20
    
    // Create lights
    const hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene)
    hemiLight.intensity = 0.6
    
    const dirLight = new DirectionalLight('dirLight', new Vector3(-1, -2, -1), scene)
    dirLight.position = new Vector3(20, 40, 20)
    dirLight.intensity = 0.8
    
    // Shadow generator
    const shadowGenerator = new ShadowGenerator(1024, dirLight)
    shadowGenerator.useBlurExponentialShadowMap = true
    shadowGenerator.blurKernel = 32
    
    // Create ground
    if (showGround) {
      const ground = MeshBuilder.CreateGround('ground', { width: 15, height: 15 }, scene)
      const groundMaterial = new StandardMaterial('groundMat', scene)
      groundMaterial.diffuseColor = new Color3(0.15, 0.15, 0.2)
      groundMaterial.specularColor = new Color3(0.1, 0.1, 0.1)
      ground.material = groundMaterial
      ground.receiveShadows = true
    }
    
    // Create character group
    const character = new Mesh('character', scene)
    characterRef.current = character
    
    // Body (capsule)
    const body = MeshBuilder.CreateCapsule('body', { 
      radius: 0.35, 
      height: 1.8,
      tessellation: 16
    }, scene)
    body.position.y = 0.9
    const bodyMaterial = new StandardMaterial('bodyMat', scene)
    bodyMaterial.diffuseColor = Color3.FromHexString(characterColor)
    bodyMaterial.specularColor = new Color3(0.2, 0.2, 0.2)
    body.material = bodyMaterial
    body.parent = character
    shadowGenerator.addShadowCaster(body)
    
    // Head (sphere)
    const head = MeshBuilder.CreateSphere('head', { 
      diameter: 0.6,
      segments: 16
    }, scene)
    head.position.y = 2.1
    const headMaterial = new StandardMaterial('headMat', scene)
    headMaterial.diffuseColor = Color3.FromHexString(skinTone)
    headMaterial.specularColor = new Color3(0.1, 0.1, 0.1)
    head.material = headMaterial
    head.parent = character
    shadowGenerator.addShadowCaster(head)
    
    // Hair (sphere on top)
    const hair = MeshBuilder.CreateSphere('hair', { 
      diameter: 0.65,
      segments: 16
    }, scene)
    hair.position.y = 2.25
    hair.scaling.y = 0.6
    const hairMaterial = new StandardMaterial('hairMat', scene)
    hairMaterial.diffuseColor = Color3.FromHexString(hairColor)
    hair.material = hairMaterial
    hair.parent = character
    shadowGenerator.addShadowCaster(hair)
    
    // Eyes
    const leftEye = MeshBuilder.CreateSphere('leftEye', { diameter: 0.08 }, scene)
    leftEye.position = new Vector3(-0.12, 2.15, 0.25)
    const eyeMaterial = new StandardMaterial('eyeMat', scene)
    eyeMaterial.diffuseColor = Color3.FromHexString(eyeColor)
    eyeMaterial.emissiveColor = Color3.FromHexString(eyeColor).scale(0.3)
    leftEye.material = eyeMaterial
    leftEye.parent = character
    
    const rightEye = MeshBuilder.CreateSphere('rightEye', { diameter: 0.08 }, scene)
    rightEye.position = new Vector3(0.12, 2.15, 0.25)
    rightEye.material = eyeMaterial
    rightEye.parent = character
    
    // Arms
    const leftArm = MeshBuilder.CreateCapsule('leftArm', { 
      radius: 0.1, 
      height: 1.2 
    }, scene)
    leftArm.position = new Vector3(-0.5, 1.2, 0)
    leftArm.rotation.z = Math.PI / 8
    leftArm.material = bodyMaterial
    leftArm.parent = character
    shadowGenerator.addShadowCaster(leftArm)
    
    const rightArm = MeshBuilder.CreateCapsule('rightArm', { 
      radius: 0.1, 
      height: 1.2 
    }, scene)
    rightArm.position = new Vector3(0.5, 1.2, 0)
    rightArm.rotation.z = -Math.PI / 8
    rightArm.material = bodyMaterial
    rightArm.parent = character
    shadowGenerator.addShadowCaster(rightArm)
    
    // Legs
    const leftLeg = MeshBuilder.CreateCapsule('leftLeg', { 
      radius: 0.12, 
      height: 1.4 
    }, scene)
    leftLeg.position = new Vector3(-0.2, 0.7, 0)
    leftLeg.material = bodyMaterial
    leftLeg.parent = character
    shadowGenerator.addShadowCaster(leftLeg)
    
    const rightLeg = MeshBuilder.CreateCapsule('rightLeg', { 
      radius: 0.12, 
      height: 1.4 
    }, scene)
    rightLeg.position = new Vector3(0.2, 0.7, 0)
    rightLeg.material = bodyMaterial
    rightLeg.parent = character
    shadowGenerator.addShadowCaster(rightLeg)
    
    // Idle animation
    if (animate) {
      const frameRate = 30
      
      // Breathing animation (scale body slightly)
      const breatheAnim = new Animation(
        'breathe',
        'scaling.y',
        frameRate,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE
      )
      
      const breatheKeys = [
        { frame: 0, value: 1 },
        { frame: 30, value: 1.02 },
        { frame: 60, value: 1 }
      ]
      breatheAnim.setKeys(breatheKeys)
      body.animations.push(breatheAnim)
      
      // Subtle rotation
      const rotateAnim = new Animation(
        'rotate',
        'rotation.y',
        frameRate,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE
      )
      
      const rotateKeys = [
        { frame: 0, value: 0 },
        { frame: 120, value: Math.PI * 2 }
      ]
      rotateAnim.setKeys(rotateKeys)
      character.animations.push(rotateAnim)
      
      scene.beginAnimation(body, 0, 60, true)
      scene.beginAnimation(character, 0, 120, true, 0.1)
    }
    
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
  }, [backgroundColor, showGround, characterColor, hairColor, eyeColor, skinTone, animate])
  
  return (
    <canvas
      ref={canvasRef}
      style={{ width, height, outline: 'none', borderRadius: '8px' }}
      touch-action="none"
    />
  )
}
