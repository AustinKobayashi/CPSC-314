uniform vec3 armadilloPosition;
uniform vec3 eggPosition;
uniform vec3 offset;

void main() {
    
    float dist = distance(vec3(armadilloPosition.x, 0.0, armadilloPosition.z) + offset, eggPosition);
    
    mat4 S = mat4(1.0);
    S[1][1] = dist;

    /* YOUR CODES HERE: move and rotate lasers corresponding to the movement of armadillo */
    mat4 M = mat4(1.0);
    M[3] = vec4(armadilloPosition.x, 0, 0, 1.0);
    
    vec3 z = normalize(eggPosition - (vec3(armadilloPosition.x, 0.0, armadilloPosition.z) + offset));
    vec3 x = normalize(cross(modelMatrix[1].xyz, z));
    vec3 y = cross(z, x);
    
    mat4 R = mat4(1.0);
    R[0] = vec4(x, 0.0);
    R[1] = vec4(y, 0.0);
    R[2] = vec4(z, 0.0);
    R[3] = vec4(armadilloPosition.x, 0, 0, 1.0);
    
    mat4 Rx = mat4(1.0);
    Rx[1][1] = 0.0;
    Rx[2][1] = -1.0;
    Rx[1][2] = 1.0;
    Rx[2][2] = 0.0;
    
    
    mat4 T = mat4(1.0);
    T[3].xyz = offset;

    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
    gl_Position = projectionMatrix * viewMatrix * T * R * Rx * S * vec4(position, 1.0);
}
