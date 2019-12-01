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
        bunnyPosition: bunnyPosition
    }
});

var fragmentMaterial = new THREE.ShaderMaterial({
    uniforms: {
    }
});

// LOAD SHADERS
var shaderFiles = [
    'glsl/bunny.vs.glsl',
    'glsl/bunny.fs.glsl',
    'glsl/egg.vs.glsl',
    'glsl/egg.fs.glsl',
    'glsl/rocket.vs.glsl',
    'glsl/rocket.fs.glsl',
    'glsl/fragment.vs.glsl',
    'glsl/fragment.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
    bunnyMaterial.vertexShader = shaders['glsl/bunny.vs.glsl'];
    bunnyMaterial.fragmentShader = shaders['glsl/bunny.fs.glsl'];

    eggMaterial.vertexShader = shaders['glsl/egg.vs.glsl'];
    eggMaterial.fragmentShader = shaders['glsl/egg.fs.glsl'];
    
    fragmentMaterial.vertexShader = shaders['glsl/fragment.vs.glsl'];
    fragmentMaterial.fragmentShader = shaders['glsl/fragment.fs.glsl'];
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

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
var eggTime = Date.now();
var jumping = false;
var shooting = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fireRocket(){
    shooting = true;
    
    var rocketHeight = {type: 'float', value: 0.0};
    
    var rocketMaterial = await new THREE.ShaderMaterial({
        uniforms: {
            rocketHeight: rocketHeight,
        }
    });
    
    await new THREE.SourceLoader().load(shaderFiles, function (shaders) {
        rocketMaterial.vertexShader = shaders['glsl/rocket.vs.glsl'];
        rocketMaterial.fragmentShader = shaders['glsl/rocket.fs.glsl'];
    })

    var rocketGeometry = new THREE.CylinderGeometry(1, 2, 2);
    //var rocketGeometry = new THREE.SphereGeometry(1, 32, 32);

    var rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);
    rocket.position.set(bunnyPosition.value.x, bunnyPosition.value.y + 1.0, bunnyPosition.value.z);
    rocket.scale.set(0.3, 0.4, 0.3);
    rocket.parent = worldFrame;
    scene.add(rocket);
    
    rocketMaterial.needsUpdate = true;

    var acceleration = 1;
    while (acceleration > 0.01){
        rocketHeight.value += acceleration;
        acceleration *= 0.9;
        await sleep(1);
        rocketMaterial.needsUpdate = true;
    }
    
    var distance = 1;
    var vertices = rocketGeometry.vertices;
    var numVertices = vertices.length;

    var faces = rocketGeometry.faces;

    scene.remove(rocket);
    delete rocketGeometry;
    delete rocket;
    delete rocketMaterial;
    
    var normals = [];
    var fragments = [];
    
    // Manually create each new face
    for(var i = 0; i < faces.length; i++){
        var a = vertices[faces[i].a].clone();
        var b = vertices[faces[i].b].clone();
        var c = vertices[faces[i].c].clone();
        
        var vec1 = a.clone().sub(b);
        var vec2 = a.clone().sub(c);
        var normal = vec1.clone();
        normal.cross(vec2).normalize();
        
        normals.push(normal);
        
        var a2 = a.clone().add(normal);
        var b2 = b.clone().add(normal);
        var c2 = c.clone().add(normal);
        
        var geometry = new THREE.Geometry();

        geometry.vertices.push(a.clone());
        geometry.vertices.push(b.clone());
        geometry.vertices.push(c.clone());
        
        geometry.vertices.push(a2.clone());
        geometry.vertices.push(b2.clone());
        geometry.vertices.push(c2.clone());
        
        var face1 = new THREE.Face3(0, 1, 2); //a, b, c
        var face2 = new THREE.Face3(3, 4, 5); //a2, b2, c2
        var face3 = new THREE.Face3(0, 3, 5); //a, a2, c2
        var face4 = new THREE.Face3(0, 2, 5); //a, c, c2
        var face5 = new THREE.Face3(0, 3, 4); //a, a2, b2
        var face6 = new THREE.Face3(0, 1, 4); //a, b, b2
        var face7 = new THREE.Face3(1, 4, 5); //b, b2, c2
        var face8 = new THREE.Face3(1, 2, 5); //b, c, c2

        geometry.faces.push(face1);
        geometry.faces.push(face2);
        geometry.faces.push(face3);
        geometry.faces.push(face4);
        geometry.faces.push(face5);
        geometry.faces.push(face6);
        geometry.faces.push(face7);
        geometry.faces.push(face8);

        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        
        var fragment = new THREE.Mesh(geometry, fragmentMaterial);
        fragment.scale.set(0.3, 0.4, 0.3);
        fragment.position.set(rocket.position.x, rocketHeight.value, rocket.position.z);
        scene.add(fragment);
                
        geometry.verticesNeedUpdate = true; 
        geometry.elementsNeedUpdate = true;
        fragmentMaterial.needsUpdate = true;
        
        fragments.push(fragment);
    }
    
    for(var i = 0; i < normals.length; i++){
        var randomModifier = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        normals[i].add(randomModifier);
    }
    
    for(var n = 0; n < 500; n++){
        for(var i = 0; i < normals.length; i++){
            var newPos = fragments[i].position.clone().add(normals[i].clone().multiplyScalar(0.3));
            fragments[i].position.set(newPos.x, newPos.y, newPos.z);
        }
        fragmentMaterial.needsUpdate = true;
        await sleep(1);
    }
    
    for(var i = 0; i < fragments.length; i++){
        scene.remove(fragments[i]);
    }
    
    shooting = false;
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
        console.log("laying egg");
        eggTime = Date.now();
        
        var eggGeometry = new THREE.SphereGeometry(1, 32, 32);
        var egg = new THREE.Mesh(eggGeometry, eggMaterial);
        egg.position.set(bunnyPosition.value.x, bunnyPosition.value.y + 1.0, bunnyPosition.value.z);
        egg.scale.set(0.3, 0.4, 0.3);
        egg.parent = worldFrame;
        scene.add(egg);
    }
    
    if (keyboard.pressed("Z")) 
        jumpTimer.value += 1;
    else if (jumpTimer.value > 0) 
        jumpTimer.value = 0;
    
    if(keyboard.pressed("F") && !shooting){
        fireRocket();
    }
    
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
