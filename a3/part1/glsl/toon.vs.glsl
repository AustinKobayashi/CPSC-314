
#version 300 es

uniform vec3 lightDirectionUniform;

out vec3 normalInCameraSpace;
out vec3 positionInCameraSpace;
out vec3 lightPositionInCameraSpace;


void main() {
	// TODO: PART 1E
    normalInCameraSpace = normalMatrix * normal;
    
    positionInCameraSpace = (modelViewMatrix * vec4(position, 1.0)).xyz;
    
    lightPositionInCameraSpace = (viewMatrix * vec4(lightDirectionUniform, 0.0)).xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
