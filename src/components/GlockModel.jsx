import { useEffect, useMemo, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

// Der exportierte Clip enthält bei einzelnen Nodes (z. B. der Patrone) einen
// vereinzelten Keyframe weit in der Zukunft (t≈33s), obwohl die eigentliche
// Explosionsbewegung schon nach ~4.7s abgeschlossen ist – vermutlich ein
// Export-Artefakt. Das bläht die Clip-Dauer künstlich auf. Wir kappen jeden
// Track an der ersten großen Zeitlücke, damit die Animation endet, sobald das
// Modell tatsächlich fertig "aufgegangen" ist.
const GAP_THRESHOLD = 2 // Sekunden

function trimTrailingOutliers(clip) {
  const trimmedTracks = clip.tracks.map((track) => {
    const { times, values } = track
    let cutIndex = times.length
    for (let i = 1; i < times.length; i++) {
      if (times[i] - times[i - 1] > GAP_THRESHOLD) {
        cutIndex = i
        break
      }
    }
    if (cutIndex === times.length) return track.clone()

    const valueSize = track.getValueSize()
    const TrackType = track.constructor
    return new TrackType(
      track.name,
      times.slice(0, cutIndex),
      values.slice(0, cutIndex * valueSize),
      track.getInterpolation()
    )
  })

  // duration = -1 lässt THREE die tatsächliche Dauer aus den gekappten Tracks neu berechnen
  return new THREE.AnimationClip(clip.name, -1, trimmedTracks, clip.blendMode)
}

// Lädt das .glb-Modell und steuert die enthaltene Animation (aktuell ein
// einzelner Clip, die Explosionsdarstellung) über Play/Pause/Reset-Props.
export default function GlockModel({ modelPath, playState, resetNonce, onFinished, ...props }) {
  const group = useRef()
  const { scene, animations } = useGLTF(modelPath)
  const trimmedAnimations = useMemo(() => animations.map(trimTrailingOutliers), [animations])
  const { actions, names, mixer } = useAnimations(trimmedAnimations, group)

  // Einmalig beim Laden die echten Animations-Namen (und die bereinigte Dauer)
  // ausgeben. In der Browser-Konsole (F12) nachsehen, falls sich der Clip mal ändert.
  useEffect(() => {
    names.forEach((name) => {
      console.log(`Animation "${name}" – Dauer nach Trim: ${actions[name]?.getClip().duration.toFixed(2)}s`)
    })
  }, [names, actions])

  // Die Action einmalig konfigurieren: einmal abspielen und am Ende in der
  // Endpose (voll explodiert) halten, statt zu loopen oder zurückzuspringen.
  useEffect(() => {
    const action = actions[names[0]]
    if (!action) return
    action.clampWhenFinished = true
    action.loop = THREE.LoopOnce
  }, [actions, names])

  // Play / Reverse / Pause
  useEffect(() => {
    const action = actions[names[0]]
    if (!action) return

    if (playState === 'playing') {
      action.timeScale = 1
      action.paused = false
      action.play()
    } else if (playState === 'reverse') {
      action.timeScale = -1
      action.paused = false
      action.play()
    } else if (playState === 'paused') {
      action.paused = true
    }
  }, [playState, actions, names])

  // Reset: Animation zurück auf die Startpose (zusammengebaut), wartet auf
  // erneutes Abspielen.
  useEffect(() => {
    if (resetNonce === 0) return
    const action = actions[names[0]]
    if (!action) return
    action.reset()
    action.timeScale = 1
    action.paused = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetNonce])

  // Wenn die Animation am Ende angekommen ist, den Play-Button in der UI
  // wieder freigeben (statt in einem "playing"-Zustand hängen zu bleiben).
  useEffect(() => {
    if (!mixer || !onFinished) return
    const handleFinished = () => onFinished()
    mixer.addEventListener('finished', handleFinished)
    return () => mixer.removeEventListener('finished', handleFinished)
  }, [mixer, onFinished])

  return <primitive ref={group} object={scene} {...props} />
}
