#version 300 es

precision highp float;
precision highp int;
out vec4 out_FragColor; 

in vec3 interpolatedNormal;

void main() {

    //out_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
    out_FragColor = vec4(interpolatedNormal, 1.0);
}
