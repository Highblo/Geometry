import * as THREE from "three";
import { WireframeGeometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(1, 1, 4);

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

//ジオメトリ
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 16);
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 15, 100, Math.PI * 2);
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.3, 0.1, 150, 15);
const particlesGeometry = new THREE.BufferGeometry();

//パーティクル
const count = 5000;
const positionArray = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

//マテリアル
const material = new THREE.MeshNormalMaterial();
const standardMaterial = new THREE.MeshStandardMaterial({
  color: "aqua",
  roughness: 0.2,
  metalness: 0.6,
});
const pointMaterial = new THREE.PointsMaterial({
  size: 0.02,
});

//メッシュ
const box = new THREE.Mesh(boxGeometry, material);
const sphere = new THREE.Mesh(sphereGeometry, material);
const particlesSphere = new THREE.Points(sphereGeometry, pointMaterial);
const plane = new THREE.Mesh(planeGeometry, material);
const torus = new THREE.Mesh(torusGeometry, material);
const torusKnot = new THREE.Mesh(torusKnotGeometry, standardMaterial);
const particles = new THREE.Points(particlesGeometry, pointMaterial);

sphere.position.x = 1.5;
particlesSphere.position.y = 2;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
torus.position.x = -1.5;
torusKnot.position.z = 1;
scene.add(box, sphere, plane, torus, torusKnot, particlesSphere, particles);

//UIデバッグ
const gui = new GUI();

//フォルダー
const boxFolder = gui.addFolder("box");
const sphereFolder = gui.addFolder("sphere");

boxFolder.add(box.position, "x").min(-3).max(3).step(0.01).name("transformX");
boxFolder.add(box.position, "y", -3, 3, 0.01).name("transformY");
boxFolder.add(box.position, "z", -3, 3, 0.01).name("transformZ");
boxFolder.add(box.rotation, "x", -3, 3, 0.01).name("rotationX");
boxFolder.add(box.rotation, "y", -3, 3, 0.01).name("rotationY");
boxFolder.add(box.rotation, "z", -3, 3, 0.01).name("rotationZ");
sphereFolder
  .add(sphere.position, "x")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("sphereX");

boxFolder.add(box, "visible");
gui.add(material, "wireframe");

//ライト
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(1, 2, 3);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
scene.add(ambientLight, pointLight, pointLightHelper);

//マウス操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("resize", onWindowResize);

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();
  // console.log(elapsedTime);

  //オブジェクトの回転
  // sphere.rotation.x = elapsedTime;
  // plane.rotation.x = elapsedTime;
  // octahedron.rotation.x = elapsedTime;
  // torus.rotation.x = elapsedTime;

  // sphere.rotation.y = elapsedTime;
  // plane.rotation.y = elapsedTime;
  // octahedron.rotation.y = elapsedTime;

  // torus.rotation.y = elapsedTime;

  controls.update();

  //レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

//ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

animate();
