#version 300 es

// Shared variable passed to the fragment shader
out float intensity;
out float segment;

// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 armadilloPosition;
uniform vec3 lightPosition;
uniform float rot_angle;

void main() {
    
    vec4 wpos = modelMatrix * vec4(position, 1.0) + vec4(armadilloPosition, 0.0);

    // Calculates vector from the vertex to the light
    vec3 l = lightPosition - wpos.xyz;
    
    // Contribution based on cosine
	  intensity = dot(normalize(l), normal);
    
    
    vec3 o_left_arm = vec3(1.05, 1.0, 0.0); 
    vec3 t_left_arm = vec3(1.25, 1.5, -0.55); 
    vec3 o_right_arm = vec3(-1.0, 1.0, -0.2); 
    vec3 t_right_arm = vec3(-1.15, 1.55, -0.9);
    vec3 normal_left_arm = t_left_arm - o_left_arm; 
    vec3 normal_right_arm = t_right_arm - o_right_arm; 

    segment = 1.0;
    
    vec3 left_pos_in_ear = position - o_left_arm;
    vec3 left_ear_norm = t_left_arm - o_left_arm;
    float left_ear_angle = acos(dot(left_pos_in_ear, left_ear_norm) / (length(left_pos_in_ear) * length(left_ear_norm)));
    
    vec3 right_pos_in_ear = position - o_right_arm;
    vec3 right_ear_norm = t_right_arm - o_right_arm;
    float right_ear_angle = acos(dot(right_pos_in_ear, right_ear_norm) / (length(right_pos_in_ear) * length(right_ear_norm)));
    
    vec3 pos = position;
    
    if (left_ear_angle < 0.8 || right_ear_angle < 0.8) {
        segment = 0.3;
        
        vec3 rot_vec = normalize(o_right_arm - o_left_arm);
        
        float angle = sin(rot_angle) * 0.5 - 0.1;
        
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
            pos = position - o_left_arm;
            pos = (R * vec4(pos,1.0)).xyz;
            pos = pos + o_left_arm;
        } else {
            pos = position - o_right_arm;
            pos = (R * vec4(pos,1.0)).xyz;
            pos = pos + o_right_arm;
        }
    }
    
    pos = (modelMatrix * vec4(pos, 1.0)).xyz + armadilloPosition;
    
    // Multiply each vertex by the model matrix to get the world position of each vertex, then the view matrix to get the position in the camera coordinate system, and finally the projection matrix to get final vertex position
    gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
}
