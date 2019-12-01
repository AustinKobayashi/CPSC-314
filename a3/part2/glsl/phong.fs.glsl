#version 300 es

uniform vec3 lightColorUniform;
uniform vec3 ambientColorUniform;
uniform float shininessUniform;
uniform float kAmbientUniform;
uniform float kDiffuseUniform;
uniform float kSpecularUniform;

out vec4 out_FragColor;

in vec3 normalInCameraSpace;
in vec3 positionInCameraSpace;
in vec3 lightPositionInCameraSpace;


void main() {
	//TODO: PART 1A
    vec3 normal = normalize(normalInCameraSpace);
    
    vec3 lightDirectionInCameraSpace = normalize(lightPositionInCameraSpace);
    
    vec3 eyeVector = normalize(-positionInCameraSpace);
    
    vec3 reflection = normalize(-lightDirectionInCameraSpace + 2.0 * dot(lightDirectionInCameraSpace, normal) * normal);
    
    float cosTheta = max(dot(lightDirectionInCameraSpace, normal), 0.0);
    float cosAlpha = max(dot(eyeVector, reflection), 0.0);
    
    //AMBIENT
    vec3 light_AMB = kAmbientUniform * ambientColorUniform;
    
    //DIFFUSE
    vec3 light_DFF = kDiffuseUniform * cosTheta * lightColorUniform;
    
    //SPECULAR
    vec3 light_SPC = kSpecularUniform * pow(cosAlpha, shininessUniform) * lightColorUniform;
    
    //TOTAL
    vec3 TOTAL = light_AMB + light_DFF + light_SPC;
	out_FragColor = vec4(TOTAL, 1.0);
}
