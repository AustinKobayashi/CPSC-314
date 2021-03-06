#version 300 es

out vec4 out_FragColor;

in vec3 vcsNormal;
in vec3 vcsPosition;
in vec2 texCoords;

uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightDirection;

uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

uniform sampler2D shipTexture;

void main() {
	//PRE-CALCS
	vec3 N = normalize(vcsNormal);
	vec3 L = normalize(vec3(viewMatrix * vec4(lightDirection, 0.0)));
	vec3 V = normalize(-vcsPosition);
	vec3 H = normalize((V + L) * 0.5);

	//AMBIENT
	vec3 light_AMB = ambientColor * kAmbient;

	//DIFFUSE
    vec3 color = texture(shipTexture, texCoords).rgb;
	vec3 diffuse = kDiffuse * lightColor;
	vec3 light_DFF = diffuse * color * max(0.0, dot(N, L));

	//SPECULAR
	vec3 specular = kSpecular * lightColor;
	vec3 light_SPC = specular * pow(max(0.0, dot(H, N)), shininess);

	//TOTAL
	vec3 TOTAL = light_AMB + light_DFF  + light_SPC;
	
	out_FragColor = vec4(TOTAL, 1.0);
}
