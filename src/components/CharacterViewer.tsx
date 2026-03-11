import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { 
  Engine, 
  Scene, 
  ArcRotateCamera, 
  Vector3, 
  HemisphericLight,
  DirectionalLight,
  Color4,
  ShadowGenerator,
  SceneLoader,
  AbstractMesh,
  AnimationGroup,
  MorphTargetManager,
  StandardMaterial,
  Color3,
  Mesh
} from '@babylonjs/core'
import '@babylonjs/loaders/glTF'
import type { Character } from '../types/character'

interface CharacterViewerProps {
  character: Character | null
  width?: string
  height?: string
  onLoad?: () => void
  onError?: (error: string) => void
}

export interface CharacterViewerRef {
  playAnimation: (name: string) => void
  setMorphTarget: (name: string, value: number) => void
  getMorphTargets: () => string[]
  getAnimations: () => string[]
}

export const CharacterViewer = forwardRef<CharacterViewerRef, CharacterViewerProps>(
  ({ character, width = '100%', height = '600px', onLoad, onError }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const engineRef = useRef<Engine | null>(null)
    const sceneRef = useRef<Scene | null>(null)
    const characterRootRef = useRef<AbstractMesh | null>(null)
    const animationGroupsRef = useRef<AnimationGroup[]>([])
    const morphTargetManagersRef = useRef<Map<string, MorphTargetManager>>(new Map())
    const currentAnimationRef = useRef<AnimationGroup | null>(null)
    const materialsRef = useRef<Map<string, StandardMaterial>>(new Map())
    
    // Initialize Babylon
    useEffect(() => {
      if (!canvasRef.current) return
      
      const init = async () => {
        try {
          // Create engine
          const engine = new Engine(canvasRef.current, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            antialias: true,
            adaptToDeviceRatio: true
          })
          engineRef.current = engine
          
          // Create scene
          const scene = new Scene(engine)
          sceneRef.current = scene
          
          // Transparent background
          scene.clearColor = new Color4(0, 0, 0, 0)
          
          // Camera
          const camera = new ArcRotateCamera(
            'camera',
            -Math.PI / 2,
            Math.PI / 2.5,
            3,
            new Vector3(0, 1, 0),
            scene
          )
          camera.attachControl(canvasRef.current, true)
          camera.wheelPrecision = 50
          camera.lowerRadiusLimit = 1.5
          camera.upperRadiusLimit = 6
          camera.minZ = 0.1
          
          // Lights
          const hemiLight = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene)
          hemiLight.intensity = 0.6
          hemiLight.groundColor = new Color3(0.2, 0.2, 0.2)
          
          const dirLight = new DirectionalLight('dir', new Vector3(-1, -2, -1), scene)
          dirLight.position = new Vector3(20, 40, 20)
          dirLight.intensity = 0.8
          
          // Shadows
          const shadowGenerator = new ShadowGenerator(2048, dirLight)
          shadowGenerator.useBlurExponentialShadowMap = true
          shadowGenerator.blurKernel = 32
          shadowGenerator.bias = 0.0001
          
          // Load the GLB model
          const modelUrl = '/models/Bibliarch Maybe.glb'
          
          SceneLoader.ImportMeshAsync('', '', modelUrl, scene, undefined, '.glb')
            .then((result) => {
              const root = result.meshes[0]
              characterRootRef.current = root
              
              // Position character
              root.position.y = 0
              
              // Collect animation groups
              animationGroupsRef.current = result.animationGroups
              
              // Process meshes
              result.meshes.forEach((mesh) => {
                if (mesh instanceof Mesh) {
                  // Enable shadows
                  shadowGenerator.addShadowCaster(mesh)
                  
                  // Collect morph target managers
                  if (mesh.morphTargetManager) {
                    morphTargetManagersRef.current.set(mesh.name, mesh.morphTargetManager)
                  }
                  
                  // Collect materials for color changing
                  if (mesh.material && mesh.material instanceof StandardMaterial) {
                    materialsRef.current.set(mesh.name, mesh.material)
                  }
                }
              })
              
              // Play idle animation if exists
              const idleAnim = result.animationGroups.find(ag => 
                ag.name.toLowerCase().includes('idle')
              )
              if (idleAnim) {
                currentAnimationRef.current = idleAnim
                idleAnim.play(true)
              } else if (result.animationGroups.length > 0) {
                currentAnimationRef.current = result.animationGroups[0]
                result.animationGroups[0].play(true)
              }
              
              onLoad?.()
            })
            .catch((error: Error) => {
              console.error('Failed to load model:', error)
              onError?.(error.message)
            })
          
          // Render loop
          engine.runRenderLoop(() => {
            scene.render()
          })
          
          // Resize handler
          const handleResize = () => {
            engine.resize()
          }
          window.addEventListener('resize', handleResize)
          
          return () => {
            window.removeEventListener('resize', handleResize)
          }
        } catch (error) {
          console.error('Failed to initialize Babylon:', error)
          onError?.(error instanceof Error ? error.message : 'Unknown error')
        }
      }
      
      init()
      
      return () => {
        sceneRef.current?.dispose()
        engineRef.current?.dispose()
      }
    }, [])
    
    // Update character appearance
    useEffect(() => {
      if (!character || !characterRootRef.current) return
      
      // Update morph targets based on appearance
      const { appearance } = character
      
      // Height/weight (if shape keys exist)
      morphTargetManagersRef.current.forEach((manager, _meshName) => {
        // Try to find matching morph targets
        for (let i = 0; i < manager.numTargets; i++) {
          const target = manager.getTarget(i)
          const targetName = target.name.toLowerCase()
          
          if (targetName.includes('height') || targetName.includes('tall')) {
            target.influence = appearance.height
          } else if (targetName.includes('weight') || targetName.includes('fat')) {
            target.influence = appearance.weight
          } else if (targetName.includes('muscle')) {
            target.influence = appearance.muscle
          } else if (targetName.includes('face')) {
            target.influence = appearance.faceShape
          }
        }
      })
      
      // Update colors
      materialsRef.current.forEach((material, meshName) => {
        const name = meshName.toLowerCase()
        
        if (name.includes('skin') || name.includes('body')) {
          material.diffuseColor = Color3.FromHexString(appearance.skinTone)
        } else if (name.includes('hair')) {
          material.diffuseColor = Color3.FromHexString(appearance.hairColor)
        } else if (name.includes('eye')) {
          material.diffuseColor = Color3.FromHexString(appearance.eyeColor)
        }
      })
      
    }, [character?.appearance])
    
    // Update animation
    useEffect(() => {
      if (!character || !characterRootRef.current) return
      
      const animName = character.currentAnimation
      const animGroup = animationGroupsRef.current.find(ag => 
        ag.name.toLowerCase().includes(animName.toLowerCase())
      )
      
      if (animGroup && animGroup !== currentAnimationRef.current) {
        currentAnimationRef.current?.stop()
        currentAnimationRef.current = animGroup
        animGroup.play(true)
      }
    }, [character?.currentAnimation])
    
    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      playAnimation: (name: string) => {
        const animGroup = animationGroupsRef.current.find(ag => 
          ag.name.toLowerCase().includes(name.toLowerCase())
        )
        
        if (animGroup) {
          currentAnimationRef.current?.stop()
          currentAnimationRef.current = animGroup
          animGroup.play(true)
        }
      },
      
      setMorphTarget: (name: string, value: number) => {
        morphTargetManagersRef.current.forEach((manager) => {
          for (let i = 0; i < manager.numTargets; i++) {
            const target = manager.getTarget(i)
            if (target.name.toLowerCase().includes(name.toLowerCase())) {
              target.influence = value
            }
          }
        })
      },
      
      getMorphTargets: () => {
        const targets: string[] = []
        morphTargetManagersRef.current.forEach((manager) => {
          for (let i = 0; i < manager.numTargets; i++) {
            targets.push(manager.getTarget(i).name)
          }
        })
        return targets
      },
      
      getAnimations: () => {
        return animationGroupsRef.current.map(ag => ag.name)
      }
    }))
    
    return (
      <canvas
        ref={canvasRef}
        style={{ 
          width, 
          height, 
          outline: 'none',
          borderRadius: '12px'
        }}
        touch-action="none"
      />
    )
  }
)

CharacterViewer.displayName = 'CharacterViewer'
