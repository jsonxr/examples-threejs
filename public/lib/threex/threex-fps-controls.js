var THREEx = THREEx || {};

THREEx.FpsControls = function (camera, options) {
  var position, rotation, orientation, pitch, yaw;
  var enabled = (options.enabled !== undefined) ? options.enabled : false;

  orientation = options.orientation || "z";
  if (orientation != "z" && orientation != "x" && orientation != "y") {
    throw new Error("Invalid orientation: '" + orientation +
        "'. Must be 'x', 'y', or 'z'.");
  }
  if (orientation === "z") {
    position = new THREE.Vector3(0, 0, 1.6);
    rotation = new THREE.Vector3(Math.PI/2, 0, 0);
  } else {
    position = new THREE.Vector3(0, 0, 1.6);
    rotation = new THREE.Vector3(Math.PI/2, 0, 0);
  }
  if (options.position) {
    position = options.position;
  }

  var controls = {};
  controls.enabled = enabled;


  camera.position.set(0,0,0);
  camera.rotation.set(0,0,0);
  pitch = new THREE.Object3D();
  pitch.add( camera );
  pitch.rotation.set(rotation.x, rotation.y, rotation.z);
  yaw = new THREE.Object3D();
  yaw.position.set(position.x, position.y, position.z);
  yaw.add(pitch);


  var onMouseMove = function ( event ) {
    if (!controls.enabled) { return };

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    pitch.rotation.x -= movementY * 0.002;
    pitch.rotation.x = Math.max(0, Math.min(pitch.rotation.x, Math.PI));
    yaw.rotation.z -= movementX * 0.001;

  };

  var velocity = new THREE.Vector3();
  var moveForward = false;
  var moveBackward = false;
  var moveRight = false;
  var moveLeft = false;
  var canJump = true;
  var moveJump = false;

  var onKeyDown = function ( event ) {
    if (!controls.enabled) {
      moveForward = false;
      moveBackward = false;
      moveLeft = false;
      moveRight = false;
      return
    };

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
        if ( canJump === true ) {
          moveJump = true;
          canJump = false;
        }
        break;

    }

  };

  var onKeyUp = function ( event ) {
    if (!controls.enabled) {
      moveForward = false;
      moveBackward = false;
      moveLeft = false;
      moveRight = false;
      return
    };


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
  var prevTime = performance.now();
  var COS45 = Math.cos(Math.PI / 4);

  var airStart;

  controls.getObject = function getObject() {
    return yaw;
  };
  controls.update = function update() {
    // Number of seconds since the last update
    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;
    prevTime = time;
    // forward/backward cancel each other
    if (moveForward && moveBackward) {
      moveForward = false;
      moveBackward = false;
    }
    // left/right cancel each other
    if (moveLeft && moveRight) {
      moveLeft = false;
      moveRight = false;
    }


    var WALK_ACCELERATION = 1;// accelerate faster than we slow down
    var WALK_DECELERATION = 0.2; // decelerate slower
    var WALK_VELOCITY = 4.317;
    if (moveForward === moveBackward) {
      // Decelerate if both are false or both are true
      if (velocity.y < 0) {
        velocity.y += WALK_DECELERATION;
        if (velocity.y > 0) {
          velocity.y = 0;
        }
      } else if (velocity.y > 0) {
        velocity.y -= WALK_DECELERATION;
        if (velocity.y < 0) {
          velocity.y = 0;
        }
      }
    } else if (moveForward) {
      // Accelerate forward
      velocity.y += WALK_ACCELERATION;
      if (velocity.y > WALK_VELOCITY) {
        velocity.y = WALK_VELOCITY;
      }
    } else if (moveBackward) {
      // Accelerate backwards
      velocity.y -= WALK_ACCELERATION;
      if (velocity.y < -WALK_VELOCITY) {
        velocity.y = -WALK_VELOCITY;
      }
    }

    if (moveLeft === moveRight) {
      velocity.x = 0;
    } else if (moveLeft) {
      velocity.x = -WALK_VELOCITY;
    } else if (moveRight) {
      velocity.x = WALK_VELOCITY;
    }
    if (velocity.x > 0 && velocity.y > 0) {
      velocity.x = velocity.x * COS45;
      velocity.y = velocity.y * COS45;
    }

    var JUMP_VELOCITY = 2;
    if (moveJump) {
      airStart = performance.now();
      moveJump = false;
      if (controls.enabled) console.log('move jump');
      velocity.z = JUMP_VELOCITY;
    } else if (!canJump) {
      velocity.z -= 9.8 * delta; // 100.0 = mass
    }

    yaw.translateZ(velocity.z);
    if (!canJump &&  yaw.position.z < 1.6 ) {
      velocity.z = 0;
      yaw.position.z = 1.6;
      canJump = true;
      var airStop = performance.now();
      if (controls.enabled) console.log('air: ' + ((airStop - airStart)/1000));
    }


    if (controls.enabled) console.log("velocity: " + velocity.z + " position: " + yaw.position.z);






    yaw.translateY(velocity.y * delta);
    yaw.translateX(velocity.x * delta);
  };


  return controls;
};
