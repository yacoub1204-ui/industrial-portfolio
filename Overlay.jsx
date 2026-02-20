// Overlay.jsx – UI HTML par-dessus la scène 3D
// Issu de overlay.js, branché sur le store Zustand

import usePortfolioStore from '../store'

// ─── Badge technologie ────────────────────────────────────────────────────────
function Tag({ children, color }) {
  return (
    <span
      className="px-3 py-1 text-xs rounded-full font-mono border"
      style={{
        background: color ? `${color}22` : 'rgba(97,218,251,0.1)',
        borderColor: color ? `${color}44` : 'rgba(97,218,251,0.2)',
        color: color || '#61DAFB',
      }}
    >
      {children}
    </span>
  )
}

// ─── Sidebar navigation ───────────────────────────────────────────────────────
export function Sidebar() {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 w-52 p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl text-white font-mono z-50 pointer-events-auto">
      <div className="text-lg font-bold mb-1 tracking-widest">
        ORBITAL<span style={{ color: '#61DAFB' }}>.STACK</span>
      </div>
      <p className="text-[10px] text-white/40 mb-5 tracking-wider">PORTFOLIO SPATIAL</p>

      <nav className="flex flex-col gap-3 text-sm">
        {['Accueil', 'Projets', 'À propos', 'Contact'].map(item => (
          <a
            key={item}
            className="text-white/60 hover:text-cyan-400 transition-colors cursor-pointer tracking-wider text-xs uppercase"
          >
            — {item}
          </a>
        ))}
      </nav>

      <div className="mt-6 pt-4 border-t border-white/10 text-[9px] text-white/30 tracking-wider">
        50 PROJETS EN ORBITE<br />
        CLIQUEZ UNE PLANÈTE
      </div>
    </div>
  )
}

// ─── Panneau projet sélectionné ───────────────────────────────────────────────
export function ProjectOverlay() {
  const { selectedProject, clearFocus } = usePortfolioStore()

  if (!selectedProject) return null

  const planetColor = selectedProject.color || '#61DAFB'

  return (
    <div className="fixed inset-0 flex items-start justify-end pointer-events-none z-50 p-6 pt-24">
      <div
        className="pointer-events-auto relative w-[380px] max-w-[90vw] p-6 rounded-2xl animate-fadeIn"
        style={{
          backdropFilter: 'blur(24px)',
          background: 'rgba(5, 8, 20, 0.75)',
          border: `1px solid ${planetColor}33`,
          boxShadow: `0 0 40px ${planetColor}22, 0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Bouton fermer */}
        <button
          onClick={clearFocus}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition font-mono text-sm"
        >
          ✕
        </button>

        {/* Indicateur couleur planète */}
        <div
          className="w-3 h-3 rounded-full mb-3"
          style={{ background: planetColor, boxShadow: `0 0 10px ${planetColor}` }}
        />

        <h2
          className="text-xl font-bold mb-2 font-mono tracking-wider"
          style={{ color: planetColor }}
        >
          {selectedProject.title}
        </h2>

        <p className="text-sm text-white/65 mb-5 leading-relaxed font-mono">
          {selectedProject.description}
        </p>

        {/* Badges tech */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(selectedProject.techs || []).map(tech => (
            <Tag key={tech} color={planetColor}>{tech}</Tag>
          ))}
        </div>

        {/* Lien projet */}
        {selectedProject.link && selectedProject.link !== '#' && (
          <a
            href={selectedProject.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono tracking-widest transition"
            style={{
              background: `${planetColor}22`,
              border: `1px solid ${planetColor}44`,
              color: planetColor,
            }}
          >
            VOIR LE PROJET →
          </a>
        )}

        {/* Si pas de vraies données */}
        {!selectedProject.hasRealData && (
          <p className="text-[10px] text-white/20 mt-3 font-mono">
            * Ajoute tes données dans src/data.js
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Bouton retour à la vue d'ensemble ────────────────────────────────────────
export function BackButton() {
  const { selectedProject, clearFocus } = usePortfolioStore()

  if (!selectedProject) return null

  return (
    <div className="fixed bottom-8 right-8 z-50 pointer-events-auto">
      <button
        onClick={clearFocus}
        className="px-6 py-3 rounded-full font-mono text-sm tracking-widest text-white transition-all hover:scale-105 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
        }}
      >
        🌌 Vue d'ensemble
      </button>
    </div>
  )
}
