
#version 300 es

uniform vec3 lightDirectionUniform;

attribute vec3 barycentric;

out vec3 normalInCameraSpace;
out vec3 positionInCameraSpace;
out vec3 lightPositionInCameraSpace;
out vec3 vBC;


void main() {
	// TODO: PART 1E
    vBC = barycentric;
    
    normalInCameraSpace = normalMatrix * normal;
    
    positionInCameraSpace = (modelViewMatrix * vec4(position, 1.0)).xyz;
    
    lightPositionInCameraSpace = (viewMatrix * vec4(lightDirectionUniform, 0.0)).xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
