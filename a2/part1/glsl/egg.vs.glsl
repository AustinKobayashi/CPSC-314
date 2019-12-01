#version 300 es

out float intensity;

uniform vec3 lightPosition;

void main(){
  // Calculate position in world coordinates
  vec4 wpos = modelMatrix * vec4(position, 1.0);

  // Calculates vector from the vertex to the light
  vec3 l = lightPosition - wpos.xyz;

  // Calculates the intensity of the light on the vertex
  intensity = dot(normalize(l), normal);

  // Multiply each vertex by the model matrix to get the world position of each vertex, then the view matrix to get the position in the camera coordinate system, and finally the projection matrix to get final vertex position
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
