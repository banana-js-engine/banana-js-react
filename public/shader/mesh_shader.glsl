#version 300 es

in vec3 a_Position;
in vec2 a_TexCoord;
in vec3 a_Normal;

out vec2 v_TexCoord;
out vec3 v_Normal;

uniform mat4 u_ViewProjectionMatrix;

void main() {
    v_TexCoord = a_TexCoord;
    v_Normal = a_Normal;
    gl_Position = u_ViewProjectionMatrix * vec4(a_Position, 1.0);
}

#version 300 es

precision mediump float;

in vec2 v_TexCoord;
in vec3 v_Normal;

out vec4 fragColor;

void main() {
    vec3 lightDirection = normalize(vec3(0.5, 0.7, 1.0));
    vec4 lightColor = vec4(0.5, 0.5, 0.5, 1.0);
    vec3 normal = normalize(v_Normal);

    vec4 ambient = vec4(0.2, 0.2, 0.2, 1.0);
    float Kd = max(dot(lightDirection, normal), 0.0);
    vec4 diffuse = Kd * lightColor;

    fragColor = ambient + diffuse;
    fragColor.a = 1.0;
}