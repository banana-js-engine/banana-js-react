#version 300 es

in vec2 a_Position;

void main() {
    gl_Position = vec4(a_Position, 0.0, 1.0);
}

#version 300 es

precision mediump float;

out vec4 fragColor;

void main() {
    fragColor = vec4(0.0, 1.0, 0.0, 1.0);
}