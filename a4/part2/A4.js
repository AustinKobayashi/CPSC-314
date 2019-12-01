/*
 * UBC CPSC 314, Vjan2019
 * Assignment 4 Template
 */

// CHECK WEBGL VERSION
if ( WEBGL.isWebGL2Available() === false ) {
  document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );
}

// Setup renderer
var container = document.createElement( 'div' );
document.body.appendChild( container );

var canvas = document.createElement("canvas");
var context = canvas.getContext( 'webgl2' );
var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
renderer.setClearColor(0X808080); // background colour
container.appendChild( renderer.domElement );

// Adapt backbuffer to window size
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  shadowMap_Camera.aspect = window.innerWidth / window.innerHeight;
  shadowMap_Camera.updateProjectionMatrix();
}

// Hook up to event listener
window.addEventListener('resize', resize);
window.addEventListener('vrdisplaypresentchange', resize, true);

// Disable scrollbar function
window.onscroll = function() {
  window.scrollTo(0, 0);
}

// Add scene
var depthScene = new THREE.Scene(); // shadow map
var finalScene = new THREE.Scene(); // final map

var lightDirection = new THREE.Vector3(0.49,0.79,0.49);

// Shadow map camera
// TODO: change the shadowMap_camera for scene that creates shadow map

// THE LIGHT SOURCE IS DIRECTIONAL, SO ALL OF ITS LIGHT RAYS ARE PARALLEL
// THEREFORE WE USE AN ORTHOGRAPHIC CAMERA SINCE IT PRESERVES THIS
var shadowMapWidth = 10;
var shadowMapHeight = 10;
var shadowMap_Camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 1, 1000);


// TODO: set the camera's lookAt and then add at it to the scene
shadowMap_Camera.position.set(10.0, 10.0, 10.0);
let lookAt = new THREE.Vector3(shadowMap_Camera.position - lightDirection)
shadowMap_Camera.lookAt(lookAt);
depthScene.add(shadowMap_Camera);

// Main camera
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(0,10,20);
camera.lookAt(finalScene.position);
finalScene.add(camera);


// COMMENT BELOW FOR VR CAMERA
// ------------------------------

// Giving camera some controls
cameraControl = new THREE.OrbitControls(camera);
cameraControl.damping = 0.2;
cameraControl.autoRotate = false;
// ------------------------------
// COMMENT ABOVE FOR VR CAMERA


// UNCOMMENT BELOW FOR VR CAMERA
// ------------------------------
// Apply VR headset positional data to camera.
// var controls = new THREE.VRControls(camera);
// controls.standing = true;

// // Apply VR stereo rendering to renderer.
// var effect = new THREE.VREffect(renderer);
// effect.setSize(window.innerWidth, window.innerHeight);

// var display;

// // Create a VR manager helper to enter and exit VR mode.
// var params = {
//   hideButton: false, // Default: false.
//   isUndistorted: false // Default: false.
// };
// var manager = new WebVRManager(renderer, effect, params);
// ------------------------------
// UNCOMMENT ABOVE FOR VR CAMERA


// XYZ axis helper
var worldFrame = new THREE.AxesHelper(2);
finalScene.add(worldFrame);

// texture containing the depth values from the shadowMap_Camera POV
// TODO: create the depthTexture associating with this RenderTarget
var shadowMap = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
//var depthTexture = new THREE.DepthTexture(shadowMapWidth, shadowMapHeight);
var depthTexture = new THREE.DepthTexture(1024, 1024);
shadowMap.depthTexture = depthTexture;



// load texture
// anisotropy allows the texture to be viewed decently at skewed angles
var colorMap = new THREE.TextureLoader().load('images/color.jpg');
colorMap.minFilter = THREE.LinearFilter;
colorMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
var normalMap = new THREE.TextureLoader().load('images/normal.png');
normalMap.minFilter = THREE.LinearFilter;
normalMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
var aoMap = new THREE.TextureLoader().load('images/ambient_occlusion.png');
aoMap.minFilter = THREE.LinearFilter;
aoMap.anisotropy = renderer.capabilities.getMaxAnisotropy();


