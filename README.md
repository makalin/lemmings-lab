# 🧠 Lemmings Lab

Welcome to **Lemmings Lab**, a collection of experimental lemmings-style games built using JavaScript, WebGL, and modern browser technologies.

This monorepo serves as a sandbox to prototype and explore variations of the classic Lemmings gameplay — from 2D HTML5 versions to 3D, voxel-based, and physics-driven interpretations.

---

## 🎮 Games

| Project | Description |
|---------|-------------|
| [`lemmings3d`](lemmings3d) | A simple 3D Lemmings-style demo using Three.js, featuring cube characters walking on a platform. |
| `lemmings2d` | A classic 2D side-scrolling version made with HTML5 Canvas (WIP). |
| `lemmings-voxel` | Experimental destructible terrain with physics and AI pathfinding (planned). |

---

## 📂 Structure

```

lemmings-lab/
├── lemmings-3d/
├── lemmings-2d/
├── lemmings-voxel/
└── assets/
└── logo.png (optional)

```

Each game is self-contained and can be run in a browser. Just open the `index.html` file inside any game folder.

---

## 🚀 Roadmap

- [x] Create minimal 3D walking prototype
- [ ] Add "dig", "build", and "block" roles
- [ ] Implement terrain interaction
- [ ] Add animated 3D models (GLTF)
- [ ] Build a level editor for custom maps
- [ ] Add touch & mobile support
- [ ] Export builds to WebAssembly

---

## 🛠 Tech Stack

- HTML5, JavaScript
- [Three.js](https://threejs.org/) for 3D rendering
- Canvas API (for 2D versions)
- WebGL / GLSL (future graphics enhancements)
- Physics engines like [Matter.js](https://brm.io/matter-js/) or [Ammo.js](https://kripken.github.io/ammo.js/)

---

## 🤝 Contributing

Feel free to fork, improve, or suggest features. Each game folder contains its own README and setup instructions.

## 🌍 Translations

- [Türkçe](README.tr.md) - Turkish translation

## 📜 License

MIT License — free to use, modify, and build upon.

---

Created with ❤️ for experimentation and nostalgia.
```
