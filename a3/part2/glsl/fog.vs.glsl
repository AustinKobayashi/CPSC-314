#version 300 es

uniform vec3 lightDirectionUniform;

out float distFromCamera;
out vec3 normalInCameraSpace;
out vec3 positionInCameraSpace;
out vec3 lightPositionInCameraSpace;


void main() {
    
    // TODO: PART 1C
    
    normalInCameraSpace = normalMatrix * normal;
    
    positionInCameraSpace = (modelViewMatrix * vec4(position, 1.0)).xyz;
    
    lightPositionInCameraSpace = (viewMatrix * vec4(lightDirectionUniform, 0.0)).xyz;
    
    distFromCamera = distance(vec3(0.0, 0.0, 0.0), positionInCameraSpace);
    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
}