var parallaxColorMap = new THREE.TextureLoader().load('images/bricks.jpg');
parallaxColorMap.minFilter = THREE.LinearFilter;
parallaxColorMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

var parallaxNormalMap = new THREE.TextureLoader().load('images/bricks_normal.jpg');
parallaxNormalMap.minFilter = THREE.LinearFilter;
parallaxNormalMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

var parallaxDisplacementMap = new THREE.TextureLoader().load('images/bricks_disp.jpg');
parallaxDisplacementMap.minFilter = THREE.LinearFilter;
parallaxDisplacementMap.anisotropy = renderer.capabilities.getMaxAnisotropy();


var shipTexture = new THREE.TextureLoader().load('images/ship.png');
shipTexture.minFilter = THREE.LinearFilter;
shipTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();



// Uniforms
var cameraPositionUniform = {type: "v3", value: camera.position};
var lightColorUniform = {type: "c", value: new THREE.Vector3(1.0, 1.0, 1.0)};
var ambientColorUniform = {type: "c", value: new THREE.Vector3(1.0, 1.0, 1.0)};
var lightDirectionUniform = {type: "v3", value: lightDirection};
var kAmbientUniform = {type: "f", value: 0.1};
var kDiffuseUniform = {type: "f", value: 0.8};
var kSpecularUniform = {type: "f", value: 0.4};
var shininessUniform = {type: "f", value: 50.0};
var armadilloPosition = { type: 'v3', value: new THREE.Vector3(0.0,0.0,0.0)};

var lightViewMatrixUniform = {type: "m4", value: shadowMap_Camera.matrixWorldInverse};
var lightProjectMatrixUniform = {type: "m4", value: shadowMap_Camera.projectionMatrix};


var shipRotationUniform = {type: "f", value: 0.0};
var movementVecUniform = { type: 'v3', value: new THREE.Vector3(0.0,0.0,0.0)};



// Materials
var depthFloorMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightViewMatrix: lightViewMatrixUniform,
    lightProjMatrix: lightProjectMatrixUniform
  }
});

var depthArmadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    armadilloPosition: armadilloPosition
  }
});

var terrainMaterial = new THREE.ShaderMaterial({
  uniforms: {
      lightColor: lightColorUniform,
      ambientColor: ambientColorUniform,
      lightDirection: lightDirectionUniform,
      kAmbient: kAmbientUniform,
      kDiffuse: kDiffuseUniform,
      kSpecular: kSpecularUniform,
      shininess: shininessUniform,
      colorMap: { type: "t", value: colorMap },
      normalMap: { type: "t", value: normalMap },
      aoMap: { type: "t", value: aoMap },
      shadowMap: { type: "t", value: shadowMap.depthTexture },
      lightViewMatrix: lightViewMatrixUniform,
      lightProjMatrix: lightProjectMatrixUniform
    }
});


var parallaxMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightColor: lightColorUniform,
    ambientColor: ambientColorUniform,
    lightPos: lightDirectionUniform,
    viewPos: {type: "v3", value: new THREE.Vector3(0, 10, 20)},
    kAmbient: kAmbientUniform,
    kDiffuse: kDiffuseUniform,
    kSpecular: kSpecularUniform,
    shininess: shininessUniform,
    heightScale: {type: "f", value: 0.05},
    diffuseMap: { type: "t", value: parallaxColorMap },
    normalMap: { type: "t", value: parallaxNormalMap },
    depthMap: { type: "t", value: parallaxDisplacementMap }
  }
});

// Skybox texture
// TODO: set up the texture for skybox
var skyboxCubemap = new THREE.CubeTextureLoader()
  .setPath( 'images/' )
    .load( [
    "negx.png", 
    "posx.png", 
    "posy.png", 
    "negy.png", 
    "posz.png", 
    "negz.png"]
    );
