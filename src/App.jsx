import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import GlockModel from './components/GlockModel'
import './App.css'

// Pfad zur .glb-Datei relativ zu /public
const MODEL_PATH = '/models/G45_ExplodedAnim.glb'

export default function App() {
  // Das Modell enthält genau eine Animation (die Explosionsdarstellung),
  // deshalb wird sie hier als Ganzes über Play/Reverse/Pause/Reset gesteuert
  // statt über einzelne benannte Clips.
  const [playState, setPlayState] = useState('idle') // 'idle' | 'playing' | 'reverse' | 'paused'
  const [resetNonce, setResetNonce] = useState(0)

  const handleReset = () => {
    setResetNonce((n) => n + 1)
    setPlayState('idle')
  }

  return (
    <div className="viewer-layout">
      <Canvas camera={{ position: [0, 0.3, 1.2], fov: 40 }} shadows>
        {/* Weißer Studio-Hintergrund statt transparent/dunkel */}
        <color attach="background" args={['#ffffff']} />

        {/* Klassisches Dreipunkt-Studiolicht */}
        <ambientLight intensity={0.35} />
        {/* Key Light: Haupt-Lichtquelle, wirft die sichtbaren Schatten */}
        <directionalLight position={[3, 5, 2]} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} />
        {/* Fill Light: hellt die Schattenseite sanft auf, ohne harte Schatten */}
        <directionalLight position={[-4, 2, 1.5]} intensity={0.6} />
        {/* Rim/Back Light: setzt Lichtkanten und trennt das Modell vom Hintergrund */}
        <directionalLight position={[0, 2, -4]} intensity={0.9} />

        <Suspense
          fallback={
            <Html center>
              <span style={{ color: '#333', fontFamily: 'sans-serif' }}>Lade Modell…</span>
            </Html>
          }
        >
          <GlockModel
            modelPath={MODEL_PATH}
            playState={playState}
            resetNonce={resetNonce}
            onFinished={() => setPlayState('paused')}
          />
          {/* Environment liefert nur die Reflexionen/IBL, nicht den sichtbaren Hintergrund */}
          <Environment preset="studio" background={false} />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={0.4} maxDistance={3} />
      </Canvas>

      <div className="hotspot-panel">
        <h1>Glock Viewer</h1>
        <p>Explosionsanimation steuern:</p>
        <div className="hotspot-buttons">
          <button
            className={playState === 'playing' ? 'active' : ''}
            onClick={() => setPlayState('playing')}
            disabled={playState === 'playing'}
          >
            ▶ Abspielen
          </button>
          <button
            className={playState === 'reverse' ? 'active' : ''}
            onClick={() => setPlayState('reverse')}
            disabled={playState === 'reverse'}
          >
            ◀ Rückwärts
          </button>
          <button
            onClick={() => setPlayState('paused')}
            disabled={playState !== 'playing' && playState !== 'reverse'}
          >
            ⏸ Pause
          </button>
          <button className="reset" onClick={handleReset}>
            ⟲ Zurücksetzen
          </button>
        </div>
      </div>
    </div>
  )
}
