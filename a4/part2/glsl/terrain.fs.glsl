#version 300 es

out vec4 out_FragColor;

in vec3 vcsNormal;
in vec3 vcsPosition;
in vec2 vcsTexcoord;

in vec4 posInLightSpace;

uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightDirection;

uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

uniform sampler2D colorMap; // images/color.jpg 
uniform sampler2D normalMap; // images/normal.png
uniform sampler2D aoMap; // images/ambient_occlusion.png
uniform sampler2D shadowMap;

void main() {
    vec3 projCoords = posInLightSpace.xyz / posInLightSpace.w;

    projCoords = (projCoords + 1.0) * 0.5;

    float shadow = 0.0;
    ivec2 textMapSize = textureSize(shadowMap, 0);
    vec2 textPixelSize = vec2(1.0 / float(textMapSize.x), 1.0 / float(textMapSize.y));
    
    for (float x = -2.0; x <= 2.0; x += 0.25) {
        for (float y = -2.0; y <= 2.0; y += 0.25) {
            float mapDepth = texture(shadowMap, projCoords.xy + vec2(x, y) * textPixelSize).r + 0.0001;
            if (mapDepth < projCoords.z){
                shadow += 1.0;
            }
        }
    }
    shadow /= 256.0;

	// TANGENT SPACE NORMAL
	vec3 Nt = normalize(texture(normalMap, vcsTexcoord).xyz * 2.0 - 1.0);
    
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 tangent = normalize(cross(normalize(vcsNormal), up));
    vec3 bitangent = normalize(cross(normalize(vcsNormal), tangent));
    mat3 tangentMatrix = transpose(mat3(tangent, bitangent, normalize(vcsNormal)));
    
    vec3 Ni = normalize(Nt);
    vec3 L = tangentMatrix * normalize(vec3(viewMatrix * vec4(lightDirection, 0.0)));
    vec3 V = tangentMatrix * normalize(-vcsPosition);
    vec3 H = normalize((V + L) * 0.5);
    
    
    
	//AMBIENT
    vec3 light_AMB = ambientColor * kAmbient;
    //vec3 light_AMB = kAmbient * texture(aoMap, vcsTexcoord).rgb;
    
	//DIFFUSE
	vec3 diffuse = kDiffuse * lightColor;
	// vec3 light_DFF = diffuse * max(0.0, dot(Ni, L));
    vec3 light_DFF = diffuse * texture(colorMap, vcsTexcoord).rgb * max(0.0, dot(Ni, L));

	//SPECULAR
	vec3 specular = kSpecular * lightColor;
	vec3 light_SPC = specular * pow(max(0.0, dot(H, Ni)), shininess);

	//TOTAL
	vec3 TOTAL = light_AMB + (1.0 - shadow) * (light_DFF + light_SPC);

	out_FragColor = vec4(TOTAL, 1.0);
}
