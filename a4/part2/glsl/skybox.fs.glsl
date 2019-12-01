#version 300 es

in vec3 pos;

out vec4 out_FragColor;

uniform samplerCube skybox;

void main() {
    out_FragColor = texture(skybox, pos);
}
