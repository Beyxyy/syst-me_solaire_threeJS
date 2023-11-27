import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'lil-gui';
/**
 * Base
 */
// Debug - Importe 'dat.gui' si besoin
const gui = new GUI({width: 350})
// ...



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene - Crée la scène ici
const scene = new THREE.Scene()

/**
 * Textures - Instancie le textureLoader ici pour ajouter les textures
 */
const textureLoader = new THREE.TextureLoader()
const sunTexture = textureLoader.load('/textures/sunmap.png')
const earthTexture = textureLoader.load('/textures/earthmap.png')
const saturnTexture = textureLoader.load('/textures/saturnmap.png')
const jupiterTexture = textureLoader.load('/textures/jupitermap.png')
const neptuneTexture = textureLoader.load('/textures/neptunemap.png')
const moonTexture = textureLoader.load('/textures/moonmap.png') 

/**
 * Objects
 */
//étoile filante 
var parameters = {};
parameters.count = 100;
const array_particules = [];
const add_particules = () => { 
for (let i=0; i<parameters.count; i++){
    

    const particlesGeometry = new THREE.BufferGeometry;
    const particlesCount = 75;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 200;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.06,
        color: 'white'
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    array_particules.push(particlesMesh);
    scene.add(particlesMesh);
}}

gui.add(parameters, 'count').min(0).max(1000).step(10);
gui.add({apply_changes: () => {
    array_particules.forEach((pos, i) => {
        scene.remove(pos)
    });
    add_particules();
}}, 'apply_changes');

add_particules();

//ajout de la fusée
let rocket;
const loader = new GLTFLoader();
loader.load('/models/rocket.glb', function(gltf) {
    rocket = gltf.scene;
    rocket.scale.set(.5, .5, .5);
    rocket.position.set(3, 5, 5);
    rocket.rotation.y = Math.PI/5;
    rocket.rotation.x = Math.PI ;
    scene.add(rocket);
});

//ajout de la Terre
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 32),
    new THREE.MeshBasicMaterial({
        map: earthTexture,
    })
)

//Ajout du soleil
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({
        map: sunTexture,
    })
)


const sunLight = new THREE.PointLight(0xffffff, 1);

// Position the light to the same position as the sun
sunLight.position.set(sun.position.x, sun.position.y, sun.position.z);

// Enable shadows for this light source
sunLight.castShadow = true;

// Add the light to the scene
scene.add(sunLight);

// Make sure all objects can receive shadows
scene.traverse(function(node) {
    if (node instanceof THREE.Mesh) {
        node.receiveShadow = true;
        node.castShadow = true;
    }
});

const saturne = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 32),
    new THREE.MeshBasicMaterial({
        map: saturnTexture, // Utilise la texture sunTexture
    })
)


//ajout de neptune
const neptune = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 32),

    new THREE.MeshBasicMaterial({
        map: neptuneTexture, 
    })
)
//ajout de neptune
scene.add(neptune);
//ajout de neptune
neptune.position.set(2, 4, 3);



//ajout d'un anneau à saturne
const saturnRing1 = new THREE.Mesh(
    new THREE.RingGeometry(0.9, 1.2, 32),
    new THREE.MeshBasicMaterial({
        map: saturnTexture,
        side: THREE.DoubleSide
    })
)

const saturnRing2 = new THREE.Mesh(
    new THREE.RingGeometry(1, 1.2, 32),
    new THREE.MeshBasicMaterial({
        map: saturnTexture, 
        side: THREE.DoubleSide
    })
)
//ajout de l'anneau autour de saturne
saturne.add(saturnRing2);
//ajout de l'anneau autour de saturne
saturnRing2.position.set(0, 0, 0);
//ajout de l'anneau autour de saturne
saturnRing2.rotation.x = Math.PI / 2;


//ajout de la lune autour de la terre
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 32, 32),
    new THREE.MeshBasicMaterial({
        map: moonTexture,
    })
)
//ajout de la lune autour de la terre
earth.add(moon);
//ajout de la lune autour de la terre
moon.position.set(0, 0, 1);


// Définir la position de la sphere
sun.position.set(0, 0, 0);
earth.position.set(8, 8, 4);
saturne.position.set(12, 1, 8);
// stars.position.set(10, 10, 10);

// Ajouter la sphere à la scène
scene.add(earth);
scene.add(saturne);
scene.add(sun);


/**
 * Lights
 */
// Créer une lumière ambiante
// Ajout d'une lumière ambiante violacée
const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
// Ajout d'une lumière directionnelle
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
// Définir la position de la lumière directionnelle
// directionalLight.position.set(0, 0, 0)
// La lumière pointe vers la sphere
// directionalLight.target = earth

// Ajouter la lumière à la scène
scene.add(ambientLight)
// scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
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

/**
 * Camera - Ajouter une caméra ici
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 8) // Définir la position initiale de la caméra
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //rotation de neptune
    neptune.rotation.y = elapsedTime * 3;
    //rotation de neptune autour du soleil
    neptune.position.x = Math.cos(elapsedTime) * 10;
    neptune.position.z = Math.sin(elapsedTime) * 10;
    neptune.position.y = Math.sin(elapsedTime) * 10;



    //fait tourner la terre autour du soleil
    earth.position.x = Math.cos(elapsedTime*.33) * 2.5;
    earth.position.z = Math.sin(elapsedTime*.33) * 2.5;
    earth.position.y = Math.sin(elapsedTime*.33) * 2.5;
    //la terre tourne sur elle même
    earth.rotation.y = elapsedTime * 3;

    saturne.position.x = Math.cos(elapsedTime*.66) * 6;
    saturne.position.z = Math.sin(elapsedTime*.66) * .5;
    saturne.position.y = Math.sin(elapsedTime*.66) * 4;

    if(rocket){
       rocket.position.x = Math.cos(elapsedTime*4) * 2;
        rocket.position.z = Math.sin(elapsedTime*4) * 2;
        rocket.position.y = Math.sin(elapsedTime*4) *2; 
        rocket.rotation.z = elapsedTime/2;
        rocket.rotation.y = elapsedTime/2;
        rocket.rotation.x = elapsedTime/2;
    }
    
    
    array_particules.forEach((pos, i) => {
        // fais tourner les particules autour de la terre
        pos.rotation.x = elapsedTime * 0.2;
        // pos.rotation.y = elapsedTime * 0.5;
        pos.rotation.z = elapsedTime * 0.3;

    });

    //anime la lune autour de la terre
    moon.position.x = Math.cos(elapsedTime) * 1;
    moon.position.z = Math.sin(elapsedTime) * 1;
    moon.position.y = Math.sin(elapsedTime) * 1;
    //la lune tourne sur elle même
    moon.rotation.y = elapsedTime * 3;


    // Update the geometry
    // arr.geometry.attributes.position.needsUpdate = true;

    //anime les particules pour qu'elles tourne autour de la terre
    // particlesMesh.rotation.x = elapsedTime * 0.2;
    // particlesMesh.rotation.y = elapsedTime * 0.2;
    // particlesMesh.rotation.z = elapsedTime * 0.2;


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
