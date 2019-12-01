#version 300 es
out vec3 pos;

void main() {
    
    pos = position;
    mat4 view = mat4(mat3(viewMatrix));
    gl_Position = projectionMatrix * view * modelMatrix * vec4(position, 1.0);
}
