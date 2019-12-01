#version 300 es

uniform mat4 lightViewMatrix;
uniform mat4 lightProjMatrix;

void main() {        
    //gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = lightProjMatrix * lightViewMatrix * modelMatrix * vec4(position, 1.0);
}
