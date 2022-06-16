// THREE JS
import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

// Textures of particals
const earth = new THREE.TextureLoader().load('/earth.jpg')
const textureLoader = new THREE.TextureLoader()
const partical_textrure = textureLoader.load('/textures/particles/9.png')

//canvas
const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene
const scene = new THREE.Scene();

//Light
var light = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(light);


// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 80000);
camera.position.z = 4100;


// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true


// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
// renderer.setClearColor(0xffffff, 1);

//loader
const loader = new GLTFLoader();

var SateModel;
loader.load('models/s6laaaaay.glb', function(glb) {
        SateModel = glb.scene;
        SateModel.scale.set(30, 30, 30)
        scene.add(SateModel);
        SateModel.position.set(0, 0, 0)
        SateModel.rotateX(45)
    },
    undefined,
    function(error) {
        console.error(error);
    });
window.onload = () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Satellite
const geometry = new THREE.SphereGeometry(15, 32, 16);
const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
var satellite = new THREE.Mesh(geometry, material);
satellite.scale.set(10, 10, 10);
satellite.position.set(0, 0, 3000);
//scene.add(satellite);


// Earth
const geometry2 = new THREE.SphereGeometry(30, 32, 16);
const material2 = new THREE.MeshBasicMaterial({ map: earth });
var Earth = new THREE.Mesh(geometry2, material2);
Earth.scale.set(10, 10, 10)
Earth.position.set(0, 0, 0)
scene.add(Earth)


//particals
const particalsGeometry = new THREE.BufferGeometry(1, 32, 32)

// stars
const count = 5000 //to increase stars
const positions = new Float32Array(count * 3)

// const colors = new Float32Array(count*3)
for (let i = 0; i < count; i++) {
    positions[i] = (Math.random() - 0.5) * 20000 //to increase distance between stars
        // colors[i]   =Math.random()
}

particalsGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

// particalsGeometry.setAttribute(
//     'color',
//     new THREE.BufferAttribute(color,3)
// )
const particalsMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    color: 'white',
    map: partical_textrure
})
particalsMaterial.alphaTest = 0.001
    //  particalsMaterial.depthTest=false
particalsMaterial.depthWrite = false
particalsMaterial.blending = THREE.AdditiveBlending
    // particalsMaterial.vertexColors = true

//points
const particals = new THREE.Points(particalsGeometry, particalsMaterial)
    // particals.scale.set()
scene.add(particals)


// degug GUI
const gui = new dat.GUI({ closed: false, width: 300, color: 'white' });
//gui.hide(); // enter H to show controls
const EarthFolder = gui.addFolder('Earth');
EarthFolder.open();
const SatelliteFolder = gui.addFolder('Satellite');
SatelliteFolder.open();
const parameters = {

    Gravity_constant: (6.6743),
    mass_earth: (5.97219 * 10000000000000),
    airDensity: (0.0000000001322 / (2.0769 * 2.73)) * 100000000,

    // Satellite
    mass_satellite: 2500,
    visible: false,
    transfer: 1,
}
EarthFolder.add(parameters, 'mass_earth')
    .onChange(() => {
        EarthMassGravityConst = parameters.mass_earth * 10000000000000
    })
EarthFolder.add(parameters, 'Gravity_constant')
    .onChange(() => {
        EarthMassGravityConst = parameters.Gravity_constant * Math.pow(10, 11)
    })

EarthFolder.add(parameters, 'airDensity').min(0.5).max(5.5)
    .onFinishChange(() => {
        airDensity = parameters.airDensity
    })
SatelliteFolder.add(parameters, 'mass_satellite')
    .onChange(() => {
        massofsatellite = parameters.mass_satellite
    })

SatelliteFolder.add(parameters, 'transfer').min(1).max(5).step(0.5)
    .onFinishChange(() => {
        transfer = parameters.transfer
        curo = curVelocity.clone()
        curo.multiplyScalar(speed * transfer);
        curVelocity.add(curo)
    })
SatelliteFolder.add(parameters, 'visible')
    .onChange(() => {
        visible = parameters.visible
    })


// Delta time
const timeDiff = 0.02 * 100;

// Consts
// air density = p / R*T:p for absolute pressure, R for specific gas constant,T for absolute temperature
// R_helium= 2.0769, R_hydrogen= 4.124
const speed = 0.04;
const dragCoefficient = 2.2;
const satelitteArea = 0.0255744
    // let Gravity_constant = parameters.Gravity_constant
var EarthMassGravityConst = parameters.Gravity_constant * parameters.mass_earth
    // console.log('g = ',parameters.Gravity_constant)
    // console.log('earth_mass = ',parameters.mass_earth)
    // let mass_earth = (5.97219 * 10000000000000)
let airDensity = parameters.airDensity
console.log(airDensity)
let massofsatellite = 2500;
var gravity = new THREE.Vector3();
let b_is_pressed = false
let z_is_pressed = false
let x_is_pressed = false
let visible = false
let transfer = 1

// starting Velocity
var curVelocity = new THREE.Vector3(300, 100, 0);
var curo = curVelocity.clone()





