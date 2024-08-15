#version 300 es

in vec3 a_Position;
in vec4 a_Color;

out vec4 v_Color;

void main() {
    v_Color = a_Color;

    gl_Position = vec4(a_Position, 1.0);
}

#version 300 es

precision mediump float;

in vec4 v_Color;

out vec4 fragColor;

void main() {
    fragColor = v_Color;
}