#version 300 es

// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 bunnyPosition;
uniform float jumpTimer;

out vec3 interpolatedNormal;

void main() {
    // Set shared variable to vertex normal
    interpolatedNormal = normal;
    
    vec3 localBunnyPosition = bunnyPosition + (vec4(position, 1.0) * modelMatrix).xyz;
    
    float jumpHeight = sin(0.1 * jumpTimer);
    if (jumpHeight < 0.0)
        jumpHeight = 0.0;
    
    if(jumpTimer > 0.0)
        localBunnyPosition.y += jumpHeight;
    
    // Multiply each vertex by the model matrix to get the world position of each vertex, then the view matrix to get the position in the camera coordinate system, and finally the projection matrix to get final vertex position
    gl_Position = projectionMatrix * viewMatrix * vec4(localBunnyPosition, 1.0);
}
