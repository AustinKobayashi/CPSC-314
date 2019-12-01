#version 300 es

precision highp float;
precision highp int;

out vec4 out_FragColor;

in float segment;
in vec3 interpolatedNormal;


void main(){
  out_FragColor = vec4(segment*1.0, interpolatedNormal.y, interpolatedNormal.z , 1.0);
}
