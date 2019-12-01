uniform vec3 armadilloPosition;
uniform vec3 eggPosition;
uniform vec3 offset;
uniform float egg_rot;

void main() {
    
    mat4 Rt = mat4(1.0);
    Rt[0][0] = cos(egg_rot);
    Rt[2][0] = sin(egg_rot);
    Rt[0][2] = -1.0 * sin(egg_rot);
    Rt[2][2] = cos(egg_rot);
    
    mat4 M = mat4(1.0);
    vec3 trans = armadilloPosition;
    M[3].xyz = trans;
    
    vec3 newEggPosition = (inverse(M) * Rt * M * vec4(eggPosition, 1.0)).xyz;
    
    float opposite = (armadilloPosition + offset).x - newEggPosition.x;
    float adjacent = (armadilloPosition + offset).z - newEggPosition.z;
    float angle = atan(opposite, adjacent);
    
    mat4 S = mat4(1.0);

    if (angle > 1.373 || angle < -1.373) {
        S = mat4(0.0);
    } else {
        float dist = distance(vec3(armadilloPosition.x, 0.0, armadilloPosition.z) + offset, newEggPosition);
        S[1][1] = dist;
    }

    vec3 z = normalize(newEggPosition - (vec3(armadilloPosition.x, 0.0, armadilloPosition.z) + offset));
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
