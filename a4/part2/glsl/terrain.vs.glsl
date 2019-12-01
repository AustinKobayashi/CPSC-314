#version 300 es

out vec3 vcsNormal;
out vec3 vcsPosition;
out vec2 vcsTexcoord;

out vec4 posInLightSpace;

uniform mat4 lightViewMatrix;
uniform mat4 lightProjMatrix;

void main() {
	// viewing coordinate system
	vcsNormal = normalMatrix * normal;
	vcsPosition = vec3(modelViewMatrix * vec4(position, 1.0));
	vcsTexcoord = uv;

    posInLightSpace = lightProjMatrix * lightViewMatrix * modelMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
