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
    
    //TODO: PART 1B
    vec3 normal = normalize(normalInCameraSpace);
    
    vec3 lightDirectionInCameraSpace = normalize(lightPositionInCameraSpace);
    float cosTheta = max(dot(lightDirectionInCameraSpace, normal), 0.0);
    
    vec3 eyeVector = normalize(-positionInCameraSpace);
    vec3 halfwayVec = normalize(lightDirectionInCameraSpace + eyeVector);
    
    float specularTerm = max(dot(halfwayVec, normal), 0.0);
    
    //AMBIENT
    vec3 light_AMB = kAmbientUniform * ambientColorUniform;
    
    //DIFFUSE
    vec3 light_DFF = kDiffuseUniform * cosTheta * lightColorUniform;
    
    //SPECULAR
    vec3 light_SPC = kSpecularUniform * pow(specularTerm, shininessUniform) * lightColorUniform;
    
    //TOTAL
    vec3 TOTAL = light_AMB + light_DFF + light_SPC;
    out_FragColor = vec4(TOTAL, 1.0);
}
