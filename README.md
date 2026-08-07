# Glock Viewer

3D-Viewer für ein Glock-Modell mit interaktiven Animations-Buttons, gebaut mit React + Three.js (react-three-fiber + drei).

## Setup

1. Node.js 18+ installieren (falls noch nicht vorhanden)
2. Im Projektordner, Terminal öffnen (z. B. VS Code Terminal) und ausführen:
   ```
   npm install
   npm run dev
   ```
3. Browser öffnet unter http://localhost:5173

## Modell einbinden

Lege deine `.glb`-Datei hier ab:
```
public/models/glock.glb
```
Der Pfad ist in `src/App.jsx` als `MODEL_PATH` hinterlegt — bei anderem Dateinamen dort anpassen.

## Animationen an Buttons anpassen

Die Buttons im `HOTSPOTS`-Array (`src/App.jsx`) rufen Animationen über ihren Clip-Namen auf. Passe die `animation`-Werte an die tatsächlichen Clip-Namen deiner .glb-Datei an (z. B. wie in Blender benannt/exportiert). Clip-Namen kannst du zur Not in der Browser-Konsole ausgeben: `console.log(names)` im `useAnimations`-Hook in `GlockModel.jsx`.

## Build für Deployment

```
npm run build
```
Ergebnis liegt in `dist/` und kann auf jedem statischen Hoster (Vercel, Netlify, GitHub Pages) deployed werden.
