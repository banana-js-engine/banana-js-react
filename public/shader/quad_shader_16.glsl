#version 300 es

struct Light {
    vec3 position;
    vec3 color;
    float intensity;
};

in vec3 a_Position;
in vec4 a_Color;
in vec2 a_TexCoord;
in float a_TexIndex;

out vec4 v_Color;
out vec2 v_TexCoord;
out float v_TexIndex;
out float v_Distance;

uniform mat4 u_ViewProjectionMatrix;
uniform Light u_Lights[10];
uniform int u_LightCount;

void main() {
    v_TexCoord = a_TexCoord;
    v_TexIndex = a_TexIndex;

    float totalDistance = 0.0;
    vec3 totalColor = vec3(0.0);
    for (int i = 0; i < u_LightCount; i++) {
        float distanceToLight = distance(u_Lights[i].position, a_Position);
        totalDistance += distanceToLight;
        totalColor += u_Lights[i].color * u_Lights[i].intensity * (1.0 / distanceToLight);
    }

    if (u_LightCount > 0) {
        v_Distance = totalDistance / float(u_LightCount);
    } else {
        v_Distance = 0.0;
    }

    if (u_LightCount > 0) {
        v_Color = a_Color * vec4(totalColor, 1.0);
    } else {
        v_Color = a_Color;
    }

    gl_Position = u_ViewProjectionMatrix * vec4(a_Position, 1.0);
    gl_Position /= gl_Position.w;
    gl_Position /= gl_Position.w;
}

#version 300 es

precision mediump float;

in vec4 v_Color;
in vec2 v_TexCoord;
in float v_TexIndex;
in float v_Distance;

out vec4 fragColor;

uniform sampler2D u_Textures[16];

void main() {
    vec4 l_Texture;
    int l_TexIndex = int(v_TexIndex);

    switch (l_TexIndex) {
        case 0:  l_Texture = texture(u_Textures[0],  v_TexCoord); break;
        case 1:  l_Texture = texture(u_Textures[1],  v_TexCoord); break;
        case 2:  l_Texture = texture(u_Textures[2],  v_TexCoord); break;
        case 3:  l_Texture = texture(u_Textures[3],  v_TexCoord); break;
        case 4:  l_Texture = texture(u_Textures[4],  v_TexCoord); break;
        case 5:  l_Texture = texture(u_Textures[5],  v_TexCoord); break;
        case 6:  l_Texture = texture(u_Textures[6],  v_TexCoord); break;
        case 7:  l_Texture = texture(u_Textures[7],  v_TexCoord); break;
        case 8:  l_Texture = texture(u_Textures[8],  v_TexCoord); break;
        case 9:  l_Texture = texture(u_Textures[9],  v_TexCoord); break;
        case 10: l_Texture = texture(u_Textures[10], v_TexCoord); break;
        case 11: l_Texture = texture(u_Textures[11], v_TexCoord); break;
        case 12: l_Texture = texture(u_Textures[12], v_TexCoord); break;
        case 13: l_Texture = texture(u_Textures[13], v_TexCoord); break;
        case 14: l_Texture = texture(u_Textures[14], v_TexCoord); break;
        case 15: l_Texture = texture(u_Textures[15], v_TexCoord); break;
    }

    float lightIntensity = (1.0 / v_Distance);
    
    if (v_Distance == 0.0) {
        lightIntensity = 1.0;
    }


    fragColor = l_Texture * v_Color * lightIntensity;
    fragColor.a = v_Color.a;
}