skyboxCubemap.format = THREE.RGBFormat;

// TODO: set up the material for skybox
var skyboxMaterial = new THREE.ShaderMaterial({
    uniforms: {
      skybox: {value: skyboxCubemap}
    },
    depthWrite: false,
    side: THREE.BackSide
});

var armadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightColor: lightColorUniform,
    ambientColor: ambientColorUniform,
    lightDirection: lightDirectionUniform,
    kAmbient: kAmbientUniform,
    kDiffuse: kDiffuseUniform,
    kSpecular: kSpecularUniform,
    shininess: shininessUniform,
    armadilloPosition: armadilloPosition
  }
});


// TODO: set up the material for environment mapping
var envmapMaterial = new THREE.ShaderMaterial({ 
  uniforms: {
    skybox: {value: skyboxCubemap},
    matrixWorld: {type: "m4", value: camera.matrixWorldInverse}
  }
});



var shipMaterial = new THREE.ShaderMaterial({ 
  uniforms: {
    rotation: shipRotationUniform,
    lightColor: lightColorUniform,
    ambientColor: ambientColorUniform,
    lightDirection: lightDirectionUniform,
    kAmbient: kAmbientUniform,
    kDiffuse: kDiffuseUniform,
    kSpecular: kSpecularUniform,
    shininess: shininessUniform,
    shipTexture: { type: "t", value: shipTexture },
    movementVec: movementVecUniform,
    speed: { type: "f", value: 0.5 }
  }
});




// Load shaders
var shaderFiles = [
  'glsl/depth.vs.glsl',
  'glsl/depth.fs.glsl',

  'glsl/terrain.vs.glsl',
  'glsl/terrain.fs.glsl',

  'glsl/bphong.vs.glsl',
  'glsl/bphong.fs.glsl',

  'glsl/skybox.vs.glsl',
  'glsl/skybox.fs.glsl',

  'glsl/envmap.vs.glsl',
  'glsl/envmap.fs.glsl',
  
  'glsl/parallax.vs.glsl',
  'glsl/parallax.fs.glsl',
  
  'glsl/ship.vs.glsl',
  'glsl/ship.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  depthFloorMaterial.vertexShader = shaders['glsl/depth.vs.glsl'];
  depthFloorMaterial.fragmentShader = shaders['glsl/depth.fs.glsl'];

  depthArmadilloMaterial.vertexShader = shaders['glsl/bphong.vs.glsl'];
  depthArmadilloMaterial.fragmentShader = shaders['glsl/depth.fs.glsl'];

  terrainMaterial.vertexShader = shaders['glsl/terrain.vs.glsl'];
  terrainMaterial.fragmentShader = shaders['glsl/terrain.fs.glsl'];

  armadilloMaterial.vertexShader = shaders['glsl/bphong.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl/bphong.fs.glsl'];

  skyboxMaterial.vertexShader = shaders['glsl/skybox.vs.glsl'];
  skyboxMaterial.fragmentShader = shaders['glsl/skybox.fs.glsl'];

  envmapMaterial.vertexShader = shaders['glsl/envmap.vs.glsl'];
  envmapMaterial.fragmentShader = shaders['glsl/envmap.fs.glsl'];
  
  parallaxMaterial.vertexShader = shaders['glsl/parallax.vs.glsl'];
  parallaxMaterial.fragmentShader = shaders['glsl/parallax.fs.glsl'];
  
  shipMaterial.vertexShader = shaders['glsl/ship.vs.glsl'];
  shipMaterial.fragmentShader = shaders['glsl/ship.fs.glsl'];
});

// var ctx = renderer.context;
// stops shader warnings, seen in some browsers
// ctx.getShaderInfoLog = function () { return '' };

