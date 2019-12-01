#version 300 es

precision highp float;
precision highp int;

uniform vec3 spotDirectPosition;
uniform vec3 spotlightPosition;

out vec4 out_FragColor;

in vec3 positionInWorld;
in vec3 lightDirection;
in vec3 n;
in vec3 eyeDir;

void main() {

	// TODO: PART 1D
    vec3 positionToLight = normalize(spotlightPosition - positionInWorld);
    
    float lightToSurfaceAngle = degrees(acos(dot(positionToLight, lightDirection)));
    
    float spotExponent = 5.0;
    
    vec3 SpotColor;
    
    if (lightToSurfaceAngle > 45.0) {
        SpotColor = vec3(0.0, 0.0, 0.0);
    } else {
        SpotColor = vec3(1.0, 1.0, 0.0) * pow(cos(1.3 * radians(lightToSurfaceAngle)), spotExponent);
    }
    out_FragColor = vec4(SpotColor , 1.0);
}
