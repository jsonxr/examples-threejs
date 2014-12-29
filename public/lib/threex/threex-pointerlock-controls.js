var THREEx = THREEx || {};

THREEx.FpsControls = function (camera, params) {
  params = params || {};
  var orientation = params.orientation || "z";

  var PI_2 = Math.PI / 2;
  var YAW_HEIGHT = 1.6;
  var SPEED = 100.0;

  var GRAVITY = 9.81;//  m/s^2
  var JUMP_VELOCITY = 1; // -> 1 m/s
  var WALK_VELOCITY = 4.317;  // -> 1 m/s
  var SPRINT_VELOCITY = 5.612;

  var scope = this;

  camera.position.set(0,0,0);
  camera.rotation.set( 0, 0, 0 );

  var pitchObject = new THREE.Object3D();
  if (orientation === "z") {
    camera.rotation.x = PI_2;
  }
  pitchObject.add( camera );

  var yawObject = new THREE.Object3D();

  if (orientation === "z") {
    yawObject.position.z = YAW_HEIGHT;
  } else {
    yawObject.position.y = YAW_HEIGHT;
  }
  yawObject.add( pitchObject );

  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;

  var isOnObject = false;
  var canJump = false;

  var prevTime = performance.now();

  var velocity = new THREE.Vector3();


  var onMouseMove = function ( event ) {

    if ( scope.enabled === false ) return;

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    //params.onmousemove();

    //yawObject.rotation.y -= movementX * 0.002;

    if (orientation === "z") {
      console.log("PI_2: " + PI_2 + " movementY: " + movementY + " pitch: " + pitchObject.rotation.x);
      //pitchObject.rotation.x -= movementY * 0.002;
      //pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
      //pitchObject.rotation.x = pitchObject.rotation.x;
      //pitchObject.rotation.x = Math.PI - (Math.PI / 4);
      pitchObject.rotation.x -= movementY * 0.002;
      pitchObject.rotation.x = Math.max( - PI_2, Math.min( Math.PI, pitchObject.rotation.x ) );
    } else if (orientation === "y") {
      pitchObject.rotation.x -= movementY * 0.002;
      pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
    }


  };

  var onKeyDown = function ( event ) {

    switch ( event.keyCode ) {

      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true; break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

      case 32: // space
        if ( canJump === true ) velocity.y += JUMP_VELOCITY;
        canJump = false;
        break;

    }

  };

  var onKeyUp = function ( event ) {

    switch( event.keyCode ) {

      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;

    }

  };

  document.addEventListener( 'mousemove', onMouseMove, false );
  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  this.enabled = false;

  this.getObject = function () {

    return yawObject;

  };

  this.isOnObject = function ( boolean ) {

    isOnObject = boolean;
    canJump = boolean;

  };

  this.getDirection = function() {

    // assumes the camera itself is not rotated

    var direction = new THREE.Vector3( 0, 0, -1 );
    var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

    return function( v ) {

      rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

      v.copy( direction ).applyEuler( rotation );

      return v;

    }

  }();

  this.update = function () {

    if ( scope.enabled === false ) return;

    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;


    velocity.x = WALK_VELOCITY;
    velocity.z = WALK_VELOCITY;


    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    //velocity.y = velocity.y - (9.8 * delta * delta);

    if ( moveForward ) {
      velocity.z = -1.0 * WALK_VELOCITY;
      console.log('moveForward: ' + velocity.z);
    } else if ( moveBackward ) {
      velocity.z = 1.0 * WALK_VELOCITY;
      console.log('moveBackward: ' + velocity.z);
    } else {
      velocity.z = 0;
    };

    if ( moveLeft ) {
      velocity.x = -1.0 * WALK_VELOCITY;
    } else if ( moveRight ) {
      velocity.x = 1.0 * WALK_VELOCITY;
    } else {
      velocity.x = 0;
    }

    if ( isOnObject === true ) {

      velocity.y = Math.max( 0, velocity.y );

    }

    if (velocity.x !== 0) {
      yawObject.translateX(velocity.x * delta);
    }
    if (velocity.z !== 0) {
      yawObject.translateZ(velocity.z * delta);
    }

    yawObject.translateY( velocity.y * delta );
    if ( yawObject.position.y < YAW_HEIGHT ) {

      velocity.y = 0;
      yawObject.position.y = YAW_HEIGHT;

      canJump = true;

    }

    prevTime = time;

  };

};
