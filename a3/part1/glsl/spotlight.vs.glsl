#version 300 es

uniform vec3 spotDirectPosition;
uniform vec3 spotlightPosition;

out vec3 positionInWorld;
out vec3 lightDirection;
out vec3 n;
out vec3 eyeDir;

void main() {

 	// TODO: PART 1D
    n = normalize((modelMatrix * vec4(position, 1.0)).xyz);
    positionInWorld = ((modelMatrix * vec4(position, 1.0)).xyz);
    lightDirection = normalize(spotlightPosition - spotDirectPosition);
    
    eyeDir = normalize((viewMatrix * vec4(positionInWorld, 1.0)).xyz);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

