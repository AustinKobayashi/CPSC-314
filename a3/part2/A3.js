/*
 * UBC CPSC 314, Vjan2019
 * Assignment 3 Template
 */

// CHECK WEBGL VERSION
if ( WEBGL.isWebGL2Available() === false ) {
  document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );
}
// Scene Modes
var Part = {
    GOURAUD: 0,
    PHONG: 1,
    BLINNPHONG: 2,
    FOG: 3,
    SPOTLIGHT: 4,
    TOON: 5,
    GOOCH: 6,
    MULTIPLELIGHTS: 7,
    COUNT: 8
}
var mode = Part.GOURAUD// current mode

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
    for (let i = 0; i < Part.COUNT; ++i) {
        cameras[i].aspect = window.innerWidth / window.innerHeight;
        cameras[i].updateProjectionMatrix();
    }
}

// Hook up to event listener
window.addEventListener('resize', resize);

// Disable scrollbar functi on
window.onscroll = function() {
    window.scrollTo(0, 0);
}

// Setup scenes
var scenes = [
    new THREE.Scene(),
    new THREE.Scene(),
    new THREE.Scene(),
    new THREE.Scene(),
    new THREE.Scene(),
    new THREE.Scene(),
    new THREE.Scene(),
    new THREE.Scene()
]

// Setting up all shared objects
var cameras = []
var controls = []
var worldFrames = []


for (let i = 0; i < Part.COUNT; ++i) {
    cameras[i] = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
    cameras[i].position.set(0,10,20);
    cameras[i].lookAt(scenes[i].position);
    scenes[i].add(cameras[i]);

    var directionlight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    directionlight.position.set(5, 8, 5);
    scenes[i].add(directionlight);

    // orbit controls
    controls[i] = new THREE.OrbitControls(cameras[i]);
    controls[i].damping = 0.2;
    controls[i].autoRotate = false;

    worldFrames[i] = new THREE.AxisHelper(2);
    scenes[i].add(worldFrames[i]);

}
resize();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////
// Parameters defining the light position
var lightColor = new THREE.Color(1.0,1.0,1.0);
var lightFogColor = new THREE.Color(0.5,0.5,0.5);
var ambientColor = new THREE.Color(0.4,0.4,0.4);
var lightDirection = new THREE.Vector3(0.49,0.79, 0.49);
var lightDirection2 = new THREE.Vector3(-0.49,-0.79, -0.49);
var spotlightPosition = new THREE.Vector3(0,7.0,0);


// Material properties
var kAmbient = 0.4;
var kDiffuse = 0.8;
var kSpecular = 0.8;
var shininess = 10.0;

// Uniforms
var lightColorUniform = {type: "c", value: lightColor};
var lightFogColorUniform = {type: "c", value: lightFogColor};
var ambientColorUniform = {type: "c", value: ambientColor};
var lightDirectionUniform = {type: "v3", value: lightDirection};
var lightDirectionUniform2 = {type: "v3", value: lightDirection2};
var spotlightPosition = {type: "v3", value: spotlightPosition};

var kAmbientUniform = {type: "f", value: kAmbient};
var kDiffuseUniform = {type: "f", value: kDiffuse};
var kSpecularUniform = {type: "f", value: kSpecular};
var shininessUniform = {type: "f", value: shininess};
var fogDensity = {type: "f", value: 0.02};

// Change this with keyboard controls in Part 1.D
var spotDirectPosition = {type: 'v3', value: new THREE.Vector3(0.0,0.0,0.0)};

// Materials

var spotlightMaterial = new THREE.ShaderMaterial({
    uniforms: {
        // TODO: pass in the uniforms you need
        spotDirectPosition: spotDirectPosition,
        spotlightPosition: spotlightPosition,
        
    }
});

var phongMaterial = new THREE.ShaderMaterial({
    uniforms: {
      lightColorUniform: lightColorUniform,
      lightDirectionUniform: lightDirectionUniform,
      ambientColorUniform: ambientColorUniform,
      shininessUniform: shininessUniform,
      kAmbientUniform: kAmbientUniform,
      kDiffuseUniform: kDiffuseUniform,
      kSpecularUniform: kSpecularUniform
    },
});

var bPhongMaterial = new THREE.ShaderMaterial({
    uniforms: {
      lightColorUniform: lightColorUniform,
      lightDirectionUniform: lightDirectionUniform,
      ambientColorUniform: ambientColorUniform,
      shininessUniform: shininessUniform,
      kAmbientUniform: kAmbientUniform,
      kDiffuseUniform: kDiffuseUniform,
      kSpecularUniform: kSpecularUniform
    },
});