// Adding objects
// LOAD OBJ ROUTINE
// mode is the scene where the model will be inserted
function loadOBJ(scene, file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function(query) {
    if (query.lengthComputable) {
      var percentComplete = query.loaded / query.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };

  var onError = function() {
    console.log('Failed to load ' + file);
  };

  var loader = new THREE.OBJLoader();
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    object.position.set(xOff, yOff, zOff);
    object.rotation.x = xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale, scale, scale);
    scene.add(object);
  }, onProgress, onError);
}

var terrainGeometry = new THREE.PlaneBufferGeometry(10, 10);


var terrainShadow = new THREE.Mesh(terrainGeometry, depthFloorMaterial);
terrainShadow.rotation.set(-1.57, 0, 0);
depthScene.add(terrainShadow);

var terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
terrain.rotation.set(-1.57, 0, 0);
finalScene.add(terrain);



var parallaxGeometry = new THREE.PlaneBufferGeometry(5, 5);
var parallax = new THREE.Mesh(parallaxGeometry, parallaxMaterial);
parallax.position.set(7.5, 0, 0);
parallax.rotation.set(-1.57, 0, 0);
finalScene.add(parallax);






var skybox = new THREE.Mesh(new THREE.BoxGeometry( 1000, 1000, 1000 ), skyboxMaterial);
finalScene.add(skybox);

loadOBJ(depthScene, 'obj/armadillo.obj', depthArmadilloMaterial, 1.0, -1.0, 1.0, 0, 0, 0, 0);
loadOBJ(finalScene, 'obj/armadillo.obj', armadilloMaterial,      1.0, -1.0, 1.0, 0, 0, 0, 0);
loadOBJ(finalScene, 'obj/armadillo.obj', envmapMaterial,         1.0, 2.0, 1.0, 0, 0, 0, 0);
loadOBJ(finalScene, 'obj/ship.obj', shipMaterial, 0.005, 0, 5.0, 0, 0, 0, 0);

var sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
var sphere = new THREE.Mesh(sphereGeometry, envmapMaterial);
sphere.position.set(0, 1, -2);
finalScene.add(sphere);

// Input
var keyboard = new THREEx.KeyboardState();

function checkKeyboard() {
//  if (keyboard.pressed("A"))
//    armadilloPosition.value.x -= 0.1;
//  if (keyboard.pressed("D"))
//    armadilloPosition.value.x += 0.1;
//  if (keyboard.pressed("W"))
//    armadilloPosition.value.z -= 0.1;
//  if (keyboard.pressed("S"))
//    armadilloPosition.value.z += 0.1;

  if (keyboard.pressed("A"))
    shipRotationUniform.value -= 3;
  if (keyboard.pressed("D"))
    shipRotationUniform.value += 3;
    
  if (keyboard.pressed("W")) {
    movementVecUniform.value.x -= Math.sin(Math.PI * (shipRotationUniform.value / 180));
    movementVecUniform.value.z += Math.cos(Math.PI * (shipRotationUniform.value / 180));
  }
}

function updateMaterials() {
  cameraPositionUniform.value = camera.position;

  depthFloorMaterial.needsUpdate = true;
  depthArmadilloMaterial.needsUpdate = true;
  terrainMaterial.needsUpdate = true;
  armadilloMaterial.needsUpdate = true;
  skyboxMaterial.needsUpdate = true;
  envmapMaterial.needsUpdate = true;
  parallaxMaterial.needsUpdate = true;
  shipMaterial.needsUpdate = true;
}

// Update routine
function update() {
  checkKeyboard();
  updateMaterials();

  requestAnimationFrame(update);
  // render depthScene to shadowMap target (instead of canvas as usual)
  renderer.render(depthScene, shadowMap_Camera, shadowMap);
  // render finalScene to the canvas
  renderer.render(finalScene, camera);

  // UNCOMMENT to see the shadowmap values
  //renderer.render(depthScene, shadowMap_Camera);

  // UNCOMMENT BELOW FOR VR CAMERA
  // ------------------------------
  // Update VR headset position and apply to camera.
  // controls.update();
  // ------------------------------
  // UNCOMMENT ABOVE FOR VR CAMERA
}

resize();
update();
