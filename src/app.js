/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */

/*
To add:
 - Make movement based around stars moving towards player character, with starfield copying itself at halfway point and creating a second one, deleting the first one after it passes
 - Get ships to move in pattern in waves
 - Detect collision with ships (for each ray check if it collides with a ship.  If it does check if its projectile is within the ship's hitbox)
 - Make ship type 2 which shoots lasers
*/
import { AmbientLight, Box3,PlaneGeometry, BoxBufferGeometry, OrthographicCamera,Mesh, WebGLRenderer, Ray, SpriteMaterial,Sprite, PerspectiveCamera, Vector3, Scene, Color, MeshBasicMaterial ,BufferGeometry, TextureLoader, Texture, SphereGeometry, Group, Sphere} from 'three';

import { test } from 'objects';
import {ship} from 'objects';
// import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

// Initialize core ThreeJS components
const scene = new Scene();
scene.background = new Color(0x000000);
// const geom = new BoxBufferGeometry(2,2,2);
// const mat = new MeshBasicMaterial();
// const cube = new Mesh(geom, mat);
// cube.position.set(490,0,0);

// scene.add(cube);

const light = new AmbientLight( 0x909090 ); // soft white light
scene.add( light );


// start code for stars

const starsGroupA = new Group();

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
      
      const centerStarlessRadius = 50;
      // make sure stars don't get too close to area ship will be in
      if(!(Math.sqrt(coords.y ** 2 + coords.z ** 2) < centerStarlessRadius)){
        let pointSprite = sprite.clone();
        pointSprite.position.set(coords.x,coords.y,coords.z);

        starsGroupA.add(pointSprite);
      }
    //   scene.add(pointSprite);
    
    }

    scene.add(starsGroupA);
};


const starsGroupB = starsGroupA.clone();
scene.add(starsGroupB);
starsGroupB.position.x = -100;

addStars('src/components/sprites/red.png', 1000, 2);
addStars('src/components/sprites/white.png', 1000, 5);
addStars('src/components/sprites/blue.png',1000,3);

// end code for stars


const checkBlasterCollision = (ray, projectile, ship) => {
    if(ship.model.children[0] != undefined){
        const shipBox = new Box3().setFromObject(ship.model.children[0]);
        // const projectileSphere = new Sphere.projectile.geometry.boundingSphere.clone();
        // projectileSphere.position = projectile.position.clone();

        if(ray.intersectsBox(shipBox)){
            
            count+=1;
            console.log("SHIP HIT");
            const explosionAudio = new Audio("./src/components/sounds/explosion.mp3"); 
            explosionAudio.play();
            ship.model.clear();
            ship.model.removeFromParent();
            scene.remove(projectile);
            
        }
    }
}


// start code for crosshair
let crosshairSprite = getSprite('src/components/sprites/green_crosshair.png');
const chsScale = 0.005;
crosshairSprite.scale.set(chsScale,chsScale,chsScale);

// crosshairSprite.position.set(0,10,10);

scene.add(crosshairSprite);
// end code for crosshair

const width = window.innerWidth;
const height = window.innerHeight/10;
// var hudCanvas = document.createElement('canvas');
// document.body.appendChild(hudCanvas);
// hudCanvas.width = width;
// hudCanvas.height = height;
// hudCanvas.id="canvasHUD"



const camera = new PerspectiveCamera(50, 1, 0.1, 800);
const renderer = new WebGLRenderer({antialias: true });
renderer.setSize( width, height );
renderer.autoClear = false;
const canvas = renderer.domElement;

var hudCanvas = document.createElement('canvas');
hudCanvas.width = width;
hudCanvas.height = height*5;

var hudBitmap = hudCanvas.getContext('2d');
hudBitmap.font = "Normal 50px Arial";
hudBitmap.textAlign = 'center';
hudBitmap.fillStyle = "Purple";
hudBitmap.fillText('Score: 0', width/2 , height/2 );

var cameraHUD = new OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 10 );

var sceneHUD = new Scene();

