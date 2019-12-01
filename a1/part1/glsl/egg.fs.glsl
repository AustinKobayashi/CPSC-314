#version 300 es

precision highp float;
precision highp int;
out vec4 out_FragColor; 

uniform vec3 bunnyPosition;

in vec4 eggPos;

void main() {

    float dist = distance(eggPos, vec4(bunnyPosition, 1.0));

    float green = 0.0;
    
    if (dist > 5.0)
        green = 1.0;
    else
        green = 0.0;

    out_FragColor = vec4(1.0, green, 1.0, 1.0); 
}
