#version 300 es

out vec4 out_FragColor;

in vec3 vcsNormal;
in vec3 vcsPosition;

uniform vec3 lightDirection;
uniform samplerCube skybox;
uniform mat4 matrixWorld;

void main( void ) {
    vec3 viewVec = normalize(vcsPosition);
    vec3 reflection = reflect(viewVec, normalize(vcsNormal));
    reflection = vec3(transpose(matrixWorld) * vec4(reflection, 1.0));
    out_FragColor = vec4(texture(skybox, reflection).rgb, 1.0);
}
