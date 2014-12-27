function Render(id, options) {
  var canvas = document.getElementById(id);
  options = options || {};
  var fov = options.fov || 75;

  var rendererOptions = {
    canvas: canvas,
    antialias: options.antialias || false
  };
  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight;
  console.log("width="+width + " height=" + height);

  var height = parseInt(window.getComputedStyle(canvas)
    .getPropertyValue("height"), 10);
  var width = parseInt(window.getComputedStyle(canvas)
    .getPropertyValue("width"), 10);
  console.log("create: width="+width + " height=" + height);



  var camera = new THREE.PerspectiveCamera( fov, width/height, 0.1, 1000 );

  //debugger
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });
  // Resize the canvas when the window resizes
  THREEx.WindowResizer({
    renderer: renderer,
    canvas: canvas,
    camera: camera
  }, function (width, height) {

  });

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
    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;
    renderer.render( scene, camera );
  }
  render();
}


Render('canvas', { fov: 75, antialias: true });
