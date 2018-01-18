#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv; 
uniform float time;
uniform sampler2D tDiffuse;
uniform vec2 resolution;


void main( void ) 
{
    
    const float shakeLength = 0.1;
    const float speed = 1.0;
    const float shakeWidth = 0.005;

    float offsetX = sin(gl_FragCoord.x * shakeLength + time * speed) * shakeWidth;
    float offsetY = cos(gl_FragCoord.y * shakeLength + time * speed) * shakeWidth;

    vec4 color = texture2D(tDiffuse, vec2(vUv.x + offsetX , vUv.y + offsetY));
    gl_FragColor = color; 
}


