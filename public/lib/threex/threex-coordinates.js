var THREEx = THREEx || {};

THREEx.Coordinates = {
  gridMesh:function(params) {
    params = params || {};
    var size = params.size !== undefined ? params.size:100;
    var scale = params.scale !== undefined ? params.scale:0.1;
    var orientation = params.orientation !== undefined ? params.orientation:"x";
    var color = params.color || 0x555555;
    var grid = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size, size * scale, size * scale),
      new THREE.MeshBasicMaterial({ color: color, wireframe: true })
    );
    // Yes, these are poorly labeled! It would be a mess to fix.
    // What's really going on here:
    // "x" means "rotate 90 degrees around x", etc.
    // So "x" really means "show a grid with a normal of Y"
    //    "y" means "show a grid with a normal of X"
    //    "z" means (logically enough) "show a grid with a normal of Z"
    if (orientation === "y") {
      grid.rotation.x = - Math.PI / 2;
    } else if (orientation === "x") {
      grid.rotation.y = - Math.PI / 2;
    } else if (orientation === "z") {
      grid.rotation.z = - Math.PI / 2;
    }

    return grid;
  },

  groundMesh:function(params) {
    params = params || {};
    var size = params.size !== undefined ? params.size:100;
    var color = params.color !== undefined ? params.color:0xFFFFFF;
    var orientation = params.orientation || "z";
    var height = params.height || 0;

    var ground = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      // When we use a ground plane we use directional lights, so illuminating
      // just the corners is sufficient.
      // Use MeshPhongMaterial if you want to capture per-pixel lighting:
      // new THREE.MeshPhongMaterial({ color: color, specular: 0x000000,
      new THREE.MeshLambertMaterial({ color: color,
        // polygonOffset moves the plane back from the eye a bit, so that the lines on top of
        // the grid do not have z-fighting with the grid:
        // Factor == 1 moves it back relative to the slope (more on-edge means move back farther)
        // Units == 4 is a fixed amount to move back, and 4 is usually a good value
        polygonOffset: true, polygonOffsetFactor: 1.0, polygonOffsetUnits: 4.0
      }));

    if (orientation === "x") {
      ground.rotation.y = Math.PI / 2;
    } else if (orientation === "y") {
      ground.rotation.x = - Math.PI / 2;
    } else {
      // No need to do anything with z up
    }

    return ground;
  },

  axesMesh:function(params) {
    // x = red, y = green, z = blue  (RGB = xyz)
    params = params || {};
    var orientation = params.orientation;
    // If orientation wasn't passed in, call this again passing each of x,y,z
    if (! orientation) {
      var obj = new THREE.Object3D();
      params.orientation = "x";
      obj.add(this.axesMesh(params));
      params.orientation = "y";
      obj.add(this.axesMesh(params));
      params.orientation = "z";
      obj.add(this.axesMesh(params));
      return obj;
    }

    var axisRadius = params.axisRadius !== undefined ? params.axisRadius:0.04;
    var axisLength = params.axisLength !== undefined ? params.axisLength:11;
    var axisTess = params.axisTess !== undefined ? params.axisTess:48;
    var obj = new THREE.Object3D();

    var color = 0x000000;
    if (orientation === "x") {
      color = 0xff0000;
    } else if (orientation === "y") {
      color = 0x00ff00;
    } else if (orientation === "z") {
      color = 0x0000ff;
    }

    var axisMaterial = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
    var axis = new THREE.Mesh(
      new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true),
      axisMaterial
    );
    if (orientation === "x") {
      axis.rotation.z = - Math.PI / 2;
      axis.position.x = axisLength/2-1;
    } else if (orientation === "y") {
      axis.position.y = axisLength/2-1;
    } else if (orientation === "z") {
      axis.rotation.x = - Math.PI / 2;
      axis.position.z = axisLength/2-1;
    }

    obj.add( axis );

    //var arrow = new THREE.Mesh(
    //  new THREE.CylinderGeometry(0, 4*axisRadius, 8*axisRadius, axisTess, 1, true),
    //  axisMaterial
    //);
    //if (orientation === "x") {
    //  arrow.rotation.z = - Math.PI / 2;
    //  arrow.position.x = axisLength - 1 + axisRadius*4/2;
    //} else if (orientation === "y") {
    //  arrow.position.y = axisLength - 1 + axisRadius*4/2;
    //} else if (orientation === "z") {
    //  arrow.rotation.x = Math.PI / 2;
    //  arrow.position.z = axisLength - 1 + axisRadius*4/2;
    //}
    //
    //obj.add( arrow );
    //


    return obj;
  }

};