var toonMaterial = new THREE.ShaderMaterial({
    uniforms: {
      lightColorUniform: lightColorUniform,
      lightDirectionUniform: lightDirectionUniform,
      ambientColorUniform: ambientColorUniform,
      shininessUniform: shininessUniform,
      kAmbientUniform: kAmbientUniform,
      kDiffuseUniform: kDiffuseUniform,
      kSpecularUniform: kSpecularUniform
    },
});

var fogMaterial = new THREE.ShaderMaterial({
    uniforms: {
      lightFogColorUniform: lightFogColorUniform,
      fogDensity: fogDensity,
      kDiffuseUniform: kDiffuseUniform,
      lightColorUniform: lightColorUniform,
      lightDirectionUniform: lightDirectionUniform
    },
});

var goochMaterial = new THREE.ShaderMaterial({
    uniforms: {
      lightColorUniform: lightColorUniform,
      lightDirectionUniform: lightDirectionUniform,
      ambientColorUniform: ambientColorUniform,
      shininessUniform: shininessUniform,
      kAmbientUniform: kAmbientUniform,
      kDiffuseUniform: kDiffuseUniform,
      kSpecularUniform: kSpecularUniform
    },
});

var multiplelightsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      lightColorUniform: lightColorUniform,
      lightDirectionUniform: lightDirectionUniform,
      lightDirectionUniform2: lightDirectionUniform2,
      ambientColorUniform: ambientColorUniform,
      shininessUniform: shininessUniform,
      kAmbientUniform: kAmbientUniform,
      kDiffuseUniform: kDiffuseUniform,
      kSpecularUniform: kSpecularUniform
    },
});

// LOAD SHADERS
var shaderFiles = [

  'glsl/spotlight.vs.glsl',
  'glsl/spotlight.fs.glsl',
  'glsl/phong.vs.glsl',
  'glsl/phong.fs.glsl',
  'glsl/phong_blinn.vs.glsl',
  'glsl/phong_blinn.fs.glsl',
  'glsl/fog.vs.glsl', 
  'glsl/fog.fs.glsl',
  'glsl/toon.fs.glsl',
  'glsl/toon.vs.glsl',
  'glsl/gooch.fs.glsl',
  'glsl/gooch.vs.glsl',
  'glsl/multiplelights.fs.glsl',
  'glsl/multiplelights.vs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {


  spotlightMaterial.vertexShader = shaders['glsl/spotlight.vs.glsl'];
  spotlightMaterial.fragmentShader = shaders['glsl/spotlight.fs.glsl'];

  phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
  phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
  bPhongMaterial.vertexShader = shaders['glsl/phong_blinn.vs.glsl'];
  bPhongMaterial.fragmentShader = shaders['glsl/phong_blinn.fs.glsl'];
  fogMaterial.vertexShader = shaders['glsl/fog.vs.glsl'];
  fogMaterial.fragmentShader = shaders['glsl/fog.fs.glsl'];
  toonMaterial.fragmentShader = shaders['glsl/toon.fs.glsl'];
  toonMaterial.vertexShader = shaders['glsl/toon.vs.glsl'];
  goochMaterial.fragmentShader = shaders['glsl/gooch.fs.glsl'];
  goochMaterial.vertexShader = shaders['glsl/gooch.vs.glsl'];
  multiplelightsMaterial.fragmentShader = shaders['glsl/multiplelights.fs.glsl'];
  multiplelightsMaterial.vertexShader = shaders['glsl/multiplelights.vs.glsl'];
})

var ctx = renderer.context;
ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

function loadOBJ(mode, file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
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
        object.parent = worldFrames[mode];
        scenes[mode].add(object);
    }, onProgress, onError);
}

function loadOBJbarycentric (mode, file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
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
    
    var numVertices = object.children[0].geometry.attributes.position.array.length;
    var barycentric = new Float32Array(3 * numVertices);
    var counter = 0;
    
    for (var i = 0; i < 3 * numVertices; i += 3) {
      if(counter == 0) {
        barycentric[i] = 1;
        barycentric[i + 1] = 0;
        barycentric[i + 2] = 0;
      }
      if(counter == 1) {
        barycentric[i] = 0;
        barycentric[i + 1] = 1;
        barycentric[i + 2] = 0;
      }
      if(counter == 2) {
        barycentric[i] = 0;
        barycentric[i + 1] = 0;
        barycentric[i + 2] = 1;
      }
      
      counter = (counter + 1) % 3;
    }
    
    object.children[0].geometry.addAttribute( 'barycentric', new THREE.BufferAttribute(barycentric, 3));
    
    object.position.set(xOff, yOff, zOff);
    object.rotation.x = xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale, scale, scale);
    object.parent = worldFrames[mode];
    scenes[mode].add(object);
  }, onProgress, onError);
}