// Drag force : not stable
function DragForce(velocity) {
    var force = (0.5 * airDensity * dragCoefficient * satelitteArea * velocity * velocity) / (massofsatellite * (Earth.position.clone().sub(satellite.position).length()))
    if (isNaN(force))
        force = 0
    if (force != 0)
        force = force * -1 * velocity / Math.abs(velocity);
    //console.log(force)
    return force;
}


// GravityForce: The farther the satellite on Earth the less Fg value
function GravityForce() {
    var force = EarthMassGravityConst * massofsatellite / (Earth.position.clone().sub(satellite.position).lengthSq())
    force = force / 1000000;
    if (isNaN(force))
        force = 0
        // console.log(force)
    return force
}


// Calculate the new acceleration based on equation F=ma
function calculate() {
    var Fg = GravityForce()

    // the vactor of the garvity * Fg
    gravity = Earth.position.clone().sub(satellite.position).normalize().multiplyScalar(Fg);

    if (isNaN(gravity.x))
        gravity.x = 0

    if (isNaN(gravity.y))
        gravity.y = 0

    if (isNaN(gravity.z))
        gravity.z = 0

    var accX = (gravity.x + DragForce(curVelocity.x)) / massofsatellite;

    var accY = (gravity.y + DragForce(curVelocity.y)) / massofsatellite;

    var accZ = (gravity.z + DragForce(curVelocity.z)) / massofsatellite;

    // checking on the values of the new acceleration
    if (isNaN(accX))
        accX = 0
    if (isNaN(accY))
        accY = 0
    if (isNaN(accZ))
        accZ = 0

    var acceleration = new THREE.Vector3(accX, accY, accZ)

    newposition(acceleration)
}


// function for calculating the new position based on the current acceleration
function newposition(acceleration) {

    const points = [];
    points.push(new THREE.Vector3(satellite.position.x, satellite.position.y, satellite.position.z));

    curVelocity.x = curVelocity.x + acceleration.x * timeDiff;
    curVelocity.y = curVelocity.y + acceleration.y * timeDiff;
    curVelocity.z = curVelocity.z + acceleration.z * timeDiff;

    satellite.position.x = satellite.position.x + curVelocity.x * timeDiff;
    satellite.position.y = satellite.position.y + curVelocity.y * timeDiff;
    satellite.position.z = satellite.position.z + curVelocity.z * timeDiff;



    SateModel.position.set(satellite.position.x, satellite.position.y, satellite.position.z)

    if (true) {
        points.push(new THREE.Vector3(satellite.position.x, satellite.position.y, satellite.position.z));

        const material = new THREE.PointsMaterial({ color: 0x0000ff });
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);

        scene.add(line);
    }

}


// Boost activate : when you press 'S' the speed of the satellite increase
document.addEventListener("keydown", onDocumentKeyDown, false);


function onDocumentKeyDown(event) {
    curo = curVelocity.clone()

    var keyCode = event.which;
    if (keyCode == 83) {
        curo.multiplyScalar(speed * timeDiff);
        curVelocity.add(curo)
        console.log('boost activeated')
        console.log(speed * timeDiff)

    }
};


function Thrust1(thrust) {

    // for(let counter =0;counter<times;counter++){
    if (!b_is_pressed) {
        curo = curVelocity.clone()
        curo.multiplyScalar(speed * timeDiff)
        curVelocity.add(curo)
        console.log(curo)
        b_is_pressed = true
    }

    // }
}



// Display The Values on the Screen
const text2 = document.createElement('div');
text2.style.position = 'absolute';
text2.style.width = "100";
text2.style.height = "100";
text2.style.backgroundColor = "white";
text2.style.top = "10" + 'px';
text2.style.left = "10" + 'px';
text2.style.fontSize = "20px";
text2.hidden = false;
document.body.appendChild(text2);
let generateTextOnScreen = () => {
        let text = 'Mass of Satellite: ' + massofsatellite;
        text += '<br>';
        text += 'Mass of Earth: ' + parameters.mass_earth;
        text += '<br>';
        text += 'Satellite position in x: ' + satellite.position.x;
        text += '<br>';
        text += 'Satellite position in y: ' + satellite.position.y;
        text += '<br>';
        text += 'Satellite position in z: ' + satellite.position.z;
        text += '<br>';
        text += 'Satellite speed in x: ' + curVelocity.x;
        text += '<br>';
        text += 'Satellite speed in y: ' + curVelocity.y;
        text += '<br>';
        text += 'Satellite speed in z: ' + curVelocity.z;
        text += '<br>';
        text += 'Thrust: ' + parameters.transfer;
        text += '<br>';
        text2.innerHTML = text;
    }
    // animate
function animate() {
    setTimeout(animate, 20);
    if (SateModel) {
        if (Earth.position.clone().sub(satellite.position).length() < 70000 && Earth.position.clone().sub(satellite.position).length() > 496) {

            calculate();

            /*if (parameters.mass_earth > (5.97219 * 10000000000000) || parameters.Gravity_constant > (6.6743)) {
                curVelocity.set(0, 0, 0)
                SateModel.position.set(0, 0, 0)
            }

            console.log('v = ', curVelocity)
            console.log(SateModel.position)*/

        }

        if (parameters.Gravity_constant > (6.6743)) {
            SateModel.position.set(0, 0, 0)
        }
        generateTextOnScreen();
        // Update controls
        controls.update()
        renderer.render(scene, camera);

    }

}

animate();