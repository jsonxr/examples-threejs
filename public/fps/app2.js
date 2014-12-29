console.log('game...');

objects = [];

function Game(id, options) {

  console.log('blah')


  var canvas = document.getElementById(id);
  options = options || {};
  var fov = options.fov || 70;
  // Set initial width/height
  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight;
  var camera = new THREE.PerspectiveCamera( fov, width/height, 0.3, 1000 );
  // Create the renderer
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });
  // Resize the canvas when the window resizes
  THREEx.WindowResizer({
    renderer: renderer,
    canvas: canvas,
    camera: camera
  });

  var game = {};
  // Create events for game to override
  game.onlockchanged = function () {};
  game.onupdate = function () {};

  //game.ontick = function () {};


  // Create a scene!
  var scene = new THREE.Scene();
  var geometry;



  geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    specular: 0x009900,
    shininess: 3,
    shading: THREE.SmoothShading
  });
  var cube = new THREE.Mesh( geometry, material );
  cube.translateZ(0.5);
  cube.translateX(1.5);
  cube.translateY(1.5);
  scene.add( cube );

  function showGrids() {
    // Background grid and axes. Grid step size is 1, axes cross at 0, 0
    scene.add(THREEx.Coordinates.axesMesh({axisLength:4, axisRadius:0.005}));
    scene.add(THREEx.Coordinates.groundMesh({ orientation: "z" }));
    scene.add(THREEx.Coordinates.gridMesh({color:0xffffff,size:100,scale:1,orientation:"x"}));
    scene.add(THREEx.Coordinates.gridMesh({color:0xffffff,size:100,scale:1,orientation:"y"}));
    //scene.add(THREEx.Coordinates.gridMesh({color:0xffffff,size:100,scale:1,orientation:"z"}));
  }
  showGrids();


  objects = [];

  function setupScene() {
    console.log('setupScene')






    // floor

    geometry = new THREE.PlaneGeometry( 100, 100, 100, 100 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

    //for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
    //
    //  var vertex = geometry.vertices[ i ];
    //  vertex.x += Math.random() * 20 - 10;
    //  vertex.y += Math.random() * 2;
    //  vertex.z += Math.random() * 20 - 10;
    //
    //}

    for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

      var face = geometry.faces[ i ];
      face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
      face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
      face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

    }

    material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );



    // objects
    geometry = new THREE.BoxGeometry( 20, 20, 20 );

    for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

      var face = geometry.faces[ i ];
      face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
      face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
      face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

    }

    for ( var i = 0; i < 500; i ++ ) {

      material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

      var mesh = new THREE.Mesh( geometry, material );
      mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
      mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
      mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
      scene.add( mesh );

      material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

      objects.push( mesh );

    }

    //



  }
//  setupScene();

  if (char = " ") {
    // then do something
  } else {
    // else do something else
  }



  camera.position.set(0,0,0);
  camera.rotation.set(0,0,0);
  var pitch = new THREE.Object3D();
  pitch.add( camera );
  pitch.rotation.x = Math.PI / 2;
  var yaw = new THREE.Object3D();
  game.camera = yaw;
  yaw.position.set(2, -20, 1.6);
  yaw.add( pitch );
  scene.add(yaw);
  controlsenabled = false









  var controls = null;
  //
  //game.camera = camera;
  //game.camera.position.set(1.0, -4.0, 1.6);
  //game.camera.rotation.x = Math.PI / 2;

  var onMouseMove = function ( event ) {
    if (!controlsenabled) { return };

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    pitch.rotation.x -= movementY * 0.002;
    pitch.rotation.x = Math.max(0, Math.min(pitch.rotation.x, Math.PI));

    yaw.rotation.z -= movementX * 0.001;

  };
  document.addEventListener( 'mousemove', onMouseMove, false );


  //controls = new THREEx.FpsControls( camera, { orientation: "z" } );
  //scene.add( controls.getObject() );
  //game.camera = controls.getObject();







  var velocity = new THREE.Vector3();
  var moveForward = false;
  var moveBackward = false;
  var moveRight = false;
  var moveLeft = false;

  var onKeyDown = function ( event ) {
    if (!controlsenabled) {
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

      //case 32: // space
      //  if ( canJump === true ) velocity.y += JUMP_VELOCITY;
      //  canJump = false;
      //  break;

    }

  };

  var onKeyUp = function ( event ) {
    if (!controlsenabled) {
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

  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );




























  var pointerLock = THREEx.PointerLock({
    element: document.body,
    onlockchanged: function (locked) {
      if (controls) {
        controls.enabled = locked;
      }
      controlsenabled = locked;
      game.onlockchanged(locked);
    },
    onlockerror: function (event) {
      console.log('pointer lock error:');
      console.log(event);
    }
  });

  game.lockPointer = function lock() {
    console.log('calling pointer lock')
    pointerLock.lock();
  };


  // add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(ambientLight);

  // directional lighting
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  var prevTime = performance.now();
  var COS45 = Math.cos(Math.PI / 4);
  console.log(COS45);

  function render() {

    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;
    prevTime = time;

    requestAnimationFrame( render );
    //cube.rotation.x += 0.02;
    //cube.rotation.y += 0.02;
    if (controls) {
      controls.update();
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
      if (velocity.y < WALK_VELOCITY) {
        velocity.y += WALK_ACCELERATION;
        if (velocity.y > WALK_VELOCITY) {
          velocity.y = WALK_VELOCITY;
        }
      }
    } else if (moveBackward) {
      // Accelerate backwards
      if (velocity.y > -WALK_VELOCITY) {
        velocity.y -= WALK_ACCELERATION;
        if (velocity.y < -WALK_VELOCITY) {
          velocity.y = -WALK_VELOCITY;
        }
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




    yaw.translateY(velocity.y * delta);
    yaw.translateX(velocity.x * delta);

    game.onupdate();
    renderer.render( scene, camera );
    //console.log(camera.position);
  }
  render();


  return game;
}


var game = Game('canvas', { fov: 75, antialias: true });
game.onlockchanged = function (locked) {
  console.log('game.onlockchanged: ' + locked);
  if (locked) {
    blocker.style.display = 'none';
  } else {
    blocker.style.display = '-webkit-box';
    blocker.style.display = '-moz-box';
    blocker.style.display = 'box';
  }
};

var position = document.getElementById('position');
var time =  document.getElementById('time');
game.onupdate = function () {

  var heading = (((180/Math.PI) * game.camera.rotation.z * 10) % 3600) / 10;


  position.innerHTML = "(" +
  game.camera.position.x.toFixed(1) + "," +
  game.camera.position.y.toFixed(1) + "," +
  game.camera.position.z.toFixed(1) + ")" +
  heading.toFixed(1);
  time.innerHTML = (new Date()).getSeconds();
};

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );
instructions.addEventListener( 'click', function (event) {
  console.log('lock!!!')
  console.log(event);
  game.lockPointer();
});
