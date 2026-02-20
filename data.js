import * as THREE from 'three'

// ─── Données partagées entre Scene et Overlay ─────────────────────────────────
// Modifie cette liste pour ajouter tes vrais projets
export const PROJECTS_DATA = [
  {
    id: 1,
    title: 'Gyroscopic Stabilizer',
    description: 'Système de stabilisation utilisant l\'effet gyroscopique pour réduire le roulis d\'un bateau en temps réel.',
    techs: ['Three.js', 'React', 'Arduino'],
    link: 'https://github.com/ton-repo',
  },
  {
    id: 2,
    title: 'Portfolio Spatial',
    description: 'Portfolio interactif en 3D avec système solaire, animation de caméra et effets de post-traitement.',
    techs: ['React', 'Three.js', 'GSAP', 'R3F'],
    link: 'https://github.com/ton-repo',
  },
  {
    id: 3,
    title: 'Orbital Dashboard',
    description: 'Tableau de bord industriel avec visualisation de données en temps réel et interface cyberpunk.',
    techs: ['React', 'WebGL', 'GLSL', 'WebSockets'],
    link: 'https://github.com/ton-repo',
  },
  // Ajoute autant de projets que tu veux ici
  // { id: 4, title: '...', description: '...', techs: [...], link: '...' },
]

// ─── Génération des 50 planètes avec les vraies données quand dispo ──────────
export const generatePlanets = () => {
  const count = 50
  return Array.from({ length: count }, (_, i) => {
    const radius = 6 + i * 0.4
    const speed = 0.3 / Math.sqrt(radius)
    const projectData = PROJECTS_DATA[i] || null

    return {
      id: i + 1,
      // Utilise les données du projet si disponible, sinon placeholder
      title: projectData?.title || `Projet ${i + 1}`,
      description: projectData?.description || `Description du projet ${i + 1}. Cliquez pour en savoir plus.`,
      techs: projectData?.techs || ['React', 'Node.js'],
      link: projectData?.link || '#',
      hasRealData: !!projectData,
      // Propriétés 3D
      color: new THREE.Color().setHSL(i / count, 0.8, 0.6).getStyle(),
      size: 0.8 + Math.sin(i) * 0.3,
      orbitRadius: radius,
      speed: speed * (0.8 + (Math.sin(i * 7.3) * 0.5 + 0.5) * 0.4),
      inclination: Math.sin(i * 0.5) * 0.4,
    }
  })
}
