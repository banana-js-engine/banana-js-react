import { Vector2, Vector3 } from "../math/Vector";
import { readFileAsText } from "../utils/file";

export class WavefrontParser {
    
    static async parseObj(src) {
        const text = await readFileAsText(src);
        const vertices = [];
        const positions = [];
        const texCoords = [];
        const normals = [];
        const colors = [];
        
        let currentMaterial = "";
        const lines = text.split('\n');

        for (const line of lines) {
            const words = line.trim().split(/\s+/);
            
            switch (words[0]) {
                case 'v': {
                    const x = Number(words[1]);
                    const y = Number(words[2]);
                    const z = Number(words[3]);
                    positions.push(new Vector3(x, y, z));

                    if (words.length > 4) {
                        colors.push(new Vector3(
                            Number(words[4]),
                            Number(words[5]),
                            Number(words[6])
                        ));
                    } else {
                        colors.push(null);
                    }
                    break;
                }
                case 'vt': {
                    texCoords.push(new Vector2(Number(words[1]), Number(words[2])));
                    break;
                }
                case 'vn': {
                    normals.push(new Vector3(Number(words[1]), Number(words[2]), Number(words[3])));
                    break;
                }
                case 'f': {
                    const indices = words.slice(1).map(word => word.split('/'));

                    for (let i = 1; i < indices.length - 1; i++) {
                        vertices.push(
                            ...[0, i, i + 1].map(index => ({
                                position: positions[indices[index][0] - 1],
                                color: colors[indices[index][0] - 1],
                                texCoord: indices[index][1] ? texCoords[indices[index][1] - 1] : null,
                                normal: indices[index][2] ? normals[indices[index][2] - 1] : null,
                                material: currentMaterial,
                            }))
                        );
                    }
                    break;
                }
                case 'usemtl':
                    currentMaterial = words[1];
                    break;
            }
        }

        return vertices;
    }

    static async parseMtl(src) {
        const text = await readFileAsText(src);
        const materials = {};
        
        const lines = text.split('\n');
        let currentMaterial = "";

        for (const line of lines) {
            const words = line.trim().split(/\s+/);

            switch (words[0]) {
                case 'newmtl':
                    currentMaterial = words[1];
                    materials[currentMaterial] = {};
                    break;
                case 'Ka': 
                    materials[currentMaterial].ambientColor = new Vector3(
                        Number(words[1]), Number(words[2]), Number(words[3])
                    );
                    break;
                case 'Kd': 
                    materials[currentMaterial].diffuseColor = new Vector3(
                        Number(words[1]), Number(words[2]), Number(words[3])
                    );
                    break;
                case 'Ks': 
                    materials[currentMaterial].specularColor = new Vector3(
                        Number(words[1]), Number(words[2]), Number(words[3])
                    );
                    break;
                case 'Ns': 
                    materials[currentMaterial].shininess = Number(words[1]);
                    break;
                case 'map_Kd': 
                    materials[currentMaterial].diffuseMapSrc = words[1];
                    break;
            }
        }

        return materials;
    }

    
}
