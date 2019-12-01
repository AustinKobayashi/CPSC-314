#version 300 es

out vec4 out_FragColor;

in vec3 posInWorldSpace;
in vec2 texCoords;
in vec3 posInEyeSpace;

in vec3 norm;

uniform sampler2D diffuseMap;
uniform sampler2D normalMap;
uniform sampler2D depthMap;

uniform vec3 lightColor;

uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

uniform float heightScale;

uniform vec3 lightPos;
uniform vec3 viewPos;

// Steep parallax + occlusion mapping
vec2 ParallaxMapping(vec2 pTexCoords, vec3 viewDirection) { 
    float height =  texture(depthMap, pTexCoords).r;     
    return pTexCoords - viewDirection.xy * (height * heightScale);  
}

void main() {               
    // Calculate tangent matrix
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 tangent = normalize(cross(normalize(norm), up));
    vec3 bitangent = normalize(cross(normalize(norm), tangent));
    mat3 tangentMatrix = transpose(mat3(tangent, bitangent, normalize(norm)));
    
    vec3 L = tangentMatrix * normalize(vec3(viewMatrix * vec4(lightPos, 0.0)));
    vec3 V = tangentMatrix * normalize(-posInEyeSpace);
    vec3 H = normalize((V + L) * 0.5);

    vec3 tView = tangentMatrix * normalize(viewPos);
    vec3 tPosInWorld = tangentMatrix * normalize(posInWorldSpace);
    
    vec3 viewDir = normalize(tView - tPosInWorld);

    // Get offset texture coords
    vec2 pTexCoords = ParallaxMapping(texCoords,  viewDir);       
    
    // The offeset could push the coord outside of the texture range
    // If that happens, we discard the fragment
    if(pTexCoords.x <= 1.0 && pTexCoords.y <= 1.0 && pTexCoords.x >= 0.0 && pTexCoords.y >= 0.0) {

        // Obtain normal from normal map
        vec3 normal = texture(normalMap, pTexCoords).rgb;
        normal = normalize(normal * 2.0 - 1.0);   
        
        // Get diffuse color
        vec3 color = texture(diffuseMap, pTexCoords).rgb;
        
        // Ambient
        vec3 light_AMB = color * kAmbient;

        // Diffuse        
        vec3 diffuse = kDiffuse * lightColor;
        vec3 light_DFF = diffuse * color * max(0.0, dot(normal, L));
        
        // Specular   
        vec3 specular = kSpecular * lightColor;
        vec3 light_SPC = specular * pow(max(0.0, dot(H, normal)), shininess);
        
        out_FragColor = vec4(light_AMB + light_DFF + light_SPC, 1.0);
        
    } else {
        discard;
    }
}
