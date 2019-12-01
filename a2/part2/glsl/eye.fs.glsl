// Shared variable interpolated across the triangle
in vec3 color;

void main() {
  // Setting final pixel color
  gl_FragColor = vec4(color, 1.0);
}
