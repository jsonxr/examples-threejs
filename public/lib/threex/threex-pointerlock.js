var THREEx = THREEx || {};

THREEx.PointerLock = function PointerLock(options) {

  // Throw an error if this is not supported
  var havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;
  if (! havePointerLock) {
    throw new Error("pointerLock not supported");
  }


  var element = options.element || document.body;
  var onlockchanged = options.onlockchanged;
  var onlockerror = options.onlockerror;

  var pointerlockerror = function (event) {
    onlockerror(event);
  };

  var pointerlockchange = function (event) {
    var locked = document.pointerLockElement === element ||
        document.mozPointerLockElement === element ||
        document.webkitPointerLockElement === element;
    onlockchanged(locked);
  };

  // Hook pointer lock state change events
  document.addEventListener( 'pointerlockchange', pointerlockchange, false );
  document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
  document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false);

  document.addEventListener( 'pointerlockerror', pointerlockerror, false );
  document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
  document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

  // Normalize requestPointerLock
  element.requestPointerLock =
      element.requestPointerLock ||     // Try generic prefix
      element.mozRequestPointerLock ||  // Try mozilla specific prefix
      element.webkitRequestPointerLock; // Try webkit specific prefix

  // Normalize requestFullscreen
  element.requestFullscreen =
      element.requestFullscreen ||     // Try generic prefix
      element.mozRequestFullscreen ||  // Try mozilla specific prefix
      element.webkitRequestFullscreen; // Try webkit specific prefix

  var pointerLock = {};
  pointerLock.lock = function lock() {
    if ( /Firefox/i.test( navigator.userAgent ) ) {
      var fullscreenchange = function ( event ) {
        var isFullscreen = document.fullscreenElement === element ||
          document.mozFullscreenElement === element ||
          document.mozFullScreenElement === element;
        if (isFullscreen) {
          document.removeEventListener( 'fullscreenchange', fullscreenchange );
          document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
          element.requestPointerLock();
        }
      };

      // First request full screen
      document.addEventListener( 'fullscreenchange', fullscreenchange, false );
      document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
      element.requestFullscreen();
    } else {
      element.requestPointerLock();
    }
  };
  return pointerLock;
};
