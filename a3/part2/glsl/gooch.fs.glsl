#version 300 es

uniform vec3 goochColorUniform;
uniform vec3 ambientColorUniform;
uniform float shininessUniform;
uniform float kAmbientUniform;
uniform float kDiffuseUniform;
uniform float kSpecularUniform;

out vec4 out_FragColor;

in vec3 normalInCameraSpace;
in vec3 positionInCameraSpace;
in vec3 lightPositionInCameraSpace;
in vec3 vBC;

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
    
    //SPECULAR
    vec3 light_SPC = kSpecularUniform * pow(cosAlpha, shininessUniform) * goochColorUniform;
    
    
    vec3 surfaceColor = vec3(0.75, 0.75, 0.75);
    vec3 warmColor = vec3(1.0, 0.4, 0.0);
    vec3 coolColor = vec3(0.2, 0.2, 0.6);
    float diffuseWarm = 0.45;
    float diffuseCool = 0.45;
    
    vec3 kcool = min(coolColor + diffuseCool * surfaceColor, 1.0);
    vec3 kwarm = min(warmColor + diffuseWarm * surfaceColor, 1.0); 
    vec3 kfinal = mix(kcool, kwarm, cosTheta);
    
    vec3 finalColor = min(kfinal + light_SPC, 1.0);

    if(any(lessThan(vBC, vec3(0.02)))){
        finalColor = vec3(0.0, 0.0, 0.0);
    }
    
    out_FragColor = vec4 (finalColor, 1.0);
}
