// App.jsx – Point d'entrée qui assemble les 3 programmes
//
// ARCHITECTURE :
// ┌─────────────────────────────────────────────┐
// │              App.jsx                        │
// │  ┌──────────────────────────────────────┐   │
// │  │         Scene.jsx (Canvas R3F)       │   │  ← scene.js adapté
// │  │  • 50 planètes en orbite             │   │
// │  │  • OrbitalCore (project.js) au       │   │
// │  │    centre (remplace le simple soleil)│   │
// │  │  • CameraManager branché sur store   │   │
// │  │  • Post-processing de project.js     │   │
// │  └──────────────────────────────────────┘   │
// │                                             │
// │  ┌────────────┐  ┌─────────────────────┐   │
// │  │ Sidebar    │  │  ProjectOverlay      │   │  ← overlay.js adapté
// │  │ (gauche)   │  │  (droite, si projet) │   │
// │  └────────────┘  └─────────────────────┘   │
// │                                             │
// │  ┌──────────────────────────────────────┐   │
// │  │  BackButton (bas-droite, si projet)  │   │
// │  └──────────────────────────────────────┘   │
// │                                             │
// │  État partagé : Zustand store (store.js)    │
// └─────────────────────────────────────────────┘

import { Suspense } from 'react'
import Scene from './components/Scene'
import { Sidebar, ProjectOverlay, BackButton } from './components/Overlay'

// ─── Écran de chargement ──────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        fontFamily: "'Courier New', monospace",
        zIndex: 9999,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.3em', color: '#fff' }}>
        ORBITAL<span style={{ color: '#61DAFB' }}>.STACK</span>
      </div>
      <div
        style={{
          width: 200,
          height: 2,
          background: '#111',
          border: '1px solid #333',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '60%',
            background: '#61DAFB',
            boxShadow: '0 0 12px #61DAFB',
            animation: 'load 1s infinite alternate ease-in-out',
          }}
        />
      </div>
      <span style={{ color: '#61DAFB', fontSize: 11, letterSpacing: '0.25em' }}>
        INITIALISATION...
      </span>
      <style>{`
        @keyframes load {
          from { width: 20%; }
          to   { width: 85%; }
        }
      `}</style>
    </div>
  )
}

// ─── App racine ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#000' }}>

      {/* ① Scène 3D : toute la zone visible */}
      <Suspense fallback={<LoadingScreen />}>
        <Scene />
      </Suspense>

      {/* ② UI HTML par-dessus (pointer-events désactivés sur le conteneur,
           réactivés ponctuellement sur chaque composant interactif) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50 }}>

        {/* Titre en haut à gauche */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 220,  // décalé pour la sidebar
            fontFamily: "'Courier New', monospace",
            pointerEvents: 'none',
          }}
        >
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '0.3em',
            color: '#fff',
            textShadow: '0 0 20px rgba(97,218,251,0.4)',
          }}>
            ORBITAL<span style={{ color: '#61DAFB' }}>.STACK</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', marginTop: 4 }}>
            50 PROJETS EN ORBITE · CLIQUEZ UNE PLANÈTE
          </div>
        </div>

        {/* Sidebar gauche */}
        <Sidebar />

        {/* Panneau projet sélectionné (droite) */}
        <ProjectOverlay />

        {/* Bouton retour (bas droite) */}
        <BackButton />

      </div>
    </div>
  )
}
