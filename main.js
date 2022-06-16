// THREE JS
import './style.css'
import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();

//Light
var light = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(light);


// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 80000);
camera.position.z = 4100;


// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xffffff, 1);


//loader
const loader = new GLTFLoader();

var SateModel;
loader.load('models/s6laaaaay.glb', function(glb) {
        SateModel = glb.scene;
        SateModel.scale.set(52, 52, 52)
        scene.add(SateModel);
        SateModel.position.set(0, 2000, 0)
        SateModel.rotateX(45)
    },
    undefined,
    function(error) {
        console.error(error);
    });


// Delta time
const timeDiff = 0.02 * 10;


// Consts
// air density = p / R*T:p for absolute pressure, R for specific gas constant,T for absolute temperature
// R_helium= 2.0769, R_hydrogen= 4.124
const airDensity = ((0.0000000001322) / (2.0769 * 2.73)) * 100;
console.log(airDensity)
const speed = 0.04;
const dragCoefficient = 2.2;
const satelitteArea = 0.0255744
const massofsatellite = 2500;
const EarthMassGravityConst = (6.6743) * (5.97219 * 10000000000000)
var gravity = new THREE.Vector3();


// starting Velocity
var curVelocity = new THREE.Vector3(500, 0, 0);
var curo = curVelocity.clone()


// Satellite
const geometry = new THREE.SphereGeometry(15, 32, 16);
const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
var satellite = new THREE.Mesh(geometry, material);
satellite.scale.set(10, 10, 10);
satellite.position.set(0, 2000, 0);
//scene.add(satellite);


// Earth
const geometry2 = new THREE.SphereGeometry(15, 32, 16);
const material2 = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
var Earth = new THREE.Mesh(geometry2, material2);
Earth.scale.set(10, 10, 10)
Earth.position.set(0, 0, 0)
scene.add(Earth)

camera.lookAt(new THREE.Vector3(Earth.position.x, Earth.position.y, Earth.position.z))



// Drag force : not stable
function DragForce(velocity) {
    var force = (0.5 * airDensity * dragCoefficient * satelitteArea * velocity * velocity) / (massofsatellite)
    if (isNaN(force))
        force = 0
    if (force != 0)
        force = force * -1 * velocity / Math.abs(velocity);
    return force;
}


// GravityForce: The farther the satellite on Earth the less Fg value
function GravityForce() {
    var force = (EarthMassGravityConst * massofsatellite) / (Earth.position.clone().sub(satellite.position).lengthSq())
    force = force / 1000000;
    if (isNaN(force))
        force = 0
    console.log(force)
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

    points.push(new THREE.Vector3(satellite.position.x, satellite.position.y, satellite.position.z));

    const material = new THREE.PointsMaterial({ color: 0x0000ff });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    points.pop()
    scene.add(line);

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

    }

};

// animate
function animate() {
    setTimeout(animate, 20);
    if (SateModel) {
        if (Earth.position.clone().sub(satellite.position).length() < 70000 && Earth.position.clone().sub(satellite.position).length() > 1000)

            calculate();
        renderer.render(scene, camera);
    }

}

animate();