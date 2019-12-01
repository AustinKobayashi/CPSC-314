#version 300 es

out float intensity;

uniform vec3 lightPosition;
uniform vec3 armadilloPosition;
vec3 eggPosition;
uniform float egg_rot;

void main(){
  // Calculate position in world coordinates
  vec4 wpos = modelMatrix * vec4(position, 1.0);

  // Calculates vector from the vertex to the light
  vec3 l = lightPosition - wpos.xyz;

  // Calculates the intensity of the light on the vertex
  intensity = dot(normalize(l), normal);
    
    mat4 Rt = mat4(1.0);
    Rt[0][0] = cos(egg_rot);
    Rt[2][0] = sin(egg_rot);
    Rt[0][2] = -1.0 * sin(egg_rot);
    Rt[2][2] = cos(egg_rot);
    
    mat4 M = mat4(1.0);
    vec3 trans = armadilloPosition;
    M[3].xyz = trans;
    
    vec3 pos = (inverse(M) * Rt * M * vec4(position, 1.0)).xyz;
    vec3 test = (modelMatrix * vec4(pos, 1.0)).xyz + eggPosition;
    
  // Multiply each vertex by the model matrix to get the world position of each vertex, then the view matrix to get the position in the camera coordinate system, and finally the projection matrix to get final vertex position
  gl_Position = projectionMatrix * viewMatrix * inverse(M) * Rt * M  * vec4(test, 1.0);
}
