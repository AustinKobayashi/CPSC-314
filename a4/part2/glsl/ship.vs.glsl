#version 300 es

out vec3 vcsNormal;
out vec3 vcsPosition;
out vec2 texCoords;

uniform float rotation;
uniform vec3 movementVec;
uniform float speed;

void main() {

	// viewing coordinate system
	vcsNormal = normalMatrix * normal;
	vcsPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    
    texCoords = uv;
    
    float theta = radians(rotation);
    mat4 rotMatrix = mat4( cos(theta), 0, sin(theta), 0,
                                    0, 1,          0, 0,
                          -sin(theta), 0, cos(theta), 0,
                                    0, 0,          0, 1);
    
    
    vec3 rotatedPos = speed * movementVec + vec3(modelMatrix * rotMatrix * vec4(position, 1.0));

	gl_Position = projectionMatrix * viewMatrix *  vec4(rotatedPos, 1.0);
}
