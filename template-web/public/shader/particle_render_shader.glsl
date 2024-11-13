#version 300 es
precision mediump float;

in vec3 a_Position;
in float a_Age;
in float a_Life;
in vec3 a_Velocity;

out float v_Age;
out float v_Life;
out vec3 v_Velocity;

void main() {
    v_Age = a_Age;
    v_Life = a_Life;
    v_Velocity = a_Velocity;

    gl_PointSize = 1.0 + 6.0 * (1.0 - a_Age/a_Life);
    gl_Position = vec4(a_Position, 1.0);
}

#version 300 es
precision mediump float;

in float v_Age;
in float v_Life;

out vec4 o_FragColor;

uniform vec3 u_Color;

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{  return a + b*cos( 6.28318*(c*t+d) ); }

void main() {
  float t =  v_Age/v_Life;
  o_FragColor = vec4(
    palette(t,
            u_Color,
            vec3(0.5,0.5,0.5),
            vec3(1.0,0.7,0.4),
            vec3(0.0,0.15,0.20)), 1.0 - t);
}
