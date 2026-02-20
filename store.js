import { create } from 'zustand'

// ─── Store global Zustand ─────────────────────────────────────────────────────
// Pont entre la scène 3D (Scene) et l'UI (Overlay)
const usePortfolioStore = create((set) => ({
  // Projet sélectionné (cliqué dans la scène)
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),
  clearProject: () => set({ selectedProject: null }),

  // Point de focus caméra (position 3D de la planète cliquée)
  focusPoint: null,
  setFocusPoint: (point) => set({ focusPoint: point }),
  clearFocus: () => set({ focusPoint: null, selectedProject: null }),

  // État hover (pour synchronisation si besoin)
  hoveredId: null,
  setHoveredId: (id) => set({ hoveredId: id }),
}))

export default usePortfolioStore
