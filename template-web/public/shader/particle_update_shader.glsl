#version 300 es
precision mediump float;

in vec3 a_Position;
in float a_Age;
in float a_Life;
in vec3 a_Velocity;

uniform float u_TimeDelta;
uniform sampler2D u_RgNoise;
uniform vec3 u_Gravity;
uniform vec3 u_Origin;
uniform float u_MinTheta;
uniform float u_MaxTheta;
uniform float u_MinSpeed;
uniform float u_MaxSpeed;
uniform mat4 u_ViewProjectionMatrix;
uniform int u_Playing;

out vec3 v_Position;
out float v_Age;
out float v_Life;
out vec3 v_Velocity;

void main() {
    if (a_Age >= a_Life && u_Playing == 1) {
        
        ivec2 noiseCoord = ivec2(gl_VertexID % 512, gl_VertexID / 512);
        vec2 rand = texelFetch(u_RgNoise, noiseCoord, 0).rg;

        float theta = u_MinTheta + rand.r * (u_MaxTheta - u_MinTheta);

        float x = cos(theta);
        float y = sin(theta);

        v_Position = mat3(u_ViewProjectionMatrix) * u_Origin;

        v_Age = 0.0;
        v_Life = a_Life;

        v_Velocity = vec3(x, y, 0.0) * (u_MinSpeed + rand.g * (u_MaxSpeed - u_MinSpeed));
    } else {
        v_Position = a_Position + a_Velocity * u_TimeDelta;
        v_Age = a_Age + u_TimeDelta;
        v_Life = a_Life;
        v_Velocity = a_Velocity + u_Gravity * u_TimeDelta;
    }
}

#version 300 es
precision mediump float;

out vec4 fragColor;

void main() {
    fragColor = vec4(1.0);
}