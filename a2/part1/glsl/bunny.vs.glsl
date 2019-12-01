#version 300 es

// Create shared variable for the vertex and fragment shaders
out vec3 interpolatedNormal;
out float intensity;

uniform vec3 armadilloPosition;
uniform vec3 bunnyPosition;
uniform vec3 lightPosition;

void main() {
    // Calculate position in world coordinates
    vec4 wpos = modelMatrix * vec4(position, 1.0) + vec4(bunnyPosition, 0.0);

    // Calculates vector from the vertex to the light
    vec3 l = lightPosition - wpos.xyz;

    // Calculates the intensity of the light on the vertex
    intensity = dot(normalize(l), normal);

    // Use normal as the color, pass is to fragment shader
    interpolatedNormal = normal;

    // Scale matrix
    mat4 S = mat4(10.0);
    S[3][3] = 1.0;

    /* You need to calculate rotation matrix here */
    
    /*
    float distance = distance(armadilloPosition, wpos.xyz);
    float theta = asin(armadilloPosition.x / distance);
    mat4 R = mat4(1.0);
    R[0][0] = cos(theta);
    R[2][0] = sin(theta);
    R[0][2] = -1.0 * sin(theta);
    R[2][2] = cos(theta);
    */
    vec3 z = normalize(armadilloPosition - wpos.xyz);
    vec3 x = normalize(cross(modelMatrix[1].xyz, z));
    vec3 y = cross(z, x);
    
    mat4 R = mat4(1.0);
    R[0] = vec4(x, 0.0);
    R[0][1] = 0.0;
    R[1] = vec4(0.0, 1.0, 0.0, 0.0);
    R[2] = vec4(z, 0.0);
    R[2][1] = 0.0;
    
    
    // Translation matrix
    mat4 T = mat4(1.0);
    T[3].xyz = bunnyPosition;

    gl_Position = projectionMatrix * viewMatrix * T * R * S * vec4(position, 1.0);
}
