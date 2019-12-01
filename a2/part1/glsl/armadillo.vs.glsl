#version 300 es

// Shared variable passed to the fragment shader
out float intensity;

// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 armadilloPosition;
uniform vec3 lightPosition;

void main() {

    vec4 wpos = modelMatrix * vec4(position, 1.0) + vec4(armadilloPosition, 0.0);

    // Calculates vector from the vertex to the light
    vec3 l = lightPosition - wpos.xyz;

    // Contribution based on cosine
	  intensity = dot(normalize(l), normal);

    // Multiply each vertex by the model matrix to get the world position of each vertex, then the view matrix to get the position in the camera coordinate system, and finally the projection matrix to get final vertex position
    gl_Position = projectionMatrix * viewMatrix * wpos;
}
