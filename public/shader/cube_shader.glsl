#version 300 es

in vec3 a_Position;
in vec3 a_Normal;
in vec4 a_Color;

out vec3 v_Normal;
out vec4 v_Color;

uniform mat4 u_ViewProjectionMatrix;

void main() {
    v_Color = a_Color;

    v_Normal = mat3(u_ViewProjectionMatrix) * a_Normal;
    gl_Position = u_ViewProjectionMatrix * vec4(a_Position, 1.0);
}

#version 300 es

precision mediump float;

in vec3 v_Normal;
in vec4 v_Color;

out vec4 fragColor;

void main() {
    vec3 lightDirection = normalize(vec3(1.0, -1.0, 1.0));
    vec4 lightColor = vec4(1.0, 0.8, 0.6, 1.0);
    vec3 normal = normalize(v_Normal);

    vec4 ambient = vec4(0.3, 0.3, 0.3, 1.0);
    float Kd = max(dot(lightDirection, normal), 0.0);
    vec4 diffuse = Kd * lightColor;

    fragColor = v_Color * (ambient + diffuse);
    fragColor.a = 1.0;
}