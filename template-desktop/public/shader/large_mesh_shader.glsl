#version 300 es

in vec3 a_Position;
in vec3 a_Color;
in vec2 a_TexCoord;
in float a_TexIndex;
in vec3 a_Normal;
in vec3 a_Ambient;
in vec3 a_Diffuse;
in vec3 a_Specular;
in float a_Shininess;

out vec3 v_Color;
out vec2 v_TexCoord;
out float v_TexIndex;
out vec3 v_Normal;
out vec3 v_Ambient;
out vec3 v_Diffuse;
out vec3 v_Specular;
out float v_Shininess;
out vec3 v_SurfaceToView;

uniform mat4 u_ViewProjectionMatrix;
uniform mat4 u_ModelMatrix;
uniform vec3 u_CameraPosition;

void main() {
    v_Color = a_Color;
    v_TexCoord = a_TexCoord;
    v_TexIndex = a_TexIndex;
    v_Ambient = a_Ambient;
    v_Diffuse = a_Diffuse;
    v_Specular = a_Specular;
    v_Shininess = a_Shininess;

    vec4 transformedNormal = vec4(a_Normal, 1.0) * u_ModelMatrix;
    vec4 transformedPosition = vec4(a_Position, 1.0) * u_ModelMatrix;

    v_Normal = transformedNormal.xyz;
    v_SurfaceToView = u_CameraPosition - transformedPosition.xyz; 
    
    gl_Position = u_ViewProjectionMatrix * transformedPosition;
}

#version 300 es

precision mediump float;

struct Light {
    vec3 position;
    vec3 color;
    float intensity;
};

in vec3 v_Color;
in vec2 v_TexCoord;
in float v_TexIndex;
in vec3 v_Normal;
in vec3 v_Ambient;
in vec3 v_Diffuse;
in vec3 v_Specular;
in float v_Shininess;
in vec3 v_SurfaceToView;

uniform Light u_Lights[10];
uniform int u_LightCount;
uniform sampler2D u_Textures[16];

out vec4 fragColor;

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

    vec3 normal = normalize(v_Normal);
    vec3 viewDirection = normalize(v_SurfaceToView);

    // Initialize the accumulated lighting components
    vec3 ambient = vec3(0.0);
    vec3 diffuse = vec3(0.0);
    vec3 specular = vec3(0.0);

    // Loop through each light in the scene
    for (int i = 0; i < u_LightCount; i++) {
        vec3 lightDirection = normalize(u_Lights[i].position - v_SurfaceToView);
        vec3 lightColor = u_Lights[i].color * u_Lights[i].intensity;

        // Ambient lighting, affected by light color
        ambient += lightColor * v_Ambient * 0.2;

        // Diffuse lighting
        float Kd = max(dot(lightDirection, normal), 0.0);
        diffuse += Kd * v_Diffuse * lightColor * vec3(l_Texture);

        // Specular lighting
        vec3 halfVector = normalize(lightDirection + viewDirection);
        float specularLight = pow(max(dot(normal, halfVector), 0.0), v_Shininess);
        specular += specularLight * v_Specular * lightColor;
    }

    // Combine lighting terms and apply to object color
    vec3 lightingResult = (ambient + diffuse + specular) * v_Color;
    fragColor = vec4(lightingResult, 1.0);
}
