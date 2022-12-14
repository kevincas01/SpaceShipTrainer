import {
	Euler,
	EventDispatcher,
	Vector3,
    Spherical,
    Object3D,
    Mesh
} from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class ship extends Object3D {
    constructor(scene){
        // super(geometry, material);
        super();
        debugger;

        this.model = undefined;

        const thisShip = this;

        // Load a glTF resource

        const loader = new GLTFLoader();
        loader.load(
            // resource URL
            './src/components/models/ship1.glb',
            // called when the resource is loaded
            function ( gltf ) {

                debugger;

                scene.add( gltf.scene );

                thisShip.model = gltf.scene;

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

export default ship;