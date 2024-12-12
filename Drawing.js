import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { gsap } from "gsap";
import Boat from "./Physics";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import {
  addVariablesListeners,
  updateboatSettings,
  updateVariablesListeners,
} from "./control";

// Variables for THREE.js scene, camera, renderer, controls, water, and sun
let camera, scene, renderer;
let controls, water, sun;

// Arrays to hold collision objects and mixers
const collisionObjects = [];
const mixers = [];
const models = [];

// Flag to control animation pause state
let animationPaused = true;

// Initialize the boat
const boat = new Boat();

// Function to initialize the THREE.js scene
async function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    20000
  );
  camera.position.set(30, 30, 200);

  sun = new THREE.Vector3();

  //aduio

  const listener = new THREE.AudioListener();
  camera.add(listener);

  const audioLoader = new THREE.AudioLoader();
  const collisionSound = new THREE.Audio(listener);

  audioLoader.load("sound/ocean.mp3", function (buffer) {
    collisionSound.setBuffer(buffer);
    collisionSound.setLoop(true);
    collisionSound.setVolume(0.2);
    collisionSound.play(); // Add this line to play the sound
  });

  const listenerm = new THREE.AudioListener();
  camera.add(listener);

  const audioLoaderm = new THREE.AudioLoader();
  const collisionSoundm = new THREE.Audio(listener);

  audioLoaderm.load("sound/m.mp3", function (buffer) {
    collisionSoundm.setBuffer(buffer);
    collisionSoundm.setLoop(true);
    collisionSoundm.setVolume(0.3);
    collisionSoundm.play(); // Add this line to play the sound
  });

  // Water
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      "textures/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });

  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  // Skybox
  const sky = new Sky();
  sky.scale.setScalar(10000);
  scene.add(sky);

  const skyUniforms = sky.material.uniforms;
  skyUniforms["turbidity"].value = 10;
  skyUniforms["rayleigh"].value = 2;
  skyUniforms["mieCoefficient"].value = 0.005;
  skyUniforms["mieDirectionalG"].value = 0.8;

  const parameters = {
    elevation: 2,
    azimuth: 180,
  };

  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  function updateSun() {
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms["sunPosition"].value.copy(sun);
    water.material.uniforms["sunDirection"].value.copy(sun).normalize();

    scene.environment = pmremGenerator.fromScene(sky).texture;
  }

  updateSun();

  // Orbit controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set(0, 10, 0);
  controls.minDistance = 40.0;
  controls.maxDistance = 200.0;
  controls.enableDamping = true;
  controls.enablePan = false;

  // Resize event listener
  window.addEventListener("resize", onWindowResize);

  // Load models
  const modelPaths = ["models/boat/scene.gltf"];
  const modelPaths1 = ["models/basalt_rocks_on_beach/scene.gltf"];
  const modelLocations = [{ x: 0, y: 30, z: 0 }];
  const modelRotations = [{ x: 0, y: Math.PI, z: 0 }];
  const modelScales = [{ x: 7, y: 7, z: 7 }];
  const animationIndices = [0];

  for (let i = 0; i < modelPaths.length; i++) {
    loadModel(
      modelPaths[i],
      modelLocations[i],
      modelScales[i],
      animationIndices[i],
      modelRotations[i]
    );
  }

  for (let i = 0; i < modelPaths1.length; i++) {
    loadModel1(
      modelPaths1[i],
      modelLocations[i],
      modelScales[i],
      animationIndices[i],
      modelRotations[i]
    );
  }

  // Animation loop
  animate();

  window.addEventListener("resize", onWindowResize);

  addInputControl(boat);

  //اضافة واجهة المراقبة
  addMonitoringScreen(boat);

  addVariablesListeners(boat);
}

