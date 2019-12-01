/*
 * UBC CPSC 314, Vjan2019
 * Assignment 1 Template
 */

// CHECK WEBGL VERSION
if (WEBGL.isWebGL2Available() === false) {
    document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
}

// SETUP RENDERER & SCENE
var container = document.createElement('div');
document.body.appendChild(container);

var canvas = document.createElement("canvas");
var context = canvas.getContext('webgl2');
var renderer = new THREE.WebGLRenderer({canvas: canvas, context: context});
renderer.setClearColor(0XAFEEEE); // green background colour
container.appendChild(renderer.domElement);
var scene = new THREE.Scene();

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(45, 20, 40);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
controls.autoRotate = false;

// ADAPT TO WINDOW RESIZE
function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize', resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
    window.scrollTo(0, 0);
}

// WORLD COORDINATE FRAME: other objects are defined with respect to it
var worldFrame = new THREE.AxesHelper(5);
scene.add(worldFrame);

// FLOOR WITH PATTERN
var floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(2, 2);

var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide});
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
scene.add(floor);
floor.parent = worldFrame;

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// UNIFORMS
var bunnyPosition = {type: 'v3', value: new THREE.Vector3(0.0, -0.7, 0.0)};
var jumpTimer = {type: 'float', value: 0};

// MATERIALS: specifying uniforms and shaders
var bunnyMaterial = new THREE.ShaderMaterial({
    uniforms: {
        bunnyPosition: bunnyPosition,
        jumpTimer: jumpTimer,
    }
});

var eggMaterial = new THREE.ShaderMaterial({
    uniforms: {
        bunnyPosition: bunnyPosition,
    }
});

// LOAD SHADERS
var shaderFiles = [
    'glsl/bunny.vs.glsl',
    'glsl/bunny.fs.glsl',
    'glsl/egg.vs.glsl',
    'glsl/egg.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
    bunnyMaterial.vertexShader = shaders['glsl/bunny.vs.glsl'];
    bunnyMaterial.fragmentShader = shaders['glsl/bunny.fs.glsl'];

    eggMaterial.vertexShader = shaders['glsl/egg.vs.glsl'];
    eggMaterial.fragmentShader = shaders['glsl/egg.fs.glsl'];
})

var ctx = renderer.context;
ctx.getShaderInfoLog = function () {
    return ''
};   // stops shader warnings, seen in some browsers

// LOAD BUNNY
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function (xhr) {
    };

    var loader = new THREE.OBJLoader(manager);
    loader.load(file, function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });

        object.position.set(xOff, yOff, zOff);
        object.rotation.x = xRot;
        object.rotation.y = yRot;
        object.rotation.z = zRot;
        object.scale.set(scale, scale, scale);
        object.parent = worldFrame;
        scene.add(object);        
    }, onProgress, onError);
}

loadOBJ('obj/bunny.obj', bunnyMaterial, 20, 0, -0.7, 0, 0, 0, 0);

// CREATE EGG
// var eggGeometry = new THREE.SphereGeometry(1, 32, 32);
// var egg = new THREE.Mesh(eggGeometry, eggMaterial);
// egg.position.set(5.0, 0.3, 5.0);
// egg.scale.set(0.3, 0.4, 0.3);
// egg.parent = worldFrame;
// scene.add(egg);

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
var eggTime = Date.now();
var jumping = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function checkKeyboard() {
    if (keyboard.pressed("W"))
        bunnyPosition.value.x -= 0.1;
    else if (keyboard.pressed("S"))
        bunnyPosition.value.x += 0.1;

    if (keyboard.pressed("A"))
        bunnyPosition.value.z += 0.1;
    else if (keyboard.pressed("D"))
        bunnyPosition.value.z -= 0.1;

    if (keyboard.pressed("X") && (Date.now() - eggTime) > 500) {
        eggTime = Date.now();
        
        var eggGeometry = new THREE.SphereGeometry(1, 32, 32);
        var egg = new THREE.Mesh(eggGeometry, eggMaterial);
        egg.position.set(bunnyPosition.value.x, 0.3, bunnyPosition.value.z);
        egg.scale.set(0.3, 0.4, 0.3);
        egg.parent = worldFrame;
        scene.add(egg);
    }
    
    if (keyboard.pressed("Z")) 
        jumpTimer.value += 1;
    else if (jumpTimer.value > 0) 
        jumpTimer.value = 0;
        
    bunnyMaterial.needsUpdate = true; // Tells three.js that some uniforms might have changed
    eggMaterial.needsUpdate = true;
}

// SETUP UPDATE CALL-BACK
function update() {
    checkKeyboard();
    requestAnimationFrame(update);
    renderer.render(scene, camera);
}

update();
