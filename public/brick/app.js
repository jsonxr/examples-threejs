THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 );

var skyColor = 0xaaaaff;
var colorLightGray = 0xafb5c7;

var PLATE_COUNT = 16;
var STUD_DISPLAY_DISTANCE = 1; // The number of 32x32 plates to draw studs on

function getMaterials() {
  var materials = {

    red: new THREE.MeshPhongMaterial({
      // light
      specular: '#ffffff',
      // intermediate
      color: '#ff0000',
      // dark
      //emissive: '#006063',
      shininess: 10
    }),

    lightGray: new THREE.MeshPhongMaterial({
      // light
      specular: '#ffffff',
      // intermediate
      color: colorLightGray,
      // dark
      //emissive: '#006063',
      shininess: 10
    })

  };
  return materials;
}

function createLights(scene) {
  // add subtle ambient lighting
  //var ambientLight = new THREE.AmbientLight(0x222222);
  //scene.add(ambientLight);

  // directional lighting
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 1, 0).normalize();
  scene.add(directionalLight);

  var hemiLight = new THREE.HemisphereLight(skyColor, colorLightGray, 0.9);
  scene.add(hemiLight);
}

function addBrick(scene, materials) {
  // Make a brick
  var brick = new THREE.Mesh(THREEx.BrickGeometry({ width: 2, depth: 4, height: 3 }), materials.red);
  console.log('h'+brick.geometry.parameters.height);
  // Move it up so the bottom of the plate is at 0
  brick.translateY((brick.geometry.parameters.height / 2))
  scene.add(brick);
  return brick;
}

function addBasePlates(scene, materials) {
  var plateGeometry = THREEx.BrickGeometry({ width: 32, depth: 32, height: 1, studs: true});
  var baseplate = new THREE.Mesh(plateGeometry, materials.lightGray);

  var baseplateNo = new THREE.Mesh(THREEx.BrickGeometry({ width: 32, depth: 32, height: 1, studs: false}), materials.lightGray);

  function addPlate(i, j) {
    var ground;
    if (Math.abs(i) <= STUD_DISPLAY_DISTANCE && Math.abs(j) <= STUD_DISPLAY_DISTANCE) {
      ground = baseplate.clone();
    } else {
      ground = baseplateNo.clone();
    }
    var shift = THREEx.BrickGeometry.BRICK_WIDTH * 32;
    ground.translateX(-shift * i);
    ground.translateZ(-shift * j);
    // Move it down so the top of the plate is at 0
    ground.translateY(- (ground.geometry.parameters.height / 2));
    ground.matrixAutoUpdate = false;
    ground.updateMatrix();
    scene.add(ground);
  }

  for (var i = -PLATE_COUNT; i <= PLATE_COUNT; i++) {
    for (var j = -PLATE_COUNT; j <= PLATE_COUNT; j++) {
      addPlate(i, j);
    }
  }
}

function Render(id, options) {
  var canvas = document.getElementById(id);
  options = options || {};
  var fov = options.fov || 100;
  // Set initial width/height
  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight;
  var camera = new THREE.PerspectiveCamera( fov, width/height, 4, 16 * 32 * THREEx.BrickGeometry.SCALE );

  // Create the renderer
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  // Resize the canvas when the window resizes
  THREEx.WindowResizer({ renderer: renderer, canvas: canvas, camera: camera });

  // Create a scene!
  var scene = new THREE.Scene();
  // Add the 3d axes
  axes = new THREE.AxisHelper(500);
  scene.add(axes);
  // Add lights to the scene
  createLights(scene);
  var materials = getMaterials();
  addBasePlates(scene, materials);

  var brick = addBrick(scene, materials);

  //camera.rotation.x = Math.PI / 2;
  camera.position.y = 11 * THREEx.BrickGeometry.BRICK_HEIGHT;
  camera.position.z = 16 * THREEx.BrickGeometry.BRICK_WIDTH;

  var stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild( stats.domElement );

  var rendererStats   = new THREEx.RendererStats();
  rendererStats.domElement.style.position = 'absolute'
  rendererStats.domElement.style.left = '0px'
  rendererStats.domElement.style.bottom   = '0px'
  document.body.appendChild( rendererStats.domElement )

  function animate() {
    stats.begin();

    brick.rotation.y += 0.02;//Math.PI / 2;
    //brick.rotation.x = Math.PI / 2;
    rendererStats.update(renderer);
    // monitored code goes here

    renderer.render( scene, camera );
    stats.end();

    requestAnimationFrame( animate );
  }
  requestAnimationFrame( animate );
}


Render('canvas', { fov: 75, antialias: true });
