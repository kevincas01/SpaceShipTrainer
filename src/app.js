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

 - Make ship type 2 which shoots lasers
*/
import { AmbientLight, Box3,PlaneGeometry, OrthographicCamera,Mesh, WebGLRenderer, Ray, SpriteMaterial,Sprite, PerspectiveCamera, Vector3, Scene, Color, MeshBasicMaterial , TextureLoader, Texture, SphereGeometry, Group, Sphere, CurvePath} from 'three';

import { test } from 'objects';
import {Ship} from 'objects';


// create a div element
var div = document.createElement("div");

div.style.width="100vh"
div.style.width="100vw"

document.body.style.backgroundImage = "url(./src/components/sprites/space2.jpg)";
document.body.style.backgroundSize = "cover";
document.body.style.padding="0"
document.body.style.margin="0"
document.body.style.backgroundColor="black"

var headerDiv = document.createElement("div");
headerDiv.style.width="100%"
headerDiv.style.textAlign="center"
headerDiv.style.marginTop="10px"
var header=document.createElement("h1");
header.id="titleHeader"
header.innerHTML="SpaceShip Trainer"
header.style.fontSize = "150px";
header.style.color="purple"
header.style.marginTop="50px"
header.style.marginBottom="50px"
headerDiv.append(header)
// create a button element

var instructDiv = document.createElement("div");
instructDiv.style.width="100%"
instructDiv.style.display="flex"
instructDiv.style.alignContent="center"

var instructInnerDiv = document.createElement("div");
instructInnerDiv.style.width="700px"

instructInnerDiv.style.backgroundColor="purple"
instructInnerDiv.style.margin="auto"
instructInnerDiv.style.marginBottom="20px"
instructInnerDiv.style.fontWeight="BOLD"
instructInnerDiv.style.fontSize="20PX"

var instructions=document.createElement("p")
instructions.style.color="black"
instructions.innerHTML="The rules of the games are as follow:"


const ul = document.createElement('ul');
const li1 = document.createElement('li');
li1.textContent = 'Move up, down, right and left with the arrow keys on your keyboard or  w,a,s,d keys';
ul.appendChild(li1);

const li2 = document.createElement('li');
li2.textContent = 'Move your mouse around to change your perspective. You CANNOT look behind you';
ul.appendChild(li2);

const li3 = document.createElement('li');
li3.textContent = 'Mouse click to shoot through the reticle. Get as many points as you can.';
ul.appendChild(li3);

const li4 = document.createElement('li');
li4.textContent = 'DON\'T CRASH WITH AN ENEMY SPACESHIP or the game will end';
ul.appendChild(li4);

instructInnerDiv.appendChild(instructions)
instructInnerDiv.appendChild(ul)
instructDiv.appendChild(instructInnerDiv)

var buttonDiv = document.createElement("div");
buttonDiv.style.width="100%"
buttonDiv.style.display="flex"
buttonDiv.style.alignContent="center"

var button = document.createElement("div");
button.textContent="center"
button.id="beginButton"
button.style.padding="10px"
button.style.borderRadius="10px"
button.style.backgroundColor="purple"
button.style.width="25%"
button.style.fontSize = "75px";
button.style.padding = "15px";
button.style.textAlign="center"
// set the button's text
button.innerHTML = "Begin";
button.style.margin="auto"

buttonDiv.appendChild(button);

headerDiv.style.alignItems = "center";
headerDiv.style.justifyContent = "center";
// add the button to the div

div.appendChild(headerDiv)
div.appendChild(instructDiv)
div.appendChild(buttonDiv)

// add the div to the page
document.body.appendChild(div);


var sceneBool=false;
var scene;
var starsGroupA;
var starsGroupB;

var camera;
var renderer;
var controls;
var animationFrame

var redMaterial;

var projectiles=[];
var rays =[];
var cameraDirs=[];
var laserSounds = []; 

let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;

document.getElementById('beginButton').addEventListener('click', initScene);

