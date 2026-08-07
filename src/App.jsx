import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import GlockModel from './components/GlockModel'
import './App.css'

// Pfad zur .glb-Datei relativ zu /public
const MODEL_PATH = '/models/glock.glb'

// Passe Label + animation an die tatsächlichen Clip-Namen deiner .glb-Datei an
// (z. B. sichtbar in Blender unter der Animation-Timeline / Action-Namen)
const HOTSPOTS = [
  { id: 'slide-rack', label: 'Verschluss betätigen', animation: 'SlideRack' },
  { id: 'magazine-eject', label: 'Magazin auswerfen', animation: 'MagazineEject' },
  { id: 'trigger-pull', label: 'Abzug betätigen', animation: 'TriggerPull' },
  { id: 'disassembly', label: 'Zerlegen', animation: 'Disassembly' },
]

export default function App() {
  const [activeAnimation, setActiveAnimation] = useState(null)

  return (
    <div className="viewer-layout">
      <Canvas camera={{ position: [0, 0.3, 1.2], fov: 40 }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} castShadow />
        <Suspense fallback={<Html center>Lade Modell…</Html>}>
          <GlockModel modelPath={MODEL_PATH} activeAnimation={activeAnimation} />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={0.4} maxDistance={3} />
      </Canvas>

      <div className="hotspot-panel">
        <h1>Glock Viewer</h1>
        <p>Animation auswählen:</p>
        <div className="hotspot-buttons">
          {HOTSPOTS.map((hotspot) => (
            <button
              key={hotspot.id}
              className={activeAnimation === hotspot.animation ? 'active' : ''}
              onClick={() => setActiveAnimation(hotspot.animation)}
            >
              {hotspot.label}
            </button>
          ))}
          <button className="reset" onClick={() => setActiveAnimation(null)}>
            Zurücksetzen
          </button>
        </div>
      </div>
    </div>
  )
}
