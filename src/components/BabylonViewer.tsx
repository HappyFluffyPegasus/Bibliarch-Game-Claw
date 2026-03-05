import { useEffect, useRef } from 'react';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Color4, SceneLoader, Mesh, AbstractMesh, AnimationGroup, MorphTargetManager, NodeMaterial } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

interface BabylonViewerProps {
  modelUrl?: string;
  onSceneReady?: (scene: Scene) => void;
  onRender?: (scene: Scene) => void;
}

export function BabylonViewer({ modelUrl, onSceneReady, onRender }: BabylonViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });
    engineRef.current = engine;

    const scene = new Scene(engine);
    sceneRef.current = scene;
    scene.clearColor = new Color4(0.05, 0.07, 0.13, 1); // Dark background matching theme

    // Camera
    const camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2.5,
      5,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 50;
    camera.minZ = 0.1;
    camera.maxZ = 100;

    // Lighting
    const hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.6;

    // Toon shader setup (basic version)
    // In production, load NodeMaterial from JSON

    // Load model if provided
    if (modelUrl) {
      SceneLoader.ImportMeshAsync('', modelUrl, '', scene).then((result) => {
        const root = result.meshes[0];
        root.position = Vector3.Zero();
        
        // Apply toon material to all meshes
        result.meshes.forEach((mesh) => {
          if (mesh instanceof Mesh && mesh.material) {
            // Store reference for later customization
          }
        });
      });
    }

    // Default ground for reference
    // const ground = MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);

    onSceneReady?.(scene);

    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
      onRender?.(scene);
    });

    // Resize handling
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [modelUrl]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full outline-none"
      style={{ touchAction: 'none' }}
    />
  );
}