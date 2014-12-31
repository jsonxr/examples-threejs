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


  if (char = " ") {
    // then do something
  } else {
    // else do something else
  }










  var controls = new THREEx.FpsControls(camera, {});
  scene.add( controls.getObject() );
  game.camera = controls.getObject();


  // PointerLock
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
  console.log('COS45: ' + COS45);

  function render() {
    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;
    prevTime = time;

    requestAnimationFrame( render );
    //cube.rotation.x += 0.02;
    //cube.rotation.y += 0.02;
    if (controls) {
      controls.update(delta);
    }

    game.onupdate();
    renderer.render( scene, camera );
  }
  render();


  return game;
}
