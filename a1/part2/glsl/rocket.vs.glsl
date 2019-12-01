#version 300 es

// HINT: YOU WILL NEED TO PASS IN THE CORRECT UNIFORM AND CREATE THE CORRECT SHARED VARIABLE
uniform float rocketHeight;

out vec3 interpolatedNormal;

void main() {

    // Multiply each vertex by the model matrix to get the world position of each vertex, then the view matrix to get the position in the camera coordinate system, and finally the projection matrix to get final vertex position
    interpolatedNormal = normal;
    
    //vec3 newPosition = (vec4(position, 1.0) * modelMatrix).xyz + vec3(0.0, rocketHeight, 0.0) + normal * rocketHeight;
    vec3 newPosition = (modelMatrix * vec4(position, 1.0)).xyz + vec3(0.0, rocketHeight, 0.0);    
    gl_Position = projectionMatrix * viewMatrix * vec4(newPosition, 1.0);
}
