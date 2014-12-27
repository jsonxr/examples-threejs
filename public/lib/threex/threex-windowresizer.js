var THREEx = THREEx || {};

THREEx.WindowResizer = function WindowResizer(options, callback) {
  var listening = false;
  var renderer = options.renderer;
  var canvas = options.canvas;
  var camera = options.camera;
  var resizer = {};

  function calculateSizes() {
    // getComputedStyle returns values like 500.2333444px, so parseInt
    resizer.width = parseInt(window.getComputedStyle(canvas)
      .getPropertyValue("width"), 10);
    resizer.height = parseInt(window.getComputedStyle(canvas)
      .getPropertyValue("height"), 10);
  }

  var _onresize = null;

  resizer.start = function start() {
    if (listening) { return; }
    listening = true;
    calculateSizes();
    renderer.setSize( resizer.width, resizer.height, false );
    window.addEventListener('resize', _onresize, false);
  };
  resizer.stop = function stop() {
    if (!listening) { return; }
    listening = false;
    window.removeEventListener('resize', _onresize);
  };
  resizer.onresize = function onresize() {
    calculateSizes();
    // notify the renderer of the size change preserving the original style
    renderer.setSize( resizer.width, resizer.height, false );
    // update the camera
    camera.aspect	= resizer.width / resizer.height;
    camera.updateProjectionMatrix();
    // Call the passed in callback if we resized
    if (callback) { callback(resizer.width, resizer.height) }
  };
  // Bind the method to this instance of resizer
  _onresize = resizer.onresize.bind(resizer);

  // Make the resizer start listening
  resizer.start();
  return resizer;
};
