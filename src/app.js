/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { AmbientLight, BoxBufferGeometry, Mesh, WebGLRenderer, Ray, SpriteMaterial,Sprite, PerspectiveCamera, Vector3, Scene, Color, MeshBasicMaterial ,BufferGeometry, TextureLoader, Texture, SphereGeometry} from 'three';

import { test } from 'objects';
import {ship} from 'objects';
// import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
// import { SeedScene } from 'scenes';
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

// Initialize core ThreeJS components
const scene = new Scene();
scene.background = new Color(0x000000);
const geom = new BoxBufferGeometry(2,2,2);
const mat = new MeshBasicMaterial();
const cube = new Mesh(geom, mat);
cube.position.set(-15,0,0);

scene.add(cube);

const light = new AmbientLight( 0x909090 ); // soft white light
scene.add( light );



// // code for hud, mostly from evermade.fi

// const width = window.innerWidth;
// const height = window.innerHeight;

// var hudCanvas = document.createElement('canvas');
// hudCanvas.width = width;
// hudCanvas.height = height;
// var hudBitmap = hudCanvas.getContext('2d');

// hudBitmap.font = "Normal 40px Arial";
// hudBitmap.textAlign = 'center';
// hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
// hudBitmap.fillText('TEST', width / 2, height / 2);

// let cameraHUD = new OrthographicCamera(
//     -width/2, width/2,
//     height/2, -height/2,
//     0, 30
//     );

// const sceneHUD = new Scene();

// var hudTexture = new Texture(hudCanvas)
// hudTexture.needsUpdate = true;
// var material = new MeshBasicMaterial( {map: hudTexture } );
// material.transparent = true;

// var planeGeometry = new PlaneGeometry( width, height );
// var plane = new Mesh( planeGeometry, material );
// sceneHUD.add( plane );

// // end code for hud

// start code for stars

const getSprite = (texturePath) => {
    let texture=new TextureLoader().load(texturePath);

    let spriteMaterial = new SpriteMaterial( { map: texture } );
    let sprite = new Sprite( spriteMaterial );
    return sprite
};

const addStars = (texturePath, amount, spriteScale) => {

    let sprite = getSprite(texturePath);
    sprite.scale.set(spriteScale,spriteScale,spriteScale);
    
    
    for (let num = 0; num < amount; num++) {
      let coords=new Vector3(Math.ceil(Math.random()*600-300),Math.ceil(Math.random()*600-300),Math.ceil(Math.random()*600-300));
      
      let pointSprite = sprite.clone();
      pointSprite.position.set(coords.x,coords.y,coords.z);
      scene.add(pointSprite);
    
    }
};

addStars('src/components/sprites/red.png', 1000, 2);
addStars('src/components/sprites/white.png', 1000, 5);
addStars('src/components/sprites/blue.png',1000,3);

// end code for stars

// start code for crosshair

let crosshairSprite = getSprite('src/components/sprites/green_crosshair.png');
const chsScale = 0.005;
crosshairSprite.scale.set(chsScale,chsScale,chsScale);


// crosshairSprite.position.set(0,10,10);

scene.add(crosshairSprite);
// end code for crosshair

const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
const canvas = renderer.domElement;

// Set up camera
camera.position.set(500, 0, 0);
camera.lookAt(new Vector3(-15, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);

canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
// const controls = new PlayerControls(camera, canvas);
const controls = new test(camera, canvas);
// test.maxPolarAngle = 1;

// controls.update();

let curTime = 0;
let prevTime = 0;
let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;

const zLimit = 20;
const yLimit = 20;

// let raycaster = new THREE.Raycaster();
let cameraDirection = new Vector3();
let crosshairPos = new Vector3();

const rays=[]
const cameraDirs=[]
// Render loop

const testShip = new ship(scene);

const onAnimationFrameHandler = (timeStamp) => {
    curTime = timeStamp;
    debugger;
    let a = testShip;
    if(testShip != undefined && testShip.model != undefined) testShip.model.position.set(-10,3,3);


    let deltaT = (curTime - prevTime)/1000;

    // player movement code start
    const playerSpeed = 10;

    const zMovement = deltaT * playerSpeed * (Number(moveLeft) - Number(moveRight));
    const yMovement = deltaT * playerSpeed * (Number(moveUp) - Number(moveDown));

    if(!(camera.position.z + zMovement > zLimit || camera.position.z + zMovement < -zLimit)) camera.position.z += zMovement;
    if(!(camera.position.y + yMovement > yLimit || camera.position.y + yMovement < -yLimit)) camera.position.y += yMovement;

    // player movement code end
    camera.position.x=camera.position.x-0.1;

    camera.getWorldDirection(cameraDirection);
    let ray = new Ray(camera.position, cameraDirection);
    ray.at(0.1, crosshairPos);
    

    for (let i = 0; i < rays.length; i++) {
        if(rays[i].active){
            rays[i].position.add(cameraDirs[i].clone().multiplyScalar(.5));
        }
        else{
            rays.splice[i,1]
            continue
        }
      
    }

// crosshair code start

    crosshairSprite.position.set(crosshairPos.x,crosshairPos.y,crosshairPos.z);

// crosshair code end

// rotation limiting for camera start
// debugger;
// rotation limiting end


    // controls.update();
    renderer.render(scene, camera);
    // renderer.render(sceneHUD, cameraHUD);

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
const redMaterial = new MeshBasicMaterial({color: 0xff0000});



let mouseIsPressed=false;
function onMouseDown(){

    if(!mouseIsPressed){
        return;
    }
    const audio = new Audio("./src/components/sounds/shortLaser.mp3"); 
    laserSounds.push(audio);

    // debugger;

    if(controls.isLocked === true){

        console.log(cameraDirection);
        if (laserSounds.length>10){
            laserSounds.splice(5,6)
        }
        for (const sound of laserSounds) {
            
            sound.play(); //Play all of them
        }

            var shot=new Mesh(new SphereGeometry(0.2,10,8),redMaterial)
            shot.position.set(camera.position.x,camera.position.y,camera.position.z)
            
            cameraDirs.push(camera.getWorldDirection(new Vector3()))

            shot.active=true
            setTimeout(()=>{
                scene.remove(shot);
                shot.active=false
            },4000)
            rays.push(shot)
            scene.add(shot)

            setTimeout(onMouseDown, 100);
    }
}
document.addEventListener( 'mousedown', function(){
    mouseIsPressed=true;
    onMouseDown();
});

document.addEventListener("mouseup", event => {
    mouseIsPressed=false;
    laserSounds.length = 0;  //Clear
        
  });

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
            controls.lock()
            // if ( canJump === true ) velocity.y += 350;
            // canJump = false;
            break;

    }

    // debugger;
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

