# 🌌 Portfolio Spatial — Guide d'installation

## Architecture (3 programmes → 1 application)

```
scene.js    ──►  src/components/Scene.jsx     (scène 3D, 50 planètes)
overlay.js  ──►  src/components/Overlay.jsx   (Sidebar + ProjectOverlay)
project.js  ──►  src/components/OrbitalCore.jsx (noyau central animé)

Pont entre eux : src/store.js (Zustand)
Données :        src/data.js  (tes projets)
```

## Ce qui a changé / pourquoi ça marche

| Problème | Solution |
|---|---|
| `scene.js` avait son propre `useState` pour `selectedProject` | → Remplacé par le store Zustand |
| `overlay.js` avait un `FakeScene` placeholder | → Remplacé par `Scene.jsx` |
| `project.js` était une app indépendante | → `OrbitalCore` extrait et inséré comme soleil central |
| Pas de lien entre les 3 fichiers | → `store.js` partage l'état entre tous |

## Installation

```bash
npm install
npm run dev
```

Ouvre http://localhost:5173

## Personnaliser tes projets

Édite **`src/data.js`** :

```js
export const PROJECTS_DATA = [
  {
    id: 1,
    title: 'Mon Super Projet',
    description: 'Description de mon projet...',
    techs: ['React', 'Three.js', 'Node.js'],
    link: 'https://github.com/mon-repo',
  },
  // Ajoute autant de projets que tu veux
  // Les planètes sans données affichent "Projet N" comme placeholder
]
```

## Dépendances requises

```
react / react-dom
@react-three/fiber
@react-three/drei
@react-three/postprocessing
three
gsap
zustand
```
