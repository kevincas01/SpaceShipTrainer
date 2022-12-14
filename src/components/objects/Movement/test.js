import {
	Euler,
	EventDispatcher,
	Vector3,
    Spherical
} from 'three';

const _euler = new Euler( 0, 0, 0, 'YXZ' );
const _vector = new Vector3();

const _changeEvent = { type: 'change' };
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

const _PI_2 = Math.PI / 2;

class test extends EventDispatcher {
    constructor( camera, domElement ) {

		super();

		this.domElement = domElement;
		this.isLocked = false;

		// Set to constrain the pitch of the camera
		// Range is 0 to Math.PI radians
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		this.pointerSpeed = 1.0;

		const scope = this;

		function onMouseMove( event ) {

			if ( scope.isLocked === false ) return;

			const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			_euler.setFromQuaternion( camera.quaternion );



			_euler.y -= movementX * 0.002 * scope.pointerSpeed;
			_euler.x -= movementY * 0.002 * scope.pointerSpeed;

			// _euler.x = Math.max( _PI_2 - scope.maxPolarAngle, Math.min( _PI_2 - scope.minPolarAngle, _euler.x ) );

            const polar_max = 2.28;
            const polar_min = 0.86;
			_euler.x = Math.max( _PI_2 - polar_max, Math.min( _PI_2 - polar_min, _euler.x ) );

            let sp = new Spherical();
            
            let cameraDirection = new Vector3();
            camera.getWorldDirection(cameraDirection);
            

            sp.setFromVector3(cameraDirection);
            const theta = sp.theta;
            // console.log(theta);
            const thetaMax = 1;
            const thetaMin = -1;
            // debugger;
            _euler.y = Math.max( _PI_2 - thetaMax, Math.min(_PI_2 - thetaMin, _euler.y ));
            // start code to limit mouse movement range



            // const maxMovementRange = 0.45;
            // let newEulerY = _euler.y - movementX * 0.002 * scope.pointerSpeed;
			// let newEulerX = _euler.x - movementY * 0.002 * scope.pointerSpeed;
            // const directionSum = Math.abs(cameraDirection.x) + Math.abs(cameraDirection.y);
            // debugger;
            // if(directionSum - 0.001 < maxMovementRange){
                // _euler.y = newEulerY;
                // _euler.x = newEulerX;
                // _euler.x = Math.max( _PI_2 - scope.maxPolarAngle, Math.min( _PI_2 - scope.minPolarAngle, _euler.x ) );

            // }


            // const mouseLimit = 0.45;
            // if(_euler.x > mouseLimit) _euler.x = mouseLimit;
            // if(_euler.x < -mouseLimit) _euler.x = -mouseLimit;

            // if(_euler.y > mouseLimit) _euler.y = mouseLimit;
            // if(_euler.y < -mouseLimit) _euler.y = -mouseLimit;

            // _euler.z = 0.99;

            // end code to limit mouse movement range

			camera.quaternion.setFromEuler( _euler );

			scope.dispatchEvent( _changeEvent );

		}

		function onPointerlockChange() {

			if ( scope.domElement.ownerDocument.pointerLockElement === scope.domElement ) {

				scope.dispatchEvent( _lockEvent );

				scope.isLocked = true;

			} else {

				scope.dispatchEvent( _unlockEvent );

				scope.isLocked = false;

			}

		}

		function onPointerlockError() {

			console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );

		}

		this.connect = function () {

			scope.domElement.ownerDocument.addEventListener( 'mousemove', onMouseMove );
			scope.domElement.ownerDocument.addEventListener( 'pointerlockchange', onPointerlockChange );
			scope.domElement.ownerDocument.addEventListener( 'pointerlockerror', onPointerlockError );

		};

		this.disconnect = function () {

			scope.domElement.ownerDocument.removeEventListener( 'mousemove', onMouseMove );
			scope.domElement.ownerDocument.removeEventListener( 'pointerlockchange', onPointerlockChange );
			scope.domElement.ownerDocument.removeEventListener( 'pointerlockerror', onPointerlockError );

		};

		this.dispose = function () {

			this.disconnect();

		};

		this.getObject = function () { // retaining this method for backward compatibility

			return camera;

		};

		this.getDirection = function () {

			const direction = new Vector3( 0, 0, - 1 );

			return function ( v ) {

				return v.copy( direction ).applyQuaternion( camera.quaternion );

			};

		}();

		this.moveForward = function ( distance ) {

			// move forward parallel to the xz-plane
			// assumes camera.up is y-up

			_vector.setFromMatrixColumn( camera.matrix, 0 );

			_vector.crossVectors( camera.up, _vector );

			camera.position.addScaledVector( _vector, distance );

		};

		this.moveRight = function ( distance ) {

			_vector.setFromMatrixColumn( camera.matrix, 0 );

			camera.position.addScaledVector( _vector, distance );

		};

		this.lock = function () {

			this.domElement.requestPointerLock();

		};

		this.unlock = function () {

			scope.domElement.ownerDocument.exitPointerLock();

		};

		this.connect();

	}

}

export default test