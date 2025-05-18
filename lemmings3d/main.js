// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000033); // darker blue

// Skybox
const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
const skyboxMaterials = [
  new THREE.MeshBasicMaterial({ color: 0x000033, side: THREE.BackSide }), // right
  new THREE.MeshBasicMaterial({ color: 0x000033, side: THREE.BackSide }), // left
  new THREE.MeshBasicMaterial({ color: 0x000033, side: THREE.BackSide }), // top
  new THREE.MeshBasicMaterial({ color: 0x000033, side: THREE.BackSide }), // bottom
  new THREE.MeshBasicMaterial({ color: 0x000033, side: THREE.BackSide }), // front
  new THREE.MeshBasicMaterial({ color: 0x000033, side: THREE.BackSide })  // back
];
const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
scene.add(skybox);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Simple camera controls
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let cameraRotation = { x: 0, y: 0 };
let cameraDistance = 20;

document.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
    };

    cameraRotation.x += deltaMove.y * 0.01;
    cameraRotation.y += deltaMove.x * 0.01;

    // Limit vertical rotation
    cameraRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.x));

    previousMousePosition = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('wheel', (e) => {
    cameraDistance += e.deltaY * 0.01;
    cameraDistance = Math.max(5, Math.min(50, cameraDistance));
});

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Ground with hills
const groundGeometry = new THREE.PlaneGeometry(30, 30, 32, 32);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: false }); // vibrant green
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.5;
scene.add(ground);

// Add screen/window
const screenGeometry = new THREE.PlaneGeometry(10, 6);
const screenMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x000000,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x111111
});
const screen = new THREE.Mesh(screenGeometry, screenMaterial);
screen.position.set(0, 3, -10); // Position it at the back of the scene
screen.rotation.y = Math.PI; // Face towards the camera
scene.add(screen);

// Add screen frame
const frameGeometry = new THREE.BoxGeometry(10.2, 6.2, 0.2);
const frameMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x333333,
    metalness: 0.5,
    roughness: 0.5
});
const frame = new THREE.Mesh(frameGeometry, frameMaterial);
frame.position.set(0, 3, -10.1);
scene.add(frame);

// Add hills
for (let i = 0; i < 5; i++) {
  const hillGeometry = new THREE.SphereGeometry(2, 32, 32);
  const hillMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // vibrant green
  const hill = new THREE.Mesh(hillGeometry, hillMaterial);
  hill.position.set(Math.random() * 20 - 10, 0, Math.random() * 20 - 10);
  scene.add(hill);
}

// Obstacles
const obstacleGeometry = new THREE.BoxGeometry(2, 2, 2);
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xcd853f }); // lighter brown
const obstacle1 = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
obstacle1.position.set(-5, 0, 0);
scene.add(obstacle1);
const obstacle2 = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
obstacle2.position.set(5, 0, 0);
scene.add(obstacle2);

// Lemming model
const lemmings = [];
const lemmingGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
const lemmingMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff }); // magenta
const lemmingFaceGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.1);
const lemmingFaceMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // yellow
const lemmingFeetGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.2);
const lemmingFeetMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff }); // cyan

function spawnLemming(x, z) {
  const lemming = new THREE.Group();
  const body = new THREE.Mesh(lemmingGeometry, lemmingMaterial);
  const face = new THREE.Mesh(lemmingFaceGeometry, lemmingFaceMaterial);
  face.position.set(0, 0.2, 0.25);
  const feet = new THREE.Mesh(lemmingFeetGeometry, lemmingFeetMaterial);
  feet.position.set(0, -0.5, 0);
  lemming.add(body);
  lemming.add(face);
  lemming.add(feet);
  lemming.position.set(x, 0.5, z);
  lemming.userData = { direction: 1, behavior: 'walk' }; // 1 or -1 (walk direction)
  scene.add(lemming);
  lemmings.push(lemming);
}

// Spawn multiple lemmings
spawnLemming(-10, 0);
spawnLemming(-10, 2);
spawnLemming(-10, -2);

// UI Overlay for behavior selection
const uiDiv = document.createElement('div');
uiDiv.style.position = 'absolute';
uiDiv.style.top = '10px';
uiDiv.style.left = '10px';
uiDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
uiDiv.style.color = 'white';
uiDiv.style.padding = '10px';
uiDiv.style.borderRadius = '5px';
uiDiv.innerHTML = 'Click on a lemming to assign behavior: <br>Walk, Dig, Build, Block';
document.body.appendChild(uiDiv);

// Raycaster for lemming selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(lemmings, true);
  if (intersects.length > 0) {
    const lemming = intersects[0].object.parent;
    const behaviors = ['walk', 'dig', 'build', 'block'];
    const currentIndex = behaviors.indexOf(lemming.userData.behavior);
    lemming.userData.behavior = behaviors[(currentIndex + 1) % behaviors.length];
    console.log('Lemming behavior set to:', lemming.userData.behavior);
  }
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update camera position based on rotation and distance
  camera.position.x = Math.sin(cameraRotation.y) * Math.cos(cameraRotation.x) * cameraDistance;
  camera.position.y = Math.sin(cameraRotation.x) * cameraDistance;
  camera.position.z = Math.cos(cameraRotation.y) * Math.cos(cameraRotation.x) * cameraDistance;
  camera.lookAt(0, 0, 0);

  for (const lem of lemmings) {
    switch (lem.userData.behavior) {
      case 'walk':
        lem.position.x += 0.02 * lem.userData.direction;
        if (lem.position.x > 14 || lem.position.x < -14) {
          lem.userData.direction *= -1;
        }
        break;
      case 'dig':
        lem.position.y -= 0.01;
        if (lem.position.y < -5) lem.position.y = -5;
        break;
      case 'build':
        lem.position.y += 0.01;
        if (lem.position.y > 5) lem.position.y = 5;
        break;
      case 'block':
        // Do nothing, lemming blocks
        break;
    }
  }

  renderer.render(scene, camera);
}

// Start animation loop
animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