var hudTexture = new Texture(hudCanvas) 
hudTexture.needsUpdate = true

var material = new MeshBasicMaterial( {map: hudTexture} );
material.transparent = true;

var planeGeometry = new PlaneGeometry( width, height );
var plane = new Mesh( planeGeometry, material );
sceneHUD.add( plane );

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

const projectiles=[];
const rays =[];
const cameraDirs=[];
// Render loop

const testShip = new ship(scene);

const onAnimationFrameHandler = (timeStamp) => {

    curTime = timeStamp;
    // debugger;
    let a = testShip;
    if(testShip != undefined && testShip.model != undefined){
        testShip.model.position.set(480,3,3);
        // debugger;
    } 


    let deltaT = (curTime - prevTime)/1000;

    // player movement code start
    const playerStrafeSpeed = 10;

    const zMovement = deltaT * playerStrafeSpeed * (Number(-moveLeft) - Number(-moveRight));
    const yMovement = deltaT * playerStrafeSpeed * (Number(-moveUp) - Number(-moveDown));

    if(!(camera.position.z + zMovement > zLimit || camera.position.z + zMovement < -zLimit)) camera.position.z += zMovement;
    if(!(camera.position.y + yMovement > yLimit || camera.position.y + yMovement < -yLimit)) camera.position.y += yMovement;

    // player movement code end
    const spaceshipForwardSpeed = 100;
    starsGroupA.position.x += (spaceshipForwardSpeed * deltaT);
    starsGroupB.position.x += (spaceshipForwardSpeed * deltaT);


    if(starsGroupA.position.x > 700 ) starsGroupA.position.x = 200;
    if(starsGroupB.position.x > 700) starsGroupB.position.x = 200;

    camera.getWorldDirection(cameraDirection);
    let ray = new Ray(camera.position, cameraDirection);
    ray.at(0.2, crosshairPos);
    
    const projectileSpeed = 3;
    for (let i = 0; i < projectiles.length; i++) {
        if(projectiles[i].active){

            projectiles[i].position.add(rays[i].direction.clone().multiplyScalar(projectileSpeed));
            // projectiles[i].position.add(cameraDirs[i].clone().multiplyScalar(raySpeed));
            checkBlasterCollision(rays[i], projectiles[i], testShip);

        }
        else{
            projectiles.splice[i,1];
            continue;
        }
      
    }

// crosshair code start

    crosshairSprite.position.set(crosshairPos.x,crosshairPos.y,crosshairPos.z);

// crosshair code end

// rotation limiting for camera start
// rotation limiting end
    hudBitmap.clearRect(0, 0, width, height);
    hudBitmap.fillText("Score: "+count , width / 2, height / 2);
    hudTexture.needsUpdate = true;

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
const redMaterial = new MeshBasicMaterial({color: 0xff0000});



let mouseIsPressed=false;
let count=0;
function onMouseDown(){

    if(!mouseIsPressed){
        return;
    }
    const audio = new Audio("./src/components/sounds/shortLaser.mp3"); 
    laserSounds.push(audio);

    if(controls.isLocked === true){

        // console.log(starsGroupA.position);
        if (laserSounds.length>10){
            laserSounds.splice(5,6)
        }
        for (const sound of laserSounds) {
            
            sound.play(); //Play all of them
        }

        const projectileRadius = 0.2;
        var shot=new Mesh(new SphereGeometry(projectileRadius,10,8),redMaterial);
        shot.position.set(camera.position.x,camera.position.y,camera.position.z);
        
        cameraDirs.push(camera.getWorldDirection(new Vector3()));

        rays.push(new Ray(camera.position, camera.getWorldDirection(new Vector3())));

        shot.active=true
        setTimeout(()=>{
            scene.remove(shot);
            shot.active=false
        },4000)

        shot.geometry.boundingSphere = new Sphere();
        // shot.geometry.boundingSphere.center = new Vector3(camera.position.x,camera.position.y,camera.position.z);
        shot.geometry.boundingSphere.radius = projectileRadius;
        projectiles.push(shot)
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
            break;

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

