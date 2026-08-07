import { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

// Lädt das .glb-Modell und spielt die per Prop übergebene Animation ab.
// activeAnimation muss dem Namen eines Animation-Clips in der .glb-Datei entsprechen.
export default function GlockModel({ modelPath, activeAnimation, ...props }) {
  const group = useRef()
  const { scene, animations } = useGLTF(modelPath)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (!activeAnimation || !actions[activeAnimation]) return

    // andere laufende Animationen sauber ausblenden
    Object.entries(actions).forEach(([name, action]) => {
      if (name !== activeAnimation) action?.fadeOut(0.3)
    })

    const action = actions[activeAnimation]
    action.reset().fadeIn(0.3).play()
  }, [activeAnimation, actions])

  return <primitive ref={group} object={scene} {...props} />
}
