#version 300 es

uniform vec3 lightFogColorUniform;
uniform float fogDensity;
uniform float kDiffuseUniform;
uniform vec3 lightColorUniform;

out vec4 out_FragColor;

in float distFromCamera;
in vec3 normalInCameraSpace;
in vec3 positionInCameraSpace;
in vec3 lightPositionInCameraSpace;

void main() {

	// TODO: PART 1C
    vec3 normal = normalize(normalInCameraSpace);
    vec3 lightDirectionInCameraSpace = normalize(lightPositionInCameraSpace);
    float cosTheta = max(dot(lightDirectionInCameraSpace, normal), 0.0);

    float fogLevel = 1.0 / (exp(distFromCamera * fogDensity));
    
    vec3 light_DFF = kDiffuseUniform * cosTheta * lightColorUniform;
    
    vec3 color = (1.0 - fogLevel) * lightFogColorUniform + fogLevel * light_DFF;
    
    out_FragColor = vec4(color, 1.0);
}
