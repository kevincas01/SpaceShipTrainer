/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { BoxBufferGeometry, Mesh, WebGLRenderer, PerspectiveCamera, Vector3, Scene, Color, MeshBasicMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

// Initialize core ThreeJS components
const scene = new Scene();
scene.background = new Color(0x7ec0ee);
const geom = new BoxBufferGeometry(2,2,2);
const mat = new MeshBasicMaterial();
const cube = new Mesh(geom, mat);

scene.add(cube);

const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(6, 3, -10);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new PointerLockControls(camera, canvas);
// controls.update();

let curTime = 0;
let prevTime = 0;
let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // debugger;
    curTime = timeStamp;

    let deltaT = (curTime - prevTime)/1000;

    const playerSpeed = 10;

    camera.position.x += deltaT * playerSpeed * (Number(moveLeft) - Number(moveRight));
    camera.position.y += deltaT * playerSpeed * (Number(moveUp) - Number(moveDown));


    // controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    prevTime = curTime;
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);


const laserSounds = [];  

document.addEventListener( 'click', function () {

    controls.lock();

} );

document.addEventListener("keydown", event => {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveUp = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveDown = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;

        case 'Space':
            if ( canJump === true ) velocity.y += 350;
            canJump = false;
            break;

    }

    debugger;

  if (event.key === "f") {
    const audio = new Audio("./src/components/sounds/laser.mp3"); 
    laserSounds.push(audio);  
    audio.play();  

    for (const sound of laserSounds) {
      sound.play(); //Play all of them
    }

  }
});


document.addEventListener("keyup", event => {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveUp = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveDown = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

    }

});


document.addEventListener("keyup", event => {
    if (event.key === "s") {
        laserSounds.length = 0;  //Clear
    }
  });