/////////////////////////////////
//       GOURAUD SCENE           //
//    RELEVANT TO PART 1.A B & C //
/////////////////////////////////
var GOURAUDMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});

var ballGeometry = new THREE.SphereGeometry(3.5, 10, 10);
function addEggs(lightingMaterial, scene_number){
    for (var i = 0;  i < 100; i++) {
        var mesh = new THREE.Mesh(ballGeometry, lightingMaterial);
        var offset = 0;
        if (Math.floor(i/10)%2 == 0) offset = 0.5;
        mesh.position.x = (i % 10 + offset) * 4 - 20;
        mesh.position.z = Math.floor(i/4) * 4 - 80;
        mesh.scale.set(0.3, 0.4, 0.3);
        scenes[scene_number].add(mesh);
    }
}
addEggs(GOURAUDMaterial, Part.GOURAUD);
addEggs(phongMaterial, Part.PHONG);
addEggs(bPhongMaterial, Part.BLINNPHONG);
addEggs(fogMaterial, Part.FOG);


/////////////////////////////////
//      SPOTLIGHT SCENE        //
//    RELEVANT TO PART 1.D     //
/////////////////////////////////

loadOBJ(Part.SPOTLIGHT, 'obj/bunny.obj', spotlightMaterial, 20, 0, 0, 0, 0,0,0);

// floor
var geoFloor = new THREE.PlaneBufferGeometry( 2000.0, 2000.0 );
var floor = new THREE.Mesh( geoFloor, spotlightMaterial);
floor.rotation.x = - Math.PI * 0.5;
floor.position.set( 0, - 0.05, 0 );
scenes[Part.SPOTLIGHT].add(floor);


/////////////////////////////////
//      TOON SCENE             //
//    RELEVANT TO PART 1.E     //
/////////////////////////////////

toon = {};

// TODO: load your objects here

toon.sphere = new THREE.SphereGeometry(1, 16, 16);
toon.npr_toon = new THREE.Mesh(toon.sphere, toonMaterial);
toon.npr_toon.position.set(0, 1, 1);
scenes[Part.TOON].add(toon.npr_toon);


gooch = {};

loadOBJbarycentric(Part.GOOCH, 'obj/bunny.obj', goochMaterial, 20, -3, -1, 0, 0,0,0);
loadOBJbarycentric(Part.GOOCH, 'obj/tree01.obj', goochMaterial, 1, 6, 0, -1, 0,0,0);



multiplelights = {};

multiplelights.sphere = new THREE.SphereGeometry(1, 16, 16);
multiplelights.npr_multiplelights = new THREE.Mesh(multiplelights.sphere, multiplelightsMaterial);
multiplelights.npr_multiplelights.position.set(2, 1, 1);
scenes[Part.MULTIPLELIGHTS].add(multiplelights.npr_multiplelights);

loadOBJ(Part.MULTIPLELIGHTS, 'obj/bunny.obj', multiplelightsMaterial, 20, -3, -1, 0, 0,0,0);


// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();

function checkKeyboard() {
    if (keyboard.pressed("0"))
        mode = Part.GOURAUD
    else if (keyboard.pressed("1"))
        mode = Part.PHONG
    else if (keyboard.pressed("2"))
        mode = Part.BLINNPHONG
    else if (keyboard.pressed("3"))
        mode = Part.FOG
    else if (keyboard.pressed("4"))
        mode = Part.SPOTLIGHT
    else if (keyboard.pressed("5"))
        mode = Part.TOON
    else if (keyboard.pressed("6"))
        mode = Part.GOOCH
    else if (keyboard.pressed("7"))
        mode = Part.MULTIPLELIGHTS
        
        
    // TODO: add keyboard control to change spotDirectPosition
    if (keyboard.pressed("W"))
      spotDirectPosition.value.z -= 0.1;
    else if (keyboard.pressed("S"))
      spotDirectPosition.value.z += 0.1;
    else if (keyboard.pressed("A"))
      spotDirectPosition.value.x -= 0.1;
    else if (keyboard.pressed("D"))
      spotDirectPosition.value.x += 0.1;

  spotlightMaterial.needsUpdate = true;
  phongMaterial.needsUpdate = true;
  bPhongMaterial.needsUpdate = true;
  toonMaterial.needsUpdate = true;
  fogMaterial.needsUpdate = true;
}

// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  requestAnimationFrame(update);
  renderer.render(scenes[mode], cameras[mode]);
}

update();

