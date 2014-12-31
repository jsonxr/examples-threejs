console.log('game...');


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
  game.lockPointer();
});
