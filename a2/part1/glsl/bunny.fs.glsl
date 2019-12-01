#version 300 es

precision highp float;
precision highp int;

out vec4 out_FragColor;

in float intensity;

// Create shared variable. The value is given as the interpolation between normals computed in the vertex shader
in vec3 interpolatedNormal;

void main(){
  vec3 N = normalize(interpolatedNormal);

  out_FragColor = vec4(N*intensity, 1.0);
}
