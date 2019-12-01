#version 300 es

uniform vec3 lightDirectionUniform;
uniform vec3 lightDirectionUniform2;

out vec3 normalInCameraSpace;
out vec3 positionInCameraSpace;
out vec3 lightPositionInCameraSpace;
out vec3 lightPositionInCameraSpace2;


void main() {
    
    // TODO: PART 1A
    normalInCameraSpace = normalMatrix * normal;
    
    positionInCameraSpace = (modelViewMatrix * vec4(position, 1.0)).xyz;
    
    lightPositionInCameraSpace = (viewMatrix * vec4(lightDirectionUniform, 0.0)).xyz;
    
    lightPositionInCameraSpace2 = (viewMatrix * vec4(lightDirectionUniform2, 0.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
