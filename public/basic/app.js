function Render(id, options) {
  var canvas = document.getElementById(id);
  options = options || {};
  var fov = options.fov || 75;
  // Set initial width/height
  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight;
  var camera = new THREE.PerspectiveCamera( fov, width/height, 0.1, 1000 );
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

  // Create a scene!
  var scene = new THREE.Scene();
  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( {
    color: 0xff5299,
    wireframe: true
  } );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  camera.position.z = 2;

  function render() {
    requestAnimationFrame( render );
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;
    renderer.render( scene, camera );
  }
  render();
}


Render('canvas', { fov: 75, antialias: true });
