#version 300 es

uniform vec3 bunnyPosition;
out vec4 eggPos;

// Fract gives the fractional part of the number
float rand(float p){
    return fract(sin(p * 12345.56789));
}

void main() {
    
    eggPos = modelMatrix * vec4(position, 1.0);
    float dist = distance(eggPos.xyz, bunnyPosition);
    
    // Multiply each vertex by the model matrix to get the world position of each vertex, then the view matrix to get the position in the camera coordinate system, and finally the projection matrix to get final vertex position
    vec3 newPos = position + rand(dist) * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
