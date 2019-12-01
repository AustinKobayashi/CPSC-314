#version 300 es

precision highp float;
precision highp int;

out vec4 out_FragColor;

in float intensity;
in float segment;

void main() {
  out_FragColor = vec4(intensity*vec3(segment, 1.0, 1.0), 1.0); 
}
