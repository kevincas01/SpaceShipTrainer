import {
	Euler,
	EventDispatcher,
	Vector3,
    Spherical,
    Object3D,
    Mesh
} from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class Ship extends Mesh {
    constructor(scene){
        // super(geometry, material);
        super();
        // debugger;

        let thisShip = this;
        thisShip.creationTime = undefined;
        thisShip.movementOffset = undefined;
        // thisShip = undefined;

        // Load a glTF resource


        this.loadModel = function (modelPath) {
            const loader = new GLTFLoader();
            loader.load(
                // resource URL
                modelPath,
                // called when the resource is loaded
                function ( gltf ) {
    
                    // debugger;
    
                    thisShip.copy(gltf.scene.children[0]);
    
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Group
                    gltf.scenes; // Array<THREE.Group>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object
    
                },
                // called while loading is progressing
                function ( xhr ) {
    
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
                },
                // called when loading has errors
                function ( error ) {
    
                    console.log( 'An error happened' );
    
                }
            );
    
        }
        
        



    }
}

export default Ship;