#version 300 es

out vec3 posInWorldSpace;
out vec3 posInEyeSpace;
out vec2 texCoords;

out vec3 norm;

uniform vec3 lightPos;
uniform vec3 viewPos;

void main() {
    
    posInWorldSpace = vec3(modelMatrix * vec4(position, 1.0));   
    posInEyeSpace = vec3(modelViewMatrix * vec4(position, 1.0));
    texCoords = uv;   
    
    norm = normalMatrix * normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
