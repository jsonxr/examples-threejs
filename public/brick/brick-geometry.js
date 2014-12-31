var THREEx = THREEx || {};

(function () {

  //
var matrix = new THREE.Matrix4();

THREEx.BrickGeometry = function Brick(parameters) {
  // Make sure was called with new BrickGeometry()
  if (! (this instanceof THREEx.BrickGeometry)) {
    return new THREEx.BrickGeometry(parameters);
  }
  parameters = parameters || {};
  parameters.width = parameters.width || 1;
  parameters.depth = parameters.depth || 1;
  parameters.height = parameters.height || 1;
  parameters.studs = (parameters.studs !== undefined) ? parameters.studs : true;
  // Get the box dimensions
  var width = THREEx.BrickGeometry.BRICK_WIDTH * parameters.width;
  var height = THREEx.BrickGeometry.BRICK_HEIGHT * parameters.height;
  var depth = THREEx.BrickGeometry.BRICK_WIDTH * parameters.depth;
  // Call super
  THREE.BoxGeometry.call(this, width, height, depth);
  this.type = 'BrickGeometry';
  this.parameters.brickWidth = parameters.width;
  this.parameters.brickHeight = parameters.height;
  this.parameters.brickDepth = parameters.depth;
  // To make the center of the rotation at the middle of the first stud (lower left)
  //var zoffset = (parameters.depth * parameters.scale / 2) - (parameters.scale / 2);
  //var xoffset = (parameters.width * parameters.scale / 2) - (parameters.scale / 2);
  //this.applyMatrix(new THREE.Matrix4().makeTranslation(xoffset, (height/2), -zoffset));

  if (parameters.studs) {
    this.merge(this.getStudsGeometry());
  }
};
THREEx.BrickGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREEx.BrickGeometry.setScale = function(scale, options) {
  THREEx.BrickGeometry.BRICK_HEIGHT = (8/20.0) * scale;
  THREEx.BrickGeometry.BRICK_HALF_HEIGHT = THREEx.BrickGeometry.BRICK_HEIGHT / 2;
  THREEx.BrickGeometry.BRICK_WIDTH = scale;
  THREEx.BrickGeometry.BRICK_HALF_WIDTH = THREEx.BrickGeometry.BRICK_WIDTH / 2;
  THREEx.BrickGeometry.STUD_HEIGHT = (4/20.0) * scale;
  THREEx.BrickGeometry.STUD_HALF_HEIGHT = THREEx.BrickGeometry.STUD_HEIGHT / 2;
  THREEx.BrickGeometry.STUD_RADIUS = ((12/20.0)/2) * scale;
  THREEx.BrickGeometry.STUD_FACES = 8;
  THREEx.BrickGeometry.SCALE = scale;
  THREEx.BrickGeometry.STUD_GEOMETRY = new THREE.CylinderGeometry(
    THREEx.BrickGeometry.STUD_RADIUS, // radius top
    THREEx.BrickGeometry.STUD_RADIUS, // radius bottom
    THREEx.BrickGeometry.STUD_HEIGHT,
    THREEx.BrickGeometry.STUD_FACES);
};
THREEx.BrickGeometry.prototype.getStudsGeometry = function () {
  if (! this.studsGeometry) {
    var studsGeometry = new THREE.Geometry();
    for (var i = 0; i < this.parameters.brickWidth; i++) {
      for (var j = 0; j < this.parameters.brickDepth; j++) {
        matrix.makeTranslation(
          (this.parameters.width/2) - THREEx.BrickGeometry.BRICK_HALF_WIDTH - (THREEx.BrickGeometry.BRICK_WIDTH * i),
          (this.parameters.height / 2) + THREEx.BrickGeometry.STUD_HALF_HEIGHT,
          (this.parameters.depth/2) - THREEx.BrickGeometry.BRICK_HALF_WIDTH - (THREEx.BrickGeometry.BRICK_WIDTH * j)
        );
        studsGeometry.merge(THREEx.BrickGeometry.STUD_GEOMETRY, matrix);
      }
    }
    this.studsGeometry = studsGeometry;
  }
  return this.studsGeometry;
};

// 20 is in LDU (LDraw Unit)
THREEx.BrickGeometry.setScale(20);

})();
