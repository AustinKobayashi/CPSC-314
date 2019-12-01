#version 300 es

// Shared variable passed to the fragment shader
out float segment;
out vec3 interpolatedNormal;

uniform float rot_angle;
uniform vec3 bunnyPosition;

void main() {
    // Colorize bunny use the normal
    interpolatedNormal = normal;

    // Provided information, do not need to change
    vec3 o_left_ear = vec3(-0.055, 0.155, 0.0126); // origin for the left ear frame
    vec3 t_left_ear = vec3(-0.0111, 0.182, -0.028); // the top point on the left ear
    vec3 o_right_ear = vec3(-0.077, 0.1537, -0.0023); // origin for the right ear frame
    vec3 t_right_ear = vec3(-0.0678, 0.18, -0.058); // the top point on the right ear
    vec3 normal_left_ear = t_left_ear-o_left_ear; // approximated normal from the origin of the left ear frame
    vec3 normal_right_ear = t_right_ear-o_right_ear; // approximated normal from the origin of the right ear frame

    // Scale matrix
    mat4 S = mat4(10.0);
    S[3][3] = 1.0;

    // Translation matrix
    mat4 T = mat4(1.0);
    T[3].xyz = bunnyPosition;

    /* Your codes start here */
    // segment = 1.0 ; //Replace me
    segment = 0.0;
    
    // If the current vertex is in Ear frame, modify this, if not, keep this.    
    vec3 left_pos_in_ear = position - o_left_ear;
    vec3 left_ear_norm = t_left_ear - o_left_ear;
    float left_ear_angle = acos(dot(left_pos_in_ear, left_ear_norm) / (length(left_pos_in_ear) * length(left_ear_norm)));
    
    vec3 right_pos_in_ear = position - o_right_ear;
    vec3 right_ear_norm = t_right_ear - o_right_ear;
    float right_ear_angle = acos(dot(right_pos_in_ear, right_ear_norm) / (length(right_pos_in_ear) * length(right_ear_norm)));
    
    vec3 pos = position;

    if (left_ear_angle < 0.8 || right_ear_angle < 0.8) {
        segment = 1.0;
        
        vec3 rot_vec = normalize(o_right_ear - o_left_ear);
        
        float angle = sin(rot_angle) * 0.5 - 0.2;
        
        mat4 R = mat4(1.0);
        R[0][0] = pow(rot_vec.x, 2.0) * (1.0 - cos(angle)) + cos(angle);
        R[1][0] = rot_vec.x * rot_vec.y * (1.0 - cos(angle)) - rot_vec.z * sin(angle);
        R[2][0] = rot_vec.x * rot_vec.z * (1.0 - cos(angle)) + rot_vec.y * sin(angle);
        R[0][1] = rot_vec.y * rot_vec.x * (1.0 - cos(angle)) + rot_vec.z * sin(angle);
        R[1][1] = pow(rot_vec.y, 2.0) * (1.0 - cos(angle)) + cos(angle);
        R[2][1] = rot_vec.y * rot_vec.z * (1.0 - cos(angle)) - rot_vec.x * sin(angle);
        R[0][2] = rot_vec.z * rot_vec.x * (1.0 - cos(angle)) - rot_vec.y * sin(angle);
        R[1][2] = rot_vec.z * rot_vec.y * (1.0 - cos(angle)) + rot_vec.x * sin(angle);
        R[2][2] = pow(rot_vec.z, 2.0) * (1.0 - cos(angle)) + cos(angle);
        
        if (left_ear_angle < 0.8){
            pos = position - o_left_ear;
            pos = (R * vec4(pos,1.0)).xyz;
            pos = pos + o_left_ear;
        } else {
            pos = position - o_right_ear;
            pos = (R * vec4(pos,1.0)).xyz;
            pos = pos + o_right_ear;
        }
    }
    
    
    gl_Position = projectionMatrix * viewMatrix * T * S * vec4(pos, 1.0);
}