function initScene(){

    let shipsRendered = false;

    let ships = new Group();


    const redShips = new Group();
    const yellowShips = new Group();
    const greenShips = new Group();

    ships.add(redShips);
    ships.add(yellowShips);
    ships.add(greenShips);

    const shipCollections = [redShips, yellowShips, greenShips];

    const redShip = new Ship();
    redShip.loadModel('./src/components/models/ship1.glb');
    
    const yellowShip = new Ship();
    yellowShip.loadModel('./src/components/models/ship2.glb');
    
    const greenShip = new Ship();
    greenShip.loadModel('./src/components/models/ship3.glb');


    const shipTypes = [redShip, yellowShip, greenShip];




    
    sceneBool=true
    const PI = 3.1415;
    // Initialize core ThreeJS components
    scene = new Scene();
    scene.background = new Color(0x000000);
    const light = new AmbientLight( 0x909090 ); // soft white light
    scene.add( light );


    // start code for stars
    starsGroupA = new Group();

    const getSprite = (texturePath) => {
        let texture=new TextureLoader().load(texturePath);

        let spriteMaterial = new SpriteMaterial( { map: texture } );
        let sprite = new Sprite(spriteMaterial );
        return sprite
    };


    const addStarsA = (texturePath, amount, spriteScale) => {

        let sprite = getSprite(texturePath);
        sprite.scale.set(spriteScale,spriteScale,spriteScale);
        
        
        for (let num = 0; num < amount; num++) {
          let coords=new Vector3(Math.floor(Math.random()*1000-500),Math.floor(Math.random()*1000-500),Math.floor(Math.random()*1000-500));
          
          const centerStarlessRadius = 50;
          // make sure stars don't get too close to area ship will be in
          if(!(Math.sqrt(coords.y ** 2 + coords.z ** 2) < centerStarlessRadius)){
            let pointSprite = sprite.clone();
            pointSprite.position.set(coords.x,coords.y,coords.z);
    
            starsGroupA.add(pointSprite);
          }
        //   scene.add(pointSprite);
        
        }
        starsGroupA.position.x=4000
        scene.add(starsGroupA);
    };

    addStarsA('src/components/sprites/red.png', 1000, 2);
    addStarsA('src/components/sprites/white.png', 1000, 5);
    addStarsA('src/components/sprites/blue.png',1000,3);


    starsGroupB=new Group()
    const addStarsB = (texturePath, amount, spriteScale) => {

        let sprite = getSprite(texturePath);
        sprite.scale.set(spriteScale,spriteScale,spriteScale);
        
        
        for (let num = 0; num < amount; num++) {
          let coords=new Vector3(Math.floor(Math.random()*1000-500),Math.floor(Math.random()*1000-500),Math.floor(Math.random()*1000-500));
          
          const centerStarlessRadius = 50;
          // make sure stars don't get too close to area ship will be in
          if(!(Math.sqrt(coords.y ** 2 + coords.z ** 2) < centerStarlessRadius)){
            let pointSprite = sprite.clone();
            pointSprite.position.set(coords.x,coords.y,coords.z);
    
            starsGroupB.add(pointSprite);

          }
        //   scene.add(pointSprite);
        
        }
        
        scene.add(starsGroupB);
    };

    addStarsB('src/components/sprites/red.png', 1000, 2);
    addStarsB('src/components/sprites/white.png', 1000, 5);
    addStarsB('src/components/sprites/blue.png',1000,3);


    starsGroupB.position.x = -750;
    // end code for stars
    
    const checkBlasterCollision = (ray, projectile, ship) => {

        if(ship != undefined){
            const shipBox = new Box3().setFromObject(ship);
            // const projectileSphere = new Sphere.projectile.geometry.boundingSphere.clone();
            // projectileSphere.position = projectile.position.clone();
            
            const projectileBox = new Box3().setFromObject(projectile);
        
        
                if(ray.intersectsBox(shipBox)){
                    
                    if(shipBox.intersectsBox(projectileBox)){
                        
                        count+=1;
                        const explosionAudio = new Audio("./src/components/sounds/explosion.mp3"); 
                        explosionAudio.play();
                        ship.clear();
                        ship.removeFromParent();
                        scene.remove(projectile);
                    }
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
    const height = window.innerHeight/5;

    camera = new PerspectiveCamera(50, 1, 0.1, 800);
    renderer = new WebGLRenderer({antialias: true });
    renderer.setSize( width, height );
    renderer.autoClear = false;
    const canvas = renderer.domElement;

    //HUD Display
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
    //HUD Display end

    // Set up camera
    camera.position.set(500, 0, 0);
    camera.lookAt(new Vector3(-15, 0, 0));

    // Set up renderer, canvas, and minor CSS adjustments
    renderer.setPixelRatio(window.devicePixelRatio);

    canvas.style.display = 'block'; // Removes padding below canvas
    document.body.style.margin = 0; // Removes margin around page
    document.body.style.overflow = 'hidden'; 
    document.body.appendChild(canvas);

    // Set up controls
    // const controls = new PlayerControls(camera, canvas);
     controls = new test(camera, canvas);
     controls.lock()
    // test.maxPolarAngle = 1;

    // controls.update();

    let curTime = 0;
    let prevTime = 0;


    const zLimit = 20;
    const yLimit = 20;

    // let raycaster = new THREE.Raycaster();
    let cameraDirection = new Vector3();
    let crosshairPos = new Vector3();

    

    // path for ships to follow

    const shipPath = new CurvePath();
    let fractionEnemyMovement = 0;


const originalShipSpawnRate = 2;
let curShipSpawnRate = originalShipSpawnRate;  // one ship spawns every 3 seconds


const originalShipsPerSpawn = 4;
const originalEnemySpeed = 20;
let shipsPerSpawn = originalShipsPerSpawn;
let enemySpeed = originalEnemySpeed;

let lastSpawnTime = 0;

let start = null;

const onAnimationFrameHandler = (timeStamp) => {

    // from https://stackoverflow.com/questions/52040914/resetting-the-value-of-timestamp-in-requestanimationframe
    if (!start) {
        start = timeStamp;
      };

    curTime = timeStamp - start;

        // difficulty increase over time code
    let secondsLog = Math.log((curTime/1000));
    
    enemySpeed = originalEnemySpeed * secondsLog;

    shipsPerSpawn = Math.floor(Math.log((curTime/1000) * originalShipsPerSpawn));
    

    // ship spawning code (spawns a ship every 2 seconds)
    if(Math.floor(curTime/1000) % originalShipSpawnRate == 0 && Math.floor(curTime/1000) != lastSpawnTime){

        lastSpawnTime = Math.floor(curTime/1000);

        if(shipsRendered){

            for (let i = 0; i < shipsPerSpawn; i++){

            

                const shipTypeInd = Math.floor(Math.random() * 3);

                
                const newShip = shipTypes[shipTypeInd].clone();
                newShip.position.z += Math.ceil(((2*Math.random())-1)*(zLimit));
                newShip.position.y = Math.ceil(((2*Math.random())-1)*(yLimit));
                newShip.position.x = 0;
                newShip.movementOffset = Math.random() * 2 * PI;
                newShip.rotateY(-PI/2);

                // rotate yellow ships more
                if(shipTypeInd == 1){
                    newShip.rotateZ(-PI/2);
                    newShip.rotateX(-PI/2);
                }

                
                newShip.creationTime = curTime;

                // newShip.rotateY(-PI/2);

                shipCollections[shipTypeInd].add(newShip);
            }

        }

    }


    if(redShip.geometry.index != undefined && yellowShip.geometry.index != undefined && greenShip.geometry.index != undefined && shipsRendered == false){
        // for(let i = 0; i < 10; i++){
        //     // debugger;
        //     const newShip = redShip.clone();
        //     newShip.position.z += i * 8;
        //     newShip.position.y = Math.ceil(((2*Math.random())-1)*60);
        //     newShip.rotateY(-PI/2);
        //     ships.add(newShip);
        // }
        // // redShip.position.set(480,3,3);
        // // scene.add(redShip);
        // ships.position.set(100,0,-30);
        scene.add(ships);

        // const path1 = new LineCurve3(ships.position.clone(), new Vector3(600,ships.position.y,ships.position.z));
        // shipPath.add(path1);
        shipsRendered = true;

    } 

    let deltaT = (curTime - prevTime)/1000;

    // player movement code start
    const playerStrafeSpeed = 20;

    const zMovement = deltaT * playerStrafeSpeed * (Number(moveLeft) - Number(moveRight));
    const yMovement = deltaT * playerStrafeSpeed * (Number(moveUp) - Number(moveDown));

    if(!(camera.position.z + zMovement > zLimit || camera.position.z + zMovement < -zLimit)) camera.position.z += zMovement;
    if(!(camera.position.y + yMovement > yLimit || camera.position.y + yMovement < -yLimit)) camera.position.y += yMovement;

    // player movement code end

    // speed of the stars going past spaceship
    const spaceshipForwardSpeed = 250;
    starsGroupA.position.x += (spaceshipForwardSpeed * deltaT);
    starsGroupB.position.x += (spaceshipForwardSpeed * deltaT);

    const differenceA=starsGroupA.position.x-camera.position.x
    const differenceB=starsGroupB.position.x-camera.position.x
    
    if(differenceA>750) starsGroupA.position.x =starsGroupB.position.x-1000;
    if(differenceB >750) starsGroupB.position.x = starsGroupA.position.x-1000;

    camera.getWorldDirection(cameraDirection);
    let ray = new Ray(camera.position, cameraDirection);
    ray.at(0.2, crosshairPos);
    
    const projectileSpeed = 5;
    for (let i = 0; i < projectiles.length; i++) {
        if(projectiles[i].active){

            projectiles[i].position.add(rays[i].direction.clone().multiplyScalar(projectileSpeed));
            // projectiles[i].position.add(cameraDirs[i].clone().multiplyScalar(raySpeed));

            if(shipsRendered){
                for(let j = 0; j < ships.children.length; j++){
            
                    for(let k = 0; k < ships.children[j].children.length; k++){
                        checkBlasterCollision(rays[i], projectiles[i], ships.children[j].children[k]);
                    }


                }
        }
        }
        else{
            projectiles.splice[i,1];
            continue;
        }
      
    }

    // move ships forward


    if(shipsRendered){
        for(let j = 0; j < ships.children.length; j++){
            // debugger;
            for(let k = 0; k < ships.children[j].children.length; k++){
                

                let curShip = ships.children[j].children[k];
                curShip.position.x += enemySpeed * deltaT;

                // delete curShip
                if(curShip.position.x > 800){
                    ships.children[j].remove(curShip);
                    curShip.clear();
                }

                
                
                if(j == 1){
                    curShip.position.z += 0.4 * Math.sin(curShip.movementOffset + Math.floor(curTime/1000) - Math.floor(curShip.creationTime/1000));

                }

                if(j == 2){
                    curShip.position.y += 0.2 * Math.sin(curShip.movementOffset + Math.floor(curTime/1000) - Math.floor(curShip.creationTime/100));
                    curShip.position.z += 0.2 * Math.cos(curShip.movementOffset + Math.floor(curTime/1000) - Math.floor(curShip.creationTime/100));
                }


                // check if ship hits player
                if(Math.abs(curShip.position.x - camera.position.x) < 1){
                    const shipBox = new Box3().setFromObject(curShip);
                    if(shipBox.containsPoint(camera.position)){
                        count = 0;

                        const wilhelmScreamAudio = new Audio("./src/components/sounds/wilhelm.mp3"); 
                        wilhelmScreamAudio.play();

                        curShipSpawnRate = originalShipSpawnRate;
                        enemySpeed = originalEnemySpeed;

                        start = null;

                        while(sceneHUD.children.length > 0){ 
                            sceneHUD.remove(sceneHUD.children[0]); 
                        }

                        const gameOver = new Audio("./src/components/sounds/gameOver.mp3"); 
                        gameOver.play();
                        removeScene()
                        ships.clear()
                        starsGroupA.clear()
                        starsGroupB.clear()

                        document.body.removeChild(canvas);
                        return
                    }
                }


            }


        }
}



    // if(shipsRendered && fractionEnemyMovement < 1){

    //     const enemySpeed = 100;
    //     const newPosition = shipPath.getPoint(fractionEnemyMovement);
    //     // debugger;
    //     ships.position.copy(newPosition);
    //     fractionEnemyMovement += enemySpeed * deltaT *0.001;


    // }

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
    if(animationFrame){
        window.requestAnimationFrame(onAnimationFrameHandler);
    }

};


animationFrame=window.requestAnimationFrame(onAnimationFrameHandler);


// Resize Handler
const windowResizeHandler = () => {
    if(sceneBool){
        const { innerHeight, innerWidth } = window;
        renderer.setSize(innerWidth, innerHeight);
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        };
    }
    
    windowResizeHandler();
    window.addEventListener('resize', windowResizeHandler, false);
    
    redMaterial = new MeshBasicMaterial({color: 0xff0000});

    controls.lock()

    div.style.display="none"
}



var gameOverDiv = document.createElement("div");
gameOverDiv.id="gameOver";

var gameOverheaderDiv = document.createElement("div");
gameOverheaderDiv.style.width="100%"
gameOverheaderDiv.style.textAlign="center"
gameOverheaderDiv.style.marginTop="10px"

var gameOverheader=document.createElement("h1");
gameOverheader.id="titleHeader"
gameOverheader.innerHTML="GAME OVER"
gameOverheader.style.fontSize = "150px";
gameOverheader.style.color="purple"

gameOverDiv.appendChild(gameOverheaderDiv);
gameOverheaderDiv.appendChild(gameOverheader)

gameOverDiv.style.display="none"
document.body.appendChild(gameOverDiv);

function removeScene(){
    for (let i = 0; i < scene.children.length; i ++) {
        let object = scene.children[i];
        
        scene.remove(object)
        if (object.type === 'Mesh') {
            object.geometry.dispose();
            object.material.dispose();
        }
        
    }
    scene.children=[]


    renderer.dispose()
    
    controls.unlock()
    sceneBool=false;
    window.cancelAnimationFrame(animationFrame);
    animationFrame=undefined
    scene = null;
    renderer = null;
    gameOverDiv.style.display="block"

    projectiles=[];
    rays =[];
    cameraDirs=[];
    laserSounds = []; 

    setTimeout(()=>{
        gameOverDiv.style.display="none"
        window.location.reload();
    },2000)
}


let mouseIsPressed=false;
let count=0;
function onMouseDown(){

    if(!mouseIsPressed){
        laserSounds.length = 0;
        return;
    }
    const audio = new Audio("./src/components/sounds/shortLaser.mp3"); 
    laserSounds.push(audio);

    if(sceneBool){

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

        rays.push(new Ray(camera.position.clone(), camera.getWorldDirection(new Vector3())));

        shot.active=true
        setTimeout(()=>{
            if(sceneBool){
                 scene.remove(shot);
                shot.active=false
            }
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
    debugger;

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


