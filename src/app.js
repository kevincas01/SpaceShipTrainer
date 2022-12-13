/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { BoxBufferGeometry, Mesh, WebGLRenderer, PerspectiveCamera, Vector3, Scene, Color, MeshBasicMaterial ,BufferGeometry, TextureLoader,PointsMaterial, Points} from 'three';

import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

// Initialize core ThreeJS components
const scene = new Scene();
scene.background = new Color(0x202120);
const geom = new BoxBufferGeometry(2,2,2);
const mat = new MeshBasicMaterial();
const cube = new Mesh(geom, mat);

scene.add(cube);



// code for hud, mostly from evermade.fi

const width = window.innerWidth;
const height = window.innerHeight;
debugger;

var hudCanvas = document.createElement('canvas');
hudCanvas.width = width;
hudCanvas.height = height;
var hudBitmap = hudCanvas.getContext('2d');

hudBitmap.font = "Normal 40px Arial";
hudBitmap.textAlign = 'center';
hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
hudBitmap.fillText('TEST', width / 2, height / 2);

let cameraHUD = new OrthographicCamera(
    -width/2, width/2,
    height/2, -height/2,
    0, 30
    );

const sceneHUD = new Scene();

var hudTexture = new Texture(hudCanvas)
hudTexture.needsUpdate = true;
var material = new MeshBasicMaterial( {map: hudTexture } );
material.transparent = true;

var planeGeometry = new PlaneGeometry( width, height );
var plane = new Mesh( planeGeometry, material );
sceneHUD.add( plane );

// end code for hud

let points=[]

for (let num = 0; num < 3000; num++) {
  let coords=new Vector3(Math.ceil(Math.random()*600-300),Math.ceil(Math.random()*600-300),Math.ceil(Math.random()*600-300));
  
  points.push(coords)
}
let starCoords=  new BufferGeometry().setFromPoints( points )

let texture=new TextureLoader().load('src/components/stars/red.png')

let starMats=new PointsMaterial({size:5,map:texture})
let brightStars=new Points(starCoords,starMats)

scene.add(brightStars)
for (let num = 0; num < 3000; num++) {
  let coords=new Vector3(Math.ceil(Math.random()*600-300),Math.ceil(Math.random()*600-300),Math.ceil(Math.random()*600-300));
  
  points.push(coords)
}
 starCoords=  new BufferGeometry().setFromPoints( points )

 texture=new TextureLoader().load('src/components/stars/white.png')

 starMats=new PointsMaterial({size:5,map:texture})
 brightStars=new Points(starCoords,starMats)

scene.add(brightStars)




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

const xLimit = 20;
const yLimit = 20;

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // debugger;
    curTime = timeStamp;

    let deltaT = (curTime - prevTime)/1000;

    const playerSpeed = 10;

    const xMovement = deltaT * playerSpeed * (Number(moveLeft) - Number(moveRight));
    const yMovement = deltaT * playerSpeed * (Number(moveUp) - Number(moveDown));

    if(!(camera.position.x + xMovement > xLimit || camera.position.x + xMovement < -xLimit)) camera.position.x += xMovement;
    if(!(camera.position.y + yMovement > yLimit || camera.position.y + yMovement < -yLimit)) camera.position.y += yMovement;




    // controls.update();
    renderer.render(scene, camera);
    renderer.render(sceneHUD, cameraHUD);

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

    debugger;

    if(controls.isLocked === true){
        

        const audio = new Audio("./src/components/sounds/laser.mp3"); 
        laserSounds.push(audio);  
        audio.play();  
    
        for (const sound of laserSounds) {
          sound.play(); //Play all of them
        }
    

    }

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