// Function to handle window resize events
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Function to load a model with animations
function loadModel(
  modelPath,
  modelLocation,
  modelScale,
  animationIndex,
  modelRotations
) {
  const loader = new GLTFLoader();
  loader.load(
    modelPath,
    function (gltf) {
      const mixer = new THREE.AnimationMixer(gltf.scene);
      const animation = gltf.animations[animationIndex];
      if (animation) {
        const action = mixer.clipAction(animation);
        mixers.push(mixer);
        action.play();
      }

      const model = gltf.scene;
      model.scale.set(modelScale.x, modelScale.y, modelScale.z);
      model.position.set(modelLocation.x, modelLocation.y, modelLocation.z);
      model.rotation.set(modelRotations.x, 
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        modelRotations.y, modelRotations.z);
      scene.add(model);
      models.push(model);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}

// Function to load a model without animations
function loadModel1(
  modelPath,
  modelLocation,
  modelScale,
  animationIndex,
  modelRotations
) {
  const loader = new GLTFLoader();
  loader.load(
    modelPath,
    function (gltf) {
      const mixer = new THREE.AnimationMixer(gltf.scene);
      const animation = gltf.animations[animationIndex];
      if (animation) {
        const action = mixer.clipAction(animation);
        mixers.push(mixer);
        action.play();
      }

      const model = gltf.scene;
      model.scale.set(0.3, 0.3, 0.3);
      model.position.set(180, 0, -380);
      model.rotation.set(modelRotations.x, modelRotations.y, modelRotations.z);
      scene.add(model);
      models.push(model);
      const box = new THREE.Box3().setFromObject(gltf.scene);
      collisionObjects.push(box);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}
let hitted = [false, false, false, false];

function checkCollisions() {
  for (let i = 0; i < collisionObjects.length; i++) {
    if (boat.boundingBox.intersectsBox(collisionObjects[i])) {
      const a = new THREE.AudioListener();
      camera.add(a);

      const audioLoadera = new THREE.AudioLoader();
      const collisionSounda = new THREE.Audio(a);

      audioLoadera.load("sound/Car.mp3", function (buffer) {
        collisionSounda.setBuffer(buffer);
        collisionSounda.setLoop(false);
        collisionSounda.setVolume(1);
        collisionSounda.play(); // Add this line to play the sound
      });

      console.log("Collision detected!");
      boat.crash();
      if (!hitted[i]) {
        hitted[i] = true;
      }
      break;
    } else {
      hitted[i] = false;
    }
  }
}

// models
// *******************************************************************************
const loader = new GLTFLoader();

function loadModell(
  modelPathss,
  modelLocationss,
  modelScaless,
  animationIndicess,
  modelRotationss
) {
  loader.load(
    modelPathss,
    function (gltf) {
      const mixer = new THREE.AnimationMixer(gltf.scene);
      const animation = gltf.animations[animationIndicess];
      if (animation) {
        const action = mixer.clipAction(animation);
        mixers.push(mixer);
        action.play();
      }

      const model = gltf.scene;
      model.scale.set(modelScaless.x, modelScaless.y, modelScaless.z);
      model.position.set(
        modelLocationss.x,
        modelLocationss.y,
        modelLocationss.z
      );
      model.rotation.set(
        modelRotationss.x,
        modelRotationss.y,
        modelRotationss.z
      );
      const box = new THREE.Box3().setFromObject(model);

      scene.add(model);
      models.push(model);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}

const modelPathss = [
  "models/lighthouse/scene.gltf",
  "models/lighthouse/scene.gltf",
  "models/New/buoy/scene.gltf",
  "models/New/buoy/scene.gltf",
  "models/New/buoy/scene.gltf",
  "models/island1/scene.gltf",
  "models/1/scene.gltf",
  "models/basalt_rocks_on_beach/scene.gltf",
  "models/basalt_rocks_on_beach/scene.gltf",
];

const modelLocationss = [
  { x: 3035, y: 0, z: -1000 },
  { x: -1500, y: 0, z: 1442 },
  { x: -300, y: 0, z: -1442 },
  { x: -750, y: 0, z: -19 },
  { x: 1300, y: 0, z: 660 },
  { x: 5000, y: -1, z: 5000 },
  { x: -1300, y: 0, z: -660 },
  { x: -677, y: 0, z: 3375 },
  { x: 1227, y: 0, z: -1883 },
];
const modelRotationss = [
  { x: 0, y: 0, z: 0 },
  { x: 0, y: 0, z: 0 },
  { x: 0, y: 0, z: 0 },
  { x: 0, y: 0, z: 0 },
  { x: 0, y: 0, z: 0 },
  { x: 0, y: 0, z: 0 },
  { x: 0, y: 0, z: 0 },
  { x: 0, y: 0, z: 0 },
  { x: 0, y: 0, z: 0 },
];

const modelScaless = [
  { x: 10.01, y: 20.01, z: 10.01 },
  { x: 15, y: 15, z: 15 },
  { x: 10, y: 10, z: 10 },
  { x: 10, y: 10, z: 10 },
  { x: 10, y: 10, z: 10 },
  { x: 0.13, y: 0.1, z: 0.03 },
  { x: 1.3, y: 1.3, z: 1.3 },
  { x: 0.3, y: 0.3, z: 0.3 },
  { x: 0.3, y: 0.3, z: 0.3 },
];

const animationIndicess = [0];

for (let i = 0; i < modelPathss.length; i++) {
  console.log(modelPathss.length);
  loadModell(
    modelPathss[i],
    modelLocationss[i],
    modelScaless[i],
    animationIndicess[i],
    modelRotationss[i]
  );
}

// ********************************************************************888888

// Keydown event listener for pausing and unpausing animations
document.addEventListener("keydown", function (event) {
  if (event.key === "p") {
    animationPaused = !animationPaused;
  }
});

// Variables for animation timing
let elapsedtime = 0;
let oldElapsedTime = 0;
let deltatime = 0;
const clock = new THREE.Clock();

// Function to animate the scene
function animate() {
  setTimeout(function () {
    requestAnimationFrame(animate);
  }, 30);

  checkCollisions();

  elapsedtime = clock.getElapsedTime();
  deltatime = elapsedtime - oldElapsedTime;
  oldElapsedTime = elapsedtime;

  for (let i = 0; i < mixers.length; i++) {
    if (!animationPaused) mixers[i].update(deltatime);
  }

  boat.update();

  updateMonitoringScreen(boat); // تحديث واجهة المراقبة
  updateVariablesListeners(boat); // تحديث واجهة المدخلات

  if (models[0]) {
    models[0].position.copy(boat.position);
    models[0].rotation.y = boat.yaw_angle - Math.PI / 2;
  }
  const boatPosition = new THREE.Vector3(
    boat.position.x,
    boat.position.y + 70,
    boat.position.z + 200
  );

  camera.lookAt(boatPosition);
  controls.target.copy(boatPosition);
  controls.update();
  renderer.render(scene, camera);

  render();
}

// Function to render the water material
function render() {
  water.material.uniforms["time"].value += 1.0 / 60.0;
  renderer.render(scene, camera);
}

function addInputControl(boat) {
  const gui = new dat.GUI({ width: 300 });
  gui
    .add(boat, "air_density", 1, 1000, 1)
    .name("Air Density (kg/m³)")
    .onChange((value) => updateboatSettings(boat, { air_density: value }));
  gui
    .add(boat, "water_density", 1, 10000, 15)
    .name("Water Density (kg/m³)")
    .onChange((value) => updateboatSettings(boat, { water_density: value }));
  gui
    .add(boat, "engineForce", 10000, 100000000, 1000)
    .name("Engine Force (Nm)")
    .onChange((value) => updateboatSettings(boat, { engineForce: value }));
  gui
    .add(boat, "mass", 2500, 3500, 10)
    .name("Mass (kg)")
    .onChange((value) => {
      boat.assestNumber = value / 100;
      updateboatSettings(boat, { mass: value });
    });
  gui
    .add(boat, "wind_speed", 0, 26000, 10)
    .name("Wind Speed (m/s)")
    .onChange((value) => updateboatSettings(boat, { wind_speed: value }));
  gui
    .add(boat, "windDirection", ["west", "east", "north", "south"])
    .name("Wind Direction")
    .onChange((value) => updateboatSettings(boat, { windDirection: value }));
}

//اضافة واجهة المراقبة
function addMonitoringScreen(boat) {
  const monitoringContainer = document.createElement("div");
  monitoringContainer.id = "monitoring-container";
  monitoringContainer.style.position = "fixed";
  monitoringContainer.style.top = "200px";
  monitoringContainer.style.right = "10px";
  monitoringContainer.style.backgroundColor = "white";
  monitoringContainer.style.padding = "10px";
  monitoringContainer.style.borderRadius = "8px";
  monitoringContainer.style.width = "250px";
  monitoringContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
  monitoringContainer.style.zIndex = "10";
  const fields = [
    {
      name: "Acceleration",
      value: `${boat.acceleration.length().toFixed(2)} m/s`,
      id: "acceleration",
    },
    {
      name: "Velocity",
      value: `${boat.velocity.length().toFixed(2)} m/s`,
      id: "current-speed",
    },
    // {
    //   name: "Wind Speed",
    //   value: `${boat.wind_speed.toFixed(2)} m/s`,
    //   id: "wind-speed",
    // },
    {
      name: "Drag Force",
      value: `${boat.dragVector.length().toFixed(2)} m/s`,
      id: "drag",
    },
    {
      name: "Air-Resisatance Force",
      value: `${boat.airResistanceVector.length().toFixed(2)} m/s`,
      id: "air-resistance",
    },
    {
      name: "Wind Force",
      value: `${boat.windVector.length().toFixed(2)} m/s`,
      id: "wind",
    },
    {
      name: "Thrust Force",
      value: `${boat.thrustVector.length().toFixed(2)} m/s`,
      id: "thrust",
    },
  ];

  fields.forEach((field) => {
    const fieldGroup = document.createElement("div");
    fieldGroup.style.marginBottom = "8px";

    const label = document.createElement("label");
    label.textContent = `${field.name}:`;
    label.style.display = "inline-block";
    label.style.fontSize = "14px";
    label.style.marginBottom = "4px";
    label.style.paddingLeft = "15%";
    label.style.color = "red";

    const valueElement = document.createElement("span");
    valueElement.id = field.id;
    valueElement.textContent = field.value;
    valueElement.style.fontSize = "14px";
    valueElement.style.marginLeft = "10px";

    fieldGroup.appendChild(label);
    fieldGroup.appendChild(valueElement);
    monitoringContainer.appendChild(fieldGroup);
  });

  document.body.appendChild(monitoringContainer);
}

// تحديث واجهة المراقبة
function updateMonitoringScreen(boat) {
  if (document.getElementById("acceleration")) {
    document.getElementById("acceleration").textContent = `${boat.acceleration
      .length()
      .toFixed(2)} m/s`;
  }
  if (document.getElementById("current-speed")) {
    document.getElementById("current-speed").textContent = `${boat.velocity
      .length()
      .toFixed(2)} m/s`;
  }
  if (document.getElementById("drag")) {
    document.getElementById("drag").textContent = `${boat.dragVector
      .length()
      .toFixed(2)} m/s`;
  }
  if (document.getElementById("air-resistance")) {
    document.getElementById(
      "air-resistance"
    ).textContent = `${boat.airResistanceVector.length().toFixed(2)} m/s`;
  }
  if (document.getElementById("wind")) {
    document.getElementById("wind").textContent = `${boat.windVector
      .length()
      .toFixed(2)} m/s`;
  }
  if (document.getElementById("thrust")) {
    document.getElementById("thrust").textContent = `${boat.thrustVector
      .length()
      .toFixed(2)} m/s`;
  }
  // if (document.getElementById("position-x")) {
  //   document.getElementById(
  //     "position-x"
  //   ).textContent = `${boat.position.x.toFixed(2)} m`;
  // }
  // if (document.getElementById("position-y")) {
  //   document.getElementById(
  //     "position-y"
  //   ).textContent = `${boat.position.y.toFixed(2)} m`;
  // }
  // if (document.getElementById("position-z")) {
  //   document.getElementById(
  //     "position-z"
  //   ).textContent = `${boat.position.z.toFixed(2)} m`;
  // }
  // if (document.getElementById("yaw-angle")) {
  //   document.getElementById(
  //     "yaw-angle"
  //   ).textContent = `${boat.yaw_angle.toFixed(2)} °`;
  // }
  // if (document.getElementById("wind-speed")) {
  //   document.getElementById(
  //     "wind-speed"
  //   ).textContent = `${boat.wind_speed.toFixed(2)} m/s`;
  // }
}

// Start initialization
init();
