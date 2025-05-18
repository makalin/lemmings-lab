# 🧠 Lemmings Lab

**Lemmings Lab**'e hoş geldiniz. Bu, JavaScript, WebGL ve modern tarayıcı teknolojileri kullanılarak oluşturulmuş deneysel lemmings tarzı oyunlar koleksiyonudur.

Bu monorepo, klasik Lemmings oyununun çeşitli versiyonlarını prototiplemek ve keşfetmek için bir kum havuzu görevi görür — 2D HTML5 versiyonlarından 3D, voxel tabanlı ve fizik tabanlı yorumlara kadar.

---

## 🎮 Oyunlar

| Proje | Açıklama |
|---------|-------------|
| [`lemmings3d`](lemmings3d) | Three.js kullanılarak yapılmış, küp karakterlerin bir platform üzerinde yürüdüğü basit bir 3D Lemmings tarzı demo. |
| `lemmings2d` | HTML5 Canvas ile yapılmış klasik 2D yan kaydırmalı versiyon (Yapım aşamasında). |
| `lemmings-voxel` | Fizik ve AI yol bulma özellikli deneysel yıkılabilir arazi (Planlanıyor). |

---

## 📂 Yapı

```

lemmings-lab/
├── lemmings-3d/
├── lemmings-2d/
├── lemmings-voxel/
└── assets/
└── logo.png (opsiyonel)

```

Her oyun bağımsızdır ve bir tarayıcıda çalıştırılabilir. Sadece herhangi bir oyun klasörünün içindeki `index.html` dosyasını açın.

---

## 🚀 Yol Haritası

- [x] Minimal 3D yürüme prototipi oluştur
- [ ] "Kazma", "inşa et" ve "engelle" rollerini ekle
- [ ] Arazi etkileşimini uygula
- [ ] Animasyonlu 3D modeller ekle (GLTF)
- [ ] Özel haritalar için bir seviye editörü oluştur
- [ ] Dokunmatik ve mobil desteği ekle
- [ ] WebAssembly'ye derleme desteği ekle

---

## 🛠 Teknoloji Yığını

- HTML5, JavaScript
- 3D render için [Three.js](https://threejs.org/)
- Canvas API (2D versiyonlar için)
- WebGL / GLSL (gelecekteki grafik geliştirmeleri için)
- [Matter.js](https://brm.io/matter-js/) veya [Ammo.js](https://kripken.github.io/ammo.js/) gibi fizik motorları

---

## 🤝 Katkıda Bulunma

Fork yapmaktan, geliştirmekten veya özellik önermekten çekinmeyin. Her oyun klasörü kendi README ve kurulum talimatlarını içerir.

## 🌍 Çeviriler

- [English](README.md) - Original English version

## 📜 Lisans

MIT Lisansı — kullanım, değiştirme ve üzerine inşa etme özgürlüğü.

---

Deney ve nostalji için ❤️ ile oluşturuldu.
```
