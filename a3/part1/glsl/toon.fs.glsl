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

float quantizeRG (float intensity) {
    if (intensity < 0.2) {
        return 0.1;
    } else if (intensity < 0.35) {
        return 0.2;
    } else if (intensity < 0.45) {
        return 0.35;
    } else if (intensity < 0.6) {
        return 0.6;
    } else if (intensity <= 1.0) {
        return 1.0;
    } 
    
    return 1.0;
}

float quantizeB (float intensity) {
    if (intensity < 0.2) {
        return 0.3;
    } else if (intensity < 0.35) {
        return 0.4;
    } else if (intensity < 0.45) {
        return 0.55;
    } else if (intensity < 0.6) {
        return 0.9;
    } else if (intensity <= 1.0) {
        return 1.0;
    } 
    
    return 1.0;
}


void main() {


	//TOTAL INTENSITY
	//TODO PART 1E: calculate light intensity (ambient+diffuse+speculars' intensity term)
    float lightIntensity = 0.0;

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
        
    lightIntensity = length((TOTAL.x + TOTAL.y + TOTAL.z) / 3.0);
    
   	vec4 resultingColor = vec4(0.0,0.0,0.0,1.0);
    
    // dark = (25, 25, 50)
    
   	//TODO PART 1E: change resultingColor based on lightIntensity (toon shading)
    resultingColor = vec4(vec3(quantizeRG(lightIntensity), quantizeRG(lightIntensity), quantizeB(lightIntensity)), 1.0);

   	//TODO PART 1E: change resultingColor to silhouette objects
    if (dot(normalize(normalInCameraSpace), normalize(-positionInCameraSpace)) < 0.2) {
        resultingColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
	out_FragColor = resultingColor;
}
